# News System Implementation Tasks

## Phase 1: Data Layer & Types

- [x] Create TypeScript types for news data (`types/news.ts`)
- [x] Implement news data fetching utilities (`lib/news.ts`)
- [x] Add news-related database types to existing type definitions

## Phase 2: News List Component

- [x] Create `NewsItem.tsx` component with left-right layout:
  - Left side: Cover image with responsive sizing
  - Right side: Title, excerpt, author + publish date (same line)
- [x] Implement separate image sizing formulas:
  - Desktop (≥768px): max 280px×160px at 1920px, proportional scaling below
  - Mobile (<768px): max 200px×200px at 768px, proportional scaling below
- [x] Implement responsive gap spacing between news items:
  - Desktop (≥768px): max 60px at 1920px, proportional scaling below
  - Mobile (<768px): max 20px at 768px, proportional scaling below
- [x] Add mobile-specific wrapper styling:
  - Individual news items: border-radius 20px, white background, 20px box-shadow
  - List container: no wrapper styling
- [x] Add desktop-specific list wrapper styling:
  - List container: border-radius 6px, white background, 10px box-shadow
  - Individual news items: no wrapper styling
- [x] Add desktop item separator lines:
  - 1px solid line between each news item
  - Color: #E1E4E9
- [x] Create `NewsList.tsx` component with responsive layout (one item per row)
- [x] Add loading spinner states for news items (#EA4148 color)
- [x] Implement infinite loading pagination (10 items per page)
- [x] Implement click-to-navigate functionality (new tab)

## Phase 3: News Detail Page

- [x] Create dynamic route `/hotlob-news/[slug]/page.tsx`
- [x] Implement Editor.js content renderer component
- [x] Create `NewsDetail.tsx` component with full article layout:
  - Content order: title, publish date, separator line, cover image, news content
  - Separator line: 1px height, #E1E4E9 background
  - Wrapper styling: 6px border-radius, white background, 10px box-shadow
  - Cover image sizing: desktop max 900×420px at 1920px, mobile max 690×320px at 768px
- [x] Add SEO meta tags and structured data:
  - Open Graph tags for social sharing
  - Twitter Card tags
  - JSON-LD structured data for news articles
  - Dynamic title and description meta tags

## Phase 4: Page Integration

- [x] Update site navigation to include "Hotlob News" link
- [x] Update `/hotlob-news/page.tsx` to include NewsList component below the existing hero
- [x] Add responsive styling for news components
- [x] Implement error handling and 404 states

## Phase 5: Testing & Validation

- [x] Write unit tests for NewsList and NewsItem components
- [x] Write integration tests for news detail pages
- [x] Test Editor.js content rendering with various block types
- [x] Validate responsive design across breakpoints
- [x] Test external link behavior (new tab opening)

## Phase 6: Polish & Optimization

- [x] Add image optimization for news cover images
- [x] Implement proper loading states and error boundaries
- [x] Implement ISR (Incremental Static Regeneration) for news detail pages
- [x] Add Supabase query caching (5-minute duration)
- [x] Add accessibility features (ARIA labels, keyboard navigation, alt text for images)
- [x] Performance optimization and bundle analysis
- [x] Cross-browser testing and mobile device testing

## Dependencies

- **Blocks Phase 2** until Phase 1 data layer is complete
- **Blocks Phase 3** until Phase 2 components are functional
- **Blocks Phase 4** until Phase 3 routing is implemented
- **Parallelizable**: Phase 5 testing can run alongside development
- **Parallelizable**: Phase 6 optimization can start after Phase 4

## Validation Criteria

- [ ] News list displays correctly on mobile (1 column) and desktop (responsive)
- [ ] News detail pages render Editor.js content properly
- [ ] External links open in new tabs as specified
- [ ] All components have proper loading and error states
- [ ] SEO meta tags are dynamically generated
- [ ] All tests pass with >90% coverage
