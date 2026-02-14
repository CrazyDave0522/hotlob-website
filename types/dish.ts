import type { Store } from './store'

export interface Dish {
    id: string
    name: string
    description: string | null
    tier: 'premium' | 'standard' | string
    price?: number | null
    is_visible: boolean
    is_available: boolean
    created_at?: string
    updated_at?: string
    category?: string | null
}

export interface MediaAsset {
    id: string
    dish_id: string
    image_url: string
    position: number
    caption?: string | null
}

export interface AllergenTag {
    id: string
    name: string
    icon_url: string
    description?: string | null
}

export interface DishAllergen {
    id: string
    dish_id: string
    tag_id: string
    created_at?: string
    updated_at?: string
    allergen_tag?: AllergenTag[] | null
}

export interface DishStore {
    id: string
    dish_id: string
    store_id: string
    price_override: number | null
    available: boolean
    uber_url: string
    created_at: string
    updated_at: string
}

export interface DishStoreWithStore extends DishStore {
    store: Store | null
}

export interface DishWithRelations extends Dish {
    media_asset?: MediaAsset[] | null
    dish_allergen?: DishAllergen[] | null
    dish_store?: DishStore[] | null
}
