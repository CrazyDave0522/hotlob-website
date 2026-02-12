# News Carousel Component Design

## Overview

The NewsCarousel component is a responsive carousel that displays news articles with horizontal navigation and auto-advance functionality. It follows mobile-first design principles and provides different interaction patterns for desktop and mobile devices.

## Architecture

### Component Structure

```
NewsCarousel
├── NewsCarouselItem (unlimited)
│   ├── Image (responsive sizing)
│   ├── Content
│   │   ├── Title (font-weight: 600, hover: #EA4148)
│   │   └── Excerpt (font-weight: 400, #86909C)
│   └── Click Handler (navigate to news detail)
├── CarouselIndicators (below carousel)
│   └── Indicator[] (dynamic count, responsive sizing)
└── Auto-Advance Timer (3s intervals, pauses on interaction)
```

### Data Flow

- **Input**: Array of news items (unlimited) passed as props
- **State**: Current carousel index, navigation state, auto-play state
- **Output**: Click events navigate to news detail pages
- **Auto-Advance**: Cycles through items every 3 seconds (pauses on interaction)
- **Empty State**: Component doesn't render if no data provided

## Responsive Design

### Breakpoints & Layouts

- **Mobile (<768px)**: Top-bottom layout
  - Image: top, full width
  - Text: bottom, stacked below image
  - Navigation: swipe gestures + keyboard + auto-advance
  - Indicators: positioned below carousel, visible with multiple items

- **Desktop (≥768px)**: Left-right layout
  - Image: left side
  - Text: right side, vertically centered
  - Navigation: indicators + keyboard navigation + auto-advance
  - Indicators: positioned below carousel, always visible with multiple items

### Image Sizing Formulas

**Desktop Formula (≥768px)**:

```
Max dimensions: 600×340px at 1920px viewport
Scaling: proportional reduction below 1920px
Example: At 960px (half of 1920px), dimensions = 300×170px (half of 600×340px)
Formula: width = min(600, 600 * (viewport / 1920))
        height = min(340, 340 * (viewport / 1920))
```

**Mobile Formula (<768px)**:

```
Max dimensions: 690×340px at 768px viewport
Scaling: proportional reduction below 768px (maintains aspect ratio)
Example: At 384px (half of 768px), dimensions = 345×170px (half of 690×340px)
Formula: width = min(690, 690 * (viewport / 768))
        height = min(340, 340 * (viewport / 768))
```

## Typography

### Title Font Sizes

**Desktop (≥768px)**:

```
Max font size: 24px at 1920px viewport
Scaling: proportional reduction below 1920px
Example: At 960px (half of 1920px), font-size = 12px (half of 24px)
Formula: font-size = min(24, 24 * (viewport / 1920))px
```

**Mobile (<768px)**:

```
Max font size: 36px at 768px viewport
Scaling: proportional reduction below 768px
Example: At 384px (half of 768px), font-size = 18px (half of 36px)
Formula: font-size = min(36, 36 * (viewport / 768))px
```

### Excerpt Font Sizes

**Desktop (≥768px)**:

```
Max font size: 18px at 768px viewport
Scaling: proportional reduction below 768px
Example: At 384px (half of 768px), font-size = 9px (half of 18px)
Formula: font-size = min(18, 18 * (viewport / 768))px
```

**Mobile (<768px)**:

```
Max font size: 30px at 768px viewport
Scaling: proportional reduction below 768px
Example: At 384px (half of 768px), font-size = 15px (half of 30px)
Formula: font-size = min(30, 30 * (viewport / 768))px
```

## Interaction Patterns

### Navigation

- **Desktop**: Keyboard arrow keys + indicator clicks + auto-advance (3s intervals)
- **Mobile**: Swipe left/right gestures + keyboard arrow keys + auto-advance (3s intervals)
- **Indicators**: Click any indicator to jump to that item (positioned below carousel, only shown with multiple items)
- **Auto-Advance**: Automatically advances every 3 seconds, pauses on hover/focus/user interaction, resumes after 5 seconds
- **Looping**: Navigation wraps from last item to first and vice versa
- **Single Item**: No indicators or auto-advance when only 1 item
- **Keyboard**: Arrow keys for navigation (accessibility)

### Visual States

- **Article Cards**: White background (#FFF), 20px border-radius, subtle shadow (0 0 20px 0 rgba(0, 0, 0, 0.05))
- **Active Indicator**: 1.875rem × 0.5rem (30px × 8px at 16px base), border-radius 20px, #EA4148 background, scales responsively
- **Inactive Indicator**: 0.5rem × 0.5rem (8px × 8px at 16px base), circular, #000 fill, 0.2 opacity, scales responsively
- **Mobile Indicators**: Active scales to 1.5rem × 0.4rem, inactive to 0.4rem × 0.4rem
- **Section Background**: Linear gradient from #FBF3F3 to #FFF (180deg)
- **Hover States**: Title color changes to #EA4148, cursor shows pointer for clickable items
- **Loading**: Smooth transitions between items
- **Clickable Items**: Entire carousel item area opens news link in new tab

## Technical Considerations

### Performance

- **Lazy Loading**: Images load only when needed
- **Animation**: CSS transitions for smooth navigation and auto-advance
- **Memory**: Efficient rendering with virtual scrolling for large item counts
- **Bundle Size**: Minimal dependencies (React hooks only)

### Accessibility

- **Keyboard Navigation**: Arrow keys and tab navigation
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Touch Targets**: Adequate size for mobile interaction

### Browser Support

- **Modern Browsers**: Full feature support
- **Touch Devices**: Swipe gesture handling
- **Legacy Browsers**: Graceful degradation (basic navigation)

## Integration Points

### Home Page Placement

- **Location**: Under "see our food" section
- **Data Source**: Fetch recent published news (unlimited items)
- **Background**: Linear gradient from #FBF3F3 to #FFF
- **Fallback**: Hide section if no news available
- **Loading**: Show skeleton or loading state during fetch

### Data Requirements

- **News Items**: Array of objects with id, title, excerpt, cover_image_url, slug
- **Validation**: Ensure all required fields present
- **Filtering**: Only published news (is_published = true)
- **Ordering**: By publish_date descending (newest first)

## Trade-offs & Decisions

### Mobile-First Approach

- **Pros**: Better performance on mobile devices, simpler default layout
- **Cons**: Additional CSS for desktop overrides
- **Decision**: Aligns with project conventions and modern web standards

### Component Reusability

- **Pros**: Can be used in other pages/sections
- **Cons**: Generic props interface may limit specific customizations
- **Decision**: Accept news data as props for maximum flexibility

### Navigation Patterns

- **Desktop**: Arrows + indicators for explicit control
- **Mobile**: Swipe gestures for natural mobile interaction
- **Decision**: Platform-appropriate interaction patterns

### Item Limit (Unlimited)

- **Pros**: Show all recent news, maximum content exposure
- **Cons**: Potential performance impact with very large item counts
- **Decision**: Prioritize content exposure with efficient rendering
