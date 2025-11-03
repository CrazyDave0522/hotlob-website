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

## Database Schema

The app expects these Supabase tables:
- `dish` - Dish information
- `tag` - Available tags
- `media_asset` - Dish images
- `dish_tag` - Many-to-many relationship

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to add your environment variables in Vercel's project settings.

## License

Private - All rights reserved

