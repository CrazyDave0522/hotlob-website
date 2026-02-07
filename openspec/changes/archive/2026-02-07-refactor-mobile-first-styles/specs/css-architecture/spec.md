# Spec Delta: Mobile-First Styling

## ADDED Requirements

### Requirement: Mobile-First Component Styling

Component styles SHALL define mobile defaults in base selectors and apply desktop-specific adjustments using `@media (min-width: 768px)`. The 768px breakpoint SHALL be the standard for responsive layout changes unless a component explicitly documents an alternative breakpoint in its spec.

#### Scenario: Styling a component for mobile and desktop

- **GIVEN** a component stylesheet defines responsive behavior
- **WHEN** the stylesheet is authored
- **THEN** mobile layout rules appear in the base selector
- **AND** desktop enhancements are added under `@media (min-width: 768px)`
- **AND** max-width media queries are avoided unless explicitly required by the component spec
