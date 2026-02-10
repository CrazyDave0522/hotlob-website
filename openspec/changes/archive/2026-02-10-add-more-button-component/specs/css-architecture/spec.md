# css-architecture Specification (Delta)

## ADDED Requirements

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
