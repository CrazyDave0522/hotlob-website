import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { fetchPlaceDetails, addDays } from '@/lib/google-places'
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
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return NextResponse.json({ ok: false, message: msg }, { status: 500 })
  }
}
