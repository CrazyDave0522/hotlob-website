# Spec: Footer Responsive Layout Updates

## MODIFIED Requirements

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
