# site-chrome Specification

## Purpose
TBD - created by archiving change add-header-footer-components. Update Purpose after archive.
## Requirements
### Requirement: Header Component Structure

The application SHALL provide a Header component that renders a horizontal layout with three distinct sections: logo on the left, navigation links in the middle, and social icons with a call-to-action button on the right. The logo SHALL be loaded from `public/images/logo/logo-lg.png` (8500×7000px, aspect ratio 1.21) and linked to the homepage using Next.js Image and Link components.

#### Scenario: Rendering the header layout

- **GIVEN** the application is rendering any page
- **WHEN** the Header component is displayed
- **THEN** the logo appears in the left section
- **AND** navigation links appear in the center section
- **AND** social icons and CTA button appear in the right section
- **AND** all sections maintain their horizontal alignment

### Requirement: Header Navigation Links

The Header component SHALL display navigation links to the main sections of the website in the following order: Home, See Our Food, Catering, Our Locations, and Hotlob News. Navigation links SHALL use the font size token `--font-size-h5` with a gap of `--space-80` between each link. Navigation link text SHALL use the color token `--color-taupe` (#665f5b).

#### Scenario: Navigating to main sections

- **GIVEN** a user is viewing any page with the Header
- **WHEN** the user clicks on a navigation link
- **THEN** the browser navigates to the corresponding page
- **AND** the navigation remains visible at the top of the new page

#### Scenario: Visual indication of current page

- **GIVEN** a user is viewing a specific section (e.g., Catering)
- **WHEN** the Header renders
- **THEN** the corresponding navigation link displays an active state
- **AND** the active link uses styling: border-radius `--radius-10` and border-bottom `4px solid var(--color-primary)`

### Requirement: Header Social Icons and CTA

The Header component SHALL display social media icons and a call-to-action button in the right section. Social icons SHALL link to external social media platforms: Facebook (`public/images/icons/fb.svg` → https://www.facebook.com/hotlob/) and Instagram (`public/images/icons/ins.svg` → https://www.instagram.com/hotlobaustralia/). The call-to-action button SHALL display the text "Order Online" with styling: border-radius `--radius-20`, background color `--color-primary`, and text color `--color-white`. The gap between the two social icons and the CTA button SHALL be `--space-32`. Social icons SHALL open in new browser tabs with proper security attributes (target="_blank" rel="noopener noreferrer"). CTA link behavior is deferred.

#### Scenario: Clicking social media icons

- **GIVEN** a user views the Header
- **WHEN** the user clicks a social media icon
- **THEN** a new browser tab opens to the corresponding social media platform
- **AND** the current page remains unchanged

#### Scenario: Clicking the CTA button

- **GIVEN** a user views the Header
- **WHEN** the user clicks the call-to-action button
- **THEN** the button is clickable and ready for link configuration

### Requirement: Footer Component Structure

The application SHALL provide a Footer component that renders a two-tier vertical layout: a top section with logo and legal links arranged horizontally, and a bottom section with copyright notice aligned to the left and social icons aligned to the right. The logo SHALL be loaded from `public/images/logo/logo-lg.png` (8500×7000px, aspect ratio 1.21) using Next.js Image component. The Footer SHALL use background color `--color-dark-brown` (#1f1f1c) with white text (`--color-white`) for all content. A separator line SHALL appear between the top and bottom sections with `border-top: 1px solid rgba(255, 255, 255, 0.20)` and a width of 80% of the footer content area.

#### Scenario: Rendering the footer layout

- **GIVEN** the application is rendering any page
- **WHEN** the Footer component is displayed
- **THEN** the top section displays the logo on the left
- **AND** the top section displays Privacy Policy, Terms & Conditions, and Contact Us links to the right of the logo
- **AND** the bottom section displays the copyright notice on the left
- **AND** the bottom section displays social media icons on the right

### Requirement: Footer Legal Links

The Footer component SHALL display links for Privacy Policy, Terms & Conditions, and Contact Us in the top section. Legal links SHALL use the font size token `--font-size-body-xs` with a gap of `--space-64` between each link. The actual link destinations will be configured in a future update. Links SHALL use Next.js Link component.

#### Scenario: Navigating to legal pages

- **GIVEN** a user is viewing any page with the Footer
- **WHEN** the user clicks on a legal link placeholder
- **THEN** the link structure is ready for destination configuration
- **AND** the Footer remains visible at the bottom of the page

### Requirement: Footer Copyright and Social Icons

The Footer component SHALL display a copyright notice in the bottom left and social media icons in the bottom right. The copyright notice SHALL display the dynamic current year (e.g., `© 2026 Hotlob`) and use the font size token `--font-size-body-xs`. Social media icons SHALL link to: Facebook (`public/images/icons/fb.svg` → https://www.facebook.com/hotlob/) and Instagram (`public/images/icons/ins.svg` → https://www.instagram.com/hotlobaustralia/). Social icons SHALL open in new browser tabs with proper security attributes (target="_blank" rel="noopener noreferrer").

#### Scenario: Viewing footer brand information

- **GIVEN** a user scrolls to the bottom of any page
- **WHEN** the Footer is visible
- **THEN** the copyright notice displays the current year and company name
- **AND** social media icons are visible and clickable

#### Scenario: Clicking footer social media icons

- **GIVEN** a user views the Footer
- **WHEN** the user clicks a social media icon in the bottom section
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

