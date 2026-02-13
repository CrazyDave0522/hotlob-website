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