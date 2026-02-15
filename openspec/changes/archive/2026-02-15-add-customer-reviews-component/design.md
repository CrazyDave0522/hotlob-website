# Customer Reviews Component - Design

## Architecture Overview

The customer reviews component is a client-side React component that fetches and displays customer reviews from the `curated_reviews` table. It follows the existing patterns for data fetching and component structure while providing a clean, accessible interface for displaying customer testimonials.

## Key Design Decisions

### 1. Component Architecture

**Client Component with Data Fetching**

- Uses `"use client"` directive for client-side rendering
- Fetches data on component mount using `useEffect`
- Follows existing StoreList component pattern for consistency
- Handles loading, error, and empty states

**Rationale**: Client-side fetching allows for dynamic data loading and follows the established pattern in the codebase. Server-side rendering is not critical for reviews as they don't impact SEO significantly.

### 2. Data Fetching

**Supabase Query**

- Fetches all reviews from `curated_reviews` table
- Filters to only English reviews (`language = 'en'`)
- Orders by `rating` descending (highest first)
- No store filtering to maximize social proof
- Includes error handling and fallback

**Rationale**: Simple query leverages existing Supabase client. Language filtering ensures only English reviews are displayed for the target audience. Sorting by rating ensures the most positive reviews are displayed first, providing optimal user experience.

### 3. Component Structure

**Review Item Layout**

- Row-based layout for each review
- User icon (author photo or default), author name, rating stars, review text, review date
- Specific layout structure:
  - User icon on the left
  - User name next to icon (on the right)
  - Review date below user name
  - Rating stars below user name/date area
  - Review text below the rating
- Separator line between reviews: `border-bottom: 1px solid #E1E4E9`
- Responsive design with mobile-first approach
- Accessible with proper semantic HTML
- Component does not include `<section>` elements

**Rationale**: Row layout maximizes content visibility on different screen sizes. Specific layout structure ensures clear visual hierarchy. Separator lines provide visual separation between reviews. Consistent with existing component patterns for maintainability. Section wrappers are handled at the page level for proper semantic structure.

### 3.1 Typography Specifications

**User Name Styling**

- Font weight: 600 (semibold)
- Line height: normal
- Text transform: uppercase
- Color: var(--color-black)
- Consistent with project typography tokens

**Review Text Styling**

- Font style: normal
- Font weight: 400 (regular)
- Line height: normal
- Color: var(--color-gray)
- Maintains readability across devices

**Review Date Styling**

- Display format: Australian convention (DD/MM/YYYY)
- Font style: normal
- Font weight: 400 (regular)
- Line height: normal
- Color: var(--color-gray)
- Color: Subtle/secondary color to indicate it's metadata

**Rationale**: Specific typography ensures visual hierarchy and brand consistency. Uppercase user names provide emphasis while review text remains readable and approachable. Date provides context for review freshness. Australian format ensures local relevance and familiarity for the target audience. Color coding distinguishes primary content (black) from secondary information (gray).

### 4. Styling Approach

**Mobile-First Responsive Design**

- All styles default to mobile layouts (screen width < 768px)
- Desktop enhancements applied via `@media (min-width: 768px)` breakpoint
- Follows project convention: mobile-first with progressive desktop enhancement
- Primary styling with Tailwind utility classes
- Component-specific styles in `styles/components/customer-reviews.css`
- Follows existing CSS architecture (tokens, base, components)
- Mobile layout: Stacked review items with full-width content
- Desktop layout: Enhanced spacing and potentially multi-column if needed

**Rationale**: Ensures optimal mobile experience with desktop enhancements. Follows project-wide mobile-first principle for consistent responsive behavior. Guarantees proper display and functionality across all device types.

### 5. User Icon Handling

**Author Photo with Fallback**

- Use `author_photo_url` from review data when available
- Fallback to `User` icon from Lucide React when photo URL is missing or invalid
- Consistent sizing and styling for all user icons

**Rationale**: Provides personalized touch with author photos while maintaining consistent design when photos are unavailable. The Lucide `User` icon provides a clean, recognizable default that fits well with the design system. Balances user experience with privacy considerations.

### 6. Error Handling

**Graceful Degradation**

- Loading spinner during fetch (same as NewsList component)
- Error message for failed requests
- Component does not render when no reviews available
- Console error logging for debugging

**Rationale**: Ensures clean page layout when no reviews exist. Follows existing error handling patterns in StoreList component.

## Data Flow

1. Component mounts and initiates data fetch
2. Supabase query retrieves all reviews ordered by rating
3. If reviews exist, render them in row-based layout
4. If no reviews exist, component does not render
5. Each review displays icon, name, rating, and text
6. Loading/error states shown as appropriate

## Performance Considerations

- Single query on mount (no re-fetching)
- Efficient Supabase query with ordering
- Minimal DOM manipulation
- Responsive images for icons

## Accessibility

- Semantic HTML structure
- Proper ARIA labels for rating component
- Keyboard navigation support
- Screen reader friendly content

## Future Extensions

- Individual review detail modals
- Review filtering/sorting options
- Review analytics integration
- Social sharing functionality
