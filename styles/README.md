# Styles Directory

This directory contains the project's CSS architecture following the css-architecture specification.

## Structure

- `token.css` - Design tokens as CSS custom properties
- `base.css` - Foundational global styles
- `utilities.css` - Custom utility classes that extend Tailwind
- `components/` - Component-specific styles
  - `index.css` - Aggregates all component stylesheets
  - Individual component files (e.g., `primary-button.css`)

## Naming Conventions

- **Component classes**: Use component-prefixed naming to avoid collisions
  - Format: `.ComponentName-root` for the main component class
  - Format: `.ComponentName--variant` for component variants
  - Format: `.ComponentName-element` for component sub-elements

- **Design tokens**: Use group prefixes
  - `--color-*` for colors
  - `--font-size-*` for font sizes
  - `--font-weight-*` for font weights
  - `--line-height-*` for line heights
  - `--space-*` for spacing
  - `--radius-*` for border radius
  - `--shadow-*` for shadows (future)
  - `--motion-*` for animations (future)

## Import Order

Styles are imported in `app/globals.css` in this order:

1. Tailwind CSS
2. Tokens (design system values)
3. Base (foundational styles)
4. Components (component-specific styles)
5. Utilities (custom utilities)

This ensures proper CSS cascade and specificity.
