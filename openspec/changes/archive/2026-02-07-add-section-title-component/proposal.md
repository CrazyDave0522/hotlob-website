# Proposal: Add Section Title Component

## Summary

Add a reusable `SectionTitle` component to provide consistent typography and styling for section headings across the Hotlob website. Additionally, establish section wrapper styling guidelines with responsive padding that accommodates content and maintains visual hierarchy.

## Motivation

Currently, section headings are implemented ad-hoc without a unified component, leading to inconsistent styling. A dedicated `SectionTitle` component will:

- Ensure visual consistency across all sections
- Reduce code duplication for headings
- Provide a single source of truth for section title styling
- Support responsive typography with platform-specific sizing rules

Section wrapper styling guidelines will:

- Establish consistent spacing around section content
- Ensure responsive padding that scales appropriately across mobile and desktop
- Provide a reusable pattern for section containers

## Requirements

### Requirement 1: SectionTitle Component

A reusable React component that renders centered, semantic heading text with responsive typography.

**Spec Impact**: `page-components` (ADDED)

**Details**:

- Component name: `SectionTitle`
- Accepts a single `text` prop (string)
- Renders as `<h2>` element for semantic HTML
- Centers text horizontally
- Uses responsive font sizing:
  - Mobile: scales from 18px minimum, reaches 36px maximum at 768px viewport width
  - Desktop: scales from 18px minimum, reaches 36px maximum at 1920px viewport width
- Typography:
  - Font weight: 600 (semibold)
  - Color: #1D1E1F (charcoal, `--color-black`)
  - Uses existing design tokens for consistency
- Spacing:
  - Bottom padding: `--space-32` (32px) on mobile
  - Bottom padding: `--space-40` (40px) on desktop (≥ 768px)
- Mobile-first CSS approach

### Requirement 2: Section Wrapper Styling

Establish responsive padding guidelines for section containers wrapping content (including SectionTitle and other components).

**Spec Impact**: `css-architecture` (ADDED)

**Details**:

- Section containers use `<section>` HTML element
- Responsive horizontal (x-axis) padding:
  - Mobile: scales from 16px minimum, reaches 32px maximum at 768px viewport width
  - Desktop: scales from 16px minimum, reaches 256px maximum at 1920px viewport width
- Responsive vertical (y-axis) padding:
  - Mobile: scales from 24px minimum, reaches 48px maximum at 768px viewport width
  - Desktop: scales from 24px minimum, reaches 64px maximum at 1920px viewport width
- Padding applied to section wrapper, not individual child components
- Uses mobile-first responsive design with CSS clamp() for responsive scaling (no discrete @media breakpoints)
- Padding values implemented as CSS clamp() with viewport-relative units for maintainability

## Success Criteria

- [x] `SectionTitle` component created and exported
- [x] Component uses semantic `<h2>` HTML
- [x] Responsive font sizing implemented with clamp()
- [x] Section wrapper CSS rules established
- [x] All typography uses existing design tokens
- [x] Mobile-first CSS approach followed
- [x] Spec validation passes (both page-components and css-architecture)
- [x] Unit tests verify rendering and styling

## Related Changes

- Builds on existing component pattern (Hero, Button, ExpandableCardGrid)
- Extends token system (adds named typography pattern)
- Follows css-architecture guidelines for responsive design
