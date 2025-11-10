import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { fetchPlaceDetails, addDays } from '@/lib/google-places'
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

      // tiny delay to avoid hitting QPS limits
      await new Promise(r => setTimeout(r, 120))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown error'
      results.push({ store_id, ok: false, message: msg })
    }
  }

  const ok = results.filter(r => r.ok).length
  const failed = results.length - ok
  return NextResponse.json({ ok, failed, results })
}
