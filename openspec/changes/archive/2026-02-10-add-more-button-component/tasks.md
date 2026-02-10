# Tasks: Add More Button Component

## 1. Component Structure
- [x] Create `components/MoreButton.tsx` with a required `href` prop and fixed label text "More".
- [x] Render a circular icon wrapper with an inline right-arrow SVG and a text label below.
- [x] Ensure the component renders as a link that navigates in the same tab.

## 2. Styling
- [x] Add `styles/components/more-button.css` with mobile-first styles and desktop overrides at 768px.
- [x] Apply responsive sizing for the circle, arrow, and label based on the specified max values.
- [x] Use a 10px vertical gap between the circle and the label.

## 3. Tokens
- [x] Add new color tokens for the circle background and label text in `styles/token.css`.

## 4. Tests
- [x] Add unit tests to verify the component renders the arrow, label, and link destination.

## 5. Integration and Validation
- [x] Export the new component if required by existing barrel patterns.
- [x] Import `more-button.css` in `styles/components/index.css`.
- [x] Run `pnpm test`.
