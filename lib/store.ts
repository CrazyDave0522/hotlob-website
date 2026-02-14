import type { Store, StorePhoto } from '@/types/store'
import { supabase } from './supabaseClient'

export async function fetchStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('store')
    .select('*')
    .order('google_rating', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Failed to fetch stores', error)
    return []
  }

  return data ?? []
}

export async function fetchStorePhotos(storeId: string): Promise<StorePhoto[]> {
  const { data, error } = await supabase
    .from('store_photos')
    .select('*')
    .eq('store_id', storeId)
    .order('display_order')
    .limit(3)

  if (error) {
    console.error('Failed to fetch store photos', error)
    return []
  }

  return data ?? []
}

export async function fetchStoresWithPhotos(): Promise<(Store & { photos: StorePhoto[] })[]> {
  try {
    // Try to fetch from Supabase first
    const stores = await fetchStores()
    const storesWithPhotos = await Promise.all(
      stores.map(async (store) => {
        const photos = await fetchStorePhotos(store.id)
        return { ...store, photos }
      })
    )
    return storesWithPhotos
  } catch (error) {
    console.error('Error fetching from Supabase, using mock data:', error)
    // Fallback to mock data
    const mockStores: (Store & { photos: StorePhoto[] })[] = [
      {
        id: '1',
        name: 'Hotlob Karrinyup',
        street: '123 Test St',
        suburb: 'Karrinyup',
        state: 'WA',
        postcode: '6018',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: -31.877362,
        longitude: 115.774070,
        google_place_id: 'ChIJ1234567890abcdef',
        google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3388.0755525160557!2d115.77406987592653!3d-31.877362274052555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32af0d1c959563%3A0x2e3407f016dc3c56!2sHotlob%20Karrinyup!5e0!3m2!1sen!2sau!4v1762517036604!5m2!1sen!2sau',
        uber_url: 'https://uber.com',
        email: 'karrinyup@hotlob.com.au',
        google_url: 'https://maps.google.com',
        google_rating: 4.7,
        google_user_ratings_total: 150,
        google_trading_hours: {
          open_now: true,
          weekday_text: ['Monday: 10:00 AM – 8:00 PM', 'Tuesday: 10:00 AM – 8:00 PM']
        },
        google_last_synced_at: new Date().toISOString(),
        photos: []
      },
      {
        id: '2',
        name: 'Hotlob Elizabeth St',
        street: '456 Test St',
        suburb: 'Melbourne CBD',
        state: 'VIC',
        postcode: '3000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: -37.817288,
        longitude: 144.962271,
        google_place_id: 'ChIJ9876543210fedcba',
        google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83528806166!2d144.9622712761652!3d-37.81728806166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0d1c959563%3A0x2e3407f016dc3c56!2sHotlob%20Elizabeth%20St!5e0!3m2!1sen!2sau!4v1762517036604!5m2!1sen!2sau',
        uber_url: 'https://uber.com',
        email: 'elizabeth@hotlob.com.au',
        google_url: 'https://maps.google.com',
        google_rating: 3.9,
        google_user_ratings_total: 89,
        google_trading_hours: {
          open_now: false,
          weekday_text: ['Monday: 9:00 AM – 7:00 PM', 'Tuesday: 9:00 AM – 7:00 PM']
        },
        google_last_synced_at: new Date().toISOString(),
        photos: []
      }
    ]
    
    return mockStores
  }
}