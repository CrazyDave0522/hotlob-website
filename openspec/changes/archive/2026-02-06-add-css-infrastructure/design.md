## Context

- Tailwind v4 is available via PostCSS, but app/globals.css is empty and not imported in the root layout.
- The styles directory exists with empty files, so there is no consistent import order or token definition.

## Goals / Non-Goals

- Goals:
  - Provide a single global CSS entrypoint that loads Tailwind plus project layers.
  - Establish a predictable file structure for tokens, base, utilities, and components.
  - Use a clear class naming convention to reduce global collisions.
- Non-Goals:
  - Build the full design system or finish component styling.
  - Produce final visual styling for components at this stage.
  - Replace Tailwind or introduce CSS-in-JS.

## Decisions

- Use app/globals.css as the entrypoint and import Tailwind plus project layers in a fixed order.
- Define tokens as CSS custom properties in styles/token.css for reuse across components.
- Aggregate component CSS via styles/components/index.css and use component-prefixed classes (e.g., .Button-root).

## Alternatives Considered

- CSS Modules per component: increases per-component imports and reduces shared token usage.
- CSS-in-JS: adds runtime cost and new tooling without current need.
- Per-component imports only: makes load order and overrides inconsistent.

## Risks / Trade-offs

- Global styles can collide if naming is inconsistent; mitigation is the component-prefixed convention.
- Ordering mistakes can cause overrides; mitigation is a single entrypoint and explicit order.

## Migration Plan

- Add the global entrypoint and layer files.
- Populate initial tokens and base styles.
- Introduce component class stubs using the naming convention.

## Open Questions

- None.
