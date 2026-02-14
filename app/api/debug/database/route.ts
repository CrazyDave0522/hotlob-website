import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  try {
    // Check dish_store table
    const { data: dishStores, error: dishStoreError } = await supabaseServer
      .from('dish_store')
      .select('id, dish_id, store_id, available')
      .limit(20)

    if (dishStoreError) {
      return NextResponse.json({ error: 'Failed to fetch dish_store', details: dishStoreError }, { status: 500 })
    }

    // Check dishes table
    const { data: dishes, error: dishesError } = await supabaseServer
      .from('dish')
      .select('id, name, is_visible, is_available')
      .eq('is_visible', true)
      .eq('is_available', true)
      .limit(20)

    if (dishesError) {
      return NextResponse.json({ error: 'Failed to fetch dishes', details: dishesError }, { status: 500 })
    }

    // Check stores table
    const { data: stores, error: storesError } = await supabaseServer
      .from('store')
      .select('id, name')
      .limit(20)

    if (storesError) {
      return NextResponse.json({ error: 'Failed to fetch stores', details: storesError }, { status: 500 })
    }

    return NextResponse.json({
      dishStores,
      dishes,
      stores,
      summary: {
        totalDishStores: dishStores?.length || 0,
        availableDishStores: dishStores?.filter(ds => ds.available).length || 0,
        totalDishes: dishes?.length || 0,
        totalStores: stores?.length || 0
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 })
  }
}