# site-chrome Specification

## Purpose
TBD - created by archiving change add-header-footer-components. Update Purpose after archive.
## Requirements
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

The Header component's "Order Online" CTA button SHALL trigger a store selection modal when clicked. After the user selects a store, the button SHALL open the store's Uber Eats URL in a new browser tab.

#### Scenario: Opening store selection modal from CTA button

- **GIVEN** the Header component is rendered with the "Order Online" CTA button
- **WHEN** the user clicks the "Order Online" button
- **THEN** the StoreSelectionModal component opens
- **AND** the modal displays all available stores from the database
- **AND** the modal title shows "Select a store"
- **AND** the page body scroll is locked while the modal is open

#### Scenario: CTA button state management

- **GIVEN** the Header component renders
- **WHEN** the component mounts
- **THEN** the Header maintains state for:
  - `isStoreModalOpen: boolean` - tracks modal open/close state
  - `stores: Store[]` - list of stores fetched from database
- **AND** stores are fetched on component mount using `fetchStores()` function
- **AND** the CTA button's `onClick` handler sets `isStoreModalOpen` to `true`
- **AND** stores are fetched on component mount using `fetchStores()` function
- **AND** when the modal opens, the UI SHALL sort stores by proximity if user location is available, otherwise the UI SHALL sort stores alphabetically by store name
- **AND** the CTA button's `onClick` handler sets `isStoreModalOpen` to `true`

#### Scenario: Automatic selection when location permission already granted

- **GIVEN** the Header component is rendered and the user has previously granted geolocation permission
- **WHEN** the user clicks the "Order Online" CTA button
- **THEN** the Header SHALL attempt to obtain a quick location (via Permissions API or a short `getCurrentPosition` call)
- **AND** if a valid user location is immediately available, the Header SHALL compute distances to all stores using `store.latitude` and `store.longitude`, select the closest store, and open the selected store's `uber_url` in a new browser tab
- **AND** the StoreSelectionModal SHALL NOT be displayed in this flow
- **AND** if location is not available immediately (permission revoked, request times out, or error), the Header SHALL open the StoreSelectionModal as the fallback behavior

#### Scenario: Handling store selection from modal

- **GIVEN** the store selection modal is open from the Header CTA button
- **WHEN** the user selects a store from the modal
- **THEN** the Header's `onStoreSelect` callback receives the selected store object
- **AND** `window.open(store.uber_url, '_blank')` is called to open Uber Eats in new tab
- **AND** the modal is closed by setting `isStoreModalOpen` to `false`
- **AND** the original tab remains on the current page

#### Scenario: Closing modal without selection

- **GIVEN** the store selection modal is open from the Header CTA button
- **WHEN** the user closes the modal without selecting a store (via close button, backdrop, or Escape)
- **THEN** the modal closes by setting `isStoreModalOpen` to `false`
- **AND** no new browser tab is opened
- **AND** the user remains on the current page

#### Scenario: CTA button with modal integration

- **GIVEN** the Header component with integrated StoreSelectionModal
- **WHEN** the component renders
- **THEN** the Button component shows "Order Online" text
- **AND** the Button has `onClick={() => setIsStoreModalOpen(true)}`
- **AND** the StoreSelectionModal is rendered with props:
  - `isOpen={isStoreModalOpen}`
  - `onClose={() => setIsStoreModalOpen(false)}`
  - `onStoreSelect={handleStoreSelect}`
  - `stores={stores}`
- **WHERE** `handleStoreSelect` is defined as:
  ```typescript
  const handleStoreSelect = (store: Store) => {
    window.open(store.uber_url, "_blank");
    setIsStoreModalOpen(false);
  };
  ```

#### Scenario: Error handling for missing stores

- **GIVEN** the Header component attempts to fetch stores on mount
- **WHEN** the fetch fails or returns an empty array
- **THEN** the CTA button remains clickable
- **AND** clicking the button opens the modal
- **AND** the modal displays "No stores available" message
- **AND** the user can close the modal

#### Scenario: CTA button accessibility

- **GIVEN** the Header CTA button is rendered
- **WHEN** keyboard users navigate to the button
- **THEN** the button is focusable via Tab key
- **WHEN** the button has focus and user presses Enter or Space
- **THEN** the store selection modal opens
- **AND** focus moves to the first interactive element in the modal (close button)

### Requirement: Footer Component Structure

The application SHALL provide a Footer component that renders a multi-section vertical layout:

- **Desktop layout (≥768px)**: Top section with logo and legal links arranged horizontally, bottom section with copyright notice aligned to the left and social icons aligned to the right
- **Mobile layout (<768px)**: Logo centered at top, legal links centered horizontally below, copyright notice centered below, social icons centered below

The logo SHALL be loaded from `public/images/logo/logo-lg.png` (8500×7000px, aspect ratio 1.21) using Next.js Image component with responsive sizing: `clamp(64px, 5vw, 96px)`. On mobile (<768px), the logo size SHALL use `clamp(64px, 25vw, 192px)` so it reaches 192px at 768px. The Footer SHALL use background color `--color-dark-brown` (#1f1f1c) with white text (`--color-white`) for all content. The footer container SHALL use vertical padding `--space-20` and responsive horizontal padding: `clamp(32px, 13.33vw, 256px)` on desktop and `clamp(16px, 4.17vw, 32px)` on mobile. A separator line SHALL appear at the top of the bottom section as `border-top: 1px solid rgba(255, 255, 255, 0.20)` spanning the full width of the footer content area, with top padding `--space-32` on desktop and `--space-12` on mobile.

#### Scenario: Rendering the footer layout on desktop (≥768px)

- **GIVEN** the application is rendering any page on a desktop viewport
- **WHEN** the Footer component is displayed
- **THEN** the top section displays the logo on the left
- **AND** the top section displays Privacy Policy, Terms & Conditions, and Contact Us links to the right of the logo
- **AND** a separator line appears between top and bottom sections
- **AND** the bottom section displays the copyright notice on the left
- **AND** the bottom section displays social media icons on the right

#### Scenario: Rendering the footer layout on mobile (<768px)

- **GIVEN** the application is rendering any page on a mobile viewport
- **WHEN** the Footer component is displayed
- **THEN** the logo is displayed centered at the top
- **AND** the legal links (Privacy Policy, Terms & Conditions, Contact Us) are displayed horizontally centered below the logo
- **AND** the gap between the logo and legal links is `--space-32`
- **AND** a separator line spans the full width of the footer
- **AND** the gap between the legal links and separator line is `--space-20`
- **AND** the copyright notice is displayed centered below the separator
- **AND** the gap between the separator line and copyright notice is `--space-12`
- **AND** social media icons are displayed centered below the copyright notice
- **AND** the gap between the copyright notice and social icons is `--space-20`

### Requirement: Footer Legal Links

The Footer component SHALL display links for Privacy Policy, Terms & Conditions, and Contact Us. On desktop (≥768px), legal links SHALL be arranged horizontally in the top section with font size token `--font-size-body-xs` and a gap of `--space-64` between each link. On mobile (<768px), legal links SHALL be arranged horizontally centered below the logo with the same font size and a responsive gap that reaches `--space-64` at 768px (e.g., `clamp(16px, 8.33vw, 64px)`). Links SHALL use Next.js Link component.

#### Scenario: Viewing legal links on desktop

- **GIVEN** a user is viewing any page with the Footer on a desktop viewport
- **WHEN** the Footer is rendered
- **THEN** legal links are displayed horizontally to the right of the logo
- **AND** links are spaced with `--space-64` gap between them

#### Scenario: Viewing legal links on mobile

- **GIVEN** a user is viewing any page with the Footer on a mobile viewport (<768px)
- **WHEN** the Footer is rendered
- **THEN** legal links are displayed horizontally and centered below the logo
- **AND** links maintain appropriate spacing for mobile screens

### Requirement: Footer Copyright and Social Icons

The Footer component SHALL display a copyright notice and social media icons in the bottom section. On desktop (≥768px), copyright notice is left-aligned and social icons are right-aligned. On mobile (<768px), copyright notice is centered and social icons are centered below. The copyright notice SHALL display the dynamic current year (e.g., `© 2026 Hotlob`) and use the font size token `--font-size-body-xs`. Social media icons SHALL link to: Facebook (`public/images/icons/fb.svg` → https://www.facebook.com/hotlob/) and Instagram (`public/images/icons/ins.svg` → https://www.instagram.com/hotlobaustralia/). Social icons SHALL open in new browser tabs with proper security attributes (target="\_blank" rel="noopener noreferrer").

#### Scenario: Viewing footer brand information on desktop

- **GIVEN** a user scrolls to the bottom of any page on desktop
- **WHEN** the Footer is visible on a desktop viewport (≥768px)
- **THEN** the copyright notice is left-aligned in the bottom section
- **AND** social media icons are right-aligned in the bottom section
- **AND** a separator line appears above the copyright notice

#### Scenario: Viewing footer brand information on mobile

- **GIVEN** a user scrolls to the bottom of any page on mobile
- **WHEN** the Footer is visible on a mobile viewport (<768px)
- **THEN** the copyright notice is displayed centered
- **AND** social media icons are centered below the copyright notice
- **AND** a separator line appears above the copyright notice spanning full width

#### Scenario: Clicking footer social media icons

- **GIVEN** a user views the Footer
- **WHEN** the user clicks a social media icon
- **THEN** a new browser tab opens to the corresponding social media platform
- **AND** the current page remains unchanged

### Requirement: Site-wide Integration

The Header and Footer components SHALL be integrated into the root layout to appear consistently across all pages of the application. The Header SHALL stick to the top of the page, and the Footer SHALL stick to the bottom of the page.

#### Scenario: Consistent site chrome across all pages

- **GIVEN** a user navigates between different pages (home, catering, locations, etc.)
- **WHEN** each page loads
- **THEN** the Header appears at the top of every page
- **AND** the Footer appears at the bottom of every page
- **AND** the page content renders between the Header and Footer

### Requirement: Custom Font Configuration

The application SHALL configure custom fonts from `public/fonts` directory as the site-wide typography system, loading font files via @font-face declarations in `styles/base.css` and defining a `--font-family-primary` font-family token in `styles/token.css`. Custom fonts SHALL be applied to all HTML/body elements to ensure universal coverage, with proper fallback system font stacks to maintain readability if custom fonts fail to load.

#### Scenario: Loading custom fonts site-wide

- **GIVEN** the application is rendering any page
- **WHEN** the page loads
- **THEN** custom font files from `public/fonts` are loaded via @font-face declarations
- **AND** a font-family design token (e.g., `--font-family-primary`) references the custom font
- **AND** all components including Header and Footer use the custom font through the token

#### Scenario: Font fallbacks

- **GIVEN** custom fonts are configured
- **WHEN** a custom font file fails to load or is still loading
- **THEN** the browser falls back to a system font stack defined in the font-family declaration
- **AND** the layout remains functional and readable

### Requirement: CSS Architecture Compliance

The Header and Footer components SHALL follow the project's CSS architecture patterns defined in the `css-architecture` specification, using component-prefixed class names and design tokens from `styles/token.css`.

#### Scenario: Styling with design tokens

- **GIVEN** the Header or Footer component is being styled
- **WHEN** the component CSS is authored
- **THEN** class names use component prefixes (e.g., `.Header-root`, `.Footer-topSection`)
- **AND** colors reference design tokens (e.g., `var(--color-primary)`, `var(--color-dark-brown)`, `var(--color-taupe)`, `var(--color-white)`)
- **AND** spacing uses design tokens (e.g., `var(--space-16)`, `var(--space-24)`)
- **AND** typography uses design tokens (e.g., `var(--font-size-body)`, `var(--font-weight-medium)`)

### Requirement: Component Testing

The Header and Footer components SHALL include unit tests that verify their structure, rendering behavior, and user interactions according to the `testing-capabilities` specification.

#### Scenario: Testing Header component

- **GIVEN** the Header component is implemented
- **WHEN** unit tests are executed
- **THEN** tests verify the logo renders in the left section
- **AND** tests verify all navigation links render in the center section
- **AND** tests verify social icons and CTA button render in the right section
- **AND** tests verify navigation links have correct href attributes
- **AND** tests verify social icons open in new tabs (target="_blank")

#### Scenario: Testing Footer component

- **GIVEN** the Footer component is implemented
- **WHEN** unit tests are executed
- **THEN** tests verify the top section renders with logo and legal link placeholders
- **AND** tests verify the bottom section renders with copyright and social icons
- **AND** tests verify the copyright notice includes the current year
- **AND** tests verify social icons open in new tabs (target="\_blank")

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

