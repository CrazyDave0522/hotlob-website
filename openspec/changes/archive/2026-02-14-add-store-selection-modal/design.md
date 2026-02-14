# Design: Store Selection Modal

## Overview
This design document outlines the architecture and implementation approach for a reusable store selection modal component that enables users to select a store location before proceeding to order online.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Header Component                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ "Order Online" Button (CTA)                          │  │
│  │ onClick → openStoreSelectionModal()                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ triggers
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ StoreSelectionModal Component                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Modal Overlay (backdrop)                             │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ Modal Content                                  │  │  │
│  │  │  • Title: "Select a store"                     │  │  │
│  │  │  • Close button (prefer the `X` icon from `lucide-react`)                            │  │  │
│  │  │  • Store List                                  │  │  │
│  │  │    ┌───────────────────────────────────────┐   │  │  │
│  │  │    │ StoreSelectionItem (repeated)         │   │  │  │
│  │  │    │  • Store name                         │   │  │  │
│  │  │    │  • Address                            │   │  │  │
│  │  │    │                                       │   │  │  │
│  │  │    │  onClick → onStoreSelect(store)       │   │  │  │
│  │  │    └───────────────────────────────────────┘   │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ callback
                           ▼
                  onStoreSelect(store)
                           │
                           │ uses store.uber_url
                           ▼
                  window.open(store.uber_url, '_blank')
```

## Component Interface

### StoreSelectionModal Props
```typescript
interface StoreSelectionModalProps {
  isOpen: boolean                           // Controls modal visibility
  onClose: () => void                       // Called when modal should close
  onStoreSelect: (store: Store) => void    // Called when user selects a store
  stores: Store[]                          // List of stores to display
}
```

### Usage Example
```tsx
function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stores, setStores] = useState<Store[]>([])

  const handleStoreSelect = (store: Store) => {
    window.open(store.uber_url, '_blank')
    setIsModalOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Order Online
      </Button>
      
      <StoreSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStoreSelect={handleStoreSelect}
        stores={stores}
      />
    </>
  )
}
```

## Data Flow

### 1. Modal Trigger
- User clicks "Order Online" CTA button in Header
- Header component sets `isModalOpen` to `true`
- StoreSelectionModal renders with overlay

### 1.5 Automatic Selection When Permission Already Granted

- Before opening the modal, the Header CTA flow SHALL attempt to determine whether a valid user location is already available. This can be done by checking the Permissions API (`navigator.permissions.query({ name: 'geolocation' })`) where supported, or by attempting a quick `navigator.geolocation.getCurrentPosition()` call with a short timeout.
- If a valid user location is immediately available, the app SHALL compute distances to all stores using each store's `latitude` and `longitude`, select the closest store, and automatically call the selection callback (for the Header flow this means opening `store.uber_url` in a new tab) without rendering the modal.
- If permission is denied, unavailable, or a quick location attempt fails or times out, the app SHALL fall back to opening the `StoreSelectionModal` as a manual-selection UI. The `StoreSelectionModal` SHALL NOT itself initiate geolocation permission requests or probes.

### 2. Location Permission and Where It's Handled
- Geolocation permission and quick-location attempts SHALL be handled by the caller (e.g., the Header flow) before deciding whether to open the modal.
- The Header (or calling component) SHALL attempt a quick location probe when the CTA is triggered. If a valid user location is immediately available, the caller SHALL compute distances and perform automatic selection (skipping modal). If not, the caller SHALL open the modal.
- The StoreSelectionModal SHALL NOT itself initiate geolocation permission requests or probes. Distance calculation and display are the responsibility of the caller (for example, the Header). The caller MAY perform distance calculations (using the utilities described below) and either automatically select the closest store or pass a pre-sorted list of stores to the modal. The modal itself must not render distance values.

### 3. Store Selection
- User clicks on a store item
- Modal calls `onStoreSelect(store)` callback with selected store
- Header receives callback, opens `store.uber_url` in new tab via `window.open(store.uber_url, '_blank')`
- Header closes modal by setting `isModalOpen` to `false`

### 4. Modal Close
- User can close via:
  - Close button (X)
  - Clicking backdrop overlay
  - Pressing Escape key
  - Selecting a store (automatic close)

## Distance Calculation

### Haversine Formula Implementation
```typescript
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}
```

Note: When calculating distance for a store, use the store object's `latitude` and `longitude` fields (e.g., `store.latitude`, `store.longitude`) and the user's coordinates returned from the Geolocation API. The function above accepts the user's `lat/lon` as the first pair and the store's `latitude/longitude` as the second pair.

### Geolocation Flow
```
CTA clicked
  │
  ▼
Header attempts quick location probe (Permissions API or short getCurrentPosition)
  │
  ├─ Success: compute distances using `store.latitude`/`store.longitude`, select closest, open store.uber_url in new tab
  │
  └─ Failure/Timeout/Denied: open StoreSelectionModal (manual selection, no distances shown)
```

## Styling Architecture

### CSS Files
- `styles/components/store-selection-modal.css` - Modal container and overlay
- CSS follows the project's component naming convention with `.StoreSelectionModal-` prefix

### Key Style Elements
- **Overlay**: `rgba(0, 0, 0, 0.90)` background, full viewport coverage, `position: fixed`
- **Modal Content**: White background, centered, max-width constraint, border-radius `--radius-30`
- **Store Items**: Clickable cards with hover states, padding, border-radius `--radius-20`
- **Responsive**: Mobile-first design with responsive padding and font sizes

### Mobile vs Desktop
- **Mobile (<768px)**: Full-width modal with minimal side padding
- **Desktop (≥768px)**: Centered modal with max-width ~600px, larger padding

## Accessibility

### ARIA Attributes
- Modal overlay: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`
- Close button: `aria-label="Close store selection modal"`
- Store items: Interactive buttons with proper focus states

### Keyboard Navigation
- **Escape**: Close modal
- **Tab**: Cycle through store items and close button
- **Enter/Space**: Select focused store
- **Focus trap**: Keep focus within modal when open

### Screen Reader Support
- Modal title announced when opened
- Each store's name and address read aloud
<!-- Modal must not manage geolocation or announce distances; caller may handle distance announcements if required. -->

## State Management

### State Management

The `StoreSelectionModal` is intentionally lightweight: it does not manage geolocation state. The caller (for example, `Header`) is responsible for any `userLocation`, loading, error, and distance calculations. The modal's internal state should only track UI-specific concerns such as internal focus and scroll position if necessary.

If the caller prefers, it may pass stores pre-sorted by distance or pass a simple `sortedStores: Store[]` prop; otherwise the modal will render the provided `stores` array as-is (alphabetically if the caller provides it that way).

## Integration Points

### Existing Components
- **Header**: Add state and handlers for modal, integrate CTA button click
- **Store utilities**: Reuse `fetchStores()` from `lib/store.ts`
- **Store types**: Use existing `Store` type from `types/store.ts`

### New Utilities
- `utils/distance.ts`: Haversine formula for distance calculation
- `utils/geolocation.ts`: Wrapper for browser geolocation API with error handling

## Error Handling

### Geolocation Errors
- **PERMISSION_DENIED**: User denied location access → show stores without distance
- **POSITION_UNAVAILABLE**: Device can't determine location → show stores without distance
- **TIMEOUT**: Geolocation request timed out → show stores without distance

### Edge Cases
- No stores available: Display message "No stores available"
- Store missing required data: Skip invalid stores with console warning
- Missing uber_url: Disable store selection for that store

## Performance Considerations

### Optimization Strategies
1. **Scroll lock**: Use same technique as Header mobile navigation
2. **Lazy geolocation**: Only request when modal opens, not on page load
3. **Memoization**: Cache distance calculations when user location doesn't change
4. **Portal rendering**: Use React portal to render modal at document root level

### Bundle Size
- Minimal external dependencies (use native Geolocation API)
- No heavy libraries for modal (custom implementation following existing patterns)

## Testing Strategy

### Unit Tests
- StoreSelectionModal rendering with/without stores
- Distance calculation accuracy (Haversine formula)
- Keyboard navigation (Escape, Tab, Enter)
- Geolocation success and error handling

### Integration Tests
- Header CTA → modal open → store select → Uber URL open
- Modal close via backdrop, close button, Escape key
- Location permission flow (mocked geolocation)

### E2E Tests (optional)
- Full user flow from landing page to Uber Eats tab opening

## Future Enhancements
- Store search/filter functionality
- Remember last selected store in localStorage
- Show store hours in selection list
- Auto-select closest store with user confirmation
- Integration with other ordering platforms beyond Uber Eats
