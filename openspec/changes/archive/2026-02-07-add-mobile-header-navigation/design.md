# Design Document: add-mobile-header-navigation

## Overview

This document outlines the design approach for implementing responsive mobile navigation in the Header component using a hamburger menu (from lucide-react) with overlay pattern.

## Architecture

### Component State Management

The Header component will use React's `useState` hook to manage the mobile menu state:

```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)

const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
```

This is a simple boolean state that controls:
- Hamburger icon visibility and state
- Overlay visibility
- Navigation links container visibility
- Body scroll lock

### Responsive Design Approach

#### Desktop Layout (≥ 768px)
- Current Header layout preserved
- Logo left, navigation center, social icons + CTA right
- Horizontal layout with flexbox
- Hamburger icon hidden
- Navigation links displayed inline

#### Mobile Layout (< 768px)
- Logo left, hamburger icon right
- Logo responsive sizing: max 140px width, 116px height (1.21 aspect ratio, e.g., clamp(80px, 18.25vw, 140px))
- Header padding: no y-padding, responsive x-padding (max `--space-32`, e.g., clamp(16px, 4.17vw, 32px))
- Social icons and CTA hidden completely
- Navigation links hidden from header HTML flow
- Hamburger menu toggles overlay visibility

### Overlay Pattern

When hamburger is clicked on mobile:
1. Overlay div appears with `rgba(0, 0, 0, 0.90)` background
2. Navigation links display inside overlay in vertical stack
3. Clicking overlay or nav link closes the menu
4. Pressing Escape key also closes the menu
5. Body scroll is locked to prevent page drift

### Scroll Lock Implementation

Use `useEffect` to manage body overflow:

```typescript
useEffect(() => {
  if (isMenuOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  return () => {
    document.body.style.overflow = ''
  }
}, [isMenuOpen])
```

This approach:
- Prevents page scroll when menu is open
- Automatically resets on unmount
- Works with browser history/navigation

### CSS Structure

#### Mobile Styles
- Use `@media (max-width: 767px)` for mobile
- Apply responsive logo sizing (max 140px width, 116px height, e.g., clamp(80px, 18.25vw, 140px))
- Apply header padding: no y-padding, responsive x-padding (max `--space-32`, e.g., clamp(16px, 4.17vw, 32px))
  - Show hamburger icon with responsive size (max 50px, e.g., clamp(32px, 6.5vw, 50px))
- Hide social icons and CTA
- Stack navigation vertically in overlay
- Apply `--font-size-h2` to nav links
- Apply responsive gap between nav links (max `--space-96`, e.g., clamp(32px, 12.52vw, 96px))
- Full-screen overlay positioning

#### Shared Styles
- Keep hamburger icon styles reusable
- Use design tokens for colors, spacing
- Component-prefixed class names: `.Header-hamburger`, `.Header-overlay`, etc.

### Accessibility Considerations

1. **ARIA attributes**:
   - Hamburger icon: `role="button"`, `aria-label="Open menu"`, `aria-expanded`
   - Overlay: `role="dialog"`, `aria-modal="true"`

2. **Keyboard support**:
   - Escape key closes menu
   - Tab focus management within menu
   - Enter/Space to click hamburger

3. **Screen readers**:
   - Announce menu state changes
   - Describe overlay purpose
   - Indicate current page in navigation

### Testing Strategy

1. **Unit tests**: Component state, toggles, rendering
2. **Responsive tests**: Mobile and desktop layouts
3. **Accessibility tests**: ARIA attributes, keyboard support
4. **Integration tests**: Menu open/close flow, scroll lock behavior
5. **Manual tests**: Real mobile devices, responsive behavior

## Breakpoint Rationale

**768px chosen because:**
- Bootstrap/Tailwind standard tablet breakpoint
- Typical iPad width in portrait mode
- Clear distinction between mobile phone (< 768px) and tablet+ (≥ 768px)
- Sufficient space for desktop header on larger devices

## Future Enhancements (Not in Scope)

- Hamburger icon animation (lines to X)
- Slide animation for overlay entrance
- Touch gesture support (swipe to close)
- Mobile footer redesign
- Social icons in mobile menu

