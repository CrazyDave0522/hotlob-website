# Design: Mobile-First Refactor

## Overview

This change converts existing component styles to a mobile-first approach without changing visual output or class names. Mobile-first means the base rules target mobile defaults, and desktop enhancements are applied with `@media (min-width: 768px)`.

## Principles

- **Mobile defaults**: Base selectors represent the <768px layout.
- **Desktop enhancements**: `@media (min-width: 768px)` holds desktop-only changes.
- **Single breakpoint**: Standardize on 768px unless a component explicitly requires a different breakpoint.
- **No visual redesign**: Layout, spacing, and typography should match current behavior.

## Current Pattern

Many component styles define desktop layout in base rules and override with `@media (max-width: 767px)` for mobile. This is desktop-first and increases override complexity.

## Proposed Pattern

For each component:

1. Move mobile-specific rules into the base selector.
2. Add a `@media (min-width: 768px)` section for desktop layout.
3. Convert any `@media (max-width: 767px)` blocks into the inverse min-width rules.
4. Keep clamp-based sizing unchanged unless it is explicitly tied to desktop or mobile behavior.

## Component Targets

- Header styles (Header layout, nav, overlay)
- Footer styles (spacing, layout)
- Hero styles (responsive text and padding)
- Any other component styles with max-width media queries

## Risks and Mitigations

- **Risk**: Subtle spacing regressions from moving rules into base selectors.
  - **Mitigation**: Validate with build/test and visually compare key pages at 375px, 768px, and 1440px.
- **Risk**: Missing a desktop-only rule that was previously implicit.
  - **Mitigation**: Treat every max-width override as a desktop delta and migrate it explicitly.

## Out of Scope

- Visual redesign or new tokens
- Changing HTML structure or component APIs
- Tailwind refactors
