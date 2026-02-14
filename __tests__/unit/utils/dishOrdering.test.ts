import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getAvailableStoresForDish } from '../../../utils/dishOrdering'

vi.mock('../../../lib/dishes', () => ({
  fetchDishStores: vi.fn()
}))

vi.mock('../../../utils/geolocation', () => ({
  tryGetQuickLocation: vi.fn(() => Promise.resolve(null))
}))

vi.mock('../../../utils/distance', () => ({
  calculateDistance: vi.fn(() => 5.0)
}))

import { fetchDishStores } from '../../../lib/dishes'
import { tryGetQuickLocation } from '../../../utils/geolocation'
import { calculateDistance } from '../../../utils/distance'

describe('getAvailableStoresForDish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return stores when dish has available stores', async () => {
    const mockDishStores = [
      {
        id: 'dish-store-1',
        dish_id: 'dish-1',
        store_id: 'store-1',
        price_override: null,
        available: true,
        uber_url: 'https://uber.com/dish1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        store: {
          id: 'store-1',
          name: 'Test Store',
          street: '123 Test St',
          suburb: 'Test Suburb',
          state: 'Test State',
          postcode: '1234',
          latitude: -33.8688,
          longitude: 151.2093,
          uber_url: 'https://uber.com/store1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          google_place_id: null,
          google_maps_embed_url: null,
          email: 'test@store.com',
          google_url: 'https://maps.google.com/store1',
          google_rating: 4.5,
          google_user_ratings_total: 100,
          google_trading_hours: null,
          google_last_synced_at: null
        }
      }
    ]

    vi.mocked(fetchDishStores).mockResolvedValue(mockDishStores)
    vi.mocked(tryGetQuickLocation).mockResolvedValue(null)

    const result = await getAvailableStoresForDish('dish-1')

    expect(fetchDishStores).toHaveBeenCalledWith('dish-1')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Test Store')
    expect(result[0].dishUberUrl).toBe('https://uber.com/dish1')
  })

  it('should return empty array when no stores are available', async () => {
    vi.mocked(fetchDishStores).mockResolvedValue([])
    vi.mocked(tryGetQuickLocation).mockResolvedValue(null)

    const result = await getAvailableStoresForDish('dish-1')

    expect(fetchDishStores).toHaveBeenCalledWith('dish-1')
    expect(result).toHaveLength(0)
  })

  it('should filter out stores without store data', async () => {
    const mockDishStores = [
      {
        id: 'dish-store-1',
        dish_id: 'dish-1',
        store_id: 'store-1',
        price_override: null,
        available: true,
        uber_url: 'https://uber.com/dish1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        store: null // No store data
      }
    ]

    vi.mocked(fetchDishStores).mockResolvedValue(mockDishStores)
    vi.mocked(tryGetQuickLocation).mockResolvedValue(null)

    const result = await getAvailableStoresForDish('dish-1')

    expect(result).toHaveLength(0)
  })

  it('should sort stores by distance when available, closest first', async () => {
    const mockDishStores = [
      {
        id: 'dish-store-1',
        dish_id: 'dish-1',
        store_id: 'store-1',
        price_override: null,
        available: true,
        uber_url: 'https://uber.com/dish1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        store: {
          id: 'store-1',
          name: 'Far Store',
          street: '456 Far St',
          suburb: 'Far Suburb',
          state: 'Far State',
          postcode: '5678',
          latitude: -33.8688,
          longitude: 151.2093,
          uber_url: 'https://uber.com/store1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          google_place_id: null,
          google_maps_embed_url: null,
          email: 'far@store.com',
          google_url: 'https://maps.google.com/store1',
          google_rating: 4.5,
          google_user_ratings_total: 100,
          google_trading_hours: null,
          google_last_synced_at: null
        }
      },
      {
        id: 'dish-store-2',
        dish_id: 'dish-1',
        store_id: 'store-2',
        price_override: null,
        available: true,
        uber_url: 'https://uber.com/dish2',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        store: {
          id: 'store-2',
          name: 'Close Store',
          street: '123 Close St',
          suburb: 'Close Suburb',
          state: 'Close State',
          postcode: '1234',
          latitude: -33.8688,
          longitude: 151.2093,
          uber_url: 'https://uber.com/store2',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          google_place_id: null,
          google_maps_embed_url: null,
          email: 'close@store.com',
          google_url: 'https://maps.google.com/store2',
          google_rating: 4.0,
          google_user_ratings_total: 50,
          google_trading_hours: null,
          google_last_synced_at: null
        }
      }
    ]

    vi.mocked(fetchDishStores).mockResolvedValue(mockDishStores)
    vi.mocked(tryGetQuickLocation).mockResolvedValue({ lat: -33.8688, lon: 151.2093 })
    vi.mocked(calculateDistance)
      .mockReturnValueOnce(10.0) // Far store
      .mockReturnValueOnce(2.0)  // Close store

    const result = await getAvailableStoresForDish('dish-1')

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Close Store') // Closest first
    expect(result[0].distance).toBe(2.0)
    expect(result[1].name).toBe('Far Store') // Farther second
    expect(result[1].distance).toBe(10.0)
  })

  it('should sort stores alphabetically when no distance is available', async () => {
    const mockDishStores = [
      {
        id: 'dish-store-1',
        dish_id: 'dish-1',
        store_id: 'store-1',
        price_override: null,
        available: true,
        uber_url: 'https://uber.com/dish1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        store: {
          id: 'store-1',
          name: 'Z Store',
          street: '123 Z St',
          suburb: 'Z Suburb',
          state: 'Z State',
          postcode: '1234',
          latitude: -33.8688,
          longitude: 151.2093,
          uber_url: 'https://uber.com/store1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          google_place_id: null,
          google_maps_embed_url: null,
          email: 'z@store.com',
          google_url: 'https://maps.google.com/store1',
          google_rating: 4.5,
          google_user_ratings_total: 100,
          google_trading_hours: null,
          google_last_synced_at: null
        }
      },
      {
        id: 'dish-store-2',
        dish_id: 'dish-1',
        store_id: 'store-2',
        price_override: null,
        available: true,
        uber_url: 'https://uber.com/dish2',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        store: {
          id: 'store-2',
          name: 'A Store',
          street: '456 A St',
          suburb: 'A Suburb',
          state: 'A State',
          postcode: '5678',
          latitude: -33.8688,
          longitude: 151.2093,
          uber_url: 'https://uber.com/store2',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          google_place_id: null,
          google_maps_embed_url: null,
          email: 'a@store.com',
          google_url: 'https://maps.google.com/store2',
          google_rating: 4.0,
          google_user_ratings_total: 50,
          google_trading_hours: null,
          google_last_synced_at: null
        }
      }
    ]

    vi.mocked(fetchDishStores).mockResolvedValue(mockDishStores)
    vi.mocked(tryGetQuickLocation).mockResolvedValue(null) // No location available

    const result = await getAvailableStoresForDish('dish-1')

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('A Store') // Alphabetical first
    expect(result[1].name).toBe('Z Store') // Alphabetical second
    expect(result[0].distance).toBeUndefined()
    expect(result[1].distance).toBeUndefined()
  })
})