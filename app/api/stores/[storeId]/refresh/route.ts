import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { fetchPlaceDetails, addDays, fetchPlaceReviews, fetchPlacePhotos, NormalizedPhoto } from '@/lib/google-places'
import { getCronSecret } from '@/lib/serverEnv'

interface ReviewRow {
  id: string
  store_id: string
  author_name: string
  author_uri: string | null
  rating: number
  review_text: string
  review_time: string
  language: string | null
}

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

  // Allow calling this route with either internal store.id (uuid) or google_place_id
  const isUuid = /^[0-9a-fA-F-]{36}$/.test(storeId)
  let storeQuery = supabase
    .from('store')
    .select('id, google_place_id')
    .limit(1)
  if (isUuid) {
    storeQuery = storeQuery.eq('id', storeId)
  } else {
    storeQuery = storeQuery.eq('google_place_id', storeId)
  }
  const { data: store, error: storeErr } = await storeQuery.maybeSingle()

  if (storeErr || !store) {
  return NextResponse.json({ error: 'Store not found', param: storeId, details: storeErr?.message }, { status: 404 })
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

      // Photo-driven feature selection: re-compute global featured reviews (same as global refresh)
      const twelveMonthsAgoIso = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()

      // Step 1: Fetch photos from ALL stores (not just this one)
      const { data: allStores } = await supabase
        .from('store')
        .select('id, google_place_id')
        .order('name')

      const allPhotos: Array<{ store_id: string; photo: NormalizedPhoto }> = []
      for (const s of allStores || []) {
        if (!s.google_place_id) continue
        try {
          const photos = await fetchPlacePhotos(s.google_place_id as string)
          for (const photo of photos) {
            allPhotos.push({ store_id: s.id as string, photo })
          }
          await new Promise(r => setTimeout(r, 100))
        } catch (e) {
          console.error('Photo fetch error for store', s.id, e)
        }
      }

      // Step 2: Extract unique author contributor IDs from photos
      const authorContribIds = new Set<string>()
      for (const { photo } of allPhotos) {
        const uris = Array.isArray(photo.author_uris) ? photo.author_uris : (photo.author_uri ? [photo.author_uri] : [])
        for (const uri of uris) {
          const contribId = uri.match(/contrib\/(\d+)/)?.[1]
          if (contribId) authorContribIds.add(contribId)
        }
      }

      // Step 3: Query all high-quality reviews, group by author
      const { data: allReviews } = await supabase
        .from('curated_reviews')
        .select('id, store_id, author_name, author_uri, rating, review_text, review_time, language')
        .gte('review_time', twelveMonthsAgoIso)

      const reviewsByAuthor = new Map<string, ReviewRow[]>()
      
      for (const r of allReviews || []) {
        const isEnglish = (r.language || '').toLowerCase().startsWith('en')
        const longEnough = (r.review_text || '').length >= 80
        const goodRating = (r.rating || 0) >= 4
        if (!isEnglish || !longEnough || !goodRating) continue

        const contribId = r.author_uri?.match(/contrib\/(\d+)/)?.[1]
        const key = contribId || r.author_name.trim().toLowerCase()
        
        if (!reviewsByAuthor.has(key)) {
          reviewsByAuthor.set(key, [])
        }
        reviewsByAuthor.get(key)!.push(r as ReviewRow)
      }

      // Step 4: Count photos per author (contributor ID)
      const photoCountByAuthor = new Map<string, number>()
      for (const { photo } of allPhotos) {
        const uris = Array.isArray(photo.author_uris) ? photo.author_uris : (photo.author_uri ? [photo.author_uri] : [])
        for (const uri of uris) {
          const contribId = uri.match(/contrib\/(\d+)/)?.[1]
          if (contribId) {
            photoCountByAuthor.set(contribId, (photoCountByAuthor.get(contribId) || 0) + 1)
          }
        }
      }

      // Step 5: For each author with photos, select best review and track photo count
      const authorsWithPhotos: Array<{ contribId: string; reviewId: string; photoCount: number; rating: number; reviewTime: string; textLength: number }> = []
      
      for (const contribId of authorContribIds) {
        const reviews = reviewsByAuthor.get(contribId)
        if (reviews && reviews.length > 0) {
          reviews.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating
            if (b.review_time !== a.review_time) return String(b.review_time).localeCompare(String(a.review_time))
            return (b.review_text?.length || 0) - (a.review_text?.length || 0)
          })
          const bestReview = reviews[0]
          authorsWithPhotos.push({
            contribId,
            reviewId: bestReview.id,
            photoCount: photoCountByAuthor.get(contribId) || 0,
            rating: bestReview.rating || 0,
            reviewTime: bestReview.review_time || '',
            textLength: bestReview.review_text?.length || 0,
          })
        }
      }

      // Step 6: Name-based matching fallback
      const photosAuthorNames = new Set<string>()
      for (const { photo } of allPhotos) {
        const names = Array.isArray(photo.author_names) ? photo.author_names : (photo.author_name ? [photo.author_name] : [])
        names.forEach((n: string) => photosAuthorNames.add(n.trim().toLowerCase()))
      }
      
      for (const authorName of photosAuthorNames) {
        const reviews = reviewsByAuthor.get(authorName)
        if (reviews && reviews.length > 0) {
          const contribId = reviews[0].author_uri?.match(/contrib\/(\d+)/)?.[1]
          const alreadyAdded = contribId && authorsWithPhotos.some(a => a.contribId === contribId)
          if (!alreadyAdded) {
            reviews.sort((a, b) => {
              if (b.rating !== a.rating) return b.rating - a.rating
              if (b.review_time !== a.review_time) return String(b.review_time).localeCompare(String(a.review_time))
              return (b.review_text?.length || 0) - (a.review_text?.length || 0)
            })
            const bestReview = reviews[0]
            authorsWithPhotos.push({
              contribId: authorName,
              reviewId: bestReview.id,
              photoCount: 0,
              rating: bestReview.rating || 0,
              reviewTime: bestReview.review_time || '',
              textLength: bestReview.review_text?.length || 0,
            })
          }
        }
      }

      // Step 7: Sort authors with photos: rating desc > photo count desc > time desc > length desc
      authorsWithPhotos.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating
        if (b.photoCount !== a.photoCount) return b.photoCount - a.photoCount
        if (b.reviewTime !== a.reviewTime) return b.reviewTime.localeCompare(a.reviewTime)
        return b.textLength - a.textLength
      })

      // Step 8: Collect featured IDs (max 5 total)
      const targetCount = 5
      const idsToFeature = [...authorsWithPhotos.map(a => a.reviewId)]

      // Step 9: Supplement if needed
      if (idsToFeature.length < targetCount) {
        const allQualityReviews: ReviewRow[] = []
        for (const reviews of reviewsByAuthor.values()) {
          allQualityReviews.push(...reviews)
        }
        allQualityReviews.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating
          return String(b.review_time).localeCompare(String(a.review_time))
        })
        
        for (const review of allQualityReviews) {
          if (idsToFeature.length >= targetCount) break
          if (!idsToFeature.includes(review.id)) {
            idsToFeature.push(review.id)
          }
        }
      }

      // Step 10: Update featured flags and order
      await supabase.from('curated_reviews').update({ is_featured: false, featured_order: null }).eq('is_featured', true)
      
      if (idsToFeature.length > 0) {
        // Update each review with its order position
        for (let i = 0; i < idsToFeature.length; i++) {
          await supabase
            .from('curated_reviews')
            .update({ is_featured: true, featured_order: i + 1 })
            .eq('id', idsToFeature[i])
        }
        
        // Step 11: Match photos for featured reviews (aggregate across all stores)
        const { data: featuredReviews } = await supabase
          .from('curated_reviews')
          .select('id, author_name, author_uri')
          .in('id', idsToFeature)

        if (featuredReviews && featuredReviews.length > 0) {
          for (const review of featuredReviews) {
            const reviewContribId = review.author_uri?.match(/contrib\/(\d+)/)?.[1]
            const reviewAuthorName = review.author_name?.trim().toLowerCase()

            let matchedPhotos = allPhotos
              .filter(({ photo }) => {
                if (reviewContribId) {
                  const uris = Array.isArray(photo.author_uris) ? photo.author_uris : (photo.author_uri ? [photo.author_uri] : [])
                  const idMatch = uris.some(u => u.match(/contrib\/(\d+)/)?.[1] === reviewContribId)
                  if (idMatch) return true
                }
                if (reviewAuthorName) {
                  const names = Array.isArray(photo.author_names) ? photo.author_names : (photo.author_name ? [photo.author_name] : [])
                  const norm = (s: string) => s.trim().toLowerCase()
                  return names.some(n => norm(n) === reviewAuthorName)
                }
                return false
              })
              .map(({ photo }) => photo)

            const seen = new Set<string>()
            matchedPhotos = matchedPhotos.filter(p => {
              if (seen.has(p.photo_name)) return false
              seen.add(p.photo_name)
              return true
            }).slice(0, 5)

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
