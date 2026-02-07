# page-components Specification

## Purpose

Page components are reusable sections that appear on multiple pages and require specific implementations with responsive design, accessibility, and flexible configuration options.

## ADDED Requirements

### Requirement: Hero Section Component

The application SHALL provide a Hero component that renders a full-width section with a responsive background image, optional overlay, and centered text content. The Hero component SHALL support two desktop variants with different aspect ratios (tall: 1920×820, short: 1920×500) and a unified responsive mobile layout (750×420 aspect ratio). The component SHALL accept title and subtitle text with responsive font sizes (title max 40px with font-weight 600, subtitle max 32px with font-weight 400) and SHALL display text in white color, left-aligned with responsive padding (desktop max `--space-256`, mobile max `--space-32`). Text content SHALL be vertically centered without y-padding.

#### Scenario: Hero with tall variant on desktop

- **GIVEN** the Hero component is rendered with variant="tall" on desktop (≥ 768px)
- **WHEN** the component receives bgImage, title, and subtitle props
- **THEN** the background image displays with 1920×820 aspect ratio
- **AND** the title displays with responsive sizing (max 40px)
- **AND** the subtitle displays below title with responsive sizing (max 32px)
- **AND** text content is left-aligned with responsive x-padding (max `--space-256`)
- **AND** text is vertically centered
- **AND** text color is white

#### Scenario: Hero with short variant on desktop

- **GIVEN** the Hero component is rendered with variant="short" on desktop (≥ 768px)
- **WHEN** the component receives bgImage, title, and subtitle props
- **THEN** the background image displays with 1920×500 aspect ratio
- **AND** all text styling matches tall variant (font sizes, colors, alignment)

#### Scenario: Hero on mobile with responsive layout

- **GIVEN** the Hero component is rendered on mobile (< 768px)
- **WHEN** variant is "tall" or "short"
- **THEN** the background image displays with 750×420 aspect ratio (unified mobile layout)
- **AND** title displays with responsive sizing (max 40px, scales down on smaller screens)
- **AND** subtitle displays with responsive sizing (max 32px)
- **AND** text is left-aligned with responsive x-padding (max `--space-32`)
- **AND** text is vertically centered

#### Scenario: Mobile-specific background image fallback

- **GIVEN** a Hero component is rendered with mobileBgImage prop provided
- **WHEN** the viewport is mobile (< 768px)
- **THEN** the mobile background image is used instead of the desktop bgImage
- **AND** the component displays correctly with mobile dimensions

#### Scenario: Mobile-specific background image not provided

- **GIVEN** a Hero component is rendered without mobileBgImage prop
- **WHEN** the viewport is mobile (< 768px)
- **THEN** the desktop bgImage is used as fallback
- **AND** the component displays correctly

#### Scenario: Hero with overlay on desktop

- **GIVEN** the Hero component is rendered on desktop with overlay={true}
- **WHEN** the component receives bgImage, title, and subtitle
- **THEN** an overlay image (`public/images/hero-bg/overlay.png`) is displayed
- **AND** the overlay appears between the background image and text content
- **AND** the overlay improves text readability without obscuring content

#### Scenario: Hero with overlay on mobile

- **GIVEN** the Hero component is rendered on mobile with overlay={true}
- **WHEN** the component receives bgImage and text
- **THEN** a mobile-specific overlay image (`public/images/hero-bg/overlay-mb.png`) is displayed
- **AND** the overlay appears between the background image and text content

#### Scenario: Hero without overlay

- **GIVEN** the Hero component is rendered with overlay={false} or undefined
- **WHEN** the component displays
- **THEN** no overlay layer is rendered
- **AND** text content is positioned directly over background image

#### Scenario: Gap between title and subtitle

- **GIVEN** the Hero component displays both title and subtitle
- **WHEN** the component renders
- **THEN** the gap between title and subtitle is `--space-20`
- **AND** the gap is consistent across desktop and mobile viewports

### Requirement: Hero Font Size Tokens

The design system SHALL provide two new responsive font size tokens for hero typography. The title token SHALL have a responsive clamp value with a minimum of 32px and a maximum of 40px. The subtitle token SHALL have a responsive clamp value with a minimum of 24px and a maximum of 32px. Both tokens SHALL use viewport-width (vw) percentages to scale responsively between minimum and maximum values and reach their maximums at 1920px viewport width. On mobile viewports (< 768px), the Hero component SHALL override these tokens so the title reaches a maximum of 32px and the subtitle reaches a maximum of 20px at 767px.

#### Scenario: Hero title font size responsive behavior

- **GIVEN** the hero title token is applied
- **WHEN** the viewport width changes from 320px to 1920px
- **THEN** the title size scales responsively from 32px to 40px
- **AND** the maximum size of 40px is reached at 1920px viewport width
- **AND** on mobile viewports, the title size reaches 32px at 767px viewport width

#### Scenario: Hero subtitle font size responsive behavior

- **GIVEN** the hero subtitle token is applied
- **WHEN** the viewport width changes from 320px to 1920px
- **THEN** the subtitle size scales responsively from 24px to 32px
- **AND** the maximum size of 32px is reached at 1920px viewport width
- **AND** on mobile viewports, the subtitle size reaches 20px at 767px viewport width

### Requirement: Hero Layout and Positioning

The Hero component SHALL implement left-aligned text positioning with responsive horizontal padding that varies by viewport size. Left padding SHALL use the responsive clamp values, and right padding SHALL be 1.5x the left padding. On desktop viewports (≥ 768px), the maximum left padding SHALL be `--space-256` (256px). On mobile viewports (< 768px), the maximum left padding SHALL be `--space-32` (32px). Text content SHALL be vertically centered using flexbox or similar layout technique without applying y-padding. All text content SHALL maintain white color (`--color-white`) for readability over background images.

#### Scenario: Desktop horizontal padding

- **GIVEN** the Hero component is rendered on desktop (≥ 768px)
- **WHEN** the component displays with title and subtitle
- **THEN** the responsive left padding scales from baseline and reaches a maximum of `--space-256` (256px) at 1920px viewport
- **AND** the right padding is 1.5x the left padding
- **AND** the padding scales responsively as viewport width increases beyond 768px

#### Scenario: Mobile horizontal padding

- **GIVEN** the Hero component is rendered on mobile (< 768px)
- **WHEN** the component displays with title and subtitle
- **THEN** the responsive left padding reaches a maximum of `--space-32` (32px)
- **AND** the right padding is 1.5x the left padding
- **AND** the padding scales responsively as viewport width decreases

#### Scenario: Text vertical centering

- **GIVEN** the Hero component displays title and subtitle
- **WHEN** the component renders
- **THEN** text content is vertically centered within the hero section
- **AND** no y-padding is applied (height is determined by variant aspect ratio)

#### Scenario: Text color with overlay

- **GIVEN** the Hero component is rendered with overlay={true}
- **WHEN** the component displays over a background image with overlay
- **THEN** both title and subtitle use white color (`--color-white`)
- **AND** the text is readable with sufficient contrast (WCAG AA minimum) over the overlay

#### Scenario: Text color without overlay

- **GIVEN** the Hero component is rendered with overlay={false} or undefined
- **WHEN** the component displays over a background image without overlay
- **THEN** the title uses dark gray color (`--color-dark-gray`)
- **AND** the subtitle uses medium gray color (`--color-medium-gray`)
- **AND** the text maintains sufficient contrast over background images
- **AND** colors are conditional based on overlay prop

### Requirement: Hero Text Color Tokens

The design system SHALL provide two new text color tokens for hero content when overlay is not applied. The hero title color token (`--color-dark-gray`) SHALL be dark gray (#242424) for use when overlay is disabled. The hero subtitle color token (`--color-medium-gray`) SHALL be medium gray (#999) for use when overlay is disabled. When overlay is enabled, text SHALL use white color (`--color-white`) regardless of these tokens. The component SHALL apply colors conditionally based on the overlay prop.

#### Scenario: Hero title color with overlay

- **GIVEN** the Hero component is rendered with overlay enabled
- **WHEN** the component displays
- **THEN** the title color is white (`--color-white`)

#### Scenario: Hero title color without overlay

- **GIVEN** the Hero component is rendered with overlay={false} or disabled
- **WHEN** the component displays
- **THEN** the title color is dark gray (`--color-dark-gray`, #242424)

#### Scenario: Hero subtitle color with overlay

- **GIVEN** the Hero component is rendered with overlay enabled
- **WHEN** the component displays
- **THEN** the subtitle color is white (`--color-white`)

#### Scenario: Hero subtitle color without overlay

- **GIVEN** the Hero component is rendered with overlay={false} or disabled
- **WHEN** the component displays
- **THEN** the subtitle color is medium gray (`--color-medium-gray`, #999)

### Requirement: Hero Page Instances

The application SHALL include Hero component instances on four primary pages: Home, See Our Food, Locations, and News. Each page SHALL display a hero section with specific configurations including variant type, background image(s), overlay status, and content. The Home page hero SHALL use the tall desktop variant (1920×820) with title "Get Rollin' with us !" and a descriptive subtitle. The See Our Food, Locations, and News pages SHALL use the short desktop variant (1920×500) with page-specific titles and subtitles. All instances except News SHALL use a single background image. The News page hero SHALL support mobile-specific background image (`news-hero-mb.png`) with desktop fallback (`news-hero.png`). Home, See Our Food, and Locations hero instances SHALL display with overlay enabled for improved text readability. The News page hero SHALL display without overlay.

#### Scenario: Home page hero - tall variant with overlay

- **GIVEN** the Home page is rendered
- **WHEN** the Hero component is displayed
- **THEN** the hero uses variant="tall" (1920×820 aspect ratio)
- **AND** the background image is `public/images/hero-bg/home-hero.jpg`
- **AND** overlay is enabled (desktop: overlay.png, mobile: overlay-mb.png)
- **AND** title displays "Get Rollin' with us !"
- **AND** subtitle displays "Premium Aussie lobster rolls — plus prawn, crab, meat & vegetarian favorites, all packed in buttery brioche."
- **AND** text is white, left-aligned, and vertically centered

#### Scenario: See Our Food page hero - short variant with overlay

- **GIVEN** the See Our Food page is rendered
- **WHEN** the Hero component is displayed
- **THEN** the hero uses variant="short" (1920×500 aspect ratio)
- **AND** the background image is `public/images/hero-bg/see-our-food-hero.jpg`
- **AND** overlay is enabled (desktop: overlay.png, mobile: overlay-mb.png)
- **AND** title displays "See Our Food"
- **AND** subtitle displays "You have to try their lobster rolls — they're addictive. And their other rolls are so good, I want to go back for more.\n— Google Review ⭐⭐⭐⭐⭐"
- **AND** text color is white and positioning is consistent

#### Scenario: Locations page hero - short variant with overlay

- **GIVEN** the Locations page is rendered
- **WHEN** the Hero component is displayed
- **THEN** the hero uses variant="short" (1920×500 aspect ratio)
- **AND** the background image is `public/images/hero-bg/our-locations-hero.png`
- **AND** overlay is enabled (desktop: overlay.png, mobile: overlay-mb.png)
- **AND** title displays "Find Hotlob near you"
- **AND** subtitle displays "We're serving up the rolls everyone's talking about — now in Perth and Melbourne.\nGrab one on your lunch break, between uni lectures, or on your way home."
- **AND** text color is white and positioning is consistent

#### Scenario: News page hero - short variant with mobile-specific image

- **GIVEN** the News page is rendered
- **WHEN** the Hero component is displayed
- **THEN** the hero uses variant="short" (1920×500 aspect ratio)
- **AND** the desktop background image is `public/images/hero-bg/news-hero.png`
- **AND** the mobile background image is `public/images/hero-bg/news-hero-mb.png`
- **AND** on mobile viewports (< 768px), the mobile image is used
- **AND** on desktop viewports (≥ 768px), the desktop image is used
- **AND** overlay is disabled (no overlay layer)
- **AND** title displays "Hot News"
- **AND** subtitle displays "Check out our latest news and stay tuned"
- **AND** text color is dark gray for title and medium gray for subtitle
