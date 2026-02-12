# News Carousel Component Implementation Tasks

## Phase 1: Component Architecture

- [x] Create TypeScript interfaces for carousel props and data structures
- [x] Implement responsive image sizing formulas:
  - Desktop: max 600×340px at 1920px viewport, proportional scaling
  - Mobile: max 690×340px at 768px viewport, proportional scaling
- [x] Create `CarouselIndicator.tsx` component with active/inactive states:
  - Active: 1.875rem × 0.5rem (30px × 8px), border-radius 20px, background #EA4148
  - Inactive: 0.5rem × 0.5rem (8px × 8px), aspect-ratio 1/1, fill #000, opacity 0.2
  - Mobile scaling: Active 1.5rem × 0.4rem, Inactive 0.4rem × 0.4rem

## Phase 2: Core Carousel Component

- [x] Create `NewsCarouselItem.tsx` component with responsive layouts:
  - Desktop: Left-right layout (image left, text right)
  - Mobile: Top-bottom layout (image top, text bottom)
  - Title styling: font-weight: 600, font-style: normal, line-height: normal, responsive font-size (max 24px desktop, 36px mobile)
  - Excerpt styling: font-weight: 400, font-style: normal, line-height: normal, color #86909C, responsive font-size (max 18px desktop, 30px mobile)
  - Click handling: Open news link in new tab with proper accessibility
- [x] Create main `NewsCarousel.tsx` component:
  - Accept news data as props (unlimited items)
  - Implement carousel state management (current index, navigation)
  - Handle empty data (component doesn't render if no data)
  - Implement looping navigation (wrap from last to first)
  - Handle single item display (no indicators)
  - Desktop: Keyboard navigation support
  - Mobile: Implement swipe gesture handling
  - Auto-advance: 3-second intervals with pause on interaction
- [x] Add carousel indicator integration:
  - Dynamic indicator count based on data length
  - Active indicator reflects current position
  - Click indicators to jump to specific items

## Phase 3: Styling & Responsiveness

- [x] Create `styles/components/carousel.css` with component-specific styles
- [x] Implement mobile-first responsive design:
  - Default to mobile layout (top-bottom)
  - Apply desktop layout at ≥768px breakpoint
- [x] Add smooth transitions for carousel navigation
- [x] Implement proper spacing and typography using design tokens
- [x] Add focus states and keyboard navigation support
- [x] Style article cards: white background, 20px border-radius, subtle shadow
- [x] Position indicators below carousel instead of overlaid
- [x] Add section gradient background (#FBF3F3 to #FFF)

## Phase 4: Home Page Integration

- [x] Update `app/page.tsx` to include news carousel section
- [x] Position carousel under the "see our food" section
- [x] Fetch news data for carousel (recent published items)
- [x] Add proper section wrapper and spacing
- [x] Add section gradient background styling
- [x] Test responsive behavior across breakpoints

## Phase 5: Testing & Validation

- [x] Create unit tests for carousel components:
  - Navigation functionality (including looping)
  - Responsive layout behavior
  - Typography scaling (title and excerpt font sizes)
  - Indicator state management (only show when multiple items)
  - Empty data handling
  - Single item display (no indicators/arrows)
  - Click handling (opens in new tab)
  - Auto-advance functionality (3s intervals, pause on interaction)
- [x] Add integration tests for home page carousel
- [x] Test accessibility features (keyboard navigation, screen readers)
- [x] Validate performance with carousel animations
- [x] Cross-browser testing for swipe gestures and keyboard navigation

## Phase 6: Documentation & Polish

- [x] Add JSDoc comments to component props and functions
- [x] Update component README if needed
- [x] Add usage examples in component files
- [x] Final responsive testing across all breakpoints
- [x] Performance optimization for carousel animations
