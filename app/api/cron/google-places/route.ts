import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { fetchPlaceDetails, extractRating, extractTradingHours } from '@/lib/google-places'
import { Store } from '@/types/store'

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Check CRON_SECRET authentication
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find stores that need syncing (no sync date or older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: storesToSync, error: fetchError } = await supabaseServer
      .from('store')
      .select('id, google_place_id')
      .not('google_place_id', 'is', null)
      .or(`google_last_synced_at.is.null,google_last_synced_at.lt.${thirtyDaysAgo.toISOString()}`)

    if (fetchError) {
      console.error('Failed to fetch stores for sync:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
    }

    if (!storesToSync || storesToSync.length === 0) {
      return NextResponse.json({ message: 'No stores need syncing' })
    }

    // Process each store
    const results = []
    for (const store of storesToSync) {
      try {
        const placeDetails = await fetchPlaceDetails(store.google_place_id!)

        if (placeDetails) {
          const rating = extractRating(placeDetails)
          const tradingHours = extractTradingHours(placeDetails)

          const updateData: Partial<Pick<Store, 'google_last_synced_at' | 'google_rating' | 'google_user_ratings_total' | 'google_trading_hours'>> = {
            google_last_synced_at: new Date().toISOString()
          }

          if (rating) {
            updateData.google_rating = rating.value
            updateData.google_user_ratings_total = rating.total
          }

          if (tradingHours) {
            updateData.google_trading_hours = tradingHours
          }

          const { error: updateError } = await supabaseServer
            .from('store')
            .update(updateData)
            .eq('id', store.id)

          if (updateError) {
            console.error(`Failed to update store ${store.id}:`, updateError)
            results.push({ storeId: store.id, success: false, error: updateError.message })
          } else {
            results.push({ storeId: store.id, success: true })
          }
        } else {
          // Mark as synced even if API failed, to avoid repeated failures
          await supabaseServer
            .from('store')
            .update({ google_last_synced_at: new Date().toISOString() })
            .eq('id', store.id)

          results.push({ storeId: store.id, success: false, error: 'API call failed' })
        }
      } catch (error) {
        console.error(`Error syncing store ${store.id}:`, error)
        results.push({ storeId: store.id, success: false, error: 'Unexpected error' })
      }
    }

    return NextResponse.json({
      message: `Synced ${results.length} stores`,
      results
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}