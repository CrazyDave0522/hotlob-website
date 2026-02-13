# Design: add-store-list-component

## Overview

The StoreList component provides a responsive display of Hotlob store locations with embedded Google Maps and comprehensive store information. The component implements an alternating layout that enhances visual interest while maintaining usability across devices.

## Architecture

### Component Structure

```
StoreList
├── For each store item:
│   ├── AlternatingContainer (handles left-right alternation)
│   │   ├── GoogleMapEmbed (responsive iframe, clickable to open Google Maps)
│   │   └── StoreInfo
│   │       ├── StoreHeader (name + Rating)
│   │       ├── StoreDetails (address + status)
│   │       ├── TradingHours
│   │       └── StorePhotos (max 3 images, clickable to open modal)

StoreSkeleton (loading placeholder, following DishCardSkeleton pattern)
├── Placeholder layout matching StoreList structure
├── Animated skeleton elements for map and info areas

Rating (reusable component)
├── Star icons: star-filled.svg, star-half.svg, star-empty.svg
├── Numeric rating display
├── Accessible screen reader support

ImageModal (using react-image-lightbox)
├── Full-size image display
├── Close button and overlay click to close
├── Keyboard navigation support
```

### Data Flow

1. **Page Load**: Locations page loads hero section, then fetches store data from database
2. **Data Retrieval**: Frontend reads cached Google Places data from database
3. **Component Render**: StoreList receives store array with cached enriched data
4. **Layout Logic**: Alternating layout applied based on store index
5. **Responsive**: CSS handles desktop (left-right) vs mobile (top-bottom)

### Layout Strategy

#### Container Width

- **Full Width**: StoreList component takes 100% width of its outer wrapper
- **No Max Width**: No artificial width constraints applied
- **Responsive**: Adapts to container width across all screen sizes

#### Desktop Layout (≥768px)

- **Alternating Pattern**: Odd stores (1st, 3rd, 5th...) = Map left, Info right
- **Even stores (2nd, 4th, 6th...) = Info left, Map right**
- **Grid System**: CSS Grid with proportional columns (1.509fr 1fr) to give map more visual weight
- **Gap**: Consistent spacing between map and info sections
- **Full Width Utilization**: Grid columns fill available container width with map getting ~60% space

#### Mobile Layout (<768px)

- **Stacked Pattern**: Info always on top, Map below (no alternation)
- **Flexbox**: Vertical stacking with full-width sections
- **Responsive Images**: Maps scale down proportionally

### Google Maps Integration

#### Embed Implementation

```html
<iframe
  src={store.google_maps_embed_url}
  width={responsiveWidth}
  height={responsiveHeight}
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
```

#### Responsive Sizing

- **Desktop (≥768px)**: Fluid height matching store info content height, width fills column (up to ~60% of container)
- **Mobile (<768px)**: Fixed 4:3 aspect ratio (75% padding-bottom)
- **Border radius**: 10px on all corners
- **Content-aware scaling**: Map height adapts to store information content rather than fixed aspect ratio

### Store Photos Display

#### Photo Sizing Specifications

Store photos SHALL be displayed with maximum dimensions and proportional scaling:

- **1920px viewport**: Maximum 140px width × 120px height
- **768px viewport**: Maximum 140px width × 120px height
- **Responsive scaling**: Scales proportionally below breakpoint maximums
- **Gallery layout**: Up to 3 photos ordered by display_order
- **Image optimization**: Web-optimized delivery with proper aspect ratio handling

### Data Architecture

#### Database Schema

**Store Table:**

```sql
create table public.store (
  id uuid not null default gen_random_uuid (),
  name text not null,
  street text null,
  suburb text null,
  state text null,
  postcode text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  latitude double precision null,
  longitude double precision null,
  google_place_id text null,
  google_maps_embed_url text null,
  uber_url text not null,
  email text not null,
  google_url text not null,
  google_rating numeric(2, 1) null,
  google_user_ratings_total integer null,
  google_trading_hours jsonb null,
  google_last_synced_at timestamp with time zone null,
  constraint store_pkey primary key (id),
  constraint store_email_key unique (email),
  constraint store_google_place_id_key unique (google_place_id),
  constraint store_google_url_key unique (google_url),
  constraint store_uber_url_key unique (uber_url)
) TABLESPACE pg_default;

create trigger trigger_store_updated_at BEFORE
update on store for EACH row
execute FUNCTION update_updated_at ();
```

**Store Photos Table:**

```sql
create table public.store_photos (
  id uuid not null default gen_random_uuid (),
  store_id uuid not null,
  photo_url text not null,
  display_order integer not null default 1,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint store_photos_pkey primary key (id),
  constraint store_photos_store_id_fkey foreign KEY (store_id) references store (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_store_photos_store_id on public.store_photos using btree (store_id) TABLESPACE pg_default;
create index IF not exists idx_store_photos_order on public.store_photos using btree (store_id, display_order) TABLESPACE pg_default;
create unique INDEX IF not exists idx_store_photos_unique_order on public.store_photos using btree (store_id, display_order) TABLESPACE pg_default;
create unique INDEX IF not exists idx_store_photos_unique_url on public.store_photos using btree (photo_url) TABLESPACE pg_default;
```

#### Store Data Structure

```typescript
interface Store {
  id: string;
  name: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  latitude: number;
  longitude: number;
  google_place_id: string;
  google_maps_embed_url: string;
  uber_url: string;
  email: string;
  google_url: string;
  google_rating: number;
  google_user_ratings_total: number;
  google_trading_hours: object;
  google_last_synced_at: string;
}

interface StorePhoto {
  id: string;
  store_id: string;
  photo_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface EnrichedStore extends Store {
  rating?: GoogleRating;
  tradingHours?: TradingHours;
  photos?: StorePhoto[];
}
```

#### Google API Integration

- **Places API**: Fetches rating, reviews, and basic place details
- **Caching**: Store API responses in database to avoid rate limits
- **Error Handling**: Graceful fallbacks when API unavailable
- **Sync Job**: Server-side cron job updates cached data every 30 days

#### Google Places Sync Job

The system SHALL implement a server-side sync job to minimize Google Places API (New) calls:

**Job Logic:**

```sql
SELECT * FROM store
WHERE google_place_id IS NOT NULL
AND (google_last_synced_at IS NULL OR google_last_synced_at < NOW() - INTERVAL '30 days')
```

**Sync State Rules:**

- `google_last_synced_at IS NULL` → Never synced → Call API (cold start)
- `google_last_synced_at < 30 days ago` → Outdated → Call API (refresh)
- `google_last_synced_at >= 30 days ago` → Current → Skip API call
- **Source of Truth**: Only `google_last_synced_at` determines sync state
- **Field Independence**: Do NOT check `google_rating` or `google_trading_hours` for NULL values
- **Automatic Initialization**: New stores with `google_place_id` are automatically synced

**Update Fields:**

- `google_rating`: Places API rating value (may be NULL)
- `google_user_ratings_total`: Total number of user ratings (may be NULL)
- `google_trading_hours`: JSONB object with opening hours (may be NULL)
- `google_last_synced_at`: Set to NOW() (never NULL after sync)

**Scheduling:**

- Runs via cron job (not on user requests)
- Only processes stores with `google_place_id`
- Updates only outdated records (>30 days old)

**Frontend Behavior:**

- Reads cached data from database only
- Never calls Google APIs directly
- Displays fallback content when data unavailable

### Styling Architecture

#### Rating Component Design

The Rating component SHALL be a reusable component that displays star ratings with the following visual format:

**Visual Format:** `[⭐][⭐][⭐][⭐½][☆] 4.5`

- **Full Stars**: `public/images/icons/star-filled.svg` for complete ratings
- **Half Stars**: `public/images/icons/star-half.svg` for partial ratings
- **Empty Stars**: `public/images/icons/star-empty.svg` for unfilled ratings
- **Numeric Display**: Rating number shown after stars
- **5-Star Scale**: Always displays 5 star positions
- **Star Sizing**: Responsive with maximum dimensions and proportional scaling (medium size variant used):
  - **1920px viewport**: Maximum 20px width × 20px height
  - **768px viewport**: Maximum 15px width × 15px height
  - **Responsive scaling**: Scales proportionally below breakpoint maximums

**Component Interface:**

```typescript
interface RatingProps {
  value: number; // Rating value (0-5)
  size?: 'sm' | 'md' | 'lg'; // Star size variants (defaults to 'md' for store items)
  className?: string; // Additional CSS classes
}
```

**Accessibility:**

- Screen reader announces: "4.5 out of 5 stars"
- Semantic markup with proper ARIA labels
- Keyboard accessible (no interaction required)

#### CSS Module Structure

```css
.StoreList {
  /* Container styles */
}

.StoreList-item {
  /* Individual store item */
}

.StoreList-alternating {
  /* Desktop alternating layout */
}

.StoreList-stacked {
  /* Mobile stacked layout */
}

.StoreInfo {
  /* Store information section */
}

.GoogleMapEmbed {
  /* Map container styles */
}
```

#### Design System Integration

- **Typography**: Uses existing font tokens (--font-size-_, --font-weight-_)
- **Spacing**: Follows space scale (--space-\*)
- **Colors**: Brand colors for ratings, status indicators
- **Responsive**: Mobile-first with desktop enhancements

#### Typography Specifications

Store information text SHALL use responsive font sizing with proportional scaling from maximum dimensions:

**Store Title (Store Name):**

- **1920px viewport**: Maximum 24px font size
- **768px viewport**: Maximum 24px font size
- **Responsive scaling**: Scales proportionally below breakpoint maximums (e.g., at 375px viewport, size ≈ 0.49 × 24px)

**Store Information Text (Address, Hours, Rating):**

- **1920px viewport**: Maximum 18px font size
- **768px viewport**: Maximum 18px font size
- **Responsive scaling**: Scales proportionally below breakpoint maximums (e.g., at 375px viewport, size ≈ 0.49 × 18px)

### Performance Considerations

#### Loading Optimization

- **Lazy Loading**: Maps load only when visible (Intersection Observer)
- **Image Optimization**: Store photos served via Next.js Image component
- **API Batching**: Multiple store requests batched where possible

#### Bundle Size

- **Dynamic Imports**: Google Maps component loaded on demand
- **Tree Shaking**: Unused API utilities excluded from bundle

### Accessibility

#### Screen Reader Support

- **Alt Text**: Descriptive alt text for store photos
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Focus management for interactive elements

#### Visual Accessibility

- **Color Contrast**: Rating stars and status indicators meet WCAG standards
- **Text Scaling**: All text scales with user preferences
- **Focus Indicators**: Visible focus states for keyboard users

### Error Handling

#### API Failures

- **Fallback UI**: Display store info without ratings/hours when API fails
- **Retry Logic**: Automatic retry for transient failures
- **Offline Mode**: Cached data displayed when offline

#### Data Validation

- **Schema Validation**: Runtime validation of store data structure
- **Sanitization**: HTML sanitization for user-generated content
