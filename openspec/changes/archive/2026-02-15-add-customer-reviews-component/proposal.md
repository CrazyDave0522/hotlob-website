# Customer Reviews Component

## Summary

Implement a customer reviews display component that fetches and shows customer reviews from the `curated_reviews` table. The component will be added as a new section below the store list on the locations page, displaying all reviews sorted by highest rating first.

## Why

Customer reviews are essential for building trust and credibility with website visitors. Currently, the website lacks a dedicated reviews section, despite having the infrastructure to fetch and store authentic Google Places reviews. By displaying these reviews prominently, we can:

- Showcase authentic customer testimonials
- Build trust through verified review sources
- Provide social proof for potential customers
- Enhance the user experience on the locations page
- Leverage existing review data without additional API costs

## What Changes

### New Capabilities

- **customer-reviews-display** — Display customer reviews in a dedicated component with proper sorting and formatting

### Design Decisions

- **Component Location**: New section below store list on `/locations` page
- **Data Source**: `curated_reviews` table via Supabase client
- **Sorting**: Highest rating first (5-star reviews displayed first)
- **Display Format**: Each review as a row with user icon, name, rating stars, and review text
- **Rating Component**: Reuse existing `Rating` component for consistency
- **User Icon**: Use `author_photo_url` from review data, with fallback to `User` icon from Lucide React
- **No Store Filtering**: Display all reviews across all stores for maximum social proof

## Requirements

### Core Functionality

- Fetch all reviews from `curated_reviews` table
- Filter to only display English reviews (`language = 'en'`)
- Sort reviews by rating descending (highest first)
- Display each review with user icon, author name, rating, and text
- Display review date in Australian format (DD/MM/YYYY)
- Handle empty state when no reviews are available
- Component does not render when no reviews exist
- Responsive design for mobile and desktop

### Component Design

- Row-based layout for each review
- Consistent spacing and typography with existing components
- Accessible design with proper ARIA labels
- Loading states during data fetching
- Error handling for failed fetches

### Integration

- Add new section to locations page below store list
- Follow existing page component patterns
- Maintain responsive design standards

## Impact

- **Users**: See authentic customer reviews building trust and credibility
- **Performance**: Minimal impact with efficient database queries
- **Maintenance**: Leverages existing review infrastructure

## Dependencies

- Existing `curated_reviews` table and review fetching system
- Supabase client integration (`lib/supabaseClient.ts`)
- Existing `Rating` component for star display
- Locations page structure (`app/locations/page.tsx`)

## Success Criteria

- Reviews display correctly sorted by rating
- Component integrates seamlessly with locations page
- Component displays properly on desktop devices (screen width >= 768px)
- Component displays properly on mobile devices (screen width < 768px)
- No performance degradation on page load
- Error states handled gracefully
