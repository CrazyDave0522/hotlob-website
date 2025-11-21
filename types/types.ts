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
  dish_allergen: { allergen_tag: { id: string; icon_url: string }[] }[]
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
  category: 'seafood' | 'meat' | 'vegetarian' | 'dessert'
}

// Allergen tag type (formerly Tag)
export interface AllergenTag {
  id: string
  name: string
  icon_url: string | null
  icon_url_active?: string | null  // Icon for selected state
}

// Dish allergen type (simplified version)
export interface DishAllergen {
  id: string
  icon_url: string | null
  icon_url_active?: string | null  // Icon for selected state
}

// Category type for food categories
export type Category = 'seafood' | 'meat' | 'vegetarian' | 'dessert'

export interface CategoryOption {
  id: Category
  name: string
  icon_url: string
  icon_url_active: string
}

// Dish type used in application
export interface Dish {
  id: string
  name: string
  description: string
  tier: 'premium' | 'standard'
  imageUrl: string
  allergens: DishAllergen[]
  category: Category
  orderUrl?: string
  stores?: {
    id: string
    name: string
    uber_url?: string | null
    latitude?: number | null
    longitude?: number | null
  }[]
}
