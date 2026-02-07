# Tasks: Refactor Styles to Mobile-First

## 1. Inventory and Planning

- [x] **List component styles with max-width media queries**
  - Inspect `styles/components/*.css`
  - Document each component using `@media (max-width: 767px)`
  - Current findings:
    - `styles/components/header.css` (max-width 767, min-width 768, 768-900 range)
    - `styles/components/footer.css` (max-width 767)
    - `styles/components/hero.css` (max-width 767)

- [x] **Confirm target breakpoint**
  - Use 768px as the standard min-width breakpoint

## 2. Refactor Component Styles

- [x] **Header styles**
  - Move mobile defaults into base rules
  - Move desktop-only rules into `@media (min-width: 768px)`

- [x] **Footer styles**
  - Move mobile defaults into base rules
  - Move desktop-only rules into `@media (min-width: 768px)`

- [x] **Hero styles**
  - Move mobile defaults into base rules
  - Move desktop-only rules into `@media (min-width: 768px)`

- [x] **Other component styles**
  - Apply same conversion for any remaining max-width queries

## 3. Spec Updates

- [x] **Update css-architecture spec**
  - Add mobile-first requirement for component styles
  - Document breakpoint standard (768px)

- [x] **Validate OpenSpec**
  - Command: `openspec validate refactor-mobile-first-styles --strict`

## 4. Verification

- [x] **Run build**
  - Command: `pnpm build`

- [x] **Run tests**
  - Command: `pnpm test`

- [ ] **Manual spot check**
  - Compare key pages at 375px, 768px, 1440px
  - Confirm no visual regressions for:
    - Header layout (logo, nav, hamburger, overlay)
    - Footer layout (logo, legal links, separator, copyright, social)
    - Hero layout (text padding, sizing, overlay)
