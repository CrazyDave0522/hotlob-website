# Proposal: Update Footer Layout and Separator

## Why

The Footer component currently uses a non-standard 900px responsive breakpoint, inconsistent with the site's 768px standard across Header and other components. Additionally, the separator line is a separate DOM element when it can be more semantically represented as a border on the `.Footer-bottom` container. These changes improve consistency, reduce DOM complexity, and enhance the mobile experience by aligning with the site's design system.

## Summary

Update the Footer component to move the separator line from an independent div element to a `border-top` on the `.Footer-bottom` container, and restructure the mobile layout to be more consistent with the site's 768px responsive breakpoint.

## Changes

1. **Remove separator div element** from Footer.tsx
2. **Add border-top styling** to `.Footer-bottom` container in footer.css
3. **Align mobile breakpoint** from Footer's custom 900px to site-standard 768px
4. **Restructure mobile layout** to better accommodate smaller screens with improved spacing

## Scope

- **Component**: Footer (components/Footer.tsx)
- **Styles**: footer.css
- **Tests**: Footer.test.tsx
- **Specs**: site-chrome

## Rationale

- **Semantic**: Separator is a visual boundary of the bottom section, not a separate element
- **Consistency**: Align Footer's breakpoint with site design system standard (768px across all components)
- **Simplicity**: Cleaner DOM structure, easier maintenance
- **Responsive**: Better layout flow on mobile devices at standard breakpoint

## Risks

- Low: Pure structural refactor, no functional changes
- Tests may need updates to reflect DOM structure change
- Minimal visual impact if CSS transitions are properly tested

## Timeline

Estimated effort: ~30 minutes for implementation, testing, and spec update
