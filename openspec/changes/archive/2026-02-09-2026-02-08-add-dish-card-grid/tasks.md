# Tasks: Add Dish Card Grid Component

## Architecture Decisions

### Supabase Utility Structure

**Decision**: Supabase client initialization and data fetching modules are organized as shared libraries:

- `lib/supabase.ts` — Supabase client initialization (core utility)
- `lib/dishes.ts` — Dish data fetching service (data access layer)
- Future modules: `lib/allergens.ts`, `lib/users.ts`, etc.

**Rationale**: `lib/` is the standard Next.js convention for shared code including data services. Grouping all data-fetching modules together in `lib/` improves maintainability and scales better as the project grows.

## Phase 0: Data Fetching & API Integration

### Task 0.1: Create Supabase client initialization

- [x] Create `lib/supabase.ts` with Supabase client initialization
- [x] Initialize Supabase client with environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [x] Validate environment variables exist at initialization time (throw error if missing)
- [x] Export initialized client for use in data service modules
- [x] Test: Client initializes without errors, environment variables properly loaded

### Task 0.2: Create Supabase dish data fetching service

- [x] Create `lib/dishes.ts` with database query functions
- [x] Import Supabase client from `lib/supabase.ts`
- [x] Implement `fetchVisibleDishes()` function that:
  - Queries `public.dish` table
  - Filters: `is_visible = true` AND `is_available = true`
  - Includes `media_asset` table join (select first image where position=1)
  - Includes `allergen_tag` table join via `dish_allergen` junction table
  - Sorts by `created_at DESC` (newest first)
  - Returns fetched dishes with related relations in nested structure
- [x] Export function for use in components
- [x] Test: Function returns properly structured data, no TypeScript errors

### Task 0.3: TypeScript types for Dish data

- [x] Create `types/dish.ts` with type definitions:
  - `Dish` interface (id, name, description, tier, price, is_visible, is_available, created_at, updated_at)
  - `MediaAsset` interface (id, dish_id, image_url, position)
  - `AllergenTag` interface (id, name, icon_url, description)
  - `DishAllergen` interface (id, dish_id, tag_id, created_at, updated_at)
    - Ensure unique constraint on (dish_id, tag_id) is documented
    - Ensure ON DELETE CASCADE behavior is understood
- [x] Ensure types match Supabase schema exactly (match PG schema dump)
- [x] Export types for use in components
- [x] Test: No TypeScript errors when using types in components

## Phase 1: Component Structure & Data Integration

### Task 1.1: Create DishCard component

- [x] Create `components/DishCard.tsx`
- [x] Define TypeScript interface for DishCard props:
  - dish: Dish object (with id, name, description, tier)
  - image: MediaAsset object (with image_url, position)
  - allergens: AllergenTag[] (array of allergen tags with icon_url)
  - expanded: boolean (from parent)
  - onHover: callback function
- [x] Implement flex column layout with child elements
- [x] Render in order: image, title, icons row, tag, description, button
- [x] Ensure semantic HTML (div root, img, h3 for title, p for description, button)
- [x] Test: Card renders all content elements correctly

### Task 1.2: Create DishCardGrid component with data fetching

- [x] Create `components/DishCardGrid.tsx`
- [x] Accept props:
  - `limit?: number` — optional limit on displayed dishes (e.g., 4 for one row, undefined for pagination)
  - `pageSize?: number` — optional pagination page size (default: 10 items per page). If provided, enables infinite scroll
- [x] Use `useEffect` hook to fetch dishes from Supabase using `fetchVisibleDishes()` helper
- [x] If limit prop is provided: slice fetched dishes array by limit (show only first N)
- [x] If pageSize prop is provided: implement infinite scroll
  - Initially load and display first pageSize items
  - Attach scroll event listener to detect when user scrolls near bottom
  - On scroll trigger, fetch next batch of pageSize items and append to list
  - Continue until all dishes are loaded
- [x] Implement flex grid layout (4 columns desktop, 2 columns mobile)
- [x] Define horizontal gaps: responsive, max 24px at 1920px, max 16px at 768px, scale linearly between breakpoints
- [x] Define vertical gap: responsive, max 24px at 1920px, max 16px at 768px, scale linearly between breakpoints
- [x] Pass dishes array to map and render DishCard components
- [x] Test: Grid renders correct number of columns with limit applied
- [x] Test: Limit prop correctly restricts displayed dishes (e.g., limit=4 shows 4 cards)
- [x] Test: Infinite scroll loads 10 items initially, then 10 more on scroll
- [x] Test: Pagination stops when all dishes are loaded

## Phase 2: Styling & Visual Design

### Task 2.1: Create card base styles

- [x] Create `styles/components/dish-card.css`
- [x] Use mobile-first styles with desktop overrides at ≥ 768px
- [x] Add white background with shadow (0 0 20px 0 rgba(0, 0, 0, 0.12))
- [x] Add border-radius 20px
- [x] Set unhovered aspect ratio (~332px × 480px)
- [x] Style image with aspect-ratio 1/1 and responsive sizing (desktop: max 230px × 230px at 1920px, mobile: max 230px × 230px at 768px)
- [x] Create content wrapper with responsive gap between title, icons, tag, description: max 14px at 1920px, max 10px at 768px
- [x] Add responsive horizontal padding to content wrapper: max 20px at both 1920px and 768px
- [x] Align content wrapper items to left (align-items: flex-start)
- [x] Image positioned at top of card: responsive sizing (max 230px × 230px at both 1920px and 768px), aspect-ratio 1/1, centered horizontally
- [x] Gap between image and title: responsive, max 20px at both 1920px and 768px
- [x] Gap between wrapper and button: responsive, max 24px at 1920px, max 16px at 768px
- [x] Button positioned below wrapper (responsive width: max 200px × 40px at 1920px, max 230px × 60px at 768px, centered horizontally)
- [x] Test: Card renders with correct background, shadow, sizing, and content spacing

### Task 2.2: Style title and description

- [x] Title: responsive font-size (desktop: max 20px at 1920px, mobile: max 28px at 768px), font-weight 600
  - Unhovered state: color #1D1E1F
  - Hovered state: color #EA4148 (with smooth CSS transition)
- [x] Description: responsive font-size (desktop: max 18px at 1920px, mobile: max 26px at 768px), font-weight 400, color var(--color-gray)
- [x] Clamp description to 4 lines max
- [x] Apply consistent spacing using design tokens
- [x] Test: Typography renders with correct styles and title color transitions on hover

### Task 2.3: Style tag and button

- [x] Tag: keep aspect ratio 100:26 with responsive sizing (max width 100px at 1920 desktop, max width 130px at 768 mobile), border-radius 10px 0, centered content
  - Display tier value with first letter capitalized ("Premium" or "Standard")
  - Text font-size: responsive (desktop: max 16px at 1920px, mobile: max 16px at 768px)
  - Premium tier: background rgba(234, 65, 72, 0.10) (light red)
  - Standard tier: background rgba(28, 67, 241, 0.10) (light blue)
- [x] Button: responsive sizing (desktop: max 200px × 40px at 1920px, mobile: max 230px × 60px at 768px), border-radius 30px 30px 0 30px, responsive horizontal padding max 20px at both 1920px and 768px, responsive bottom padding max 24px at both 1920px and 768px
- [x] Button text: "Order Now", color #FFFFFF (white), responsive font-size (desktop: max 16px at 1920px, mobile: max 26px at 768px)
- [x] Button default gradient: linear-gradient(90deg, #EA4148 0%, #FFA159 100%)
- [x] Button hover/clicked gradient: linear-gradient(180deg, #FB8225 0%, #D51D24 100%)
- [x] Button text color: #FFFFFF (white) in both states
- [x] Button shadow: 3px 3px 0 0 rgba(175, 23, 23, 0.16) in both states
- [x] Button state transition: smooth 0.3s ease-out for background change
- [x] Test: Tag and button render with correct dimensions and styles (including tier-specific colors and white text)
- [x] Test: Button hover/clicked state transitions smoothly with new gradient

### Task 2.4: Implement hover expansion (desktop ≥ 768px only)

- [x] Implement white background as separate layer (::before pseudo-element or background div)
- [x] Desktop (≥ 768px):
  - Background unhovered: aspect-ratio 332 / 480 (shorter than content, image extends above)
  - Background hovered: aspect-ratio 332 / 590 (fully covers all content including image)
  - Anchor background expansion at bottom (position: absolute with bottom: 0)
  - Smooth transition animation for background aspect-ratio change (0.3s ease-out)
  - Use flex layout to shrink non-hovered cards
- [x] Mobile (< 768px):
  - Background remains static and shorter than content (image top exposed)
  - No hover expansion or transition effects
  - Background never fully covers the image
- [x] Image movement on hover (desktop ≥ 768px): Image moves downward by 6px when card is expanded (creates dynamic parallax effect with expanding background)
  - Add `transition: transform 0.3s ease-out` to image element
  - Apply `transform: translateY(6px)` on expanded state
  - Other content elements (title, tag, description, button) maintain fixed positions (no movement)
- [x] Test: Desktop - white background expands upward on hover, image moves down 6px smoothly, other content stays fixed, animation is smooth
- [x] Test: Desktop - unhovered state shows image top extending above white background
- [x] Test: Mobile - cards remain static, image top remains exposed, no expansion or image movement occurs

### Task 2.5: Style icons row

- [x] Create flexible layout for icon row using flexbox
- [x] Icons display in single row only
- [x] Gap between icons: responsive, max 16px at 1920px, max 12px at 768px
- [x] Responsive icon sizing:
  - Desktop: max 40px × 40px at 1920px viewport width
  - Mobile: max 50px × 50px at 768px viewport width
- [x] Test: Icons render in single row with correct spacing and sizing

## Phase 3: State Management & Interaction (Desktop ≥ 768px Only)

### Task 3.1: Add expand/collapse state

- [x] Use React useState to track expanded card index (desktop only)
- [x] Only one card expanded at a time
- [x] Pass expanded state to individual cards
- [x] On mobile, no expansion state needed (cards remain static)
- [x] Test: useState hook tracks single expanded card on desktop

### Task 3.2: Add hover handlers (desktop only)

- [x] Implement onMouseEnter/onMouseLeave handlers for desktop viewports
- [x] Update expanded state on hover (desktop only)
- [x] No hover handlers needed on mobile (< 768px)
- [x] Test: Hover changes expanded state correctly on desktop
- [x] Test: Mobile cards remain static with no hover behavior

## Phase 4: Testing & Validation

### Task 4.1: Unit tests for DishCard

- [x] Create `__tests__/unit/components/DishCard.test.tsx`
- [x] Test: Renders all content elements (image, title, icons, tag, description, button)
- [x] Test: Applies correct CSS classes and styles
- [x] Test: Desktop (≥ 768px) - responds to hover state changes with expansion
- [x] Test: Mobile (< 768px) - remains static with no hover expansion
- [x] Coverage: ≥ 90%

### Task 4.2: Unit tests for DishCardGrid

- [x] Create `__tests__/unit/components/DishCardGrid.test.tsx`
- [x] Test: Returns null and does not render when no dishes are available
- [x] Test: Renders correct number of cards when dishes exist
- [x] Test: Grid layout responsive (4 desktop, 2 mobile)
- [x] Test: Desktop - only one card expanded at a time
- [x] Test: Desktop - non-hovered cards shrink during expansion
- [x] Test: Mobile - cards remain static with no expansion
- [x] Coverage: ≥ 90%

### Task 4.3: Validate build and tests

- [x] Run `pnpm build` - must succeed
- [x] Run `pnpm test` - all tests must pass (66+ total)
- [x] No TypeScript errors
- [x] No console warnings

## Phase 5: Documentation & Integration

### Task 5.1: Add spec delta for page-components

- [x] Create `specs/page-components/spec.md` delta
- [x] Document DishCardGrid requirement with scenarios
- [x] Include integration guidance for page usage

### Task 5.2: Add spec delta for css-architecture

- [x] Create `specs/css-architecture/spec.md` delta (if new design tokens added)
- [x] Document new color tokens or spacing (if any)

### Task 5.3: Page integration

- [x] **Home Page**: Add DishCardGrid below "About Hotlob" section with limit=4 (display 4 featured dishes)
  - [x] Test layout on desktop and mobile
  - [x] Verify responsive grid (4 columns desktop, 2 mobile)
  - [x] Verify hover expansion works on desktop
- [x] **See Our Food Page**: Add DishCardGrid below hero section with pageSize=10 (infinite scroll pagination, initially 10 items)
  - [x] Test layout on desktop and mobile
  - [x] Verify responsive grid (4 columns desktop, 2 mobile)
  - [x] Verify hover expansion works on desktop
  - [x] Test infinite scroll: loads 10 items, then 10 more on scroll
  - [x] Verify pagination stops when all dishes are loaded
- [x] Test both pages on desktop and mobile
- [x] Verify responsive behavior on all pages

### Task 5.4: Validate spec

- [x] Run `openspec validate 2026-02-08-add-dish-card-grid --strict`
- [x] Resolve any validation issues

## Validation Checklist

- [x] Component renders all child elements correctly
- [x] Desktop: 4 columns, Mobile: 2 columns
- [x] Card styling matches specifications exactly
- [x] Desktop (≥ 768px): Hover expansion smooth, anchored at bottom
- [x] Desktop: Only one card expanded at a time
- [x] Desktop: Non-hovered cards shrink responsively
- [x] Mobile (< 768px): Cards remain static with no expansion
- [x] Typography, colors, spacing use design tokens
- [x] All 4 tests suites pass (66+ total tests)
- [x] Build succeeds with no errors
- [x] OpenSpec proposal validates strictly

## Dependencies

- None (uses existing React, TypeScript, CSS, design tokens)

## Parallelizable Work

- Tasks 2.1-2.5 (styling) can be done in parallel with 1.1-1.2 (structure)
- Tasks 4.1-4.2 (testing) can start after 1.1-1.2 are complete
