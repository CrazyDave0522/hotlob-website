# Proposal: add-hero-section

## Summary

Add a responsive Hero component that displays a full-width background image with overlay support and centered title/subtitle text. The component supports two desktop variants with different aspect ratios (tall: 1920×820, short: 1920×500) and a single responsive mobile layout. Mobile images can be specified separately with automatic fallback to desktop images.

## Why

Hero sections are a key visual component for landing pages and section introductions. A flexible, responsive hero component enables:
- Reusable hero section across multiple pages (home, news, locations, etc.)
- Different visual layouts per page/section (tall vs. short hero)
- Mobile-optimized images for better performance and UX
- Optional overlay for text readability
- Accessible, semantically correct headline hierarchy

## What Changes

### New Capabilities

- **page-components** — Hero component for full-width background images with responsive text overlay

### Design Decisions

- **Desktop variants**: Two aspect ratios (1920×820 and 1920×500) for layout flexibility
- **Mobile layout**: Single responsive variant (750×420 aspect ratio) for all pages
- **Mobile images**: Optional mobile-specific background with desktop fallback
- **Overlay styling**: Conditional with separate desktop (`overlay.png`) and mobile (`overlay-mb.png`) images
- **Text positioning**: Left-aligned with responsive padding (desktop max `--space-256`, mobile max `--space-32`), vertically centered
- **Typography**: 
  - Title: Responsive font size with 40px maximum
  - Subtitle: Responsive font size with 32px maximum
  - Gap: `--space-20` between title and subtitle
  - Color: Conditional based on overlay
    - With overlay: White (`--color-white`)
    - Without overlay: Title dark gray (`#242424`), subtitle medium gray (`#999`)
- **New design tokens**: Two new font size tokens + two new color tokens for hero typography

## Impact Assessment

### Breaking Changes

None. New component is purely additive.

### Dependencies

- Existing `css-architecture` capability for component styling
- Next.js Image component for optimized image loading
- Design tokens for spacing, colors, and typography

### Migration

No migration needed. Hero component is new and optional.

## Alternatives Considered

1. **Single fixed aspect ratio**: Rejected because different pages need different visual treatments
2. **CSS background-image only**: Rejected because Next.js Image provides better optimization
3. **No mobile image override**: Rejected because mobile-specific optimization improves performance

## Timeline

Estimated implementation: 2-3 hours

- Hero component structure with variant support: 30 minutes
- Responsive CSS with two desktop variants: 30 minutes
- Mobile image fallback logic: 20 minutes
- Overlay implementation: 20 minutes
- Typography and positioning: 20 minutes
- Hero component tests: 30 minutes
- Integration with existing pages: 15 minutes
