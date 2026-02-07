# Design: Update Footer Layout and Separator

## Overview

This change updates the Footer component structure and responsive behavior to improve visual hierarchy and mobile usability.

## Current State

**Desktop Layout** (≥901px):

- Logo and legal links aligned horizontally
- Separator div (80% width, centered)
- Copyright and social icons aligned left/right

**Mobile Layout** (<901px):

- Logo stacked above legal links
- Separator div (centered, 80% width)
- Copyright and social icons stacked left

**Separator Implementation**: Currently a separate div element positioned between top and bottom sections.

## Proposed Changes

### 1. Separator Line Migration

**From**: Separate `.Footer-separator` div element
**To**: `border-top` on `.Footer-bottom` container

**Rationale**:

- More semantic (separator is visually a boundary of the bottom section)
- Simpler DOM structure (one less element)
- Easier to maintain (border styling contained with its container)
- Maintains visual appearance: 1px solid rgba(255, 255, 255, 0.20)

### 2. Mobile Layout Restructuring

**Target Breakpoint**: <768px (aligned with site mobile breakpoint)

**Current 900px Breakpoint Issues**:

- Inconsistent with site standard (768px)
- Creates middle ground that doesn't align with design system
- Causes layout shift at unexpected viewport sizes

**New Mobile Layout** (logo → legal → separator → copyright → social):

```
[Logo image - centered]

[Privacy Policy] [Terms & Conditions] [Contact Us] - centered

[separator line - full width border-top]

[© 2026 Ocean Food Group...] - centered

[Facebook] [Instagram] - centered
```

**Layout Details**:

- Logo: Full width, centered, `clamp(64px, 25vw, 192px)` on mobile to reach 192px at 768px
- Legal links: Horizontal layout, centered, gap `--space-32` from logo
- Separator: Full width border-top on footer-bottom with gap `--space-20` from legal links
- Copyright: Centered below separator with gap `--space-12`
- Social icons: Centered below copyright with gap `--space-20`

### 3. CSS Architecture

**Token Updates**: None required - reuse existing spacing tokens

**Responsive Breakpoint**: Align with 768px site standard (from @media max-width 900px)

**DOM Structure Changes**:

- Remove `.Footer-separator` div element
- Add `border-top` to `.Footer-bottom`
- Adjust padding on `.Footer-bottom` for visual balance
- Update media query selector from 900px to 768px

### 4. Backward Compatibility

- No external API changes (Footer component props unchanged)
- Internal restructuring only (CSS + minimal HTML)
- Tests may need adjustment for missing separator div

## Implementation Sequence

1. Update Footer.tsx: Remove separator div
2. Update footer.css: Add border-top to .Footer-bottom, adjust layout
3. Update media query breakpoint to 768px
4. Update tests to verify new structure
5. Update spec to reflect changes

## Trade-offs

**Pros**:

- Cleaner DOM
- Consistent responsive breakpoint (768px)
- Simpler CSS selectors
- Better semantic markup

**Cons**:

- Requires removing an element (minor breaking change for tests)
- Breakpoint change may affect users viewing near 768-900px on tablets

**Risk**: Low - purely visual restructuring with no functional changes
