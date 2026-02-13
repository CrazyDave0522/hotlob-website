# Tasks: add-store-list-component

## Implementation Tasks

### Data Layer Setup

- [x] Create store and store_photos TypeScript types based on database schema
- [x] Implement database client for store data retrieval with photo relationships
- [x] Set up Google Places API (New) client configuration
- [x] Create API utility functions for ratings and trading hours
- [x] Implement server-side Google Places sync job with cron scheduling
- [x] Add CRON_SECRET authentication to sync job endpoint
- [x] Add sync job logic to update stores with outdated Google data (30+ days)

### Component Architecture

- [x] Create StoreList component with variant prop support
- [x] Implement alternating layout logic for desktop (left-right)
- [x] Implement stacked layout for mobile (top-bottom)
- [x] Add responsive breakpoint handling (@media queries)

### Store Information Display

- [x] Create StoreInfo component for name, rating, address, status, hours
- [x] Create reusable Rating component (star-filled.svg, star-half.svg, star-empty.svg + numeric value, responsive sizing)
- [x] Add store photos gallery (max 3 images, 140px×120px at 1920px/768px, scales proportionally below)
- [x] Implement image modal using react-image-lightbox (click photos to open full-size modal)
- [x] Style operating status indicators (Open/Closed)

### Google Maps Integration

- [x] Implement embedded Google Maps component using store.google_maps_embed_url
- [x] Add responsive sizing: max 800x340px @ 1920px, 650x320px @ 768px, scales proportionally
- [x] Maintain aspect ratio across breakpoints
- [x] Implement Google Maps click navigation (open google_url in new tab)
- [x] Handle map loading states and errors
- [x] Add loading states using skeleton placeholders (following DishCardSkeleton pattern)
- [x] Create StoreSkeleton component for loading states
- [x] Implement lazy loading for images and maps
- [x] Add React error boundaries for component failure handling
- [x] Ensure keyboard navigation for image modals (Tab, Escape)

### Page Integration

- [x] Update locations page to include StoreList component as a new section below the hero
- [x] Add proper spacing and layout around the component
- [x] Ensure component fits within existing page design

### Styling and Responsive Design

- [x] Create CSS module for StoreList component
- [x] Ensure component takes 100% width of outer wrapper (no max-width constraints)
- [x] Implement alternating layout CSS Grid/Flexbox
- [x] Add mobile-first responsive styles
- [x] Style store information typography and spacing (title: max 24px, body: max 18px, responsive)

### Testing

- [x] Write unit tests for StoreList component variants
- [x] Test responsive layout behavior
- [x] Mock Google API responses for testing
- [x] Add integration tests for locations page
- [x] Test accessibility features

### Documentation

- [x] Update component README with usage examples
- [x] Document Google API setup requirements
- [x] Add TypeScript interface documentation
