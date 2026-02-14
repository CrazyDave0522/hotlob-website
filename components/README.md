# Store Components

This directory contains components for displaying Hotlob store locations.

## Components

### StoreList
Main component that displays a list of stores with alternating layout.

```tsx
import StoreList from '@/components/StoreList'

function LocationsPage() {
  return <StoreList />
}
```

### StoreItem
Individual store item with map and info sections.

### StoreInfo
Store information display including name, rating, address, hours, and photos.

### Rating
Reusable star rating component.

```tsx
import Rating from '@/components/Rating'

<Rating value={4.5} size="md" />
```

### GoogleMapEmbed
Embedded Google Maps component.

### StoreSkeleton
Loading skeleton for store items.

### ErrorBoundary
Error boundary for catching component errors.

### StoreSelectionModal
Reusable modal component for selecting a store when automatic location-based selection isn't available.

Usage:
```tsx
import StoreSelectionModal from '@/components/StoreSelectionModal'

function HeaderExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [stores, setStores] = useState<Store[]>([])

  const handleSelect = (store: Store) => {
    window.open(store.uber_url, '_blank')
    setIsOpen(false)
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Order Online</button>
      <StoreSelectionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onStoreSelect={handleSelect}
        stores={stores}
      />
    </>
  )
}
```

Props:
- `isOpen: boolean` — controls visibility
- `onClose: () => void` — called when modal should close
- `onStoreSelect: (store: Store) => void` — called when user selects a store
- `stores: Store[]` — list of stores to render

Geolocation behavior:
- The modal is a manual-selection UI and SHALL NOT request location permissions or render distances.
- Callers (e.g., `Header`) may attempt a quick location probe (`tryGetQuickLocation`) and auto-select the closest store using `utils/distance` helpers. If that fails or times out, open this modal as a fallback.

## Google Places API Setup

The components use Google Places API (New) for store ratings and hours. Required environment variables:

- `NEXT_PUBLIC_GMAPS_API_KEY`: Google Maps API key with Places API enabled

## Cron Job

A server-side cron job syncs Google Places data:

```
GET /api/cron/google-places
Authorization: Bearer <CRON_SECRET>
```

Required environment variable:
- `CRON_SECRET`: Secret for authenticating cron requests

## Styling

Components use CSS files in `styles/components/` following the project's naming convention.