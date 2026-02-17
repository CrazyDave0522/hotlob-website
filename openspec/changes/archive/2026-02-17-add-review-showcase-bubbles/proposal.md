# Change: Add review showcase bubbles

## Why

The `ReviewShowcase` component overlays curated customer reviews on a decorative background to increase social proof on the homepage. This change documents and standardizes that UI capability (mobile-first layout, accessibility, tests).

## What Changes

- Add a UI capability to overlay up to three curated reviews on the `ReviewShowcase` backgrounds; mobile shows the top two in a compact bottom row.
- Fetch reviews from `fetchReviews()` (language = `en`, rating >= 4); server-side code selects the top reviews by descending rating.
- Implement responsive, mobile-first layouts:
  - Mobile: bottom row of up to two compact bubbles (avatars overlap the top-left / top-right of each bubble).
  - Desktop (md and up): up to three anchored bubbles positioned top-left, middle-right, and bottom-left.
- Visual and interaction details:
  - Bubble visuals: `border-radius: 6px`, `background: rgba(255,255,255,0.50)`, `box-shadow: 0 4px 4px rgba(95,65,65,0.20)`, `backdrop-filter: blur(2px)`.
  - Colors: author name color `#1D1E1F` applied to `.rs-author`; review text color `#4E5969` applied to `.rs-text`.
  - Text truncation is implemented visually via CSS line-clamp (`.rs-text--clamp`): mobile = 1 line, desktop = 2 lines (no server-side hard truncate to N chars).
  - Hover/interaction: subtle elevation + softened shadow on hover for pointer-capable devices; transitions respect `prefers-reduced-motion`. CSS variables added for fine-tuning hover intensity.
- Accessibility: avatars include `alt`, semantic markup used for bubble content, initials fallback used when photo missing.
- Tests: unit tests for selection/truncation/avatar fallback and an integration snapshot for the mobile layout exist.

## Impact

- Affected code:
  - `components/ReviewShowcase.tsx` (layout & server fetch)
  - `components/Bubble.tsx`, `components/Avatar.tsx` (rendering + fallback)
  - `styles/components/review-showcase.css` (visual + interaction)
  - `lib/reviews.ts` (read-only data query)
  - Tests: `__tests__/unit/components/ReviewShowcase.test.tsx`, `__tests__/integration/review-showcase.test.tsx`
- Affected specs: `openspec/changes/add-review-showcase-bubbles/specs/review-showcase/spec.md` (delta updated to match implementation)
- Breaking changes: none.

## Current status

- Implementation: complete and merged in working branch.
- Tests: unit + integration snapshot added and present in the test suite.
- Remaining: openspec validation + PR review/archival (follow standard release workflow).
