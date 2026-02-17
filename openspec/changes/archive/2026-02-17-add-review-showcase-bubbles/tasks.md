## Tasks

### 1. Proposal

- [x] 1.1 Create `proposal.md` explaining why and what changes
- [x] 1.2 Create `tasks.md` and spec delta files

### 2. Implementation (status)

- [x] 2.1 Implement UI in `components/ReviewShowcase.tsx` to overlay top-three reviews (desktop anchors: top-left, middle-right, bottom-left; mobile bottom-row)
- [x] 2.2 Ensure remote author photos handled (fallback to initials if not available) — implemented in `components/Avatar.tsx`
- [x] 2.3 Add unit tests for rendering logic (top-3 selection, visual truncation via `.rs-text--clamp`, fallback avatar) — `__tests__/unit/components/ReviewShowcase.test.tsx`
- [x] 2.4 Add integration test for responsive layout and snapshot — `__tests__/integration/review-showcase.test.tsx`
- [x] 2.5 Visual polish: hover interaction + reduced-motion support added in CSS (`.rs-bubble` hover states)
- [x] 2.6 Desktop layout tweak: increased bubble max-width on `md` and up
- [x] 2.7 Color & typography polish: `author_name` color `#1D1E1F` (`.rs-author`), `review_text` color `#4E5969` (`.rs-text`)

### Mobile-first

- Implementation SHALL follow a mobile-first approach: base styles and layout MUST target the mobile/small viewport first, then progressively enhance for `md` and larger breakpoints. Ensure CSS, spacing, and avatar/bubble sizing behave correctly when media queries apply.

### 3. Validation & Release

- [x] 3.1 Run `openspec validate add-review-showcase-bubbles --strict` and fix issues (validated)
