import type { Store } from '@/types/store'
import { fetchDishStores } from '@/lib/dishes'
import { tryGetQuickLocation } from '@/utils/geolocation'
import { calculateDistance } from '@/utils/distance'

export interface StoreWithDistance extends Store {
  distance?: number
  dishUberUrl?: string
}

export async function getAvailableStoresForDish(dishId: string): Promise<StoreWithDistance[]> {
  const dishStores = await fetchDishStores(dishId)

  if (dishStores.length === 0) {
    return []
  }

  // Get user location if available
  const userLocation = await tryGetQuickLocation({ timeoutMs: 2000 })

  // Transform dish_store data to StoreWithDistance format
  const storesWithDistance: StoreWithDistance[] = dishStores
    .filter(dishStore => !!dishStore.store)
    .map(dishStore => {
      const store = dishStore.store as Store
      let distance: number | undefined

      if (userLocation && store.latitude && store.longitude) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          store.latitude,
          store.longitude
        )
      }

      return {
        ...store,
        distance,
        dishUberUrl: dishStore.uber_url
      }
    })

  // Sort by distance if available, otherwise alphabetically by store name
  return storesWithDistance.sort((a, b) => {
    // If both have distance, sort by distance (closest first)
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance
    }
    // If only one has distance, prioritize the one with distance
    if (a.distance !== undefined && b.distance === undefined) {
      return -1
    }
    if (a.distance === undefined && b.distance !== undefined) {
      return 1
    }
    // If neither has distance, sort alphabetically
    return a.name.localeCompare(b.name)
  })
}

export async function handleDishOrder(dishId: string): Promise<void> {
  // This will be implemented when we update the components
  // For now, it's a placeholder that will open the modal
  console.log('Ordering dish:', dishId)
}