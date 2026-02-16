# Design: Store List Variant - Carousel Left

## Architectural Overview

The carousel-left variant introduces a new layout pattern for the StoreList component that prioritizes visual store presentation through image carousels while maintaining the essential store information display. This variant differs from existing variants by removing map embeds, fixing the layout to always show images on the left, and including an angle-right navigation icon that opens the store's Uber URL in a new tab.

## Layout Structure

```
Desktop Layout:
+-------------------+-------------------+-------------------+
|                   | Store Name        |                   |
|  Image Carousel   | Rating            |    Angle Icon     |
|  (Left Side)      | Address           |    (Right Side)   |
|                   | Hours             |                   |
+-------------------+-------------------+-------------------+

Mobile Layout:
+-------------------+-------------------+-------------------+
|  Image Carousel   | Store Name        |                   |
|  (Left Side)      | Rating            |    Angle Icon     |
|                   | Address           |    (Right Side)   |
|                   | Hours             |                   |
+-------------------+-------------------+-------------------+
```

The middle column displays store information in a vertical stack: store name at the top, followed by rating, address, and hours. The right column contains an angle-right icon (`public/images/icons/angle-right-black.svg`) that opens the store's Uber URL in a new tab. This layout is consistent between mobile and desktop devices, with responsive sizing for all elements.

## Visual Design

### Store Item Borders

Each store item has a top border using `#B9B7B7` color, with the last item also having a bottom border:

- `border-top: 1px solid #B9B7B7` (all items)
- `border-bottom: 1px solid #B9B7B7` (last item only)

This prevents overlapping thicker lines between stacked items on mobile.

### Mobile-Specific Styling

On mobile devices (<768px), the carousel-left variant uses transparent backgrounds with no shadows or border radius for seamless integration:

- `background: transparent`
- `box-shadow: none`
- `border-radius: 0`

### Consistent Styling with V1

The carousel-left variant maintains visual consistency with existing variants but includes responsive typography and sizing:

- Responsive typography for store names (16-24px), addresses/hours (14-18px)
- Responsive carousel dimensions (120-220px width, 160px height)
- Responsive angle icon sizing (16-32px)
- Same color scheme and visual hierarchy
- Same responsive breakpoints and behavior
- Only the layout structure differs (fixed left-right vs alternating)

## Component Architecture

### Mobile-First Implementation

The carousel-left variant follows mobile-first responsive design:

- **Base styles**: Optimized left-right layout for mobile devices
- **Desktop enhancements**: Additional styling applied via `@media (min-width: 768px)` for larger screens
- **Progressive enhancement**: Desktop builds upon mobile foundation rather than overriding

### StoreList Component Changes

- Add `variant` prop with values: `'alternating' | 'carousel-left'`
- Conditional rendering based on variant
- Maintain backward compatibility with existing usage
- **No section titles/labels**: SectionTitle components are handled at the page level, not within StoreList

### Image Carousel Sub-component

- Reuse existing carousel logic or create specialized store image carousel
- Support multiple images per store
- Include navigation controls (arrows, indicators)
- Handle loading states and error fallbacks
- **Aspect ratio**: Maintain 220:160 (11:8) aspect ratio for responsive sizing
- **Placeholder**: Use Store icon from Lucide React when no images available

### Data Flow

```
Store Data (from DB)
├── Basic Info (name, address, hours)
├── Images Array (for carousel)
└── Location Data (not used in this variant)
```

## Trade-offs and Considerations

### Performance

- **Pro**: No map embeds reduces page load time
- **Con**: Carousel adds JavaScript for navigation
- **Mitigation**: Lazy load carousel functionality

### User Experience

- **Pro**: Visual focus on store images enhances appeal
- **Con**: Fixed left-right layout may feel less dynamic than alternating
- **Mitigation**: Clear visual hierarchy and responsive design

### Maintenance

- **Pro**: Reuses existing store info display logic
- **Con**: Adds complexity to StoreList component
- **Mitigation**: Clean separation of concerns with variant-specific rendering

## Implementation Strategy

1. **Phase 1**: Add variant prop and basic layout structure
2. **Phase 2**: Implement image carousel functionality
3. **Phase 3**: Style and responsive behavior
4. **Phase 4**: Testing and validation

## Dependencies

- Store image data structure in database
- Existing carousel components for reference
- StoreList component architecture
- CSS token system for consistent styling
