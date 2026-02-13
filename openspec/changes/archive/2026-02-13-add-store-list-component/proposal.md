# Proposal: add-store-list-component

## Summary

Implement a StoreList component for displaying Hotlob store locations. The component provides an alternating left-right layout on desktop with embedded Google Maps and store information, switching to top-bottom layout on mobile. The component will fetch store data from the database and Google Places API (New) for ratings and trading hours. Maps use fluid height matching store content rather than fixed aspect ratios, and ratings display in medium size for better visibility.

## Why

Customers need to find and learn about Hotlob store locations, including addresses, operating hours, ratings, and visual maps. The current locations page only has a hero section without actual store information. Adding a comprehensive store list component improves user experience by providing all necessary location information in an organized, visually appealing format.

## What Changes

- Add StoreList component with alternating layout variant (map gets ~60% width on desktop)
- Create reusable Rating component with star display (SVG icons + numeric value, medium size variant)
- Create store data types and API integration for Google Places
- Add server-side Google Places sync job to cache API data and minimize calls
- Add embedded Google Maps with fluid height matching store content (not fixed aspect ratio)
- Implement store information display (name, rating, address, hours, photos from store_photos table with responsive sizing maintaining aspect ratio)
- Add image modal functionality using react-image-lightbox for viewing full-size photos
- Update locations page to include StoreList component as a new section below the hero
- Add database integration for store data and photos retrieval

## Capabilities

- **store-list-display** (ADDED) - New capability for displaying store locations with maps and information

## Alternatives Considered

1. **Simple list without maps**: Rejected because visual maps are crucial for location finding and provide better user experience.
2. **External map service links**: Rejected because embedded maps allow users to explore locations without leaving the page.
3. **Simple layout**: Considered but rejected because alternating layout provides better visual interest and space utilization on desktop.

## Implementation Approach

1. Create store data types and database schema integration
2. Implement Google Places API (New) client for ratings and hours
3. Create server-side Google Places sync job with cron scheduling
4. Build StoreList component with responsive alternating layout
5. Add embedded Google Maps integration
6. Create store information display components
7. Update locations page to include StoreList as a new section below hero
8. Add comprehensive testing

## Timeline

- Design and planning: 45 minutes
- Data types and API setup: 60 minutes
- Google Places sync job: 90 minutes
- StoreList component: 120 minutes
- Google Maps integration: 90 minutes
- Locations page integration: 30 minutes
- Testing and validation: 60 minutes
- Documentation: 30 minutes

Total estimated time: 8.75 hours
