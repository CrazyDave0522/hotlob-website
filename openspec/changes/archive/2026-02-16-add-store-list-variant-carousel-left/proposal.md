# Add Store List Variant: Carousel Left

## Summary

Add a new layout variant to the StoreList component that displays store images in a carousel on the left side, store information in the middle, and an angle-right navigation icon on the right side. This variant does not include maps and provides a focused image-centric layout for store presentation with responsive design.

## What Changes

### Modified Capabilities

- **store-list-display** — Add new carousel-left variant to StoreList component with three-column layout: image carousel, store info, angle icon

### New Capabilities

- **home-page-store-showcase** — Add carousel-left store list variant to home page below "See Our Food" section with desktop background image

### Design Decisions

- **Variant Name**: `carousel-left` - clearly indicates the layout style
- **Image Display**: Responsive carousel (120-220px width, 160px height) showing multiple store images
- **Layout**: Three-column grid: carousel (responsive width), store info (flexible), angle icon (auto width)
- **No Maps**: This variant excludes map embeds entirely
- **Responsive**: Mobile-first approach with three-column layout on both mobile and desktop
- **Store Info**: Responsive typography (store name 16-24px, address/hours 14-18px)
- **Navigation**: Responsive angle-right icon (16-32px) in right column that opens Uber URL in new tab
- **Visual Consistency**: Maintains styling consistency with responsive elements
- **Mobile Styling**: Transparent background, no shadows/borders on mobile for seamless integration
- **Home Page Placement**: New section on home page between "See Our Food" and "Hot News" sections

## Impact

- **Users**: Get a new visual way to browse stores with image carousels
- **Performance**: Slightly reduced due to carousel functionality, but no map embeds
- **Maintenance**: Adds complexity to StoreList component but reuses existing store info display logic
- **Home Page**: Adds store showcase section to increase visibility and drive traffic to locations

## Dependencies

- Existing StoreList component structure
- Store image data in database
- Carousel component (reuse existing NewsCarousel or create new)
- Store data fetching system
