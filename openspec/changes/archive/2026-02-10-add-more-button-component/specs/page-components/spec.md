# page-components Specification (Delta)

## ADDED Requirements

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
