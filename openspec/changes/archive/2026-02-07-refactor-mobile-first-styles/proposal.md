# Proposal: Refactor Styles to Mobile-First

## Why

The current styles are mostly desktop-first, which leads to larger base rules and multiple overrides for smaller screens. Refactoring to mobile-first keeps base styles aligned with the smallest viewport, improves maintainability, and standardizes responsive patterns across the project.

## What Changes

- Refactor component styles to define mobile defaults in the base rules.
- Replace `@media (max-width: 767px)` overrides with `@media (min-width: 768px)` desktop enhancements.
- Standardize on the 768px breakpoint for responsive behavior.
- Preserve visual output and existing class names/selectors.

**Audit scope (current media queries):**
- `styles/components/header.css` (max-width 767, min-width 768, and 768-900 range)
- `styles/components/footer.css` (max-width 767)
- `styles/components/hero.css` (max-width 767)

## Impact

- **Specs**: css-architecture (add a mobile-first requirement)
- **Specs (unchanged)**: site-chrome, page-components (behavior and requirements remain the same)
- **Code**: styles/components/* (Header, Footer, Hero, and any others using max-width media queries)
- **Tests**: No new tests required; run existing build/test to confirm parity
