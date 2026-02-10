# page-components Specification

## Purpose

TBD - created by archiving change add-hero-section. Update Purpose after archive.
## Requirements
### Requirement: Hero Section Component

The application SHALL provide a Hero component that renders a full-width section with a responsive background image, optional overlay, and centered text content. The Hero component SHALL support two desktop variants with different aspect ratios (tall: 1920×820, short: 1920×500) and a unified responsive mobile layout (750×420 aspect ratio). The component SHALL accept title and subtitle text with responsive font sizes (title max 40px with font-weight 600, subtitle max 32px with font-weight 400) and SHALL display text in white color, left-aligned with responsive padding (desktop max `--space-256`, mobile max `--space-32`). Text content SHALL be vertically centered without y-padding.

#### Scenario: Hero with tall variant on desktop

- **GIVEN** the Hero component is rendered with variant="tall" on desktop (≥ 768px)
- **WHEN** the component receives bgImage, title, and subtitle props
- **THEN** the background image displays with 1920×820 aspect ratio
- **AND** the title displays with responsive sizing (max 40px)
- **AND** the subtitle displays below title with responsive sizing (max 32px)
- **AND** text content is left-aligned with responsive x-padding (max `--space-256`)
- **AND** text is vertically centered
- **AND** text color is white

#### Scenario: Hero with short variant on desktop

- **GIVEN** the Hero component is rendered with variant="short" on desktop (≥ 768px)
- **WHEN** the component receives bgImage, title, and subtitle props
- **THEN** the background image displays with 1920×500 aspect ratio
- **AND** all text styling matches tall variant (font sizes, colors, alignment)

#### Scenario: Hero on mobile with responsive layout

- **GIVEN** the Hero component is rendered on mobile (< 768px)
- **WHEN** variant is "tall" or "short"
- **THEN** the background image displays with 750×420 aspect ratio (unified mobile layout)
- **AND** title displays with responsive sizing (max 40px, scales down on smaller screens)
- **AND** subtitle displays with responsive sizing (max 32px)
- **AND** text is left-aligned with responsive x-padding (max `--space-32`)
- **AND** text is vertically centered

#### Scenario: Mobile-specific background image fallback

- **GIVEN** a Hero component is rendered with mobileBgImage prop provided
- **WHEN** the viewport is mobile (< 768px)
- **THEN** the mobile background image is used instead of the desktop bgImage
- **AND** the component displays correctly with mobile dimensions

#### Scenario: Mobile-specific background image not provided

- **GIVEN** a Hero component is rendered without mobileBgImage prop
- **WHEN** the viewport is mobile (< 768px)
- **THEN** the desktop bgImage is used as fallback
- **AND** the component displays correctly

#### Scenario: Hero with overlay on desktop

- **GIVEN** the Hero component is rendered on desktop with overlay={true}
- **WHEN** the component receives bgImage, title, and subtitle
- **THEN** an overlay image (`public/images/hero-bg/overlay.png`) is displayed
- **AND** the overlay appears between the background image and text content
- **AND** the overlay improves text readability without obscuring content

#### Scenario: Hero with overlay on mobile

- **GIVEN** the Hero component is rendered on mobile with overlay={true}
- **WHEN** the component receives bgImage and text
- **THEN** a mobile-specific overlay image (`public/images/hero-bg/overlay-mb.png`) is displayed
- **AND** the overlay appears between the background image and text content

#### Scenario: Hero without overlay

- **GIVEN** the Hero component is rendered with overlay={false} or undefined
- **WHEN** the component displays
- **THEN** no overlay layer is rendered
- **AND** text content is positioned directly over background image

#### Scenario: Gap between title and subtitle

- **GIVEN** the Hero component displays both title and subtitle
- **WHEN** the component renders
- **THEN** the gap between title and subtitle is `--space-20`
- **AND** the gap is consistent across desktop and mobile viewports

### Requirement: Hero Font Size Tokens

The design system SHALL provide two new responsive font size tokens for hero typography. The title token SHALL have a responsive clamp value with a minimum of 32px and a maximum of 40px. The subtitle token SHALL have a responsive clamp value with a minimum of 24px and a maximum of 32px. Both tokens SHALL use viewport-width (vw) percentages to scale responsively between minimum and maximum values and reach their maximums at 1920px viewport width. On mobile viewports (< 768px), the Hero component SHALL override these tokens so the title reaches a maximum of 32px and the subtitle reaches a maximum of 20px at 767px.

#### Scenario: Hero title font size responsive behavior

- **GIVEN** the hero title token is applied
- **WHEN** the viewport width changes from 320px to 1920px
- **THEN** the title size scales responsively from 32px to 40px
- **AND** the maximum size of 40px is reached at 1920px viewport width
- **AND** on mobile viewports, the title size reaches 32px at 767px viewport width

#### Scenario: Hero subtitle font size responsive behavior

- **GIVEN** the hero subtitle token is applied
- **WHEN** the viewport width changes from 320px to 1920px
- **THEN** the subtitle size scales responsively from 24px to 32px
- **AND** the maximum size of 32px is reached at 1920px viewport width
- **AND** on mobile viewports, the subtitle size reaches 20px at 767px viewport width

### Requirement: Hero Layout and Positioning

The Hero component SHALL implement left-aligned text positioning with responsive horizontal padding that varies by viewport size. Left padding SHALL use the responsive clamp values, and right padding SHALL be 1.5x the left padding. On desktop viewports (≥ 768px), the maximum left padding SHALL be `--space-256` (256px). On mobile viewports (< 768px), the maximum left padding SHALL be `--space-32` (32px). Text content SHALL be vertically centered using flexbox or similar layout technique without applying y-padding. All text content SHALL maintain white color (`--color-white`) for readability over background images.

#### Scenario: Desktop horizontal padding

- **GIVEN** the Hero component is rendered on desktop (≥ 768px)
- **WHEN** the component displays with title and subtitle
- **THEN** the responsive left padding scales from baseline and reaches a maximum of `--space-256` (256px) at 1920px viewport
- **AND** the right padding is 1.5x the left padding
- **AND** the padding scales responsively as viewport width increases beyond 768px

#### Scenario: Mobile horizontal padding

- **GIVEN** the Hero component is rendered on mobile (< 768px)
- **WHEN** the component displays with title and subtitle
- **THEN** the responsive left padding reaches a maximum of `--space-32` (32px)
- **AND** the right padding is 1.5x the left padding
- **AND** the padding scales responsively as viewport width decreases

#### Scenario: Text vertical centering

- **GIVEN** the Hero component displays title and subtitle
- **WHEN** the component renders
- **THEN** text content is vertically centered within the hero section
- **AND** no y-padding is applied (height is determined by variant aspect ratio)

#### Scenario: Text color with overlay

- **GIVEN** the Hero component is rendered with overlay={true}
- **WHEN** the component displays over a background image with overlay
- **THEN** both title and subtitle use white color (`--color-white`)
- **AND** the text is readable with sufficient contrast (WCAG AA minimum) over the overlay

#### Scenario: Text color without overlay

- **GIVEN** the Hero component is rendered with overlay={false} or undefined
- **WHEN** the component displays over a background image without overlay
- **THEN** the title uses dark gray color (`--color-dark-gray`)
- **AND** the subtitle uses medium gray color (`--color-medium-gray`)
- **AND** the text maintains sufficient contrast over background images
- **AND** colors are conditional based on overlay prop

### Requirement: Hero Text Color Tokens

The design system SHALL provide two new text color tokens for hero content when overlay is not applied. The hero title color token (`--color-dark-gray`) SHALL be dark gray (#242424) for use when overlay is disabled. The hero subtitle color token (`--color-medium-gray`) SHALL be medium gray (#999) for use when overlay is disabled. When overlay is enabled, text SHALL use white color (`--color-white`) regardless of these tokens. The component SHALL apply colors conditionally based on the overlay prop.

#### Scenario: Hero title color with overlay

- **GIVEN** the Hero component is rendered with overlay enabled
- **WHEN** the component displays
- **THEN** the title color is white (`--color-white`)

#### Scenario: Hero title color without overlay

- **GIVEN** the Hero component is rendered with overlay={false} or disabled
- **WHEN** the component displays
- **THEN** the title color is dark gray (`--color-dark-gray`, #242424)

#### Scenario: Hero subtitle color with overlay

- **GIVEN** the Hero component is rendered with overlay enabled
- **WHEN** the component displays
- **THEN** the subtitle color is white (`--color-white`)

#### Scenario: Hero subtitle color without overlay

- **GIVEN** the Hero component is rendered with overlay={false} or disabled
- **WHEN** the component displays
- **THEN** the subtitle color is medium gray (`--color-medium-gray`, #999)

### Requirement: Hero Page Instances

The application SHALL include Hero component instances on four primary pages: Home, See Our Food, Locations, and News. Each page SHALL display a hero section with specific configurations including variant type, background image(s), overlay status, and content. The Home page hero SHALL use the tall desktop variant (1920×820) with title "Get Rollin' with us !" and a descriptive subtitle. The See Our Food, Locations, and News pages SHALL use the short desktop variant (1920×500) with page-specific titles and subtitles. All instances except News SHALL use a single background image. The News page hero SHALL support mobile-specific background image (`news-hero-mb.png`) with desktop fallback (`news-hero.png`). Home, See Our Food, and Locations hero instances SHALL display with overlay enabled for improved text readability. The News page hero SHALL display without overlay.

#### Scenario: Home page hero - tall variant with overlay

- **GIVEN** the Home page is rendered
- **WHEN** the Hero component is displayed
- **THEN** the hero uses variant="tall" (1920×820 aspect ratio)
- **AND** the background image is `public/images/hero-bg/home-hero.jpg`
- **AND** overlay is enabled (desktop: overlay.png, mobile: overlay-mb.png)
- **AND** title displays "Get Rollin' with us !"
- **AND** subtitle displays "Premium Aussie lobster rolls — plus prawn, crab, meat & vegetarian favorites, all packed in buttery brioche."
- **AND** text is white, left-aligned, and vertically centered

#### Scenario: See Our Food page hero - short variant with overlay

- **GIVEN** the See Our Food page is rendered
- **WHEN** the Hero component is displayed
- **THEN** the hero uses variant="short" (1920×500 aspect ratio)
- **AND** the background image is `public/images/hero-bg/see-our-food-hero.jpg`
- **AND** overlay is enabled (desktop: overlay.png, mobile: overlay-mb.png)
- **AND** title displays "See Our Food"
- **AND** subtitle displays "You have to try their lobster rolls — they're addictive. And their other rolls are so good, I want to go back for more.\n— Google Review ⭐⭐⭐⭐⭐"
- **AND** text color is white and positioning is consistent

#### Scenario: Locations page hero - short variant with overlay

- **GIVEN** the Locations page is rendered
- **WHEN** the Hero component is displayed
- **THEN** the hero uses variant="short" (1920×500 aspect ratio)
- **AND** the background image is `public/images/hero-bg/our-locations-hero.png`
- **AND** overlay is enabled (desktop: overlay.png, mobile: overlay-mb.png)
- **AND** title displays "Find Hotlob near you"
- **AND** subtitle displays "We're serving up the rolls everyone's talking about — now in Perth and Melbourne.\nGrab one on your lunch break, between uni lectures, or on your way home."
- **AND** text color is white and positioning is consistent

#### Scenario: News page hero - short variant with mobile-specific image

- **GIVEN** the News page is rendered
- **WHEN** the Hero component is displayed
- **THEN** the hero uses variant="short" (1920×500 aspect ratio)
- **AND** the desktop background image is `public/images/hero-bg/news-hero.png`
- **AND** the mobile background image is `public/images/hero-bg/news-hero-mb.png`
- **AND** on mobile viewports (< 768px), the mobile image is used
- **AND** on desktop viewports (≥ 768px), the desktop image is used
- **AND** overlay is disabled (no overlay layer)
- **AND** title displays "Hot News"
- **AND** subtitle displays "Check out our latest news and stay tuned"
- **AND** text color is dark gray for title and medium gray for subtitle

### Requirement: Expandable Card Grid Component

The application SHALL provide an `ExpandableCardGrid` component that displays exactly three cards, each with a title and description aligned to the left. The component SHALL accept an array of three items and render them in the supplied order. Each card SHALL use background images sourced from `public/images/expandable-card-grid`, including default, active, and active-mobile variants. On desktop viewports, unhovered cards SHALL use `cardx.png` while hovered/active cards SHALL use `cardx-active.png`. On mobile viewports, cards SHALL use `cardx-active-mb.png`. Card sizing SHALL be responsive with aspect-ratio enforcement rather than fixed dimensions. The expected aspect ratios are: default ~0.95, active desktop 1.3333, and active mobile 2.3000. All card descriptions SHALL be rendered in the DOM; on desktop, CSS controls visibility such that inactive cards display only the title while active cards display both title and description. On mobile, all descriptions are visible by default. Title text SHALL use responsive font sizing that reaches a maximum of 32px at both 768px (mobile) and 1920px (desktop) viewports, with a font-weight of 600. Description text SHALL use responsive font sizing that reaches a maximum of 24px at both 768px (mobile) and 1920px (desktop) viewports, with a font-weight of 400. Active card text color SHALL be white, and inactive card text color SHALL be `--color-charcoal`. Each card SHALL apply inner padding of `--space-32` on desktop and `--space-20` on mobile. The gap between title and description SHALL be `--space-20`. On desktop viewports (>= 768px), the cards SHALL display in a single row with the first card expanded by default. On mobile viewports (< 768px), the cards SHALL stack vertically and each card SHALL take the full width of its outer wrapper, rendering in the expanded (active) state by default.

#### Scenario: Desktop layout with three cards in one row

- **GIVEN** the ExpandableCardGrid component is rendered on desktop (>= 768px)
- **WHEN** the component receives three items
- **THEN** the cards display in a single row
- **AND** each card shows a left-aligned title
- **AND** each card uses `cardx.png` when unhovered and `cardx-active.png` when hovered
- **AND** the first card is expanded by default
- **AND** all descriptions are rendered in the DOM
- **AND** CSS controls visibility such that inactive cards display only the title while the expanded card displays title and description
- **AND** title font size reaches 32px at 1920px viewport with font-weight 600
- **AND** description font size reaches 24px at 1920px viewport with font-weight 400

#### Scenario: Mobile layout with stacked cards

- **GIVEN** the ExpandableCardGrid component is rendered on mobile (< 768px)
- **WHEN** the component receives three items
- **THEN** the cards stack vertically in three rows
- **AND** each card takes the full width of its outer wrapper
- **AND** each card uses `cardx-active-mb.png`
- **AND** the cards render in the expanded (active) state by default
- **AND** each card shows both title and description
- **AND** title font size reaches 32px at 768px viewport with font-weight 600
- **AND** description font size reaches 24px at 768px viewport with font-weight 400

### Requirement: Desktop Hover Expansion Behavior

On desktop viewports (>= 768px), the ExpandableCardGrid component SHALL expand the hovered card while the non-hovered cards fold to accommodate the expansion. The interaction SHALL use React state management for tracking the expanded card index, with CSS providing smooth transitions for visual effects. The expansion SHALL include horizontal width animation that reflects the width change between unhovered and hovered states. Description text SHALL apply a fade-in effect when revealed during hover expansion. At most one card SHALL be expanded at a time. All descriptions SHALL be rendered in the DOM, with CSS controlling visibility (display: none for inactive, display: block with fade-in animation for active).

#### Scenario: Hovering a card expands only the active card

- **GIVEN** the ExpandableCardGrid component is rendered on desktop (>= 768px)
- **WHEN** the user hovers card B after card A was hovered
- **THEN** card A returns to its folded size
- **AND** card B expands
- **AND** only one card appears expanded at any time
- **AND** the size and background transitions are smooth
- **AND** the expansion includes a horizontal width animation via flex property changes
- **AND** the description visibility is toggled via CSS (display: none → display: block)
- **AND** the visible description fades in with opacity animation when the card expands

### Requirement: Home Page Expandable Card Grid Instance

The Home page SHALL include one ExpandableCardGrid instance positioned under the Hero section, rendering three items with left-aligned titles and descriptions. The content SHALL be:

- Card 1 title: Our Story
- Card 1 description: Born from our original restaurant, The Lobster Pier (est. 2018 in WA), we wanted everyone to enjoy Aussie lobster without the fine-dining price tag.
- Card 2 title: A quick bite that feels like a treat
- Card 2 description: Hotlob takes the premium lobster roll experience and makes it fun, fast, and affordable. Now, our takeaway rolls bring big flavour in a small brioche — the perfect grab-and-go roll that fits any craving or budget.
- Card 3 title: 🦞 The Hotlob Hits
- Card 3 description: ✨ Truffle & Cheese Lobster Roll
  ✨ Lemon & Dill Lobster Roll
  ✨ Soft Shell Crab Roll

#### Scenario: Home page renders the Expandable Card Grid

- **GIVEN** the Home page is rendered
- **WHEN** the content below the Hero section is displayed
- **THEN** an ExpandableCardGrid instance appears below the Hero
- **AND** the instance renders three cards with titles and descriptions
- **AND** the card content matches the specified Home page copy

### Requirement: Section Title Component

The application SHALL provide a `SectionTitle` component that renders a centered, static section heading with responsive typography and bottom spacing. The component is non-interactive and renders text content only, without click-handling or event listeners. The component SHALL accept a single `text` string prop and render it as an `<h2>` element for semantic HTML. The component SHALL use responsive font sizing via CSS clamp() function with a maximum size of 36px at both 768px (mobile) and 1920px (desktop) viewports, scaling from a minimum of 18px. Font weight SHALL be 600 (semibold, using `--font-weight-semibold` token) and color SHALL be #1D1E1F (charcoal, using `--color-black` token). Text alignment SHALL be centered. The component SHALL apply bottom padding of `--space-32` (32px) on mobile and `--space-40` (40px) on desktop (≥ 768px).

#### Scenario: SectionTitle renders centered heading with responsive font sizing

- **GIVEN** the SectionTitle component is rendered with text prop "Our Offerings"
- **WHEN** the component mounts with valid text
- **THEN** a semantic `<h2>` element is rendered
- **AND** the text displays as "Our Offerings"
- **AND** the text is center-aligned
- **AND** font-weight is 600 (semibold)
- **AND** color is #1D1E1F (charcoal)
- **AND** on mobile (< 768px), font size starts at 18px and scales up to 36px at the 768px breakpoint
- **AND** on mobile (< 768px), bottom padding is `--space-32` (32px)
- **AND** on desktop (>= 768px), font size starts at 18px and scales up to 36px at the 1920px breakpoint
- **AND** on desktop (>= 768px), bottom padding is `--space-40` (40px)

#### Scenario: SectionTitle uses design tokens for consistency

- **GIVEN** the SectionTitle component is rendered
- **WHEN** CSS is applied
- **THEN** font-weight uses the `--font-weight-semibold` (600) design token
- **AND** color uses the `--color-black` (#1D1E1F) design token
- **AND** bottom padding uses the spacing tokens (`--space-32` mobile, `--space-40` desktop)
- **AND** all responsive sizing is defined via CSS clamp() function with viewport-relative units

#### Scenario: SectionTitle is non-interactive

- **GIVEN** the SectionTitle component is rendered
- **WHEN** the component is mounted
- **THEN** no click event handlers are attached
- **AND** no interactive behavior is present
- **AND** the component renders as text-only content
- **AND** semantic `<h2>` element is used for proper document structure

#### Scenario: SectionTitle used on home page within section wrapper

- **GIVEN** the home page is rendered
- **WHEN** the about section loads
- **THEN** a `<section>` element wraps the SectionTitle and ExpandableCardGrid components
- **AND** the SectionTitle component is rendered with text prop "About Hotlob"
- **AND** the SectionTitle displays above the ExpandableCardGrid
- **AND** the section wrapper applies responsive padding (horizontal and vertical)
- **AND** the SectionTitle's bottom padding (`--space-32` mobile, `--space-40` desktop) provides spacing between title and grid
- **AND** the ExpandableCardGrid component is displayed below the SectionTitle with its own responsive layout

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

The application SHALL provide a `DishCard` component that renders a single food/dish item as an expandable card with responsive styling. The card SHALL accept a dish object containing `name`, `description`, `tier`, and related `image` and `allergen_tag` arrays. The card SHALL have background #FFF, border-radius 20px, and box-shadow `0 0 20px 0 rgba(0, 0, 0, 0.12)`. On hover, the box-shadow SHALL change to `0 0 20px 0 rgba(234, 65, 72, 0.20)` (red-tinted shadow) with a smooth transition.

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
- **AND** the box-shadow changes from `0 0 20px 0 rgba(0, 0, 0, 0.12)` to `0 0 20px 0 rgba(234, 65, 72, 0.20)` (red-tinted)
- **AND** the image moves downward by 6px (creates dynamic parallax effect, uses `transform: translateY(6px)`)
- **AND** other content elements (title, tag, description, button) maintain fixed positions (no movement)
- **AND** the expansion is smooth with CSS transition 0.3s ease-out for both aspect-ratio and box-shadow
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

### Requirement: More Button Component

The application SHALL provide a `MoreButton` component that renders a circular icon button with a right arrow and a label below.

The component SHALL accept a required `href` prop and navigate in the same tab when clicked. The label text SHALL be "More" and appear below the circle.

The component SHALL render in a vertical stack, centered, with a 10px gap between the circle and the label. The circle and arrow sizes SHALL be responsive using two-stage formulas:
- Mobile (<768px): formula reaches max at 768px
- Desktop (≥768px): separate formula reaches different max at 1920px

The arrow icon source SHALL change on hover and active states:
- Unhovered: displays `public/images/icons/arrow-right.svg`
- Hovered/active: displays `public/images/icons/arrow-right-active.svg`

#### Scenario: More Button renders with a link
- **GIVEN** a `MoreButton` component is rendered with `href="/menu"`
- **WHEN** the component is displayed
- **THEN** the component renders a clickable link pointing to `/menu`
- **AND** the label text reads "More"

#### Scenario: More Button navigates on click
- **GIVEN** a `MoreButton` component is rendered with `href="/menu"`
- **WHEN** the user clicks the component
- **THEN** the browser navigates to `/menu` in the same tab

#### Scenario: More Button uses two-stage responsive formulas
- **GIVEN** the More Button is displayed on mobile (< 768px)
- **WHEN** the mobile formula is applied
- **THEN** the circle reaches max 50px at 768px
- **AND** the arrow reaches max 36px at 768px
- **AND** the label reaches max 26px at 768px

- **GIVEN** the More Button is displayed on desktop (≥ 768px)
- **WHEN** the separate desktop formula is applied
- **THEN** the circle reaches max 32px at 1920px
- **AND** the arrow reaches max 20px at 1920px
- **AND** the label reaches max 16px at 1920px
- **AND** the values achieved on desktop are different from mobile (not the same formula applied)

#### Scenario: More Button arrow icon changes on hover/active
- **GIVEN** a More Button is in unhovered state
- **WHEN** the component is displayed
- **THEN** the arrow icon displays `public/images/icons/arrow-right.svg`

- **GIVEN** a More Button is hovered or active
- **WHEN** the user hovers over or clicks the component
- **THEN** the arrow icon displays `public/images/icons/arrow-right-active.svg`
- **AND** the transition is smooth without DOM changes

#### Scenario: More Button appears below See Our Food DishCardGrid on home page
- **GIVEN** the home page is displayed
- **WHEN** the user scrolls to the "See Our Food" section
- **THEN** a MoreButton component is rendered below the DishCardGrid
- **AND** the MoreButton is centered
- **AND** there is a 30px gap between the DishCardGrid and the MoreButton
- **AND** the MoreButton href points to `/see-our-food` (the "See Our Food" page)
- **AND** clicking the MoreButton navigates to the "See Our Food" page in the same tab

