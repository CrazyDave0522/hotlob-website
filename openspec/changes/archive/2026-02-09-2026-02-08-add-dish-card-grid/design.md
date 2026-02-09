# Design: Dish Card Grid Component

## Overview

The DishCardGrid is a responsive grid component that displays food/dish items fetched from Supabase. The component:

1. Fetches dishes from `dish` table with related image and allergen data
2. Filters: Only shows dishes where `is_visible = true` AND `is_available = true`
3. Renders cards with dish images, names, allergen icons, tier badges, descriptions
4. Supports hover-triggered vertical expansion on desktop (≥ 768px) only; cards remain static on mobile (< 768px)
5. Manages state to show only one expanded card at a time (desktop only)

## Implementation Architecture

### Supabase Utility Structure

To enable reusable Supabase integration across the application, we maintain a centralized data access layer:

**File Structure:**

- `lib/supabase.ts` — Supabase client initialization
  - Initializes client with environment variables:
    - `NEXT_PUBLIC_SUPABASE_URL` (Project URL from Supabase dashboard)
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Publishable key from Supabase dashboard)
  - Validates environment variables at startup
  - Exported for use by all data service modules

- `lib/dishes.ts` — Dish-specific data fetching service
  - Imports client from `lib/supabase.ts`
  - Implements `fetchVisibleDishes()` and other dish queries
  - Exported for use by components

- Future data services: `lib/allergens.ts`, `lib/users.ts`, etc. follow the same pattern

**Rationale**: This approach follows Next.js conventions and keeps data-fetching logic centralized and reusable across the application. As the project grows, all data services remain grouped in `lib/`, making the codebase more maintainable.

## Data Architecture

### Data Model

```
Dish (main table)
├── id: uuid
├── name: string (displayed as card title)
├── description: string (displayed in card)
├── tier: 'premium' | 'standard' (displayed as tag with first letter capitalized: "Premium" or "Standard")
├── is_visible: boolean (filter: true only)
├── is_available: boolean (filter: true only)
└── Relations:
    ├── many-to-one: category
    ├── one-to-many: MediaAsset (images)
    └── one-to-many: DishAllergen (allergen tags)

MediaAsset
├── id: uuid
├── dish_id: uuid (foreign key to Dish)
├── image_url: string (displayed as card image)
├── position: number (1 = primary image)
└── caption: string

DishAllergen (join table)
├── id: uuid (primary key)
├── dish_id: uuid (foreign key to Dish, ON DELETE CASCADE)
├── tag_id: uuid (foreign key to AllergenTag, ON DELETE CASCADE)
├── created_at: timestamp (auto-generated)
├── updated_at: timestamp (auto-updated)
└── Unique constraint: (dish_id, tag_id) — prevents duplicate allergens per dish

AllergenTag
├── id: uuid
├── name: string (e.g., "Contains Shellfish")
├── icon_url: string (displayed as allergen icon)
└── description: string
```

### Data Flow

```
Page Component
  |
  v
[useEffect] fetchVisibleDishes() from Supabase
  |
  v
DishCardGrid (receives: dishes[] array)
  |
  +-- State: expandedIndex (null | number)
  |
  +-- Map dishes to DishCard components
       |
       v
     DishCard (receives: dish + allergens + image data)
       |
       +-- Display image from media_asset.image_url
       +-- Display title from dish.name
       +-- Display icons from allergen_tag.icon_url via dish_allergen
       +-- Display tag from dish.tier
       +-- Display description from dish.description
       +-- Display button "Order Now"
       |
       +-- Hover handler: update expandedIndex state
```

## Architecture

### Component Hierarchy

```
DishCardGrid (container)
├── Fetches data from Supabase (useEffect)
├── Filters: is_visible=true AND is_available=true
├── Applies limit prop (if provided)
├── DishCard (individual card)
│   ├── Image
│   ├── Title (h3)
│   ├── Icons Row (allergen icons)
│   ├── Tag (tier label)
│   ├── Description (p)
│   └── Button
├── DishCard
└── DishCard
```

### Component Responsibilities

**DishCardGrid**:

- Accepts `limit?: number` prop to control displayed dishes (undefined = all, 4 = one desktop row, etc.)
- Fetches and manages dish data from Supabase using `useEffect` hook
- Filters dishes: `is_visible=true` AND `is_available=true`
- Slices fetched dishes array to respect limit (if provided)
- Manages grid layout (flex, responsive columns 4 desktop / 2 mobile)
- Tracks which card is expanded (React state)
- Passes expanded state and callbacks to DishCard children
- Handles responsive breakpoints and reflow

**DishCard**:

- Receives structured dish object with nested relations (from DishCardGrid)
- Renders single card with all content
- Receives expanded state from parent
- Applies conditional CSS classes based on expanded state
- Handles hover events (onMouseEnter, onMouseLeave)
- Renders image from media_asset.image_url
- Renders allergen icons in single row

## Expansion Animation Design

### The Challenge

The white card background must expand vertically while anchoring the bottom edge and keeping content fixed:

- Unhovered: white background aspect-ratio 332/480 (SHORTER than total content height)
  - Top ~half of image extends ABOVE white background (visible but uncovered)
  - Background starts partway down the image
- Hovered: white background aspect-ratio 332/590 (TALL enough to cover all content)
  - Background grows upward to fully embrace the entire image
  - Content positions never change - only background coverage expands
- ~110px vertical growth proportional to ~332px card width (scaling guide, not fixed)
- Bottom edge stays at same position
- Top edge moves up proportionally

### Solution: Independent background layer with aspect-ratio

Implementation approach:

1. **Content container**: Fixed positioning, holds all card elements (image, title, etc.)
2. **Background layer**: Separate element (::before pseudo-element or div) with white background, border-radius, shadow
3. **Background sizing**: Use aspect-ratio property for responsive sizing
   - `aspect-ratio: 332 / 480` (unhovered, partial coverage)
   - `aspect-ratio: 332 / 590` (hovered, full coverage)
4. **Image movement**: On hover, image moves downward by 6px (creates dynamic parallax effect with the expanding background)
5. **Positioning**: Background anchored to bottom, expands upward behind fixed content; image translates down 6px

When expanded:

- Background layer aspect-ratio changes from 332/480 to 332/590
- Background grows upward to cover previously exposed image top
- Image moves downward by 6px (creates dynamic parallax effect)
- Content elements (except image) maintain fixed positions and never move during background expansion
- Bottom edge of background stays fixed
- Visual effect: card "embraces" the content on hover while image slides down

### Non-hovered Cards Shrink

The parent grid uses `display: flex` with `flex: 1` on each card:

- Cards share available width equally (4 columns desktop, 2 mobile)
- When one card expands in height via aspect-ratio change, siblings adjust their flex-basis
- Siblings may shrink in width or adjust gap, but the overall layout remains balanced

**Recommended**: Use `aspect-ratio` property (cleaner, responsive, no JS needed for animation).

## Layout Strategy

### Desktop (4 Columns)

```
[Card 1]         [Card 2]         [Card 3]         [Card 4]
BG: 332/480      BG: 332/480      BG: 332/480      BG: 332/480
(image top       (image top       (image top       (image top
 extends above)   extends above)   extends above)   extends above)

[Card 1 Exp]     [Card 2]         [Card 3]         [Card 4]
BG: 332/590      BG: 332/480      BG: 332/480      BG: 332/480
(bg covers       (image top       (image top       (image top
 full image)      extends above)   extends above)   extends above)
```

### Mobile (2 Columns)

```
[Card 1]         [Card 2]
BG: 332/480      BG: 332/480
(image extends)  (image extends)
```

### Notes

- White background uses aspect-ratio for responsive sizing (NOT fixed pixel heights)
- **Desktop (≥ 768px)**:
  - Content positions are fixed and never move during expansion (except image)
  - Image moves downward by 6px on hover (creates dynamic effect)
  - Unhovered: background is intentionally shorter than content (image extends above) - aspect-ratio 332/480
  - Hovered: background expands upward to fully cover all content - aspect-ratio 332/590
  - A 332px × 480px → 590px background expansion is proportional (~110px for this width)
  - Expansion always anchors at bottom, grows upward
  - Visual effect: background "embraces" content while image slides down
- **Mobile (< 768px)**:
  - Cards remain static with no expansion
  - Background stays shorter than content; image top remains exposed
  - Background never fully covers the image
  - No hover state or aspect-ratio transitions
- On different viewport widths, backgrounds scale proportionally maintaining aspect-ratio

### CSS Grid Structure (Mobile-First)

````css
/* Mobile-first: 2 columns (responsive gaps scale up to desktop max values) */
.DishCardGrid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-24); /* vertical gap - responsive, scales between viewports */
  row-gap: var(--space-24);
  column-gap: clamp(16px, 0.833vw, var(--space-24)); /* responsive horizontal gap (16px at 768px, 24px at 1920px) */

  width: 100%;
}

.DishCard {
  flex: 0 0 calc(50% - var(--space-15)); /* 2 columns mobile */
  display: flex;
  flex-direction: column;
  aspect-ratio: 332 / 480; /* unhovered */

  background: var(--color-white);
  border-radius: var(--radius-20);
  box-shadow: var(--shadow-card);
}

.DishCard-image {
  width: 230px; /* max width */
  aspect-ratio: 1 / 1;
  transition: transform 0.3s ease-out; /* smooth 6px downward movement on hover */
}

/* Desktop: 4 columns */
@media (min-width: 768px) {
  .DishCard {
    flex: 0 0 calc(25% - var(--space-18)); /* 4 columns desktop */
    transition: aspect-ratio 0.3s ease-out;
  }

  .DishCard.expanded {
    aspect-ratio: 332 / 590; /* hovered/expanded */
  }

  .DishCard.expanded .DishCard-image {
    transform: translateY(6px); /* move image down 6px on hover */
  }
}

## State Management

### React State Hook

```typescript
const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

const handleCardHover = (index: number) => {
  setExpandedIndex(index);
};

const handleCardLeave = () => {
  setExpandedIndex(null);
};
````

**Benefits**:

- Single source of truth for expanded state
- Parent component controls logic
- Children are presentational
- No logic duplication

## Animation Details

### Expansion Animation

Property: `aspect-ratio` (cleaner than `height` for responsive cards)
Duration: 0.3s
Timing: ease-out (starts fast, ends slow, natural feel)
Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (slightly snappy)

```css
.DishCard {
  transition: aspect-ratio 0.3s ease-out;
}
```

### Fade-in for Hidden Content (Optional)

Content that appears only in expanded state (extra description lines, etc.):

```css
.DishCard-expandedContent {
  opacity: 0;
  transition: opacity 0.3s ease-out 0.15s; /* delay to let expansion finish first */
}

.DishCard.expanded .DishCard-expandedContent {
  opacity: 1;
}
```

## Responsive Design Rationale

### Why Flex Over CSS Grid

- Easier to manage 4/2 column layouts
- Simpler calc for responsive card widths
- Flex `gap` property handles spacing elegantly
- Shrinking behavior is more natural with flex

### Why aspect-ratio Over Fixed Heights

- Maintains proportions across viewport sizes
- Cards scale responsively
- Easier to adjust overall size with single token
- Works with dynamic content (text reflow)

### Breakpoint: 768px (Tailwind Standard)

Consistent with project's existing breakpoint:

- Mobile: 2 columns
- Desktop: 4 columns
- Aligns with Hero component breakpoint

## Design Tokens Needed

### Existing Tokens to Use

- `--color-black` (#1D1E1F) - title color
- `--color-gray` (#4e5969) - description text color
- `--color-primary` (#EA4148) - used in gradients
- `--color-white` (#FFF) - card background
- `--space-16` (16px) - icon gap spacing
- `--space-20` (20px) - responsive padding/gaps
- `--space-24` (24px) - responsive padding/gaps
- `--radius-20` (20px) - card border-radius
- `--radius-30` (30px) - button border-radius (for 30px 30px 0 30px corners)
- `--shadow-card` - card box shadow
- `--gradient-button-default` - button default gradient
- `--gradient-button-hover` - button hover/clicked gradient

### New Tokens Added to token.css

**Shadow Tokens:**

- `--shadow-card`: `0 0 20px 0 rgba(0, 0, 0, 0.12)` (card shadow, reusable for other components)
- `--shadow-button`: `3px 3px 0 0 rgba(175, 23, 23, 0.16)` (button shadow)

**Gradient Tokens:**

- `--gradient-button-default`: `linear-gradient(90deg, #ea4148 0%, #ffa159 100%)` (button default state)
- `--gradient-button-hover`: `linear-gradient(180deg, #fb8225 0%, #d51d24 100%)` (button hover/clicked state)

**Note on Responsive Gaps:**
Horizontal and vertical gaps between grid cards are responsive and scale between 768px (mobile) and 1920px (desktop) viewports. These use `clamp()` CSS functions rather than fixed token values to achieve smooth responsive scaling between max values (16px mobile → 24px desktop).

## Accessibility Considerations

### Screen Readers

- Use semantic HTML (section, h3, p, button)
- ARIA labels on buttons ("Order Now for [dish name]")
- Icon descriptions (TBD with icon details)
