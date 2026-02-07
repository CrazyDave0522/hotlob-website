# page-components Specification Delta

## ADDED Requirements

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
