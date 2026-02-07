# Tasks: Update Footer Layout and Separator

## Implementation Tasks

### Phase 1: HTML Structure Update

- [x] **Remove `.Footer-separator` div from Footer.tsx**
  - Locate: `<div className="Footer-separator" aria-hidden="true" />`
  - Delete the entire separator div element
  - Validate: Component still renders without errors

- [x] **Run build to verify no structural errors**
  - Command: `pnpm build`
  - Expect: Build succeeds with no TypeScript errors

### Phase 2: CSS Layout Updates

- [x] **Move separator styling to `.Footer-bottom`**
  - Add `border-top: 1px solid rgba(255, 255, 255, 0.2);` to `.Footer-bottom`
  - Adjust padding on `.Footer-bottom` for visual balance (top padding reduced since border replaces div spacing)

- [x] **Update media query breakpoint from 900px to 768px**
  - Change: `@media (max-width: 900px)` → `@media (max-width: 767px)`
  - Keep all existing layout rules (flex-direction, alignment)

- [x] **Fine-tune mobile spacing for improved visual hierarchy**
  - Set logo -> legal gap to `--space-32`
  - Set legal -> separator gap to `--space-20`
  - Set separator -> copyright gap to `--space-12`
  - Set copyright -> social icons gap to `--space-20`

- [x] **Verify responsive scaling**
  - Test at 768px breakpoint
  - Verify logo scales correctly on mobile (clamp(64px, 25vw, 192px))
  - Confirm padding responds appropriately

### Phase 3: Testing

- [x] **Update Footer.test.tsx to reflect DOM changes**
  - Remove test assertions checking for `.Footer-separator` element
  - Add test assertions verifying `.Footer-bottom` has border-top

- [x] **Run unit tests**
  - Command: `pnpm test`
  - Expect: 39+ tests passing, Footer tests updated
  - Verify: No TypeScript warnings about removed element

- [x] **Manual visual testing**
  - Desktop (≥768px): Logo, legal links horizontal, copyright left-aligned, social right-aligned with border-top separator
  - Mobile (<768px): Logo centered, legal links centered, separator gap `--space-20`, copyright centered, social centered below
  - Breakpoint (768px): Smooth layout transition without jarring shifts

### Phase 4: Spec Updates

- [x] **Update site-chrome spec with modified footer requirements**
  - Modify: "Footer Component Structure" requirement
  - Detail: Separator is now `border-top: 1px solid rgba(255, 255, 255, 0.2)` on `.Footer-bottom`
  - Clarify: Mobile layout at <768px breakpoint
  - Add: Scenario for mobile layout flow

- [x] **Validate OpenSpec changes**
  - Command: `openspec validate update-footer-layout --strict`
  - Expect: All validation passes

### Phase 5: Final Verification

- [x] **Run full build**
  - Command: `pnpm build`
  - Expect: 8 static routes generated successfully

- [x] **Run all tests**
  - Command: `pnpm test`
  - Expect: All 39+ tests passing

- [x] **Commit changes**
  - Include: Footer.tsx, footer.css, Footer.test.tsx, spec.md updates
  - Message: "refactor: restructure footer layout with mobile-first responsive design"

## Validation Checklist

- [x] No functional changes to Footer props or behavior
- [x] Visual appearance maintained on desktop (≥768px)
- [x] Improved layout clarity on mobile (<768px)
- [x] Separator styling preserved (1px solid rgba)
- [x] All tests passing
- [x] Build successfully without errors
- [x] Spec requirements updated and validated
