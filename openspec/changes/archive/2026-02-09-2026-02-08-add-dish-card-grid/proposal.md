# Add Dish Card Grid Component

## Summary

Introduces a reusable `DishCardGrid` component for displaying food/dish items in a responsive grid layout. Each card features an image, title, icons row, tag, description, and call-to-action button. Cards expand vertically on hover (desktop ≥ 768px only) with smooth animations, anchored at the bottom. On mobile (< 768px), cards remain static with no expansion. Layout is 4 columns on desktop, 2 columns on mobile.

## Motivation

The DishCardGrid component will be a reusable building block used across multiple pages and sections to display dishes from Supabase. Usage includes:

- "See Our Food" page: display all available dishes
- Product showcase sections: display limited set (e.g., 4 dishes for one desktop row)
- Menu sections: display category-specific dishes with varying limits

Key requirements:

- Responsive grid layout (4 desktop, 2 mobile)
- Mobile-first styling (base styles for mobile, desktop overrides at ≥ 768px)
- Flexible display limit: show all, or limit to N dishes (e.g., 4 for one row)
- Hover expansion effect with smooth transitions (desktop ≥ 768px only; static cards on mobile)
- Built-in Supabase data fetching with filtering logic
- Display dish images, names, allergen indicators, tier badges, and descriptions
- Consistent styling and spacing using design tokens
- Clear visual hierarchy with image, title, metadata, and call-to-action
- Filter out dishes where `is_visible=false` or `is_available=false`

## Requirements

### Data Source & Filtering

1. **Dish Data Source**
   - Fetch dishes from Supabase `public.dish` table
   - Include relations: `media_asset` (via dish_id) and `allergen_tag` (via dish_allergen join)
   - Filter: Only include dishes where `is_visible = true` AND `is_available = true`
   - Sort: By `created_at` descending (newest first)

2. **Data Mapping**
   - **Image**: FROM `media_asset.image_url` WHERE `dish_id` matches AND `position = 1` (first image)
   - **Title**: FROM `dish.name`
   - **Description**: FROM `dish.description` (if null, leave blank or use placeholder)
   - **Tag**: FROM `dish.tier` (displays "Premium" or "Standard" label with first letter capitalized)
   - **Icons**: FROM `allergen_tag.icon_url` via `dish_allergen` (display max 5 allergen icons in row)

### Core Component

1. **Component Props**
   - `limit?: number` — optional prop to limit displayed dishes (e.g., 4 for one row). If omitted, displays all fetched dishes
   - Component handles Supabase data fetching internally

2. **Empty State Behavior**
   - If no available dishes are found (all filtered out or table is empty), the component SHALL NOT render
   - The component returns `null` and renders nothing to the DOM

3. **Responsive Grid Layout**
   - Desktop: 4 cards per row
   - Mobile: 2 cards per row
   - Horizontal gap between cards: responsive, max 24px at 1920px (desktop), max 16px at 768px (mobile)
   - Vertical gap between cards: responsive, max 24px at 1920px (desktop), max 16px at 768px (mobile)
   - Cards scale responsively, not fixed dimensions

4. **Card Structure & Styling**
   - Card background: #FFF; border-radius: 20px; box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.12)
   - Card layout (flex column): Image (responsive sizing: max 230px × 230px at both 1920px and 768px, aspect-ratio 1/1, centered horizontally in card, top) → Gap responsive, max 20px at both 1920px and 768px (between image and title) → Content wrapper (flex column, gap responsive, max 14px at 1920px, max 10px at 768px, align-items flex-start, padding-x responsive max 20px at both 1920px and 768px) → Gap responsive, max 24px at 1920px, max 16px at 768px → Button (responsive width: max 200px × 40px at 1920px, max 230px × 60px at 768px, centered horizontally, padding-x responsive max 20px at both 1920px and 768px, padding-bottom responsive max 24px at both 1920px and 768px)

   - Unhovered state: white background aspect-ratio ~332px × 480px (shorter than total content height)
     - Top ~half of image extends ABOVE the white card background (visible but not covered by white bg)
     - Background starts partway down the image
   - Hovered state (desktop only): white background expands to ~332px × 590px
     - Background grows tall enough to fully cover ALL content including entire image
     - Image moves downward 6px (creates dynamic parallax effect)

   - Expansion: white background anchors at bottom, grows upward to embrace content
   - Image moves down 6px on hover (dynamic parallax effect with smooth 0.3s ease-out transition)
   - Other content elements (title, tag, description, button) maintain fixed positions (no movement or reflow)
   - Only one card can be expanded at a time

5. **Card Content Elements**
   - **Image**: aspect-ratio 1/1, responsive sizing (desktop: max 230px × 230px at 1920px, mobile: max 230px × 230px at 768px), loaded from `media_asset.image_url` (assumed to always be present)
   - **Title**: FROM `dish.name`, color #1D1E1F (unhovered) → #EA4148 (hovered on desktop), responsive font-size (desktop: max 20px at 1920px, mobile: max 28px at 768px), font-weight 600

   - **Icons**: Allergen icons in single row FROM `allergen_tag.icon_url`, max 5 icons displayed with tooltips showing `allergen_tag.name` on hover. Gap between icons: responsive, max 16px at 1920px, max 12px at 768px. Sizing: max 40px × 40px at 1920px (desktop), max 50px × 50px at 768px (mobile)
   - **Tag**: Keep aspect ratio 100:26 with responsive sizing (max width 100px at 1920 desktop, max width 130px at 768 mobile), border-radius 10px 0, centered content, displays `dish.tier` with first letter capitalized ("Premium" or "Standard"). Text font-size: responsive (desktop: max 16px at 1920px, mobile: max 16px at 768px)
     - Premium tier: background rgba(234, 65, 72, 0.10) (light red tint)
     - Standard tier: background rgba(28, 67, 241, 0.10) (light blue tint)

   - **Description**: FROM `dish.description`, color var(--color-gray) (#4e5969), responsive font-size (desktop: max 18px at 1920px, mobile: max 26px at 768px), font-weight 400, clamped to 4 lines max
   - **Button**: "Order Now" text (color #FFFFFF, responsive font-size: desktop max 16px at 1920px, mobile max 26px at 768px), responsive sizing (desktop: max 200px × 40px at 1920px, mobile: max 230px × 60px at 768px), border-radius 30px 30px 0 30px
     - Default: gradient background (linear-gradient 90deg #EA4148 → #FFA159), text color #FFFFFF, box-shadow 3px 3px 0 0 rgba(175, 23, 23, 0.16)
     - Hovered/Clicked: gradient background (linear-gradient 180deg #FB8225 → #D51D24), text color #FFFFFF, same shadow
     - Smooth transition on state change (0.3s ease-out)
     - Note: Button is a placeholder for now and does not trigger navigation or open an order modal.

6. **Hover Behavior**

   **Desktop (≥ 768px)**:
   - White card background expands: aspect-ratio from 332/480 to 332/590 (proportional growth ~110px for ~332px width, scaled responsively)
   - Background expansion anchored at bottom edge, grows upward to cover previously exposed content
   - Image moves downward by 6px on hover (creates dynamic parallax effect with expanding background, using `transform: translateY(6px)` with smooth 0.3s ease-out transition)
   - Other content elements (title, tag, description, button) maintain fixed positions (no movement or reflow)
   - Unhovered: top ~half of image extends above white background
   - Hovered: white background fully covers entire image and all content
   - Width remains constant (~332px, responsive proportions)
   - Non-hovered cards shrink to make room (flex layout)
   - Only one card expanded at any time

   **Mobile (< 768px)**:
   - Cards remain static with no expansion behavior
   - White background stays shorter than content; image top remains exposed
   - White background never fully covers the image
   - No hover states or transitions

## Success Criteria

- ✅ Component does not render if no available dishes exist
- ✅ Component renders responsive grid (4 desktop, 2 mobile) when dishes are available
- ✅ Desktop (≥ 768px): Cards expand on hover with smooth animation
- ✅ Desktop: Expansion anchors at bottom, grows upward
- ✅ Mobile (< 768px): Cards remain static with no expansion
- ✅ All content elements visible and properly styled
- ✅ Button and tag styling matches specifications
- ✅ Uses design tokens for colors and spacing
- ✅ Unit tests cover layout, hover states (desktop), static cards (mobile), and empty state
- ✅ Build succeeds, all tests pass

## Open Questions

(None - all design decisions have been resolved)

## Scope

- DishCardGrid component (React functional component)
- DishCard sub-component (individual card)
- CSS styling with hover animations
- Unit tests
- Design tokens (if new ones needed)
- Page integration (Home page and See Our Food page)

## Integration Plan

### Home Page Integration

- **Location**: Below the "About Hotlob" section
- **Display**: 4 cards (limit=4)
- **Purpose**: Showcase featured dishes

### See Our Food Page Integration

- **Location**: Below the hero section
- **Display**: Paginated view with 10 items initially loaded
- **Pagination**: Infinite scroll - loads 10 additional items when user scrolls to bottom
- **Purpose**: Complete menu view
