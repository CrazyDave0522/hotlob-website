# css-architecture Specification (Delta)

## ADDED Requirements

### Requirement: Dish Card Styling

The application SHALL provide CSS styling for DishCard components with a white background (background-color: #FFF), border-radius 20px, and consistent box-shadow 0 0 20px 0 rgba(0, 0, 0, 0.12).

Styles SHALL follow a mobile-first approach, with base styles targeting mobile viewports and desktop overrides applied at ≥ 768px.

The card SHALL use flexbox layout (display: flex, flex-direction: column) to arrange content vertically. Within the card, a content wrapper (div or section) SHALL contain title, allergen icons, tier tag, and description elements in a flexbox column layout with responsive gap (max 14px at 1920px, max 10px at 768px) between these elements and align-items: flex-start. The content wrapper SHALL have responsive horizontal padding with max 20px at both 1920px and 768px.

The gap between the card image and the content wrapper (which contains the title as its first element) SHALL be responsive with max 20px at both 1920px and 768px. The gap between the content wrapper and the button element SHALL be responsive with max 24px at 1920px and max 16px at 768px.

The card image SHALL be positioned at the top of the card with responsive sizing (max 230px × 230px at both 1920px and 768px), aspect-ratio 1/1, and centered horizontally within the card. The card button SHALL be positioned below the content wrapper and centered horizontally within the card, using margin-top: auto to stick to the bottom of the card. The button SHALL have responsive bottom margin with max 24px at both 1920px and 768px.

The white card background SHALL use aspect-ratio for responsive sizing instead of fixed pixel dimensions. On mobile viewports (< 768px), the default (static) state SHALL have aspect-ratio 330 / 570 (intentionally SHORTER than total content height, allowing the top ~half of the image to extend ABOVE the white background). On desktop viewports (≥ 768px), the default state SHALL have aspect-ratio 332 / 480, and SHALL expand to aspect-ratio 332 / 590 on hover (tall enough to fully cover ALL content including the entire image). On mobile viewports, the white background SHALL remain static with no expansion behavior and SHALL remain shorter than content so the image top stays exposed.

The white background expansion (desktop only) SHALL be anchored at the bottom edge and grow upward. The image SHALL move downward by 6px on hover (creates dynamic parallax effect with expanding background, using `transform: translateY(6px)` with smooth `transition: transform 0.3s ease-out`). Other content elements (title, icons, tag, description, button) SHALL maintain fixed positions and never move or reflow during background expansion. The transition between background states SHALL be smooth with CSS property `transition: aspect-ratio 0.3s ease-out` applied to the background layer only on desktop viewports.

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

## MODIFIED Requirements

(None at this time - all CSS requirements are new additions)

## REMOVED Requirements

(None)
