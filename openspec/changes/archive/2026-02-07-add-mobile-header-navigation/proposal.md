# Proposal: add-mobile-header-navigation

## Summary

Add responsive mobile navigation for the Header component with hamburger menu and overlay navigation pattern. On mobile viewports (< 768px), the header displays only the logo and a hamburger icon. Clicking the icon reveals a full-screen overlay with vertically stacked navigation links.

## Why

Currently, the Header component is designed for desktop viewports with a horizontal layout displaying the logo, navigation links, social icons, and CTA button. On smaller mobile screens, this layout is cramped and not touch-friendly. A hamburger menu pattern with overlay navigation is standard UX for mobile-first responsive design, providing:

- Better use of limited screen space on mobile
- Easier touch targets for mobile users
- Standard navigation pattern familiar to users
- Cleaner mobile interface focusing on content

## What Changes

### Modified Capabilities

- **site-chrome** — Header component gains responsive mobile layout with hamburger menu and overlay navigation

### Design Decisions

- **Mobile breakpoint**: 768px (handles tablets and phones)
- **Logo size**: Responsive with maximum 140px width, 116px height (maintains 1.21 aspect ratio, e.g., clamp(80px, 18.25vw, 140px) width)
- **Hamburger icon**: From lucide-react icon library, replaces social icons and CTA on mobile
- **Icon size**: Responsive with maximum 50px (e.g., clamp(32px, 6.5vw, 50px))
- **Header padding**: No y-padding on mobile (same as desktop), responsive x-padding with maximum `--space-32` (e.g., clamp(16px, 4.17vw, 32px))
- **Overlay style**: Full-screen with rgba(0, 0, 0, 0.90) background
- **Navigation typography**: Uses `--font-size-h2` for mobile navigation (larger, more touch-friendly)
- **Navigation spacing**: Responsive gap between links with maximum `--space-96` (e.g., clamp(32px, 12.52vw, 96px))
- **Scroll behavior**: When overlay is open, body scroll is disabled to prevent page drift
- **No footer changes**: Footer remains the same across all viewports

## Impact Assessment

### Breaking Changes

None. Mobile navigation is purely additive and progressive enhancement.

### Dependencies

- Existing `site-chrome` capability (Header component)
- CSS architecture for component-prefixed styling
- React's state management for menu open/close handling

### Migration

No migration needed. Existing desktop behavior is unchanged; mobile behavior is new.

## Alternatives Considered

1. **Slide-in side drawer**: Rejected because full-screen overlay is more immersive and works better on mobile.
2. **Split navigation** (main nav and mobile nav): Rejected because hamburger menu pattern is well-established.
3. **Collapse nav to dropdown**: Rejected because overlay pattern provides better UX on small screens.

## Timeline

Estimated implementation: 2-3 hours

- Mobile component structure and state: 30 minutes
- Hamburger menu toggle: 15 minutes
- Overlay styling: 30 minutes
- Mobile header CSS (responsive breakpoint): 20 minutes
- scroll lock implementation: 15 minutes
- Mobile header tests: 30 minutes
- Navigation link click behavior: 15 minutes
