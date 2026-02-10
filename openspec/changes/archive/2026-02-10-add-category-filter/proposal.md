# Change: Add Category Filter to See Our Food Page

## Why
The See Our Food page displays many dishes across multiple food categories. A category filter allows users to quickly discover dishes within their preferred category, improving navigation and user experience.

## What Changes
- Add a `CategoryFilter` component that renders category buttons below the Hero section
- Implement single-select category filtering logic (only one category selected at a time)
- Position the filter wrapper directly below the Hero with zero gap and full viewport width
- Include an "All" button as the default state that shows all dishes
- Display all available category options (derived from dish data)
- Filter the DishGrid to show only dishes matching the selected category
- Update See Our Food page layout to integrate the filter

## Impact
- Affected specs: page-components, css-architecture
- Affected code: app/see-our-food/page.tsx, components/CategoryFilter.tsx (new), styles/components/category-filter.css (new)
- User-visible change: Filter controls appear below each page hero
