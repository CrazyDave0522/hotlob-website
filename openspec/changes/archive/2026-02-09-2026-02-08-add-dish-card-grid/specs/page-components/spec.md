# page-components Specification (Delta)

## ADDED Requirements

### Requirement: Dish Data Fetching and Filtering

The DishCardGrid component SHALL fetch dish data from the Supabase `public.dish` table with related `media_asset` (images) and `allergen_tag` (via `dish_allergen` join table) data. The component SHALL filter dishes to display only those where `is_visible = true` AND `is_available = true`. Dishes where `is_visible = false` or `is_available = false` SHALL be excluded from the grid.

The component SHALL fetch the first media asset (WHERE `position = 1`) for each dish to use as the card image. The component SHALL fetch all related `allergen_tag` records via the `dish_allergen` join table to display allergen icons. Query results SHALL be sorted by `created_at DESC` (newest first).

The component SHALL accept an optional `limit` prop to display only the first N dishes (e.g., limit=4 for one desktop row) or implement infinite scroll loading if neither limit nor pageSize props are provided. The component SHALL accept an optional `pageSize?: number` prop (default: 10) to define how many items to load per page when using infinite scroll pagination.

When no limit prop is provided and pageSize is set, the component SHALL implement infinite scroll: initially load and display pageSize items, then load an additional pageSize items when user scrolls near the bottom of the list.

#### Scenario: DishCardGrid fetches filtered dishes from Supabase

- **GIVEN** the DishCardGrid component is mounted
- **WHEN** the component initializes
- **THEN** a Supabase query is executed using `fetchVisibleDishes()`
- **AND** only dishes with `is_visible = true` AND `is_available = true` are fetched
- **AND** hidden dishes (`is_visible = false`) are excluded
- **AND** unavailable dishes (`is_available = false`) are excluded
- **AND** dishes are sorted by `created_at DESC`

#### Scenario: DishCardGrid applies limit prop to restrict displayed dishes

- **GIVEN** the DishCardGrid component receives `limit={4}` prop
- **WHEN** the component fetches and processes dishes
- **THEN** the fetched array is sliced to length 4
- **AND** only the first 4 dishes are rendered
- **AND** grid displays exactly 4 cards (one complete desktop row)

#### Scenario: DishCardGrid implements infinite scroll pagination

- **GIVEN** the DishCardGrid component is rendered without a limit prop and pageSize=10
- **WHEN** the component initializes
- **THEN** the first 10 dishes are fetched and displayed
- **AND** a scroll event listener is attached to detect when user scrolls near bottom
- **WHEN** the user scrolls to near the bottom of the list (e.g., within 200px of bottom)
- **THEN** the next 10 dishes are fetched and appended to the displayed list
- **AND** this process continues until all available dishes are loaded
- **AND** once all dishes are loaded, no further requests are made

#### Scenario: DishCardGrid displays all dishes when limit is omitted

- **GIVEN** the DishCardGrid component is rendered with pageSize=10 (for infinite scroll)
- **WHEN** the component fetches dishes from Supabase
- **THEN** the first batch of dishes (10 items) is loaded and displayed
- **AND** grid displays 10 items and shows a scroll container
- **AND** additional batches load automatically on scroll

#### Scenario: DishCardGrid displays all dishes when limit is omitted

- **GIVEN** the DishCardGrid component is rendered without a limit prop and without pageSize (backward compatibility)
- **WHEN** the component fetches dishes from Supabase
- **THEN** the fetched array is displayed in full
- **AND** all available dishes are rendered
- **AND** grid displays all dishes across multiple rows as needed

#### Scenario: DishCardGrid does not render when no available dishes exist

- **GIVEN** the DishCardGrid component is mounted
- **WHEN** the component fetches dishes from Supabase AND no dishes match the filter criteria (all `is_visible = false` or `is_available = false`) OR the dish table is empty
- **THEN** the component returns `null`
- **AND** nothing is rendered to the DOM
- **AND** no grid, cards, or empty state message appears

### Requirement: Dish Card Component

The application SHALL provide a `DishCard` component that renders a single food/dish item as an expandable card with responsive styling. The card SHALL accept a dish object containing `name`, `description`, `tier`, and related `image` and `allergen_tag` arrays. The card SHALL have background #FFF, border-radius 20px, and box-shadow `0 0 20px 0 rgba(0, 0, 0, 0.12)`.

The card SHALL display content in the following order from top to bottom: image, title, allergen icons row, tier tag, description, and button. On desktop viewports (≥ 768px), the component SHALL support an expanded state on hover that increases height while anchoring the bottom edge (expansion grows upward). On mobile viewports (< 768px), the card SHALL remain static with no expansion behavior, and the white background SHALL stay shorter than content with the image top exposed.

The card SHALL be responsive and not use fixed pixel dimensions (aspect-ratio instead). Mobile viewports (< 768px) SHALL use aspect-ratio 330 / 570. Desktop viewports (≥ 768px) SHALL use aspect-ratio 332 / 480, expanding to 332 / 590 on hover. The button SHALL use margin-top: auto to stick to the bottom of the card.

#### Scenario: DishCard renders with all content elements from Supabase data

- **GIVEN** a DishCard component is rendered with a dish object from Supabase
- **WHEN** the component receives `dish.name`, `dish.description`, `dish.tier`, and related image/allergen data
- **THEN** the card structure includes:
  - Image (responsive sizing: max 230px × 230px at both 1920px and 768px, aspect-ratio 1/1, centered horizontally, top)
  - Gap between image and title: responsive, max 20px at both 1920px and 768px
  - Content wrapper (flex column with responsive gap max 14px at 1920px, max 10px at 768px, align-items: flex-start, responsive horizontal padding max 20px at both 1920px and 768px) containing:
    - Title
    - Allergen icons row
    - Tier tag
    - Description
  - Gap between wrapper and button: auto (button uses margin-top: auto to stick to bottom)
  - Button (responsive width: max 200px × 40px at 1920px, max 230px × 60px at 768px, centered horizontally, responsive bottom margin max 24px at both 1920px and 768px)
- **AND** the image displays from `media_asset.image_url` with aspect-ratio 1/1 and responsive sizing (desktop: max 230px × 230px at 1920px, mobile: max 230px × 230px at 768px)
- **AND** the title displays `dish.name` with responsive font-size (desktop: max 20px at 1920px, mobile: max 28px at 768px), font-weight 600
  - Unhovered: color #1D1E1F
  - Hovered: color #EA4148 (with smooth transition)
- **AND** the allergen icons display from `allergen_tag.icon_url` in a single row
- **AND** the tier tag displays `dish.tier` with first letter capitalized ("Premium" or "Standard") keeping aspect ratio 100:26 with responsive sizing (max width 100px at 1920 desktop, max width 130px at 768 mobile), responsive font-size (desktop: max 16px at 1920px, mobile: max 24px at 768px), border-radius 10px 0
  - Premium tier: background rgba(234, 65, 72, 0.10) (light red), text color #EA4148
  - Standard tier: background rgba(28, 67, 241, 0.10) (light blue), text color #416BEA
- **AND** the description displays `dish.description` with responsive font-size (desktop: max 18px at 1920px, mobile: max 26px at 768px), font-weight 400, color var(--color-gray)
- **AND** the description is clamped to a maximum of 4 lines
- **AND** the button displays with text "Order Now" (color #FFFFFF, responsive font-size: desktop max 16px at 1920px, mobile max 26px at 768px)

#### Scenario: DishCard expands on hover

- **GIVEN** the DishCard component is rendered on desktop (≥ 768px)
- **WHEN** the user hovers over the card
- **THEN** the card height increases from ~480px to ~590px (110px growth)
- **AND** the bottom edge remains at the same position (expansion anchors at bottom)
- **AND** the image moves downward by 6px (creates dynamic parallax effect, uses `transform: translateY(6px)`)
- **AND** other content elements (title, tag, description, button) maintain fixed positions (no movement)
- **AND** the expansion is smooth with CSS transition 0.3s ease-out
- **AND** only the hovered card expands

#### Scenario: DishCard remains static on mobile

- **GIVEN** the DishCard component is rendered on mobile (< 768px)
- **WHEN** the user interacts with the card
- **THEN** the card background remains static and shorter than content
- **AND** the image top stays exposed above the white background
- **AND** no expansion animation occurs
- **AND** the card maintains a fixed aspect-ratio with all content visible
- **AND** no hover state changes apply

#### Scenario: DishCard position within expanded grid

- **GIVEN** multiple DishCard components render within DishCardGrid
- **WHEN** one card expands on hover
- **THEN** non-hovered cards shrink or adjust to accommodate the expanded card
- **AND** the layout remains balanced and responsive

### Requirement: Allergen Icon Display

The DishCard component SHALL display allergen icons from the related `allergen_tag` records in a single row. Icons SHALL be sourced from `allergen_tag.icon_url` and displayed as inline images. Icons SHALL be responsive and scale with the card:

- Desktop: max 40px × 40px at 1920px viewport width
- Mobile: max 50px × 50px at 768px viewport width

The icons row SHALL display up to a maximum of 5 allergen icons. If a dish has more than 5 related allergen tags, only the first 5 shall be displayed. Each icon SHALL have a tooltip displaying the `allergen_tag.name` on hover (implementation details TBD).

#### Scenario: DishCard displays allergen icons in single row

- **GIVEN** a dish has related allergen tags
- **WHEN** the DishCard renders
- **THEN** all allergen icons display from `allergen_tag.icon_url`
- **AND** icons display in a single horizontal row
- **AND** icons are responsive and scale proportionally
- **AND** desktop: icons max 40px × 40px at 1920px viewport width
- **AND** mobile: icons max 50px × 50px at 768px viewport width
- **AND** no text labels appear (only icons)

#### Scenario: DishCard with no allergens

- **GIVEN** a dish has no related allergen tags
- **WHEN** the DishCard renders
- **THEN** the icons row is empty or hidden
- **AND** the card layout adjusts gracefully

### Requirement: Dish Card Grid Component

The application SHALL provide a `DishCardGrid` component that renders multiple DishCard components in a responsive grid layout. The component SHALL accept an array of dish items and render one DishCard component per item. The grid SHALL display 4 columns on desktop viewports (≥ 768px) and 2 columns on mobile viewports (< 768px).

The component SHALL manage state to track which card is expanded on desktop viewports (≥ 768px), ensuring only one card is expanded at a time. On mobile viewports (< 768px), no expansion state management is needed. All cards SHALL receive the expanded state and handler callbacks on desktop. The component SHALL use flexbox layout for responsive sizing and smooth card shrinking during expansion on desktop.

#### Scenario: DishCardGrid displays 4 columns on desktop

- **GIVEN** the DishCardGrid component is rendered on desktop (≥ 768px)
- **WHEN** the component receives an array of dish items
- **THEN** the cards display in 4 columns
- **AND** each column contains equal width cards
- **AND** cards are responsive (not fixed width)
- **AND** the horizontal gap between cards scales responsively: max 24px at 1920px (desktop), max 16px at 768px (mobile)
- **AND** the vertical gap between rows scales responsively: max 24px at 1920px (desktop), max 16px at 768px (mobile)

#### Scenario: DishCardGrid displays 2 columns on mobile

- **GIVEN** the DishCardGrid component is rendered on mobile (< 768px)
- **WHEN** the component receives an array of dish items
- **THEN** the cards display in 2 columns
- **AND** cards take equal width in each row
- **AND** cards stack vertically with responsive gaps
- **AND** the horizontal gap between cards scales responsively: max 16px at 768px (mobile)
- **AND** the vertical gap between rows scales responsively: max 24px at 1920px (desktop), max 16px at 768px (mobile)

#### Scenario: Only one card expanded at a time

- **GIVEN** multiple DishCard components render in DishCardGrid
- **WHEN** the user hovers card A
- **THEN** card A expands
- **AND** when the user then hovers card B
- **THEN** card A collapses and card B expands
- **AND** only one card appears expanded at any moment

#### Scenario: Non-hovered cards shrink during expansion

- **GIVEN** the DishCardGrid component displays 4 cards on desktop
- **WHEN** card 2 is expanded
- **THEN** cards 1, 3, and 4 shrink or adjust width to accommodate
- **AND** the total grid width remains constant
- **AND** the layout remains balanced

### Requirement: Button Styling for Dish Card

The button within DishCard SHALL display with text "Order Now" and apply specific styling including responsive dimensions (desktop: max 200px width, max 40px height at 1920px; mobile: max 230px width, max 60px height at 768px), border-radius 30px 30px 0 30px, gradient background (linear-gradient 90deg #EA4148 0% to #FFA159 100%), and box-shadow 3px 3px 0 0 rgba(175, 23, 23, 0.16).

The button SHALL be responsive and scale proportionally with the card rather than using fixed pixel dimensions (use relative units or CSS clamp).

#### Scenario: Button renders with correct styling

- **GIVEN** the DishCard component displays
- **WHEN** the button element is rendered
- **THEN** the button text displays as "Order Now"
- **AND** the button has responsive sizing (desktop: max 200px width and max 40px height at 1920px, mobile: max 230px width and max 60px height at 768px)
- **AND** the button has gradient background from #EA4148 to #FFA159 (default state)
- **AND** the button has shadow 3px 3px 0 0 rgba(175, 23, 23, 0.16)
- **AND** the button has border-radius 30px 30px 0 30px (rounded top corners only, crisp bottom-left)
- **AND** the button is clickable and functional

#### Scenario: Button hover/clicked state gradient

- **GIVEN** the DishCard button in default state
- **WHEN** the user hovers over or clicks the button
- **THEN** the button background transitions to linear-gradient(180deg, #FB8225 0%, #D51D24 100%)
- **AND** the gradient angle changes from 90deg to 180deg
- **AND** the transition is smooth (0.3s ease-out)
- **AND** the button text remains "Order Now" with color #FFFFFF

## MODIFIED Requirements

(None at this time - all DishCard and DishCardGrid requirements are new additions)

## REMOVED Requirements

(None)
