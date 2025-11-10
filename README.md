# 🦞 Hotlob Website

A modern Next.js website for Hotlob - Australian Lobster & Seafood Rolls.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd hotlob-website
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
app/
├── layout.tsx           # Root layout with metadata
├── page.tsx            # Home page
├── globals.css         # Global styles
└── see-our-food/       # Food menu section
    ├── page.tsx        # Server component - data fetching
    ├── loading.tsx     # Loading state
    ├── error.tsx       # Error boundary
    └── components/     # Client components
        ├── dish-card.tsx
        ├── dish-grid.tsx
        ├── empty-state.tsx
        ├── food-section.tsx
        ├── hero.tsx
        └── tag-filter.tsx
lib/
└── supabaseClient.ts   # Supabase client setup
types/
└── types.ts           # TypeScript type definitions
```

## Features

- ✅ Server-side data fetching with Supabase
- ✅ Client-side tag filtering
- ✅ Responsive design
- ✅ Image optimization with Next.js Image
- ✅ Loading and error states
- ✅ TypeScript type safety
- ✅ Location pages with Google Places rating & hours cache (monthly refresh)

## Database Schema

The app expects these Supabase tables:

- `dish` - Dish information
- `tag` - Available tags
- `media_asset` - Dish images
- `dish_tag` - Many-to-many relationship
- `store` - Physical store locations (includes `google_place_id` and optional `google_maps_embed_url`)
- `store_photos` - Up to 3 photos per store
- `place_cache` - Cached Google Places details per store (see below)

### Google Places Cache (`place_cache`)

Monthly refreshed snapshot of lightweight Place Details fields:

| Column | Type | Notes |
| ------ | ---- | ----- |
| `store_id` | uuid | FK to `store` (unique) |
| `rating` | numeric(2,1) | e.g. 4.5; null if unavailable |
| `user_ratings_total` | integer | total reviews count (currently unused in UI) |
| `opening_hours_weekday_text` | text[] | 7 strings Monday→Sunday from Places API |
| `refreshed_at` | timestamptz | when we last pulled |
| `expires_at` | timestamptz | `refreshed_at + 30 days` |

Display logic: we show only today's line (`Today: …`). If hours array missing or malformed we hide the row.

Rating logic: hide the stars if `rating` is null.

### Refresh Flow

Two protected API routes (Authorization: Bearer `CRON_SECRET`):

```
POST /api/places/refresh            # refresh all stores
POST /api/places/{storeId}/refresh  # refresh single store
```

They call Google Place Details with fields:

```
rating,userRatingCount,regularOpeningHours.weekdayDescriptions
```

**Important**: Uses **Places API (New)** endpoint:
- Endpoint: `https://places.googleapis.com/v1/places/{place_id}`
- Headers: `X-Goog-Api-Key`, `X-Goog-FieldMask`
- Make sure "Places API (New)" is enabled in Google Cloud Console

Language is forced to `en` for consistency.

### Environment Variables

Add to `.env.local` (or Vercel server env):

```
GMAPS_API_KEY=your-google-maps-api-key
CRON_SECRET=super-long-random-string
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server only)
```

Do NOT expose `SUPABASE_SERVICE_ROLE_KEY` or the Google key on the client; only server code imports `serverEnv.ts`.

### Vercel Cron Setup

Configure a monthly cron hitting `/api/places/refresh` with header:

```
Authorization: Bearer {CRON_SECRET}
```

Optionally schedule a daily run if you later switch to real-time open/closed logic.

### Edge Cases Covered

- 24 hours: source string like `"Monday: Open 24 hours"` → `Today: Open 24 hours`
- Closed day: `"Sunday: Closed"` → `Today: Closed`
- Multiple segments: passed through as returned (comma separated)
- Missing data: hours row hidden; rating row hidden
- API failure: previous cache retained until next successful run

### Local Manual Refresh

You can manually refresh a single store with curl (replace placeholders):

```bash
curl -X POST \
    -H "Authorization: Bearer $CRON_SECRET" \
    https://localhost:3000/api/places/<storeId>/refresh
```

Or all stores:

```bash
curl -X POST \
    -H "Authorization: Bearer $CRON_SECRET" \
    https://localhost:3000/api/places/refresh
```

## Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm refresh-places   # Test script: list stores and refresh first one
```

### Development Tools

**`pnpm refresh-places`** - Manual Google Places refresh helper:
- Lists all stores with IDs and Place IDs
- Refreshes the first store as a test
- Shows cache results (rating, reviews, hours)
- Useful for debugging API integration

Requires `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `CRON_SECRET`.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to add your environment variables in Vercel's project settings.

## License

Private - All rights reserved
