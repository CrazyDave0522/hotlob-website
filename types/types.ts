// types/types.ts

// 数据库返回的原始菜品数据（如果需要的话）
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

// 标签类型
export interface Tag {
  id: string
  name: string
  icon_url: string | null
}

// 菜品标签类型（简化版）
export interface DishTag {
  id: string
  icon_url: string | null
}

// 应用中使用的菜品类型
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
