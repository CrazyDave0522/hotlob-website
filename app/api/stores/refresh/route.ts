import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { fetchPlaceDetails, addDays, fetchPlaceReviews, fetchPlacePhotos, NormalizedReview, NormalizedPhoto } from '@/lib/google-places'
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
            author_uri: r.author_uri,
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

  // Photo-driven feature selection: photos find reviews
  try {
    const twelveMonthsAgoIso = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()

    // Step 1: Fetch all photos from all stores
    const allPhotos: Array<{ store_id: string; photo: NormalizedPhoto }> = []
    for (const s of stores || []) {
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

    // Step 3: Query all high-quality reviews, group by author contrib_id
    const { data: allReviews } = await supabase
      .from('curated_reviews')
      .select('id, store_id, author_name, author_uri, rating, review_text, review_time, language')
      .gte('review_time', twelveMonthsAgoIso)

    // Filter and group reviews by quality and author
    const reviewsByAuthor = new Map<string, ReviewRow[]>() // key: contrib_id or author_name
    
    for (const r of allReviews || []) {
      const isEnglish = (r.language || '').toLowerCase().startsWith('en')
      const longEnough = (r.review_text || '').length >= 80
      const goodRating = (r.rating || 0) >= 4
      if (!isEnglish || !longEnough || !goodRating) continue

      // Try to get contrib_id
      const contribId = r.author_uri?.match(/contrib\/(\d+)/)?.[1]
      const key = contribId || r.author_name.trim().toLowerCase()
      
      if (!reviewsByAuthor.has(key)) {
        reviewsByAuthor.set(key, [])
      }
      reviewsByAuthor.get(key)!.push(r)
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
        // Sort: rating desc, time desc, length desc
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

    // Step 6: Also try name-based matching for photos without contrib_id matches
    const photosAuthorNames = new Set<string>()
    for (const { photo } of allPhotos) {
      const names = Array.isArray(photo.author_names) ? photo.author_names : (photo.author_name ? [photo.author_name] : [])
      names.forEach((n: string) => photosAuthorNames.add(n.trim().toLowerCase()))
    }
    
    for (const authorName of photosAuthorNames) {
      const reviews = reviewsByAuthor.get(authorName)
      if (reviews && reviews.length > 0) {
        // Check if not already added by contrib_id
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
            photoCount: 0, // name-based match, count unknown
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

    // Step 8: Collect featured review IDs (max 5 total: authors with photos first)
    const targetCount = 5
    const idsToFeature = [...authorsWithPhotos.map(a => a.reviewId)]

    // Step 9: If less than 5, supplement with high-quality reviews without photos
    if (idsToFeature.length < targetCount) {
      const allQualityReviews: ReviewRow[] = []
      for (const reviews of reviewsByAuthor.values()) {
        allQualityReviews.push(...reviews)
      }
      // Sort all by rating desc, time desc
      allQualityReviews.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating
        return String(b.review_time).localeCompare(String(a.review_time))
      })
      
      // Add reviews not already featured
      for (const review of allQualityReviews) {
        if (idsToFeature.length >= targetCount) break
        if (!idsToFeature.includes(review.id)) {
          idsToFeature.push(review.id)
        }
      }
    }

    // Step 10: Reset all featured flags and order, then set the selected ones with order
    await supabase.from('curated_reviews').update({ is_featured: false, featured_order: null }).eq('is_featured', true)
    
    if (idsToFeature.length > 0) {
      // Update each review with its order position
      for (let i = 0; i < idsToFeature.length; i++) {
        await supabase
          .from('curated_reviews')
          .update({ is_featured: true, featured_order: i + 1 })
          .eq('id', idsToFeature[i])
      }
    }

    // Match photos for featured reviews (aggregate photos across all stores)
    if (idsToFeature.length > 0) {
      // Get featured reviews with author info
      const { data: featuredReviews } = await supabase
        .from('curated_reviews')
        .select('id, author_name, author_uri')
        .in('id', idsToFeature)

      if (featuredReviews && featuredReviews.length > 0) {
        // For each featured review, collect matching photos from ALL stores (cross-store aggregation)
        for (const review of featuredReviews) {
          const reviewContribId = review.author_uri?.match(/contrib\/(\d+)/)?.[1]
          const reviewAuthorName = review.author_name?.trim().toLowerCase()

          // Find all photos by this author across all stores
          let matchedPhotos = allPhotos
            .filter(({ photo }) => {
              // Try contributor ID match first
              if (reviewContribId) {
                const uris = Array.isArray(photo.author_uris) ? photo.author_uris : (photo.author_uri ? [photo.author_uri] : [])
                const idMatch = uris.some(u => u.match(/contrib\/(\d+)/)?.[1] === reviewContribId)
                if (idMatch) return true
              }
              // Fallback: name-based match
              if (reviewAuthorName) {
                const names = Array.isArray(photo.author_names) ? photo.author_names : (photo.author_name ? [photo.author_name] : [])
                const norm = (s: string) => s.trim().toLowerCase()
                return names.some(n => norm(n) === reviewAuthorName)
              }
              return false
            })
            .map(({ photo }) => photo)

          // De-duplicate by photo_name
          const seen = new Set<string>()
          matchedPhotos = matchedPhotos.filter(p => {
            if (seen.has(p.photo_name)) return false
            seen.add(p.photo_name)
            return true
          }).slice(0, 5) // Max 5 photos per review

          if (matchedPhotos.length > 0) {
            // Delete existing photos for this review
            await supabase
              .from('review_photos')
              .delete()
              .eq('review_id', review.id)

            // Insert new photos
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
    console.error('Global feature selection failed:', e)
  }

  const ok = results.filter(r => r.ok).length
  const failed = results.length - ok
  return NextResponse.json({ ok, failed, results })
}
