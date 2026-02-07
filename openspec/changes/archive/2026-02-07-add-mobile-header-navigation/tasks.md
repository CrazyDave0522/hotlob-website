# Implementation Tasks: add-mobile-header-navigation

## Task List

- [x] **Add mobile state management to Header component**
   - Import React `useState` hook to manage menu open/close state
   - Add `isMenuOpen` state variable (boolean)
   - Create toggle handler function `toggleMenu()`
   - **Validation**: Component imports work, state is defined and toggleable
   - **Dependencies**: None (preparation for other tasks)
   - **Estimated effort**: 10 minutes

- [x] **Add hamburger menu icon from lucide-react**
   - Import Menu icon from lucide-react library
   - Icon should be visible only on mobile (< 768px)
   - Apply responsive sizing with maximum 50px (e.g., clamp(32px, 6.5vw, 50px))
   - Add click handler that calls `toggleMenu()`
   - **Validation**: Icon renders on mobile, size is responsive, click toggles state
   - **Dependencies**: Task 1
   - **Estimated effort**: 15 minutes

- [x] **Implement overlay background for mobile navigation**
   - Create overlay div that appears only when `isMenuOpen` is true
   - Apply styles: `fill: rgba(0, 0, 0, 0.90)`, full-screen, fixed positioning
   - Add click handler to close menu when clicking overlay
   - Ensure overlay is keyboard-dismissible (Escape key)
   - **Validation**: Overlay displays with correct color and opacity, click closes menu
   - **Dependencies**: Task 1
   - **Estimated effort**: 15 minutes

- [x] **Implement scroll lock when overlay is open**
   - When `isMenuOpen` is true, add `overflow: hidden` to `document.body`
   - When `isMenuOpen` is false, remove `overflow: hidden` from `document.body`
   - Use useEffect to manage body overflow state
   - **Validation**: Page scroll is disabled when menu open, enabled when menu closed
   - **Dependencies**: Task 1
   - **Estimated effort**: 10 minutes

- [x] **Create mobile navigation links layout**
   - Move navigation links into overlay when on mobile
   - Stack links vertically in overlay (display: flex, flex-direction: column)
   - Use `--font-size-h2` for mobile navigation text
   - Apply responsive gap between links (max `--space-96`, e.g., clamp(32px, 12.52vw, 96px))
   - Add click handler to close menu when any nav link is clicked
   - Style for mobile: full-width, large touch targets, centered in overlay
   - **Validation**: Navigation links display vertically in overlay, font size is correct, gap is responsive, links are clickable
   - **Dependencies**: Tasks 1, 3
   - **Estimated effort**: 20 minutes

- [x] **Update Header responsive CSS for mobile**
   - Add `@media (max-width: 768px)` breakpoint
   - Hide social icons and CTA button on mobile
   - Show hamburger icon on mobile
   - Apply responsive logo sizing (max 140px width, 116px height based on 1.21 aspect ratio)
   - Hide navigation links on desktop view inside header (show in overlay on mobile)
   - Apply responsive x-padding (max `--space-32`, e.g., clamp(16px, 4.17vw, 32px)), no y-padding
   - **Validation**: CSS media query applies correctly, elements show/hide as expected
   - **Dependencies**: Tasks 2, 3, 5
   - **Estimated effort**: 20 minutes

- [x] **Add accessibility features**
   - Add `role="button"` and `aria-label` to hamburger icon
   - Add `aria-expanded` attribute to hamburger icon (reflects menu state)
   - Add `aria-modal="true"` to overlay
   - Add `aria-label="Close menu"` to overlay or close button
   - Add focus management (focus trap or focus restoration)
   - **Validation**: Screen readers announce menu state, keyboard navigation works
   - **Dependencies**: All previous tasks
   - **Estimated effort**: 15 minutes

- [x] **Write mobile Header component tests**
   - Create new test file: `__tests__/unit/components/Header.mobile.test.tsx` or add to existing Header.test.tsx
   - Test hamburger icon renders on mobile viewport (< 768px)
   - Test hamburger icon does NOT render on desktop viewport (> 768px)
   - Test clicking hamburger toggles menu open/close state
   - Test overlay appears when menu is open
   - Test clicking overlay closes menu
   - Test navigation links appear in overlay on mobile
   - Test navigation links have correct font size (`--font-size-h2`)
   - Test clicking nav link closes menu
   - Test `aria-expanded` attribute updates
   - **Validation**: Run `pnpm test` and verify all mobile-specific tests pass
   - **Dependencies**: Tasks 1-7
   - **Estimated effort**: 30 minutes

- [x] **Test scroll lock behavior**
   - Manually test that page scroll is disabled when overlay is open
   - Test that page scroll is re-enabled when overlay is closed
   - Test on mobile device or mobile viewport in browser DevTools
   - **Validation**: Overflow behavior works correctly on real devices
   - **Dependencies**: Task 4
   - **Estimated effort**: 10 minutes

- [x] **Test responsiveness across breakpoints**
   - Test header layout at 375px (mobile)
   - Test header layout at 768px (tablet threshold)
   - Test header layout at 1024px (desktop)
   - Test header layout at 1920px (desktop large)
   - Verify no layout issues or overlapping elements
   - **Validation**: Header displays correctly at all breakpoints
   - **Dependencies**: All previous tasks
   - **Estimated effort**: 15 minutes

- [x] **Final integration validation**
   - Run `pnpm test` to ensure all tests pass
   - Run `pnpm build` to ensure no build errors
   - Manually test on mobile device or in mobile browser mode
   - Test navigation flow: open menu → click link → menu closes
   - Test menu escape key dismissal
   - Verify no TypeScript or ESLint errors
   - **Validation**: All automated tests pass, no build errors, manual testing confirms expected behavior
   - **Dependencies**: All previous tasks
   - **Estimated effort**: 15 minutes

## Notes

- Mobile-first approach: start with mobile styles, then enhance for desktop with CSS media queries
- Use existing design tokens for styling (font sizes, colors, spacing)
- Social icons and CTA button are completely hidden on mobile (not moved to overlay)
- Navigation only uses `--font-size-h2` on mobile; desktop still uses `--font-size-h5`
- The hamburger icon should animate but details (e.g., hamburger to X animation) can be enhancement if not specified
- Test viewport width is < 768px for mobile, >= 768px for desktop

