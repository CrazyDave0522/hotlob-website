import { describe, it, expect } from 'vitest'
import { calculateDistance, findClosestStore } from '../../../utils/distance'
import type { Store } from '../../../types/store'

describe('distance utilities', () => {
  it('calculates distance between two coordinates (approx)', () => {
    // Equatorial 1 degree longitude ~ 111.195 km
    const d = calculateDistance(0, 0, 0, 1)
    expect(d).toBeCloseTo(111.2, 1)
  })

  it('finds the closest store', () => {
    const stores: Store[] = [
      { id: 'a', name: 'A', street: null, suburb: null, state: null, postcode: null, created_at: '', updated_at: '', latitude: 0.1, longitude: 0, google_place_id: null, google_maps_embed_url: null, uber_url: '', email: '', google_url: '', google_rating: null, google_user_ratings_total: null, google_trading_hours: null, google_last_synced_at: null },
      { id: 'b', name: 'B', street: null, suburb: null, state: null, postcode: null, created_at: '', updated_at: '', latitude: 1, longitude: 1, google_place_id: null, google_maps_embed_url: null, uber_url: '', email: '', google_url: '', google_rating: null, google_user_ratings_total: null, google_trading_hours: null, google_last_synced_at: null }
    ]

    const closest = findClosestStore({ lat: 0, lon: 0 }, stores)
    expect(closest).not.toBeNull()
    expect(closest?.id).toBe('a')
  })
})
