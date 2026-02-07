# css-architecture Specification

## Purpose
This specification defines the CSS architecture for the Hotlob website, establishing a scalable system for styling components with design tokens, organized file structure, and Tailwind CSS compatibility. The architecture ensures consistent styling across the application while maintaining maintainability as the project grows.
## Requirements
### Requirement: Global CSS Entrypoint

The app SHALL load a single global stylesheet via app/globals.css that imports Tailwind and the project CSS layers in a deterministic order (tokens, base, components, utilities).

#### Scenario: Loading global styles

- **WHEN** the root layout renders
- **THEN** app/globals.css is loaded
- **AND** Tailwind and project CSS layers are applied in the defined order

### Requirement: Design Tokens

The project SHALL define design tokens as CSS custom properties in styles/token.css, covering color, font sizes, font weights, line heights, spacing scale, border radius, shadows, and motion. Token naming MUST follow group prefixes: --color-*, --font-size-*, --font-weight-*, --line-height-*, --space-*, --radius-*, --shadow-*, and --motion-*. The color tokens MUST include --color-primary as #ea4148, --color-black as #1d1e1f, --color-gray as #4e5969, and --color-white as #fff. The border radius tokens MUST include --radius-10 (10px), --radius-20 (20px), and --radius-30 (30px). The spacing tokens MUST include values following a 4px-based scale: --space-4 (4px), --space-8 (8px), --space-12 (12px), --space-16 (16px), --space-20 (20px), --space-24 (24px), --space-32 (32px), --space-40 (40px), --space-48 (48px), --space-64 (64px), --space-80 (80px), --space-96 (96px), --space-128 (128px), --space-160 (160px), --space-192 (192px), and --space-256 (256px). The font size tokens MUST include responsive clamp values: --font-size-h1 (clamp(32px, 4vw, 48px)), --font-size-h2 (clamp(24px, 3vw, 36px)), --font-size-h3 (clamp(20px, 2.5vw, 30px)), --font-size-h4 (clamp(18px, 2vw, 24px)), --font-size-h5 (clamp(16px, 1.5vw, 20px)), --font-size-h6 (clamp(14px, 1vw, 18px)), --font-size-body-lg (clamp(18px, 2vw, 20px)), --font-size-body (clamp(16px, 1.5vw, 18px)), --font-size-body-sm (clamp(14px, 1vw, 16px)), and --font-size-body-xs (clamp(12px, 0.8vw, 14px)). The font weight tokens MUST include --font-weight-normal (400), --font-weight-medium (500), --font-weight-semibold (600), and --font-weight-bold (700). The line height tokens MUST include --line-height-tight (1.2), --line-height-normal (1.4), and --line-height-relaxed (1.6). Shadow and motion tokens MAY be added later as the design system evolves.

#### Scenario: Using token values in components

- **WHEN** a component references a token like var(--color-primary) or var(--font-size-h1)
- **THEN** the token resolves to a defined value from styles/token.css

### Requirement: Component Style Organization

The project SHALL organize component styles under styles/components and aggregate them via styles/components/index.css for global import.

#### Scenario: Adding a new component stylesheet

- **WHEN** a new component stylesheet is created under styles/components
- **THEN** it is referenced by styles/components/index.css
- **AND** the styles are available globally through app/globals.css

### Requirement: Component Class Naming

Component classes MUST use component-prefixed naming (e.g., .Button-root, .Button--primary) to minimize global collisions.

#### Scenario: Multiple components on one page

- **WHEN** multiple components render on the same page
- **THEN** their class names remain distinct and do not collide

### Requirement: Infrastructure-Only Scope

The initial CSS setup MUST focus on directories, import structure, and naming conventions without requiring finished component styling.

#### Scenario: Early project bootstrap

- **WHEN** the CSS infrastructure is introduced
- **THEN** empty or placeholder component styles are acceptable
- **AND** the project still compiles with the global stylesheet in place

### Requirement: Tailwind Compatibility

The global stylesheet SHALL preserve Tailwind base, components, and utilities layers, allowing custom CSS to live in matching layers without override conflicts.

#### Scenario: Mixing Tailwind and custom styles

- **WHEN** a component uses Tailwind utilities alongside custom component classes
- **THEN** both sets of styles apply without unintended overrides

### Requirement: Mobile-First Component Styling

Component styles SHALL define mobile defaults in base selectors and apply desktop-specific adjustments using `@media (min-width: 768px)`. The 768px breakpoint SHALL be the standard for responsive layout changes unless a component explicitly documents an alternative breakpoint in its spec.

#### Scenario: Styling a component for mobile and desktop

- **GIVEN** a component stylesheet defines responsive behavior
- **WHEN** the stylesheet is authored
- **THEN** mobile layout rules appear in the base selector
- **AND** desktop enhancements are added under `@media (min-width: 768px)`
- **AND** max-width media queries are avoided unless explicitly required by the component spec

