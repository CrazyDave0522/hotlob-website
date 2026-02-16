## Component Updates

- [x] Add `carousel-left` variant prop to StoreList component
- [x] Implement conditional rendering based on variant prop
- [x] Create carousel-left layout structure with three columns: carousel, store info, angle icon
- [x] Ensure the component does not include SectionTitle or section labels (handled at page level)
- [x] Ensure responsive behavior: three-column layout on both mobile and desktop

## Image Carousel Implementation

- [x] Create store image carousel component or reuse existing carousel
- [x] Implement image fetching for store photos from database
- [x] Add carousel navigation (arrows, indicators)
- [x] Implement responsive dimensions (120-220px width, 160px height) for carousel container
- [x] Handle cases with no images or single image (use Store icon from Lucide as placeholder)
- [x] Ensure carousel is responsive and touch-friendly

## Store Info Display

- [x] Reuse existing store info display logic for middle column
- [x] Ensure store info layout works in middle column with responsive typography
- [x] Include all essential store information (name, address, hours, etc.)
- [x] Add angle-right icon (`public/images/icons/angle-right-black.svg`) in separate right column
- [x] Implement click handler to open store's Uber URL in new tab
- [x] Make icon responsive (16-32px) and centered in its column

## Styling

- [x] Add CSS classes for carousel-left variant
- [x] Implement mobile-first three-column grid layout (base styles for mobile)
- [x] Add desktop enhancements with @media queries for larger screens
- [x] Style carousel container and navigation
- [x] Implement responsive typography: store name (16-24px), address/hours (14-18px)
- [x] Add borders to store items: `border-top: 1px solid #B9B7B7;` (all), `border-bottom` (last only)
- [x] Remove gaps between store items for seamless border appearance
- [x] Handle border overlaps to prevent thicker lines
- [x] Add mobile-specific styling: transparent background, no shadows/borders
- [x] Follow project CSS token conventions

## Page Integration

- [x] Update `app/page.tsx` to include carousel-left StoreList variant
- [x] Position below "See Our Food" section and above "Hot News" section
- [x] Add `<section>` wrapper with desktop background image
- [x] Ensure responsive layout integration on home page

## Data Layer

- [x] Update store data fetching to include image arrays
- [x] Ensure stores are always ordered by rating descending (highest first)
- [x] Add image URL validation and fallbacks
- [x] Ensure proper TypeScript types for store images

## Testing

- [x] Add unit tests for carousel-left variant
- [x] Test responsive behavior across breakpoints
- [x] Test carousel functionality with mock images
- [x] Test edge cases (no images, single image)
- [x] Add integration test for locations page with new variant

## Documentation

- [x] Update StoreList component README with new variant
- [x] Document carousel-left variant usage
- [x] Update CSS comments for new classes
