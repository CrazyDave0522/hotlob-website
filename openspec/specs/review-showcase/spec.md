# review-showcase Specification

## Purpose
TBD - created by archiving change add-review-showcase-bubbles. Update Purpose after archive.
## Requirements
### Requirement: Review Showcase Bubbles

The frontend SHALL display up to three curated reviews in the `ReviewShowcase` component.

#### Scenario: Desktop render (md and up)

- **WHEN** the `ReviewShowcase` component is rendered on viewport width `>= md`
- **THEN** it SHALL overlay up to three review bubbles centered horizontally and evenly distributed vertically within the review area.
- **AND** each bubble SHALL contain a user avatar (author photo or initial) and a text bubble showing the `review_text`.
- **AND** bubble visuals SHALL match: `border-radius: 6px 6px 6px 6px`, `background: rgba(255,255,255,0.50)`, `box-shadow: 0 4px 4px 0 rgba(95,65,65,0.20)`, `backdrop-filter: blur(2px)`.

#### Scenario: Mobile render (sm and below)

- **WHEN** the `ReviewShowcase` component is rendered on viewport width `< md`
- **THEN** it SHALL overlay a vertical stack of up to three compact bubbles centered horizontally and evenly distributed vertically within the review area. On mobile the implementation currently renders two compact bubbles (top two reviews); avatars overlap the top-left/top-right corners of their respective bubbles for the two items.
 - **AND** each bubble SHALL render its avatar inside the bubble, anchored at the top-right corner.

#### Scenario: Data source and ordering

- **WHEN** `fetchReviews()` returns a list of curated reviews
- **THEN** the component SHALL select the top reviews (server query orders by `rating` descending) and display up to three results.
- **AND** if fewer than three reviews are returned, the component SHALL display the available reviews.
- **AND** if fetching reviews fails or returns an empty list, the component SHALL render the background images only (graceful degrade).

#### Scenario: Visual truncation (CSS)

- **WHEN** `review_text` length exceeds the available display lines
- **THEN** the component SHALL visually truncate the text using CSS line-clamp:
  - mobile (default): 1 line (`.rs-text--clamp`)
  - desktop (md and up): 2 lines (`.rs-text--clamp`)
- **NOTE**: truncation is visual via CSS line-clamp; the implementation does not perform server-side hard truncation to a fixed character count.

#### Scenario: Bubble content

- **WHEN** reviews are displayed
- **THEN** each review bubble SHALL display the following content:
  - The reviewer's display name (`author_name`) rendered prominently. The `author_name` SHALL use the following typography: `font-style: normal; font-weight: 400; line-height: normal;`.
  - The numeric `rating` associated with the review (e.g., `4` or `4.5`) rendered adjacent to the name or in a consistent location inside the bubble. The component SHALL use the existing `Rating` component to render the rating visuals and numeric value.
  - The `review_text` (subject to the truncation rule defined above). The `review_text` SHALL use the following typography: `font-style: normal; font-weight: 400; line-height: normal;`.
  - The `author_name` color SHALL be `#1D1E1F` and the `review_text` color SHALL be `#4E5969`; implementations SHALL expose these via the `.rs-author` and `.rs-text` CSS classes.
  - The bubble header SHALL place the name and rating in a left-side column (top-to-bottom order) and the avatar on the right side of the same header row.

#### Scenario: Accessibility

- **WHEN** reviews are displayed
- **THEN** each avatar image SHALL include an `alt` attribute containing the `author_name`.
- **AND** review bubbles SHALL use semantic HTML (e.g., `<p>`) and readable contrast.

#### Scenario: Avatar placement and responsive anchors

- **WHEN** up to three reviews are displayed
- **THEN** each review bubble SHALL include the avatar inside the bubble header on the right side.
- **AND** the bubble container for each review SHALL be centered horizontally and evenly distributed vertically within the review area across responsive layouts.

#### Scenario: Interaction (hover & reduced-motion)

- **WHEN** a pointer-capable device hovers over a review bubble
- **THEN** the bubble SHALL animate with a subtle lift (translateY and gentle scale) and a softened, larger shadow.
- **AND** transitions and transforms SHALL respect `prefers-reduced-motion: reduce` (no motion when reduced-motion is requested).
