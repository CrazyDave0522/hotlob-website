# css-architecture Specification

## Purpose
This specification defines the CSS architecture for the Hotlob website, establishing a scalable system for styling components with design tokens, organized file structure, and Tailwind CSS compatibility. The architecture ensures consistent styling across the application while maintaining maintainability as the project grows.
## Requirements
### Requirement: Global CSS Entrypoint

The app SHALL load a single global stylesheet via app/globals.css that imports Tailwind and the project CSS layers in a deterministic order (tokens, base, components, utilities).

#### Scenario: Loading global styles

- **WHEN** the root layout renders
- **THEN** app/globals.css is loaded
- **AND** Tailwind and project CSS layers are applied in the defined order

### Requirement: Design Tokens

The project SHALL define design tokens as CSS custom properties in styles/token.css, covering color, font sizes, font weights, line heights, spacing scale, border radius, shadows, and motion. Token naming MUST follow group prefixes: --color-*, --font-size-*, --font-weight-*, --line-height-*, --space-*, --radius-*, --shadow-*, and --motion-*. The color tokens MUST include --color-primary as #ea4148, --color-black as #1d1e1f, --color-gray as #4e5969, and --color-white as #fff. The border radius tokens MUST include --radius-10 (10px), --radius-20 (20px), and --radius-30 (30px). The spacing tokens MUST include values following a 4px-based scale: --space-4 (4px), --space-8 (8px), --space-12 (12px), --space-16 (16px), --space-20 (20px), --space-24 (24px), --space-32 (32px), --space-40 (40px), --space-48 (48px), --space-64 (64px), --space-80 (80px), --space-96 (96px), --space-128 (128px), --space-160 (160px), --space-192 (192px), and --space-256 (256px). The font size tokens MUST include responsive clamp values: --font-size-h1 (clamp(32px, 4vw, 48px)), --font-size-h2 (clamp(24px, 3vw, 36px)), --font-size-h3 (clamp(20px, 2.5vw, 30px)), --font-size-h4 (clamp(18px, 2vw, 24px)), --font-size-h5 (clamp(16px, 1.5vw, 20px)), --font-size-h6 (clamp(14px, 1vw, 18px)), --font-size-body-lg (clamp(18px, 2vw, 20px)), --font-size-body (clamp(16px, 1.5vw, 18px)), --font-size-body-sm (clamp(14px, 1vw, 16px)), and --font-size-body-xs (clamp(12px, 0.8vw, 14px)). The font weight tokens MUST include --font-weight-normal (400), --font-weight-medium (500), --font-weight-semibold (600), and --font-weight-bold (700). The line height tokens MUST include --line-height-tight (1.2), --line-height-normal (1.4), and --line-height-relaxed (1.6). Shadow and motion tokens MAY be added later as the design system evolves.

#### Scenario: Using token values in components

- **WHEN** a component references a token like var(--color-primary) or var(--font-size-h1)
- **THEN** the token resolves to a defined value from styles/token.css

### Requirement: Component Style Organization

The project SHALL organize component styles under styles/components and aggregate them via styles/components/index.css for global import.

#### Scenario: Adding a new component stylesheet

- **WHEN** a new component stylesheet is created under styles/components
- **THEN** it is referenced by styles/components/index.css
- **AND** the styles are available globally through app/globals.css

### Requirement: Component Class Naming

Component classes MUST use component-prefixed naming (e.g., .Button-root, .Button--primary) to minimize global collisions.

#### Scenario: Multiple components on one page

- **WHEN** multiple components render on the same page
- **THEN** their class names remain distinct and do not collide

### Requirement: Infrastructure-Only Scope

The initial CSS setup MUST focus on directories, import structure, and naming conventions without requiring finished component styling.

#### Scenario: Early project bootstrap

- **WHEN** the CSS infrastructure is introduced
- **THEN** empty or placeholder component styles are acceptable
- **AND** the project still compiles with the global stylesheet in place

### Requirement: Tailwind Compatibility

The global stylesheet SHALL preserve Tailwind base, components, and utilities layers, allowing custom CSS to live in matching layers without override conflicts.

#### Scenario: Mixing Tailwind and custom styles

- **WHEN** a component uses Tailwind utilities alongside custom component classes
- **THEN** both sets of styles apply without unintended overrides

### Requirement: Mobile-First Component Styling

Component styles SHALL define mobile defaults in base selectors and apply desktop-specific adjustments using `@media (min-width: 768px)`. The 768px breakpoint SHALL be the standard for responsive layout changes unless a component explicitly documents an alternative breakpoint in its spec.

#### Scenario: Styling a component for mobile and desktop

- **GIVEN** a component stylesheet defines responsive behavior
- **WHEN** the stylesheet is authored
- **THEN** mobile layout rules appear in the base selector
- **AND** desktop enhancements are added under `@media (min-width: 768px)`
- **AND** max-width media queries are avoided unless explicitly required by the component spec

### Requirement: Section Wrapper Responsive Padding

The application SHALL establish responsive padding guidelines for section wrapper elements that contain web page content. Section wrapper elements SHALL use the `<section>` HTML element and SHALL apply responsive padding on both horizontal (x-axis) and vertical (y-axis) to maintain visual hierarchy and consistent spacing across mobile and desktop viewports. The design follows a mobile-first approach with 768px as the mobile-to-desktop breakpoint. Horizontal padding SHALL be implemented using CSS clamp() function, reaching a minimum of 16px and a maximum of 32px at 768px on mobile, and 256px at 1920px on desktop. Vertical padding SHALL be implemented using CSS clamp() function, reaching a minimum of 24px and a maximum of 48px at 768px on mobile, and 64px at 1920px on desktop. All padding values SHALL use viewport-relative units within the clamp() function for fluid responsive scaling without discrete breakpoints.

#### Scenario: Section wrapper has responsive vertical padding

- **GIVEN** a section wrapper element is rendered on mobile (< 768px)
- **WHEN** the viewport width is less than 768px
- **THEN** vertical padding scales from a minimum of 24px
- **AND** at the 768px breakpoint, vertical padding reaches 48px maximum
- **AND** on desktop (>= 768px), vertical padding scales from a minimum of 24px
- **AND** at the 1920px viewport, vertical padding reaches 64px maximum

#### Scenario: Section wrapper has responsive horizontal padding

- **GIVEN** a section wrapper element is rendered on mobile (< 768px)
- **WHEN** the viewport width is less than 768px
- **THEN** horizontal padding (x-axis) scales from a minimum of 16px
- **AND** at the 768px breakpoint, horizontal padding reaches 32px maximum
- **AND** on desktop (>= 1920px), horizontal padding scales from a minimum of 16px
- **AND** at the 1920px viewport, horizontal padding reaches 256px maximum

#### Scenario: Section wrapper styling uses mobile-first approach with clamp()

- **GIVEN** section wrapper CSS is defined
- **WHEN** responsive padding is applied
- **THEN** base mobile styles define default scaling behavior
- **AND** mobile scaling targets 768px as the maximum scaling point
- **AND** desktop (>= 768px) scaling targets 1920px as the maximum scaling point
- **AND** padding is implemented via CSS clamp() with viewport-relative units for fluid transitions
- **AND** no discrete @media breakpoints are used for padding values

#### Scenario: Section wrapper applies padding to home page about section

- **GIVEN** the home page "About Hotlob" section is rendered with a `<section>` element
- **WHEN** the section contains SectionTitle and ExpandableCardGrid components
- **THEN** horizontal padding is applied to the section wrapper
- **AND** vertical padding is applied to the section wrapper
- **AND** on mobile (< 768px), horizontal padding scales from 16px and reaches 32px at 768px
- **AND** on mobile (< 768px), vertical padding scales from 24px and reaches 48px at 768px
- **AND** on desktop (>= 768px), horizontal padding scales from 16px and reaches 256px at 1920px
- **AND** on desktop (>= 768px), vertical padding scales from 24px and reaches 64px at 1920px
- **AND** the SectionTitle component's bottom padding (`--space-32` mobile, `--space-40` desktop) adds additional spacing between title and ExpandableCardGrid
- **AND** the section wrapper padding creates consistent margins around all child content

### Requirement: Dish Card Styling

The application SHALL provide CSS styling for DishCard components with a white background (background-color: #FFF), border-radius 20px, and consistent box-shadow 0 0 20px 0 rgba(0, 0, 0, 0.12).

Styles SHALL follow a mobile-first approach, with base styles targeting mobile viewports and desktop overrides applied at ≥ 768px.

The card SHALL use flexbox layout (display: flex, flex-direction: column) to arrange content vertically. Within the card, a content wrapper (div or section) SHALL contain title, allergen icons, tier tag, and description elements in a flexbox column layout with responsive gap (max 14px at 1920px, max 10px at 768px) between these elements and align-items: flex-start. The content wrapper SHALL have responsive horizontal padding with max 20px at both 1920px and 768px.

The gap between the card image and the content wrapper (which contains the title as its first element) SHALL be responsive with max 20px at both 1920px and 768px. The gap between the content wrapper and the button element SHALL be responsive with max 24px at 1920px and max 16px at 768px.

The card image SHALL be positioned at the top of the card with responsive sizing (max 230px × 230px at both 1920px and 768px), aspect-ratio 1/1, and centered horizontally within the card. The card button SHALL be positioned below the content wrapper and centered horizontally within the card, using margin-top: auto to stick to the bottom of the card. The button SHALL have responsive bottom margin with max 24px at both 1920px and 768px.

The white card background SHALL use aspect-ratio for responsive sizing instead of fixed pixel dimensions. On mobile viewports (< 768px), the default (static) state SHALL have aspect-ratio 330 / 570 (intentionally SHORTER than total content height, allowing the top ~half of the image to extend ABOVE the white background). On desktop viewports (≥ 768px), the default state SHALL have aspect-ratio 332 / 480, and SHALL expand to aspect-ratio 332 / 590 on hover (tall enough to fully cover ALL content including the entire image). On mobile viewports, the white background SHALL remain static with no expansion behavior and SHALL remain shorter than content so the image top stays exposed.

The white background expansion (desktop only) SHALL be anchored at the bottom edge and grow upward. The image SHALL move downward by 6px on hover (creates dynamic parallax effect with expanding background, using `transform: translateY(6px)` with smooth `transition: transform 0.3s ease-out`). Other content elements (title, icons, tag, description, button) SHALL maintain fixed positions and never move or reflow during background expansion. The transition between background states SHALL be smooth with CSS properties `transition: aspect-ratio 0.3s ease-out, box-shadow 0.3s ease-out` applied to the background layer only on desktop viewports. On hover, the box-shadow SHALL change from 0 0 20px 0 rgba(0, 0, 0, 0.12) to 0 0 20px 0 rgba(234, 65, 72, 0.20) (red-tinted shadow).

The card image child SHALL have aspect-ratio 1/1 with responsive sizing. Sizing guide:

- Desktop: max 230px × 230px at 1920px viewport width
- Mobile: max 230px × 230px at 768px viewport width

All card content SHALL use design tokens for colors and spacing.

#### Scenario: Dish card base styling

- **GIVEN** the DishCard component renders
- **WHEN** CSS is applied
- **THEN** the card background is white (#FFF)
- **AND** the card has border-radius 20px
- **AND** the card has box-shadow 0 0 20px 0 rgba(0, 0, 0, 0.12)
- **AND** the card uses flex layout
- **AND** the card has responsive sizing via aspect-ratio

#### Scenario: Dish card static state (mobile viewports)

- **GIVEN** the DishCard component renders in the static state on mobile (< 768px)
- **WHEN** CSS is applied
- **THEN** the white card background has aspect-ratio 330 / 570
- **AND** the background is shorter than total content height
- **AND** the top ~half of the image extends ABOVE the white background
- **AND** all card content is visible (image partially uncovered by background)

#### Scenario: Dish card static state (desktop viewports)

- **GIVEN** the DishCard component renders in the static state on desktop (≥ 768px)
- **WHEN** CSS is applied
- **THEN** the white card background has aspect-ratio 332 / 480
- **AND** the background is shorter than total content height
- **AND** the top ~half of the image extends ABOVE the white background
- **AND** all card content is visible (image partially uncovered by background)

#### Scenario: Dish card expanded state

- **GIVEN** the DishCard component is in expanded state on desktop (≥ 768px)
- **WHEN** CSS is applied for expanded class
- **THEN** the white card background aspect-ratio is 332 / 590
- **AND** the box-shadow changes to 0 0 20px 0 rgba(234, 65, 72, 0.20) (red-tinted shadow)
- **AND** the background is tall enough to fully cover all content including the entire image
- **AND** the transition is smooth (0.3s ease-out)
- **AND** the expansion grows upward (bottom edge anchored)
- **AND** content elements remain in their original fixed positions (no movement)

#### Scenario: Dish card expansion anchors at bottom

- **GIVEN** the DishCard white background expands from aspect-ratio 332/480 to 332/590
- **WHEN** the expansion occurs
- **THEN** the bottom edge of the white background remains at the same vertical position
- **AND** the top edge of the white background moves up to cover the previously exposed image top
- **AND** the image moves downward by 6px (creates dynamic parallax effect, using `transform: translateY(6px)`)
- **AND** other content elements (title, icons, tag, description, button) never move
- **AND** the visual effect is the background "embracing" the content from below while image creates parallax movement

#### Scenario: Dish card remains static on mobile

- **GIVEN** the DishCard component is rendered on mobile (< 768px)
- **WHEN** CSS is applied
- **THEN** the white card background remains static with no aspect-ratio changes
- **AND** the background stays shorter than content with the image top exposed
- **AND** the background never fully covers the image
- **AND** no hover expansion or transition effects occur
- **AND** no media query transitions are applied for card expansion

### Requirement: Tier Tag Styling

The tier tag within DishCard SHALL display the dish tier value with first letter capitalized ("Premium" or "Standard") with responsive sizing, border-radius, and tier-specific background colors.

The tag SHALL keep aspect ratio 100:26 with responsive sizing. Sizing guide: max width 100px at 1920px desktop, max width 130px at 768px mobile. The tag SHALL keep border-radius 10px 0 (rounded top-left corner, crisp bottom edges).

Tier text SHALL use responsive font-sizing with font-weight 500. Sizing guide:

- Desktop: max 16px at 1920px viewport width
- Mobile: max 24px at 768px viewport width

Tags SHALL use tier-specific styling: premium tier SHALL use background rgba(234, 65, 72, 0.10) (light red) with text color #EA4148, and standard tier SHALL use background rgba(28, 67, 241, 0.10) (light blue) with text color #416BEA.

Text content SHALL be centered using flexbox. The tag SHALL be responsive and scale proportionally with the card rather than using fixed pixel dimensions.

#### Scenario: Premium tier tag renders with red background and text

- **GIVEN** a DishCard displays a dish with `tier = "premium"`
- **WHEN** the tier tag is rendered
- **THEN** the tag background is rgba(234, 65, 72, 0.10) (light red tint)
- **AND** the tag text color is #EA4148 (red)
- **AND** the tag has border-radius 10px 0
- **AND** the text is centered
- **AND** the tag keeps aspect ratio 100:26 with max width 100px at 1920px (desktop) and max width 130px at 768px (mobile)
- **AND** the tag font-size is max 16px at 1920px (desktop) and max 24px at 768px (mobile)

#### Scenario: Standard tier tag renders with blue background and text

- **GIVEN** a DishCard displays a dish with `tier = "standard"`
- **WHEN** the tier tag is rendered
- **THEN** the tag background is rgba(28, 67, 241, 0.10) (light blue tint)
- **AND** the tag text color is #416BEA (blue)
- **AND** the tag has border-radius 10px 0
- **AND** the text is centered
- **AND** the tag keeps aspect ratio 100:26 with max width 100px at 1920px (desktop) and max width 130px at 768px (mobile)
- **AND** the tag font-size is max 16px at 1920px (desktop) and max 24px at 768px (mobile)

### Requirement: Dish Card Button Styling

The button element within DishCard SHALL render with specific styling including gradient background, shadows, rounded corners, and text color.

The button SHALL have a linear gradient background with colors transitioning from #EA4148 (0%) to #FFA159 (100%) at 90-degree angle. The button SHALL have box-shadow 3px 3px 0 0 rgba(175, 23, 23, 0.16).

The button SHALL have border-radius 30px 30px 0 30px (top corners fully rounded, bottom-left crisp corner, bottom-right slightly rounded). The button text SHALL have color #FFFFFF (white) with responsive font-sizing. Sizing guide:

- Desktop: max 16px at 1920px viewport width
- Mobile: max 26px at 768px viewport width

The button SHALL have responsive sizing with max width 200px and max height 40px at 1920px viewport on desktop, and max width 230px and max height 60px at 768px viewport on mobile (not fixed pixels).

The button SHALL use flexbox (display: flex, justify-content: center, align-items: center) to center its text content.

On hover or click state, the button background SHALL transition to a linear gradient with colors transitioning from #FB8225 (0%) to #D51D24 (100%) at 180-degree angle. The transition SHALL be smooth with CSS property `transition: background 0.3s ease-out`.

#### Scenario: Dish card button renders with gradient background

- **GIVEN** the DishCard button renders
- **WHEN** CSS is applied
- **THEN** the button has linear-gradient(90deg, #EA4148 0%, #FFA159 100%)
- **AND** the gradient transitions smoothly from red to orange
- **AND** the button has responsive sizing (desktop: max 200px width and max 40px height at 1920px, mobile: max 230px width and max 60px height at 768px)

#### Scenario: Dish card button shadow styling

- **GIVEN** the DishCard button renders
- **WHEN** CSS is applied
- **THEN** the button has box-shadow 3px 3px 0 0 rgba(175, 23, 23, 0.16)
- **AND** the shadow appears as a 3px offset with dark red tint

#### Scenario: Dish card button border radius

- **GIVEN** the DishCard button renders
- **WHEN** CSS is applied
- **THEN** the button has border-radius 30px 30px 0 30px
- **AND** the top-left corner is rounded 30px
- **AND** the top-right corner is rounded 30px
- **AND** the bottom-left corner is crisp (0px)
- **AND** the bottom-right corner is rounded 30px

#### Scenario: Dish card button hover/clicked state

- **GIVEN** the DishCard button is in default state
- **WHEN** the user hovers over or clicks the button
- **THEN** the button background transitions to linear-gradient(180deg, #FB8225 0%, #D51D24 100%)
- **AND** the transition is smooth (0.3s ease-out)
- **AND** the text color remains #FFFFFF (white)
- **AND** the shadow remains 3px 3px 0 0 rgba(175, 23, 23, 0.16)

### Requirement: Dish Card Grid Responsive Layout

The DishCardGrid component SHALL use responsive flexbox layout (display: flex, flex-wrap: wrap) with columns that adjust based on viewport width.

On desktop viewports (≥ 768px), the grid SHALL display 4 equal-width columns using flex-basis or CSS Grid. On mobile viewports (< 768px), the grid SHALL display 2 equal-width columns.

The horizontal gap between cards SHALL be responsive with max 24px at 1920px (desktop) and max 16px at 768px (mobile). The vertical gap between rows SHALL be responsive with max 24px at 1920px (desktop) and max 16px at 768px (mobile).

Cards SHALL be flexibly sized to fill available width equally. The layout SHALL support smooth transitions when cards expand/contract on hover.

#### Scenario: Dish card grid 4-column desktop layout

- **GIVEN** the DishCardGrid component renders on desktop (≥ 768px)
- **WHEN** CSS is applied
- **THEN** the grid displays 4 columns
- **AND** each column has equal width
- **AND** cards are responsive (not fixed pixel width)
- **AND** gap between cards is consistent

#### Scenario: Dish card grid 2-column mobile layout

- **GIVEN** the DishCardGrid component renders on mobile (< 768px)
- **WHEN** CSS is applied
- **THEN** the grid displays 2 columns
- **AND** each column has equal width
- **AND** cards stack vertically
- **AND** gap between cards is responsive

#### Scenario: Dish card grid gaps

- **GIVEN** the DishCardGrid renders at various viewport widths
- **WHEN** CSS is applied
- **THEN** the horizontal gap between cards scales responsively: max 24px at 1920px (desktop), max 16px at 768px (mobile)
- **AND** the vertical gap between rows scales responsively: max 24px at 1920px (desktop), max 16px at 768px (mobile)
- **AND** gaps scale linearly between 768px and 1920px viewports

### Requirement: Dish Card Typography Styling

Card title text SHALL use color #1D1E1F (unhovered state) in the default state and transition to color #EA4148 (hovered state) when the card is hovered.

Title text SHALL use responsive font-sizing with font-weight 600. Sizing guide:

- Desktop: max 20px at 1920px viewport width
- Mobile: max 28px at 768px viewport width

The title color transition SHALL be smooth with CSS transition property.

Card description text SHALL use color var(--color-gray) with responsive font-sizing and font-weight 400. Sizing guide:

- Desktop: max 18px at 1920px viewport width
- Mobile: max 26px at 768px viewport width

The description SHALL be clamped to a maximum of 4 lines.

Both title and description text SHALL use semantic HTML tags (h3 for title, p for description) and fit within the card's flex layout. All typography SHALL use design tokens for colors and font-weights.

#### Scenario: Dish card title typography

- **GIVEN** the DishCard title renders
- **WHEN** CSS is applied in unhovered state
- **THEN** the title color is #1D1E1F
- **AND** the title font-size is responsive (desktop: max 20px at 1920px, mobile: max 28px at 768px)
- **AND** the title font-weight is 600
- **AND** the title uses design token `--color-black`

#### Scenario: Dish card title color on hover

- **GIVEN** the DishCard title renders
- **WHEN** the user hovers over the card
- **THEN** the title color transitions smoothly to #EA4148
- **AND** the transition uses CSS (typically 0.3s ease-out)
- **AND** the title font-size and font-weight remain unchanged

#### Scenario: Dish card description typography

- **GIVEN** the DishCard description renders
- **WHEN** CSS is applied
- **THEN** the description color is var(--color-gray) (#4e5969)
- **AND** the description font-size is responsive (desktop: max 18px at 1920px, mobile: max 26px at 768px)
- **AND** the description font-weight is 400
- **AND** the description uses design token `--color-gray`

### Requirement: Allergen Icon Row Styling

The DishCard SHALL display allergen icons in a horizontal row with responsive styling. The icons row SHALL use flexbox layout (display: flex, flex-direction: row) to position icons horizontally in a single line.

Icons SHALL be sourced from `allergen_tag.icon_url` (external images) and displayed as responsive `<img>` elements. Icons SHALL scale proportionally with responsive sizing:

- Desktop: max 40px × 40px at 1920px viewport width
- Mobile: max 50px × 50px at 768px viewport width

The gap between icons SHALL be responsive with max 16px at 1920px and max 12px at 768px, using design tokens for consistent spacing. Icon containers SHALL display evenly spaced within the card width.

If no allergen tags are associated with a dish, the icons row SHALL be hidden or empty.

#### Scenario: Allergen icons display in responsive row

- **GIVEN** the DishCard renders with allergen tags
- **WHEN** CSS is applied
- **THEN** allergen icons display in a single horizontal flexbox row
- **AND** icons are sourced from `allergen_tag.icon_url`
- **AND** icons scale responsively with max sizing constraints
- **AND** desktop viewport: icons max 40px × 40px at 1920px
- **AND** mobile viewport: icons max 50px × 50px at 768px
- **AND** gap between icons is consistent and responsive
- **AND** icons are evenly distributed across available width

#### Scenario: Allergen icons row responsive behavior

- **GIVEN** the DishCard renders at various viewport widths
- **WHEN** CSS is applied
- **THEN** the icons row width is responsive to card width
- **AND** icons maintain aspect ratio while scaling
- **AND** icons respect max sizing constraints per viewport
- **AND** icons remain in single row (no wrapping)

#### Scenario: Empty allergen row handling

- **GIVEN** a dish has no associated allergen tags
- **WHEN** the DishCard renders
- **THEN** the icons row is hidden or displays empty
- **AND** the card layout adjusts gracefully without gap

### Requirement: More Button Tokens

The design tokens SHALL include `--color-peach-100` with value #fde4d5 and `--color-muted` with value #86909c.

#### Scenario: Using More Button color tokens
- **GIVEN** a component references `var(--color-peach-100)` or `var(--color-muted)`
- **WHEN** the styles are applied
- **THEN** the values resolve to #fde4d5 and #86909c respectively

### Requirement: More Button Styling

The application SHALL provide component styles for a More Button using component-prefixed class names.

The More Button SHALL render as a vertical stack aligned to the center, with a 10px gap between the circle and the label.

The circle wrapper SHALL use background `var(--color-peach-100)` with border-radius 30px. The circle size SHALL be responsive using two-stage formulas:
- Mobile (<768px): formula reaches max 50px at 768px
- Desktop (≥768px): formula reaches max 32px at 1920px

The right arrow icon SHALL be an inline SVG with responsive sizing using two-stage formulas:
- Mobile (<768px): formula reaches max 36px at 768px
- Desktop (≥768px): formula reaches max 20px at 1920px

The arrow icon source SHALL change based on state:
- Unhovered state: displays `public/images/icons/arrow-right.svg`
- Hovered/active state: displays `public/images/icons/arrow-right-active.svg`

The icon swap SHALL use CSS background-image or similar technique to avoid DOM manipulation, with smooth transition.

The label text SHALL read "More" and use color `var(--color-muted)`, font-weight 400, and line-height normal. The label font-size SHALL be responsive using two-stage formulas:
- Mobile (<768px): formula reaches max 26px at 768px
- Desktop (≥768px): formula reaches max 16px at 1920px

Responsive values SHALL follow the project pattern of mobile-first `clamp()` sizing with separate desktop overrides at ≥768px breakpoint, with each formula independently reaching its specified max at each viewport.

#### Scenario: More Button sizing follows two-stage responsive formula
- **GIVEN** the More Button is displayed on mobile (< 768px)
- **WHEN** the mobile formula is applied
- **THEN** the circle reaches max 50px at 768px
- **AND** the arrow reaches max 36px at 768px
- **AND** the label reaches max 26px at 768px

- **GIVEN** the More Button is displayed on desktop (≥ 768px)
- **WHEN** the desktop formula is applied within the @media breakpoint
- **THEN** the circle reaches max 32px at 1920px (not 50px)
- **AND** the arrow reaches max 20px at 1920px (not 36px)
- **AND** the label reaches max 16px at 1920px (not 26px)

#### Scenario: More Button arrow swaps icon on hover/active
- **GIVEN** the More Button is in unhovered state
- **WHEN** the component is displayed
- **THEN** the arrow icon displays `public/images/icons/arrow-right.svg`

- **GIVEN** the More Button is hovered or clicked
- **WHEN** the user hovers over or clicks the component
- **THEN** the arrow icon switches to `public/images/icons/arrow-right-active.svg`
- **AND** the transition is smooth

