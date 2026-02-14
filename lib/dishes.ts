import type { DishWithRelations, DishStoreWithStore } from '@/types/dish'
import { supabase } from './supabaseClient'

export async function fetchVisibleDishes(): Promise<DishWithRelations[]> {
    const { data, error } = await supabase
        .from('dish')
        .select(
            `
      id,
      name,
      description,
      tier,
      category,
      is_visible,
      is_available,
      created_at,
      updated_at,
      media_asset (
        id,
        dish_id,
        image_url,
        position,
        caption
      ),
      dish_allergen (
        id,
        dish_id,
        tag_id,
        created_at,
        updated_at,
        allergen_tag (
          id,
          name,
          icon_url,
          description
        )
      ),
      dish_store!inner (
        id,
        dish_id,
        store_id,
        price_override,
        available,
        uber_url,
        created_at,
        updated_at
      )
    `
        )
        .eq('is_visible', true)
        .eq('is_available', true)
        .eq('dish_store.available', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Failed to fetch dishes', error)
        return []
    }

    return data ?? []
}

export async function fetchDishStores(dishId: string): Promise<DishStoreWithStore[]> {
    console.log('🔍 fetchDishStores called with dishId:', dishId)
    const { data, error } = await supabase
        .from('dish_store')
        .select(
            `
      id,
      dish_id,
      store_id,
      price_override,
      available,
      uber_url,
      created_at,
      updated_at,
      store (
        id,
        name,
        street,
        suburb,
        state,
        postcode,
        latitude,
        longitude,
        uber_url,
        created_at,
        updated_at,
        google_place_id,
        google_maps_embed_url,
        email,
        google_url,
        google_rating,
        google_user_ratings_total,
        google_trading_hours,
        google_last_synced_at
      )
    `
        )
        .eq('dish_id', dishId)
        .eq('available', true)

    if (error) {
        console.error('❌ Failed to fetch dish stores:', error)
        return []
    }

    console.log('🔍 fetchDishStores result:', data)
    console.log('🔍 Result length:', data?.length)
    return (data ?? []) as unknown as DishStoreWithStore[]
}
