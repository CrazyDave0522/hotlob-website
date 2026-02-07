# Implementation Tasks: add-header-footer-components

## Task List

- [x] **Configure custom fonts site-wide**
   - Add @font-face declarations in `styles/base.css` for font files from `public/fonts`
   - Define `--font-family-primary` token in `styles/token.css` with custom font and fallback stack
   - Apply font-family to root HTML/body elements in `styles/base.css`
   - **Validation**: Custom fonts load correctly; inspect DevTools to verify font files are loaded
   - **Dependencies**: None
   - **Estimated effort**: 15 minutes

- [x] **Create Header component file and basic structure**
   - Create `components/Header.tsx` with TypeScript React component
   - Define three-section layout structure (left, center, right)
   - Export component for use in layout
   - **Validation**: Component file exists and can be imported without errors
   - **Dependencies**: None
   - **Estimated effort**: 10 minutes

- [x] **Create Header component styles**
   - Create `styles/components/header.css` with component-prefixed classes
   - Style the three-section horizontal layout using design tokens
   - Add responsive behavior for mobile/desktop viewports
   - Import in `styles/components/index.css`
   - **Validation**: Styles load and render correctly; no console errors
   - **Dependencies**: Task 2
   - **Estimated effort**: 20 minutes

- [x] **Implement Header logo section**
   - Add logo image component in left section using `public/images/logo/logo-lg.png` (8500×7000px, aspect ratio 1.21)
   - Link logo to homepage
   - Use Next.js Image component for optimized loading
   - **Validation**: Logo renders and links to home page
   - **Dependencies**: Task 2
   - **Estimated effort**: 10 minutes

- [x] **Implement Header navigation section**
   - Add navigation links in order: Home, See Our Food, Catering, Our Locations, Hotlob News
   - Use Next.js Link component for client-side navigation
   - Style links with design tokens: font-size `--font-size-h5`, gap between links `--space-80`, text color `--color-taupe`
   - Add active state styling: border-radius `--radius-10` and border-bottom `4px solid var(--color-primary)`
   - **Validation**: All navigation links render and navigate to correct routes
   - **Dependencies**: Task 2, 3
   - **Estimated effort**: 15 minutes

- [x] **Implement Header social icons and CTA section**
   - Add social media icon components using `public/images/icons/fb.svg` (links to https://www.facebook.com/hotlob/) and `public/images/icons/ins.svg` (links to https://www.instagram.com/hotlobaustralia/)
   - Add call-to-action button using existing Button component with text "Order Online" (link destination to be configured later)
   - Style CTA button with border-radius `--radius-20`, background `--color-primary`, and text color `--color-white`
   - Set the gap between the social icons and the CTA button to `--space-32`
   - Configure social links to open in new tabs (target="_blank" rel="noopener noreferrer")
   - **Validation**: Social icons and CTA button render and function correctly
   - **Dependencies**: Task 2, 3
   - **Estimated effort**: 15 minutes

- [x] **Create Footer component file and basic structure**
   - Create `components/Footer.tsx` with TypeScript React component
   - Define two-tier vertical layout structure (top section, bottom section)
   - Export component for use in layout
   - **Validation**: Component file exists and can be imported without errors
   - **Dependencies**: None (can be parallelized with Header tasks)
   - **Estimated effort**: 10 minutes

- [x] **Create Footer component styles**
   - Create `styles/components/footer.css` with component-prefixed classes
   - Style the two-tier layout using design tokens
   - Apply background color `--color-dark-brown` and text color `--color-white`
   - Add a separator line between top and bottom sections: `border-top: 1px solid rgba(255, 255, 255, 0.20)` with width 80%
   - Add responsive behavior for mobile/desktop viewports
   - Import in `styles/components/index.css`
   - **Validation**: Styles load and render correctly; no console errors
   - **Dependencies**: Task 7
   - **Estimated effort**: 20 minutes

- [x] **Implement Footer top section**
   - Add logo component on the left using `public/images/logo/logo-lg.png` (8500×7000px, aspect ratio 1.21)
   - Add legal link placeholders (Privacy Policy, Terms & Conditions, Contact Us) to the right (actual destinations to be configured later)
   - Style legal links with font-size `--font-size-body-xs` and gap between links `--space-64`
   - Use Next.js Link component for navigation
   - Style with design tokens for spacing and typography
   - **Validation**: Top section renders with logo and all legal link placeholders
   - **Dependencies**: Task 7, 8
   - **Estimated effort**: 15 minutes

- [x] **Implement Footer bottom section**
   - Add copyright notice with dynamic year (e.g., `© ${new Date().getFullYear()} Hotlob`)
   - Style copyright notice with font-size `--font-size-body-xs`
   - Align copyright notice to the left within the bottom section
   - Add social media icons on the right using `public/images/icons/fb.svg` (links to https://www.facebook.com/hotlob/) and `public/images/icons/ins.svg` (links to https://www.instagram.com/hotlobaustralia/)
   - Align social icons to the right within the bottom section
   - Configure social links to open in new tabs
   - **Validation**: Bottom section renders with copyright and social icons
   - **Dependencies**: Task 7, 8
   - **Estimated effort**: 10 minutes

- [x] **Integrate Header and Footer into root layout**
   - Update `app/layout.tsx` to import Header and Footer components
   - Place Header before {children} and Footer after {children}
   - Ensure proper HTML semantics (header, main, footer tags)
   - Make Header stick to the top of the page and Footer stick to the bottom
   - **Validation**: Navigate to multiple pages and verify Header/Footer appear consistently
   - **Dependencies**: Tasks 2-10 (all components must be complete)
   - **Estimated effort**: 10 minutes

- [x] **Write Header component unit tests**
   - Create `__tests__/unit/components/Header.test.tsx`
   - Test logo renders in left section
   - Test all navigation links render with correct hrefs
   - Test social icons and CTA button render
   - Test social icons have target="_blank" and rel="noopener noreferrer"
   - Skip CTA link behavior tests (deferred)
   - **Validation**: Run `pnpm test` and verify all Header tests pass
   - **Dependencies**: Tasks 2-6
   - **Estimated effort**: 20 minutes

- [x] **Write Footer component unit tests**
   - Create `__tests__/unit/components/Footer.test.tsx`
   - Test top section renders with logo and legal link placeholders
   - Test bottom section renders with copyright and social icons
   - Test copyright notice includes current year
   - Test social icons have target="_blank" and rel="noopener noreferrer"
   - **Validation**: Run `pnpm test` and verify all Footer tests pass
   - **Dependencies**: Tasks 7-10
   - **Estimated effort**: 20 minutes

- [x] **Final integration validation**
   - Run `pnpm test` to ensure all tests pass
   - Run `pnpm build` to ensure no build errors
   - Manually test navigation across all pages
   - Verify Header and Footer appear consistently on all routes
   - Test responsive behavior on mobile and desktop viewports
   - **Validation**: All automated tests pass, no build errors, manual testing confirms expected behavior
   - **Dependencies**: All previous tasks
   - **Estimated effort**: 15 minutes

## Notes

- Task 1 (custom fonts) should be completed first as it's foundational
- Tasks 2-6 (Header) and Tasks 7-10 (Footer) can be parallelized if desired
- Social media URLs:
  - Facebook: https://www.facebook.com/hotlob/
  - Instagram: https://www.instagram.com/hotlobaustralia/
- Navigation link styling: font-size `--font-size-h5`, gap `--space-80`
- Active navigation state (highlighting current page) is required
- Responsive behavior should prioritize mobile-first design principles
