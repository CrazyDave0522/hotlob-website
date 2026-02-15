import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { fetchPlaceReviews, GooglePlaceReview } from '@/lib/google-places'

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Check CRON_SECRET authentication
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find stores that need review syncing
    const now = new Date().toISOString()

    const { data: allStores, error: fetchError } = await supabaseServer
      .from('store')
      .select('id, google_place_id')
      .not('google_place_id', 'is', null)

    if (fetchError) {
      console.error('Failed to fetch stores:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
    }

    if (!allStores || allStores.length === 0) {
      return NextResponse.json({ message: 'No stores with Google Place IDs found' })
    }

    // Filter stores that need syncing
    const storesToSync = []
    for (const store of allStores) {
      const { data: recentReviews, error: reviewError } = await supabaseServer
        .from('curated_reviews')
        .select('expires_at')
        .eq('store_id', store.id)
        .order('expires_at', { ascending: false })
        .limit(1)

      if (reviewError && reviewError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error(`Error checking reviews for store ${store.id}:`, reviewError)
        continue
      }

      // Need syncing if no reviews exist or latest review is expired
      const needsSync = !recentReviews || recentReviews.length === 0 ||
                       (recentReviews[0].expires_at && recentReviews[0].expires_at < now)
      if (needsSync) {
        storesToSync.push(store)
      }
    }

    if (storesToSync.length === 0) {
      return NextResponse.json({ message: 'No stores need review syncing' })
    }

    // Process each store
    const results = []
    for (const store of storesToSync) {
      try {
        const reviews = await fetchPlaceReviews(store.google_place_id!)

        if (reviews && reviews.length > 0) {
          const syncResult = await syncReviewsForStore(store.id, reviews)
          results.push({
            storeId: store.id,
            success: syncResult.success,
            reviewsFetched: reviews.length,
            reviewsInserted: syncResult.inserted,
            reviewsUpdated: syncResult.updated,
            reviewsDeleted: syncResult.deleted,
            error: syncResult.error
          })
        } else {
          // Mark as synced even if no reviews found
          results.push({
            storeId: store.id,
            success: true,
            reviewsFetched: 0,
            reviewsInserted: 0,
            reviewsUpdated: 0,
            reviewsDeleted: 0
          })
        }
      } catch (error) {
        console.error(`Error syncing reviews for store ${store.id}:`, error)
        results.push({
          storeId: store.id,
          success: false,
          error: 'Unexpected error',
          reviewsFetched: 0,
          reviewsInserted: 0,
          reviewsUpdated: 0,
          reviewsDeleted: 0
        })
      }
    }

    return NextResponse.json({
      message: `Synced reviews for ${results.length} stores`,
      results
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function syncReviewsForStore(storeId: string, apiReviews: GooglePlaceReview[]): Promise<{
  success: boolean
  inserted: number
  updated: number
  deleted: number
  error?: string
}> {
  try {
    // Transform API reviews to database format
    const transformedReviews = apiReviews.map(review => ({
      store_id: storeId,
      google_review_id: review.name.split('/').pop(), // Extract review ID from name
      author_name: review.authorAttribution.displayName,
      author_photo_url: review.authorAttribution.photoUri,
      rating: review.rating,
      review_text: review.text?.text || review.originalText?.text || '',
      review_time: new Date(review.publishTime).toISOString(),
      language: review.text?.languageCode || review.originalText?.languageCode,
      author_uri: review.authorAttribution.uri,
      fetched_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    }))

    // Get existing reviews for this store
    const { data: existingReviews, error: fetchExistingError } = await supabaseServer
      .from('curated_reviews')
      .select('id, google_review_id, review_text, rating')
      .eq('store_id', storeId)

    if (fetchExistingError) {
      console.error('Failed to fetch existing reviews:', fetchExistingError)
      return { success: false, inserted: 0, updated: 0, deleted: 0, error: fetchExistingError.message }
    }

    const existingReviewMap = new Map(
      (existingReviews || []).map(review => [review.google_review_id, review])
    )

    // Prepare operations
    const toInsert = []
    const toUpdate = []
    const existingApiReviewIds = new Set()

    for (const review of transformedReviews) {
      existingApiReviewIds.add(review.google_review_id)

      const existing = existingReviewMap.get(review.google_review_id)
      if (!existing) {
        toInsert.push(review)
      } else if (existing.review_text !== review.review_text || existing.rating !== review.rating) {
        toUpdate.push({ ...review, id: existing.id })
      }
    }

    // Reviews to delete (exist in DB but not in API)
    const toDelete = (existingReviews || [])
      .filter(review => !existingApiReviewIds.has(review.google_review_id))
      .map(review => review.google_review_id)

    // Execute operations in transaction-like manner
    let inserted = 0
    let updated = 0
    let deleted = 0

    // Insert new reviews
    if (toInsert.length > 0) {
      const { error: insertError } = await supabaseServer
        .from('curated_reviews')
        .insert(toInsert)

      if (insertError) {
        console.error('Failed to insert reviews:', insertError)
        return { success: false, inserted: 0, updated: 0, deleted: 0, error: insertError.message }
      }
      inserted = toInsert.length
    }

    // Update changed reviews
    for (const review of toUpdate) {
      const { error: updateError } = await supabaseServer
        .from('curated_reviews')
        .update({
          review_text: review.review_text,
          rating: review.rating,
          fetched_at: review.fetched_at,
          expires_at: review.expires_at
        })
        .eq('google_review_id', review.google_review_id)
        .eq('store_id', storeId)

      if (updateError) {
        console.error('Failed to update review:', updateError)
        return { success: false, inserted, updated: 0, deleted: 0, error: updateError.message }
      }
      updated++
    }

    // Delete removed reviews
    if (toDelete.length > 0) {
      const { error: deleteError } = await supabaseServer
        .from('curated_reviews')
        .delete()
        .eq('store_id', storeId)
        .in('google_review_id', toDelete)

      if (deleteError) {
        console.error('Failed to delete reviews:', deleteError)
        return { success: false, inserted, updated, deleted: 0, error: deleteError.message }
      }
      deleted = toDelete.length
    }

    // Update store timestamps
    // Note: timestamps are managed per review, not per store

    return { success: true, inserted, updated, deleted }
  } catch (error) {
    console.error('Error in syncReviewsForStore:', error)
    return { success: false, inserted: 0, updated: 0, deleted: 0, error: 'Unexpected error in sync' }
  }
}