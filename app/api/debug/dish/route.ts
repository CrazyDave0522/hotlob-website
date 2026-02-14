import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dishId = searchParams.get('dishId')

  if (!dishId) {
    return NextResponse.json({ error: 'dishId parameter is required' }, { status: 400 })
  }

  try {
    // Check if dish exists
    const { data: dish, error: dishError } = await supabaseServer
      .from('dish')
      .select('id, name, is_visible, is_available')
      .eq('id', dishId)
      .single()

    if (dishError) {
      return NextResponse.json({ error: 'Failed to fetch dish', details: dishError }, { status: 500 })
    }

    // Check dish_store records for this dish
    const { data: dishStores, error: dishStoreError } = await supabaseServer
      .from('dish_store')
      .select(`
        id,
        dish_id,
        store_id,
        available,
        uber_url,
        store!inner (
          id,
          name
        )
      `)
      .eq('dish_id', dishId)

    if (dishStoreError) {
      return NextResponse.json({ error: 'Failed to fetch dish stores', details: dishStoreError }, { status: 500 })
    }

    // Filter for available stores
    const availableDishStores = dishStores?.filter(ds => ds.available) || []

    return NextResponse.json({
      dish,
      allDishStores: dishStores,
      availableDishStores,
      summary: {
        dishExists: !!dish,
        totalDishStores: dishStores?.length || 0,
        availableDishStores: availableDishStores.length,
        hasAvailableStores: availableDishStores.length > 0
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 })
  }
}