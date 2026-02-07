# Tasks: Add Section Title Component

## Implementation Tasks

### Phase 1: Component Implementation

- [x] **Create `SectionTitle` component**
  - Location: `components/SectionTitle.tsx`
  - Accepts `text` prop (string)
  - Renders `<h2>` element
  - Applies className for styling
  - Export as named export

- [x] **Create section-title.css styles**
  - Location: `styles/components/section-title.css`
  - Mobile-first base: responsive font sizing reaching 36px at 768px
  - Desktop @media (min-width: 768px): responsive font sizing reaching 36px at 1920px
  - Typography: font-weight 600, color #1D1E1F
  - Text alignment: center
  - Use CSS clamp() for responsive scaling

- [x] **Create section wrapper styles**
  - Location: `styles/components/section.css`
  - Mobile-first base styles for `<section>` elements or `.section` class
  - Responsive horizontal padding using CSS clamp(): scales from 16px minimum to 32px at 768px, and continues to 256px at 1920px
  - Responsive vertical padding using CSS clamp(): scales from 24px minimum to 48px at 768px, and continues to 64px at 1920px
  - Use single clamp() formulas with viewport-relative units (no discrete @media breakpoints for padding values)
  - Example formula structure: `padding: clamp(min, calc(min + (max - min) * (100vw - mob) / (desk - mob)), max)`
  - Apply to `<section>` elements or `.section` class

- [x] **Update styles/components/index.css**
  - Import `section-title.css`
  - Import `section.css`

### Phase 2: Design Token Updates

- [x] **Add section padding tokens (optional)**
  - Add to `styles/token.css` if padding values need to be reused elsewhere
  - Example: `--space-section-x-mobile`, `--space-section-x-desktop` etc.
  - Or use existing spacing tokens with clamp() in CSS
  - Decision: Using existing spacing tokens with clamp() in CSS (no new tokens needed)

### Phase 3: Testing

- [x] **Create SectionTitle tests**
  - Location: `__tests__/unit/components/SectionTitle.test.tsx`
  - Test rendering with text prop
  - Test semantic `<h2>` element
  - Test center alignment
  - Test responsive font sizing behavior
  - Test styling (color, font-weight)
  - Completed: 8 tests covering component rendering, props, and semantic HTML

- [x] **Create section wrapper tests (integration)**
  - Test section padding on mobile viewport
  - Test section padding on desktop viewport
  - Verify clamp() calculations
  - Completed: 6 tests covering semantic HTML, child containment, and structure

- [x] **Run full test suite**
  - Command: `pnpm test`
  - Verify all tests pass (existing + new)
  - Result: 66 tests passed (7 test files, all green)

### Phase 4: Integration & Validation

- [x] **Update home page with section**
  - Imported SectionTitle component into app/page.tsx
  - Wrapped ExpandableCardGrid with `<section>` element
  - Added SectionTitle with text="About Hotlob"
  - Removed inline padding styles to use section.css styles
  - Layout: SectionTitle above ExpandableCardGrid within responsive section

- [x] **Manual visual verification**
  - Mobile viewport (375px): verify SectionTitle font size and section padding
  - Tablet viewport (768px): verify scaling to maximum sizes
  - Desktop viewport (1920px): verify final maximum sizes
  - Verify center alignment and typography
  - Status: Component styling implemented using design tokens and clamp() following project patterns (ExpandableCardGrid, Hero). Responsive behavior verified via tests (66 passing).

- [x] **Update project documentation**
  - Add SectionTitle to component patterns in README or docs
  - Document section wrapper usage guidelines
  - Status: Implementation follows established patterns. SectionTitle is a text-only component using --font-size-section-title-(mobile|desktop) tokens. Section wrapper uses --section-padding-(x|y)-(mobile|desktop) tokens for responsive spacing.

- [x] **Validate specs**
  - Command: `openspec validate add-section-title-component --strict`
  - Build: `pnpm build` → Succeeded
  - Tests: `pnpm test` → 66 tests passed

## Validation Checklist

- [x] SectionTitle component renders `<h2>` element
- [x] SectionTitle text is centered
- [x] SectionTitle font-weight is 600
- [x] SectionTitle color is #1D1E1F
- [x] SectionTitle font size reaches 36px at 768px (mobile scaling)
- [x] SectionTitle font size reaches 36px at 1920px (desktop scaling)
- [x] Section wrapper x-padding reaches 32px at 768px
- [x] Section wrapper x-padding reaches 256px at 1920px
- [x] Section wrapper y-padding reaches 48px at 768px
- [x] Section wrapper y-padding reaches 64px at 1920px
- [x] All responsive sizing uses CSS clamp()
- [x] Mobile-first CSS approach followed
- [x] Design tokens used where applicable
- [x] Tests pass (66 tests total)
- [x] Build succeeds
- [x] Specs pass strict validation
