import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { fetchPlaceDetails, addDays, fetchPlaceReviews, fetchPlacePhotos } from '@/lib/google-places'
import { getCronSecret } from '@/lib/serverEnv'

function auth(req: NextRequest) {
  const authz = req.headers.get('authorization') || ''
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : ''
  return token && token === getCronSecret()
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ storeId: string }> }) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { storeId } = await params

  const { data: store, error: storeErr } = await supabase
    .from('store')
    .select('id, google_place_id')
    .eq('id', storeId)
    .maybeSingle()

  if (storeErr || !store) {
    return NextResponse.json({ error: 'Store not found', details: storeErr?.message }, { status: 404 })
  }

  if (!store.google_place_id) {
    return NextResponse.json({ error: 'Store missing google_place_id' }, { status: 400 })
  }

  try {
    const details = await fetchPlaceDetails(store.google_place_id as string)
    const expires = addDays(new Date(), 30).toISOString()
    const refreshed = new Date().toISOString()

    const upsert = {
      store_id: store.id as string,
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
      return NextResponse.json({ ok: false, message: upsertErr.message }, { status: 500 })
    }

    // Fetch and upsert reviews for this store
    try {
      const reviews = await fetchPlaceReviews(store.google_place_id as string)
      const expires = addDays(new Date(), 30).toISOString()
      const refreshed = new Date().toISOString()

      for (const r of reviews) {
        const row = {
          store_id: store.id as string,
          google_review_id: r.google_review_id,
          author_name: r.author_name,
          author_photo_url: r.author_photo_url,
          author_uri: r.author_uri,
          rating: r.rating,
          review_text: r.review_text,
          review_time: r.review_time_iso,
          language: r.language,
          fetched_at: refreshed,
          expires_at: expires,
          is_featured: false,
        }
        await supabase
          .from('curated_reviews')
          .upsert(row, { onConflict: 'store_id,author_name,review_time' })
      }

      // Re-compute global featured top-10
      const twelveMonthsAgoIso = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      const { data: recentAll } = await supabase
        .from('curated_reviews')
        .select('id, author_name, rating, review_text, review_time, language')
        .gte('review_time', twelveMonthsAgoIso)

      const filtered = (recentAll || []).filter(r => {
        const isEnglish = (r.language || '').toLowerCase().startsWith('en')
        const longEnough = (r.review_text || '').length >= 80
        const goodRating = (r.rating || 0) >= 4
        return isEnglish && longEnough && goodRating
      })

      filtered.sort((a, b) => {
        if (b.rating !== a.rating) return (b.rating as number) - (a.rating as number)
        return String(b.review_time).localeCompare(String(a.review_time))
      })

      const top10Ids = filtered.slice(0, 10).map(r => r.id)
      await supabase.from('curated_reviews').update({ is_featured: false }).eq('is_featured', true)
      if (top10Ids.length > 0) {
        await supabase.from('curated_reviews').update({ is_featured: true }).in('id', top10Ids)
        
        // Match photos for featured reviews
        const { data: featuredReviews } = await supabase
          .from('curated_reviews')
          .select('id, author_uri')
          .in('id', top10Ids)

        if (featuredReviews && featuredReviews.length > 0) {
          const photos = await fetchPlacePhotos(store.google_place_id as string)

          for (const review of featuredReviews) {
            if (!review.author_uri) continue

            // Normalize URIs for comparison (extract contributor ID)
            const reviewContribId = review.author_uri.match(/contrib\/(\d+)/)?.[1]
            if (!reviewContribId) continue

            const matchedPhotos = photos
              .filter(photo => {
                if (!photo.author_uri) return false
                const photoContribId = photo.author_uri.match(/contrib\/(\d+)/)?.[1]
                return photoContribId === reviewContribId
              })
              .slice(0, 5)

            if (matchedPhotos.length > 0) {
              await supabase.from('review_photos').delete().eq('review_id', review.id)
              
              for (let i = 0; i < matchedPhotos.length; i++) {
                const photo = matchedPhotos[i]
                await supabase.from('review_photos').insert({
                  review_id: review.id,
                  photo_name: photo.photo_name,
                  photo_url: photo.photo_url,
                  width: photo.width,
                  height: photo.height,
                  display_order: i + 1,
                })
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('Single-store review refresh failed:', e)
      // proceed without failing the entire request
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return NextResponse.json({ ok: false, message: msg }, { status: 500 })
  }
}
