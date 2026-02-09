import type { DishWithRelations } from '@/types/dish'
import { supabase } from './supabase'

export async function fetchVisibleDishes(): Promise<DishWithRelations[]> {
    const { data, error } = await supabase
        .from('dish')
        .select(
            `
      id,
      name,
      description,
      tier,
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
      )
    `
        )
        .eq('is_visible', true)
        .eq('is_available', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Failed to fetch dishes', error)
        return []
    }

    return data ?? []
}
