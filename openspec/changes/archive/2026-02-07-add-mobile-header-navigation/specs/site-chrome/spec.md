# site-chrome Specification Delta

## MODIFIED Requirements

### Requirement: Header Component Structure

The application SHALL provide a Header component that renders a horizontal layout with three distinct sections on desktop (≥ 768px): logo on the left, navigation links in the middle, and social icons with a call-to-action button on the right. On mobile (< 768px), the header SHALL display only the logo on the left (with responsive sizing: max 140px width, 116px height maintaining 1.21 aspect ratio) and a hamburger menu icon on the right. The header SHALL have no y-padding on mobile (same as desktop) and responsive x-padding with maximum `--space-32`. The logo SHALL be loaded from `public/images/logo/logo-lg.png` (8500×7000px, aspect ratio 1.21) and linked to the homepage using Next.js Image and Link components.

#### Scenario: Desktop header layout

- **GIVEN** the viewport width is 768px or greater
- **WHEN** the Header component is displayed
- **THEN** the logo appears in the left section
- **AND** navigation links appear in the center section
- **AND** social icons and CTA button appear in the right section
- **AND** all sections maintain their horizontal alignment

#### Scenario: Mobile header layout

- **GIVEN** the viewport width is less than 768px
- **WHEN** the Header component is displayed
- **THEN** the logo appears in the left section with responsive sizing (max 140px width, 116px height)
- **AND** the header has no y-padding and responsive x-padding (max `--space-32`)
- **AND** a hamburger menu icon appears in the right section
- **AND** social icons and CTA button are hidden
- **AND** navigation links are hidden from the header (available in overlay menu)

#### Scenario: Mobile hamburger menu toggle

- **GIVEN** the viewport width is less than 768px
- **WHEN** the user clicks the hamburger menu icon
- **THEN** a full-screen overlay appears
- **AND** the overlay background color is `rgba(0, 0, 0, 0.90)`
- **AND** navigation links are displayed vertically inside the overlay
- **AND** the hamburger icon changes its state to indicate menu is open (e.g., `aria-expanded="true"`)

#### Scenario: Mobile overlay navigation

- **GIVEN** the hamburger menu is open on mobile
- **WHEN** navigation links are displayed in the overlay
- **THEN** each link uses the font size token `--font-size-h2` for larger mobile-friendly text
- **AND** links are stacked vertically with spacing
- **AND** each link is clickable and navigates to the correct route
- **AND** clicking any navigation link closes the overlay menu

#### Scenario: Overlay interaction

- **GIVEN** the mobile overlay menu is open
- **WHEN** the user clicks the overlay background
- **THEN** the overlay closes and menu is hidden
- **AND** the hamburger icon returns to closed state

#### Scenario: Keyboard support for mobile menu

- **GIVEN** the mobile overlay menu is open
- **WHEN** the user presses the Escape key
- **THEN** the overlay closes and menu is hidden

#### Scenario: Scroll lock on mobile menu

- **GIVEN** the mobile overlay menu is open
- **WHEN** the user attempts to scroll the page
- **THEN** the page background does not scroll
- **AND** only the overlay menu content can be scrolled (if needed)
- **AND** the page becomes scrollable again when the menu closes

### Requirement: Header Navigation Links

The Header component SHALL display navigation links to the main sections of the website in the following order: Home, See Our Food, Catering, Our Locations, and Hotlob News. On desktop (≥ 768px), navigation links SHALL use the font size token `--font-size-h5` with a gap of `--space-80` between each link. Navigation link text SHALL use the color token `--color-taupe` (#665f5b). On mobile (< 768px), when displayed in the overlay, navigation links SHALL use the font size token `--font-size-h2` and SHALL be stacked vertically with a responsive gap (maximum `--space-96`, e.g., clamp(32px, 12.52vw, 96px)).

#### Scenario: Desktop navigation styling

- **GIVEN** the viewport width is 768px or greater
- **WHEN** the Header renders
- **THEN** navigation links use font size `--font-size-h5`
- **AND** navigation links are gap `--space-80` apart
- **AND** all navigation link styling from the original spec applies

#### Scenario: Mobile navigation styling

- **GIVEN** the viewport width is less than 768px
- **WHEN** the hamburger menu is opened and overlay is displayed
- **THEN** navigation links use font size `--font-size-h2`
- **AND** links are stacked vertically
- **AND** links have responsive gap between them (maximum `--space-96`)
- **AND** links have padding for touch targets (minimum 44x44px recommended)

### Requirement: Header Social Icons and CTA

The Header component SHALL display social media icons and a call-to-action button in the right section on desktop (≥ 768px). On mobile (< 768px), social icons and CTA button SHALL be completely hidden. Social icons SHALL link to external social media platforms: Facebook (`public/images/icons/fb.svg` → https://www.facebook.com/hotlob/) and Instagram (`public/images/icons/ins.svg` → https://www.instagram.com/hotlobaustralia/`). The call-to-action button SHALL display the text "Order Online" with styling: border-radius `--radius-20`, background color `--color-primary`, and text color `--color-white`. The gap between the two social icons and the CTA button SHALL be `--space-32`. Social icons SHALL open in new browser tabs with proper security attributes (target="_blank" rel="noopener noreferrer"). CTA link behavior is deferred.

#### Scenario: Desktop social icons and CTA display

- **GIVEN** the viewport width is 768px or greater
- **WHEN** the Header is rendered
- **THEN** social icons are visible and clickable
- **AND** CTA button is visible and clickable

#### Scenario: Mobile social icons and CTA hidden

- **GIVEN** the viewport width is less than 768px
- **WHEN** the Header is rendered
- **THEN** social icons are not visible
- **AND** CTA button is not visible

## ADDED Requirements

### Requirement: Mobile Hamburger Menu Icon

The Header component SHALL display a hamburger menu icon (three horizontal lines) on mobile viewports (< 768px). The hamburger icon SHALL be interactive and toggle the mobile overlay menu. The icon size SHALL be responsive with a maximum of 50px (e.g., clamp(32px, 6.5vw, 50px)). The hamburger icon SHALL have an `aria-expanded` attribute that reflects the menu state (true when open, false when closed). The hamburger icon SHALL be hidden on desktop viewports (≥ 768px).

#### Scenario: Hamburger icon display on mobile

- **GIVEN** the viewport width is less than 768px
- **WHEN** the Header is rendered
- **THEN** the hamburger menu icon is visible
- **AND** the icon size is responsive with maximum 50px
- **AND** the icon is positioned in the right section of the header
- **AND** the icon has a click handler

#### Scenario: Hamburger icon hidden on desktop

- **GIVEN** the viewport width is 768px or greater
- **WHEN** the Header is rendered
- **THEN** the hamburger menu icon is not visible

#### Scenario: Hamburger icon accessibility

- **GIVEN** the hamburger menu icon is rendered
- **WHEN** the icon is analyzed with accessibility tools
- **THEN** it has `role="button"`
- **AND** it has appropriate `aria-label` (e.g., "Open navigation menu")
- **AND** it has `aria-expanded` attribute reflecting menu state

### Requirement: Mobile Menu Scroll Lock

When the mobile overlay menu is open, the page behind the overlay SHALL not be scrollable. The document body's scroll capability SHALL be disabled (e.g., via `overflow: hidden` CSS or equivalent JavaScript scroll lock). When the menu is closed, the page scroll functionality SHALL be restored.

#### Scenario: Disable page scroll when menu open

- **GIVEN** the mobile overlay menu is open
- **WHEN** the user attempts to scroll the page
- **THEN** the page background remains in its current scroll position
- **AND** scroll events on the page do not propagate

#### Scenario: Restore page scroll when menu closed

- **GIVEN** the mobile overlay menu was open
- **WHEN** the user closes the menu
- **THEN** the page becomes scrollable again
- **AND** the previous scroll position is maintained

