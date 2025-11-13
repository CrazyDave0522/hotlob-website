// types/types.ts

// Raw dish data returned from database (if needed)
export interface RawDish {
  id: string
  name: string
  description: string
  tier: 'premium' | 'standard'
  is_visible: boolean
  is_available: boolean
  order_url?: string | null
  media_asset: { image_url: string }[]
  dish_tag: { tag: { id: string; icon_url: string }[] }[]
  dish_store?: {
    available: boolean
    uber_url?: string | null
    store: {
      id: string
      name: string
      latitude?: number | null
      longitude?: number | null
    } | null
  }[]
}

// Tag type
export interface Tag {
  id: string
  name: string
  icon_url: string | null
  icon_url_active?: string | null  // Icon for selected state
}

// Dish tag type (simplified version)
export interface DishTag {
  id: string
  icon_url: string | null
  icon_url_active?: string | null  // Icon for selected state
}

// Dish type used in application
export interface Dish {
  id: string
  name: string
  description: string
  tier: 'premium' | 'standard'
  imageUrl: string
  tags: DishTag[]
  orderUrl?: string
  stores?: {
    id: string
    name: string
    uber_url?: string | null
    latitude?: number | null
    longitude?: number | null
  }[]
}
