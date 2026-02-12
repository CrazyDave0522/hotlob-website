# Add News Carousel Component

## Summary

Implement a responsive news carousel component that displays news articles with horizontal scrolling functionality. The component features a left-right layout on desktop (image left, text right) and top-bottom layout on mobile (image top, text bottom), with carousel indicators and keyboard navigation on desktop. The carousel will be integrated into the home page as a new section under the "see our food" section.

## Motivation

The Hotlob website currently lacks an engaging way to showcase recent news and updates on the home page. A news carousel will:

- **Increase User Engagement**: Highlight important news and promotions prominently
- **Improve Content Discovery**: Make it easier for users to find and read recent updates
- **Enhance Visual Appeal**: Add dynamic content to the home page layout
- **Support Business Goals**: Better platform for sharing announcements and maintaining customer relationships

## Scope

This change will add:

1. **NewsCarousel Component**: A reusable carousel component that displays news articles
2. **Responsive Layouts**:
   - Desktop: Left-right layout (image left, text right)
   - Mobile: Top-bottom layout (image top, text bottom)
3. **Navigation Features**:
   - Desktop: Keyboard arrow keys for navigation + auto-advance
   - Mobile: Swipe gestures for navigation + auto-advance
   - Carousel indicators showing current position (only when multiple items)
   - Auto-advance every 3 seconds (pauses on interaction)
   - Looping navigation (wraps from last to first item)
   - Single item handling (no indicators when only 1 item)
4. **Styling & Interactions**:
   - Article cards: White background, 20px border-radius, subtle shadow
   - Section background: Linear gradient from #FBF3F3 to #FFF
   - Hover effects on titles (color change to #EA4148)
   - Carousel indicators (active/inactive states, positioned below carousel)
   - Responsive image sizing with separate formulas
   - Auto-advance visual feedback (pauses on hover/focus)
5. **Home Page Integration**: Add carousel section under "see our food" section

## Impact

- **User Experience**: More engaging home page with dynamic news content
- **Performance**: Client-side carousel with efficient data loading
- **Accessibility**: Keyboard navigation and screen reader support
- **Maintainability**: Reusable component for future news displays

## Dependencies

- Existing news data structure and fetching utilities (`lib/news.ts`)
- Supabase client configuration for data fetching
- Existing CSS architecture and design tokens
- Home page layout structure

## Why

The current home page focuses on food categories and static content but lacks dynamic news content that could keep users informed about Hotlob updates, promotions, and announcements. A news carousel provides:

- **Visual Hierarchy**: Important news gets prominent placement
- **Content Freshness**: Regular updates keep the page feeling current
- **User Retention**: Encourages users to explore more content
- **Business Value**: Better platform for sharing time-sensitive information

## What Changes

### Code Changes

#### New Files

- `components/NewsCarousel.tsx` - Main carousel component
- `components/NewsCarouselItem.tsx` - Individual carousel item component
- `components/CarouselIndicator.tsx` - Carousel indicator component

#### Modified Files

- `app/page.tsx` - Add news carousel section under "see our food"
- `styles/components/carousel.css` - Carousel-specific styles

#### Data Flow

- Component receives news data as props (no internal data fetching)
- Supports unlimited news items with auto-advance functionality
- Handles empty data gracefully (component doesn't render)

#### Responsive Behavior

- **Desktop (≥768px)**: Left-right layout with keyboard navigation
- **Mobile (<768px)**: Top-bottom layout with swipe gestures
- **Images**: Separate responsive formulas for desktop/mobile
- **Indicators**: Dynamic count based on actual data length

#### Interactions

- **Navigation**: Keyboard navigation (desktop) or swipe gestures (mobile)
- **Auto-Advance**: Automatic progression every 3 seconds, pauses on interaction
- **Indicators**: Visual feedback for current position
- **Hover Effects**: Title color changes on hover
- **Click Handling**: Navigate to news detail pages (opens in new tab)
- **Looping**: Continuous navigation that wraps around
