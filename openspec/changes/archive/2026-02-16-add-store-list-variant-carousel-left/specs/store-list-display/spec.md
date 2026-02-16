# store-list-display Specification Delta

## Purpose

Add carousel-left variant to StoreList component for image-focused store presentation without maps.

## ADDED Requirements

### Requirement: Carousel Left Variant

The StoreList component SHALL support a `carousel-left` variant that displays store images in a carousel on the left side and store information in the middle, with an angle-right icon on the right side, without map embeds.

#### Scenario: Carousel left layout on desktop

**GIVEN** the StoreList component is rendered with `variant="carousel-left"`
**WHEN** viewed on desktop devices (screen width >= 768px)
**THEN** each store displays an image carousel on the left side
**AND** store information displays in the middle
**AND** an angle-right icon displays on the right side
**AND** no map embeds are shown
**AND** the layout uses responsive columns: carousel (sized to content), info (flexible), icon (auto)

#### Scenario: Three-column layout on mobile

**GIVEN** the StoreList component is rendered with `variant="carousel-left"`
**WHEN** viewed on mobile devices (screen width < 768px)
**THEN** the image carousel displays on the left side
**AND** store information displays in the middle
**AND** an angle-right icon displays on the right side
**AND** all sections use responsive widths
**AND** items stack vertically in the store list

#### Scenario: Image carousel functionality

**GIVEN** a store has multiple images
**WHEN** the carousel-left variant is displayed
**THEN** images are shown in a carousel format
**AND** navigation controls (arrows/indicators) are available
**AND** users can navigate between images
**AND** the carousel maintains responsive dimensions (120-220px width, 160px height)
**AND** the carousel is touch-friendly on mobile

#### Scenario: Store info in carousel variant

**GIVEN** the carousel-left variant is displayed
**WHEN** store information is rendered
**THEN** it displays in the middle column in this vertical order: store name, rating, address, hours
**AND** the styling uses responsive typography: store name (16-24px), addresses/hours (14-18px)
**AND** layout adapts to the middle column on both mobile and desktop
**AND** maintains consistent spacing and visual hierarchy

#### Scenario: Uber URL navigation icon

**GIVEN** the carousel-left variant is displayed
**WHEN** store information is rendered
**THEN** an angle-right icon (`public/images/icons/angle-right-black.svg`) appears in the right column
**AND** the icon is centered vertically in its column
**AND** clicking the icon opens the store's Uber URL in a new tab
**AND** the icon uses responsive sizing (16-32px) and is visible on both mobile and desktop

#### Scenario: Handling stores without images

**GIVEN** a store has no images available
**WHEN** the carousel-left variant is displayed
**THEN** a Store icon from Lucide React is shown as placeholder
**AND** the layout remains consistent
**AND** store information still displays properly

### Requirement: Store Ordering

The StoreList component SHALL always order stores by rating descending (highest first), regardless of the variant used.

#### Scenario: Consistent ordering across variants

**GIVEN** stores with different ratings are available
**WHEN** any StoreList variant is displayed (alternating or carousel-left)
**THEN** stores are ordered by `rating` in descending order
**AND** highest-rated stores appear first
**AND** ordering is consistent regardless of layout variant

### Requirement: Store Item Borders

The carousel-left variant SHALL display store items with top borders and bottom border on the last item only.

#### Scenario: Border styling for store items

**GIVEN** the carousel-left variant is displayed
**WHEN** store items are rendered
**THEN** each item has `border-top: 1px solid #B9B7B7`
**AND** only the last item has `border-bottom: 1px solid #B9B7B7`
**AND** there are no gaps between adjacent store items
**AND** overlapping borders are handled to prevent thicker lines
