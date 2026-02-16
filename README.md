# Hotlob Website

A modern Next.js application for Hotlob, featuring premium Australian lobster rolls and seafood. Built with TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Testing**: Vitest with React Testing Library
- **Package Manager**: pnpm
- **Documentation**: OpenSpec

## Features

- **Store Locator**: Find Hotlob locations with interactive maps and store information
- **Menu Display**: Browse dishes with categories, pricing, and allergen information
- **Catering Services**: Information about Hotlob catering options
- **News & Updates**: Latest Hotlob news and announcements
- **Customer Reviews**: Curated Google reviews with ratings
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Server-side rendering with Next.js App Router

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/cron/          # Cron jobs for data syncing
│   ├── locations/         # Store locator page
│   ├── see-our-food/      # Menu page
│   ├── hotlob-news/       # News page
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions and API clients
├── types/                 # TypeScript type definitions
├── styles/                # CSS styles and tokens
├── __tests__/             # Test files
└── openspec/              # Project documentation and specs
```

## API Routes

### Cron Jobs

The application includes automated cron jobs for data synchronization:

- **Google Places Sync** (`/api/cron/google-places`)
  - Syncs store ratings, hours, and reviews from Google Places API
  - Runs automatically to keep data fresh
  - Requires `CRON_SECRET` authentication

- **Customer Reviews Sync** (`/api/cron/customer-reviews`)
  - Fetches and curates customer reviews
  - Manages review expiration and freshness

**Authentication**: All cron endpoints require `Authorization: Bearer <CRON_SECRET>` header.

### Usage

```bash
# Trigger Google Places sync
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://your-domain.com/api/cron/google-places
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Variables

This project requires the following environment variables to be set:

### Required Variables

- `NEXT_PUBLIC_SUPABASE_PROJECT_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable (anon) key
- `SUPABASE_SECRET_KEY` - Your Supabase secret key (server-side only)
- `CRON_SECRET` - Secret for authenticating cron job requests

### Supabase Client Usage

This project uses two separate Supabase clients for security:

- **Client-side**: `lib/supabaseClient.ts` - Uses publishable key, safe for browser
- **Server-side**: `lib/supabaseServer.ts` - Uses secret key, for server operations only

Import the appropriate client based on your context:

- Client components: `import { supabase } from '@/lib/supabaseClient'`
- Server components/actions/routes: `import { supabaseServer } from '@/lib/supabaseServer'`

## Database Schema

This project uses Supabase (PostgreSQL) as the database. The schema includes the following key tables:

### Store Table

```sql
CREATE TABLE store (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  street TEXT,
  suburb TEXT,
  state TEXT,
  postcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  google_place_id TEXT,
  google_maps_embed_url TEXT,
  uber_url TEXT NOT NULL,
  email TEXT NOT NULL,
  google_url TEXT NOT NULL,
  google_rating DOUBLE PRECISION,
  google_user_ratings_total INTEGER,
  google_trading_hours JSONB,
  google_last_synced_at TIMESTAMP WITH TIME ZONE
);
```

### Store Photos Table

```sql
CREATE TABLE store_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES store(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_store_photos_store_id ON store_photos(store_id);
CREATE INDEX idx_store_photos_display_order ON store_photos(display_order);
```

### Curated Reviews Table

```sql
CREATE TABLE curated_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES store(id) ON DELETE CASCADE,
  google_review_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_photo_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_time TIMESTAMP WITH TIME ZONE NOT NULL,
  language TEXT,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  author_uri TEXT,
  text_length INTEGER GENERATED ALWAYS AS (char_length(review_text)) STORED,
  UNIQUE(store_id, google_review_id)
);

CREATE INDEX idx_curated_reviews_store_id ON curated_reviews(store_id);
CREATE INDEX idx_curated_reviews_expires_at ON curated_reviews(expires_at);
CREATE INDEX idx_curated_reviews_google_review_id ON curated_reviews(google_review_id);
```

### News Table

```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  content JSONB NOT NULL,
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  excerpt TEXT,
  author TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Dish Table

```sql
CREATE TABLE dish (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('premium', 'standard')),
  price DOUBLE PRECISION,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  category TEXT
);
```

### Additional Tables

- `media_assets` - Images for dishes
- `allergen_tags` - Allergen information
- `dish_allergens` - Dish-allergen relationships
- `dish_stores` - Dish availability per store

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- **Store Locator**: Find Hotlob locations with interactive maps and store information
- **Menu Display**: Browse dishes with categories, pricing, and allergen information
- **News & Updates**: Latest Hotlob news and announcements
- **Customer Reviews**: Curated Google reviews with ratings
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Server-side rendering with Next.js App Router

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/cron/          # Cron jobs for data syncing
│   ├── locations/         # Store locator page
│   ├── see-our-food/      # Menu page
│   ├── hotlob-news/       # News page
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions and API clients
├── types/                 # TypeScript type definitions
├── styles/                # CSS styles and tokens
├── __tests__/             # Test files
└── openspec/              # Project documentation and specs
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Framework documentation
- [Supabase Documentation](https://supabase.com/docs) - Database and auth
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Vitest](https://vitest.dev/) - Testing framework
- [OpenSpec](https://github.com/your-repo/openspec) - Documentation system

## Testing

This project uses [Vitest](https://vitest.dev/) for testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [jsdom](https://github.com/jsdom/jsdom) for DOM simulation.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Test Types & Organization

Tests are organized by type in the `__tests__/` directory:

1. **Unit Tests** (`__tests__/unit/`)
   - Test individual components and functions
   - Fast and focused
   - Examples: Button rendering, form validation, utility functions

2. **Integration Tests** (`__tests__/integration/`)
   - Test how multiple components work together
   - Test complete user workflows
   - Examples: Page navigation, form submissions, API interactions

3. **Snapshot Tests** (`__tests__/snapshots/`)
   - Detect unintended UI changes
   - Useful after components are stable
   - Examples: Component layout regression detection

### Test Structure

```
__tests__/
├── unit/
│   ├── app/components/
│   │   └── Button.test.tsx
│   └── README.md
├── integration/
│   ├── locations.test.tsx
│   └── README.md
├── snapshots/
│   └── README.md
├── setup.ts                 # Test configuration
└── README.md
```

### Writing Tests

- Use React Testing Library for component testing
- Focus on testing behavior, not implementation details
- Test user-facing interactions and outcomes
- Import test utilities from `@testing-library/react`
- Use `screen` for querying elements
- Mock external dependencies (Supabase, APIs)

### Best Practices

1. **Start with unit tests** for individual components
2. **Add integration tests** as features become more complex
3. **Use snapshots** to catch UI regressions on stable components
4. **Run tests** before marking features complete
5. **Keep tests maintainable** - simple and clear assertions
6. **Test accessibility** features where applicable
