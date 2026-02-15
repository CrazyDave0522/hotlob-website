# Customer Reviews Component - Tasks

## Data Layer

- [x] Create `lib/reviews.ts` with `fetchReviews` function
- [x] Implement Supabase query to fetch all reviews ordered by rating desc
- [x] Add language filter to only include English reviews (`language = 'en'`)
- [x] Add rating filter to only include reviews with rating >= 4
- [x] Add proper error handling and logging
- [x] Export review types from `types/review.ts`

## Component Implementation

- [x] Create `components/CustomerReviews.tsx` client component
- [x] Ensure component does not include `<section>` elements
- [x] Implement loading state with spinner (same as NewsList component)
- [x] Create review item layout with specific structure: wrapper with icon left and name/date/rating/text right (all aligned left)
- [x] Implement error state with user-friendly message
- [x] Implement empty state when no reviews available (component does not render)
- [x] Add responsive row-based layout for review items

## Review Item Design

- [x] Create review item sub-component or inline rendering
- [x] Display author photo (with fallback to `User` icon from Lucide React) for each review
- [x] Show author name with specified typography (font-weight: 600, line-height: normal, text-transform: uppercase, color: var(--color-black))
- [x] Integrate existing Rating component for star display
- [x] Display review text with specified typography (font-style: normal, font-weight: 400, line-height: normal, color: var(--color-gray))
- [x] Display review date in Australian format consistent with news list (e.g., "15 February 2026") with subtle styling (color: var(--color-gray))
- [x] Ensure accessible markup with ARIA labels

## Styling

- [x] Create `styles/components/customer-reviews.css`
- [x] Implement mobile-first responsive design
- [x] Implement specified typography styles for user names, review text, and review dates
- [x] Style review items with specific layout: icon left, name/date/rating/text in right container (all aligned left)
- [x] Add separator line between reviews: `border-bottom: 1px solid #E1E4E9`
- [x] Add hover states and transitions if needed
- [x] Follow project CSS token conventions

## Page Integration

- [x] Update `app/locations/page.tsx` to include CustomerReviews section
- [x] Position below StoreList section
- [x] Add `<section>` wrapper at page level around CustomerReviews component
- [x] Ensure responsive layout integration

## Testing

- [x] Create unit tests for CustomerReviews component
- [x] Test loading, error, and empty states
- [x] Test review rendering with mock data
- [x] Test desktop display compatibility (screen width >= 768px)
- [x] Test mobile display compatibility (screen width < 768px)
- [x] Create integration test for locations page
- [x] Validate responsive design across breakpoints

## Validation

- [x] Run component in development environment
- [x] Verify data fetching works with real Supabase data
- [x] Test component display on desktop devices (screen width >= 768px)
- [x] Test component display on mobile devices (screen width < 768px)
- [x] Check accessibility with screen readers
- [x] Validate performance impact on page load
- [x] Fix Next.js Image configuration for Google-hosted author photos

## Documentation

- [x] Update component README if needed
- [x] Document new CSS classes in styles README
- [x] Add usage examples for future developers
