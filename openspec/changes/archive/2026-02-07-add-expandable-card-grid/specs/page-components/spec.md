# page-components Specification

## ADDED Requirements

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
