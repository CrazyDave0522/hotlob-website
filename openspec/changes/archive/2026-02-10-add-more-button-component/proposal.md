# Change: Add More Button Component

## Why
Sections need a compact call-to-action that signals additional content while staying visually consistent across breakpoints.

## What Changes
- Add a new More Button component that renders a circular icon button with a right arrow and the label "More" beneath.
- Define responsive sizing rules for the circle, arrow, and label across mobile and desktop breakpoints.
- Add design tokens for the new background and label colors used by the component.
- Add unit tests for rendering and link navigation behavior.

## Impact
- Affected specs: css-architecture, page-components
- Affected code: components/, styles/components/, styles/token.css, __tests__/unit/
