# Tasks: Add Expandable Card Grid component

## Implementation Tasks

### Phase 1: Component and Styles

- [x] **Create `ExpandableCardGrid` component**
  - Accept an array of three items with `title` and `description`
  - Render semantic markup with left-aligned text
  - Support card background images from `public/images/expandable-card-grid` with default, active, and active-mobile variants
  - Desktop: use `cardx.png` when unhovered and `cardx-active.png` when hovered
  - Mobile: use `cardx-active-mb.png`
  - Inactive cards show title only; active cards show title and description
  - Apply card padding of `--space-32` on desktop and `--space-20` on mobile
  - Set title/description gap to `--space-20`
  - Active card text color is white; inactive card text color is `--color-charcoal`
  - Title font size is `--font-size-h3`; description font size is `--font-size-h6`

- [x] **Implement mobile-first styles**
  - Mobile: three cards stacked, full width of wrapper
  - Mobile: cards render in expanded (active) state by default
  - Desktop (>= 768px): three cards in one row
  - Desktop: first card is expanded by default
  - Hover expansion on desktop using CSS-only behavior with smooth transitions
  - Horizontal expansion animation reflects width change between default and active backgrounds
  - Description uses fade-in effect when card is hovered

- [x] **Standardize stylesheet naming**
  - Use `styles/components/expandable-card-grid.css`
  - Ensure component styles are imported in `styles/components/index.css`

### Phase 2: Page Integration

- [x] **Add Home page instance**
  - Place the component under the Hero section
  - Provide the three items (title + description) for the Home page content
  - Card 1 title: Our Story
  - Card 1 description: Born from our original restaurant, The Lobster Pier (est. 2018 in WA), we wanted everyone to enjoy Aussie lobster without the fine-dining price tag.
  - Card 2 title: A quick bite that feels like a treat
  - Card 2 description: Hotlob takes the premium lobster roll experience and makes it fun, fast, and affordable. Now, our takeaway rolls bring big flavour in a small brioche — the perfect grab-and-go roll that fits any craving or budget.
  - Card 3 title: 🦞 The Hotlob Hits
  - Card 3 description: ✨ Truffle & Cheese Lobster Roll
    ✨ Lemon & Dill Lobster Roll
    ✨ Soft Shell Crab Roll

### Phase 3: Validation

- [x] **Add or update tests**
  - Verify the component renders three cards with titles and descriptions
  - Update snapshots if required

- [x] **Manual visual check**
  - Mobile (375px): cards stack vertically and fill wrapper width ✓
  - Desktop (>= 1024px): cards sit in one row, hover expands only the active card ✓

- [x] **Run tests**
  - Command: `pnpm test`
  - Result: 52 tests passed

## Validation Checklist

- [x] Component renders three cards with left-aligned text
- [x] Cards use backgrounds from `public/images/expandable-card-grid` with default, active, and active-mobile variants
- [x] Desktop uses `cardx.png` when unhovered and `cardx-active.png` when hovered
- [x] Mobile uses `cardx-active-mb.png`
- [x] Inactive cards show title only; active cards show title and description
- [x] Desktop hover expands only the active card
- [x] Hover expansion uses smooth transitions
- [x] Hover expansion includes horizontal width animation
- [x] Description uses fade-in effect on hover
- [x] Desktop default state expands the first card
- [x] Mobile layout uses expanded (active) cards by default
- [x] Mobile layout stacks cards in three rows
- [x] Card padding is `--space-32` on desktop and `--space-20` on mobile
- [x] Title/description gap is `--space-20`
- [x] Active card text color is white; inactive card text color is `--color-charcoal`
- [x] Title font size is `--font-size-h3`; description font size is `--font-size-h6`
- [x] Tests pass (52 tests, all green)
