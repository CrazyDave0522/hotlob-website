import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { fetchPlaceDetails, addDays, fetchPlaceReviews, NormalizedReview } from '@/lib/google-places'
import { getCronSecret } from '@/lib/serverEnv'

function auth(req: NextRequest) {
  const authz = req.headers.get('authorization') || ''
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : ''
  return token && token === getCronSecret()
}

export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: stores, error: storeErr } = await supabase
    .from('store')
    .select('id, google_place_id')
    .order('name')

  if (storeErr) {
    return NextResponse.json({ error: 'Failed to load stores', details: storeErr.message }, { status: 500 })
  }

  const results: Array<{ store_id: string; ok: boolean; message?: string }> = []
  const allNormalizedForFeature: Array<{ store_id: string; review: NormalizedReview }> = []

  for (const s of stores || []) {
    const store_id = s.id as string
    const placeId = s.google_place_id as string | null
    if (!placeId) {
      results.push({ store_id, ok: false, message: 'missing place_id' })
      continue
    }
    try {
      const details = await fetchPlaceDetails(placeId)
      const expires = addDays(new Date(), 30).toISOString()
      const refreshed = new Date().toISOString()

      const upsert = {
        store_id,
        rating: details.rating,
        user_ratings_total: details.user_ratings_total,
        opening_hours_weekday_text: details.opening_hours_weekday_text,
        refreshed_at: refreshed,
        expires_at: expires,
      }

      const { error: upsertErr } = await supabase
        .from('place_cache')
        .upsert(upsert, { onConflict: 'store_id' })

      if (upsertErr) {
        results.push({ store_id, ok: false, message: upsertErr.message })
      } else {
        results.push({ store_id, ok: true })
      }

      // Fetch and upsert reviews for this store
      try {
        const reviews = await fetchPlaceReviews(placeId)
        // Upsert each review (store all fetched; is_featured handled after global selection)
        for (const r of reviews) {
          const row = {
            store_id,
            google_review_id: r.google_review_id,
            author_name: r.author_name,
            author_photo_url: r.author_photo_url,
            rating: r.rating,
            review_text: r.review_text,
            review_time: r.review_time_iso,
            language: r.language,
            fetched_at: refreshed,
            expires_at: expires,
            is_featured: false,
          }

          // conflict on (store_id, author_name, review_time)
          await supabase
            .from('curated_reviews')
            .upsert(row, { onConflict: 'store_id,author_name,review_time' })
        }

        // collect for global feature selection
        for (const r of reviews) {
          allNormalizedForFeature.push({ store_id, review: r })
        }
      } catch (e) {
        // ignore review failures; rating/hours already updated
        console.error('Review upsert error for store', store_id, e)
      }

      // tiny delay to avoid hitting QPS limits
      await new Promise(r => setTimeout(r, 120))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown error'
      results.push({ store_id, ok: false, message: msg })
    }
  }

  // Global Top-10 feature selection across all stores
  try {
    const twelveMonthsAgoIso = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()

    // Compute in memory from collected set to match business rules
    const filtered = allNormalizedForFeature.filter(({ review }) => {
      const isEnglish = (review.language || '').toLowerCase().startsWith('en')
      const longEnough = (review.review_text || '').length >= 80
      const recent = review.review_time_iso >= twelveMonthsAgoIso
      const goodRating = review.rating >= 4
      return isEnglish && longEnough && recent && goodRating
    })

    // Sort: rating desc, then time desc
    filtered.sort((a, b) => {
      if (b.review.rating !== a.review.rating) return b.review.rating - a.review.rating
      return b.review.review_time_iso.localeCompare(a.review.review_time_iso)
    })

    const top10 = filtered.slice(0, 10)
    const idsToFeature: string[] = []

    // Get ids by querying DB for the upserted rows (match unique key)
    for (const item of top10) {
      const { data } = await supabase
        .from('curated_reviews')
        .select('id')
        .eq('store_id', item.store_id)
        .eq('author_name', item.review.author_name)
        .eq('review_time', item.review.review_time_iso)
        .limit(1)
        .single()
      if (data?.id) idsToFeature.push(data.id)
    }

    // Reset all featured flags, then set the selected ones
    await supabase.from('curated_reviews').update({ is_featured: false }).eq('is_featured', true)
    if (idsToFeature.length > 0) {
      await supabase.from('curated_reviews').update({ is_featured: true }).in('id', idsToFeature)
    }
  } catch (e) {
    console.error('Global feature selection failed:', e)
  }

  const ok = results.filter(r => r.ok).length
  const failed = results.length - ok
  return NextResponse.json({ ok, failed, results })
}
