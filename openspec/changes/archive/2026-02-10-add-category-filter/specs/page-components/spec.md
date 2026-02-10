# page-components Specification (Delta)

## ADDED Requirements

### Requirement: Category Filter Component

The application SHALL provide a `CategoryFilter` component that renders category buttons for filtering dishes on the See Our Food page. The component SHALL support single-select category filtering, allowing users to view dishes from a specific category or all categories.

The allowed categories SHALL be Dessert, Seafood, Meat, and Vegetarian. The component SHALL render only categories that appear in the dish data, plus an "All" option.

The component SHALL accept a `selectedCategory` prop (string or null) representing the currently selected category ID. The component SHALL accept an `onCategoryChange` callback prop that fires when a category button is clicked, passing the selected category ID (or null for "All").
The component SHALL accept an `availableCategories` prop (array of category IDs) that determines which category buttons render. Categories not present in `availableCategories` SHALL NOT render.

The component SHALL render as a horizontal button group. Each button SHALL consist of:

- A category icon from `public/images/icons/food-category/` (all.svg, dessert.svg, seafood.svg, meat.svg, vegetarian.svg)
- A category text label

The icon source SHALL change based on button state:

- **Inactive state**: displays `[category].svg` (e.g., `seafood.svg`, `all.svg`)
- **Active state**: displays `[category]-active.svg` (e.g., `seafood-active.svg`, `all-active.svg`)

On mobile (< 768px), the icon SHALL appear above the text in a vertical stack. On desktop (≥ 768px), the icon SHALL appear to the left of the text in a horizontal layout.

Button styling SHALL use component-prefixed class names (e.g., `.CategoryFilter-button`, `.CategoryFilter-button--active`). The active button SHALL be visually distinct from inactive buttons. Styling differs between mobile and desktop:

**Desktop**: Active buttons have `#EA4148` background with white text and blur shadow. Inactive buttons have white background with #1D1E1F text and no border.

**Mobile**: Active buttons have `#EA4148` background with white text and blur shadow. Inactive buttons have semi-transparent white background (`rgba(255, 255, 255, 0.60)`) with white border (`2px solid #FFFFFF`) and #1D1E1F text and blur shadow.

#### Scenario: Category Filter renders with category options

- **GIVEN** a `CategoryFilter` component is rendered
- **WHEN** the component displays
- **THEN** it renders buttons for "All" and each available category
- **AND** the "All" button is selected by default (visually active)
- **AND** each button displays its icon from `public/images/icons/food-category/[category].svg`
- **AND** the "All" button icon is `public/images/icons/food-category/all.svg`

#### Scenario: Categories with no dishes are omitted

- **GIVEN** the dish data includes categories "Seafood", "Meat", and "Dessert" but no "Vegetarian" dishes
- **WHEN** the `CategoryFilter` component renders
- **THEN** it renders buttons for "All", "Seafood", "Meat", and "Dessert"
- **AND** no "Vegetarian" button is rendered

#### Scenario: Category button icon changes on active state

- **GIVEN** the "Seafood" category button is in inactive state
- **WHEN** the button is displayed
- **THEN** the icon displays `public/images/icons/food-category/seafood.svg`

- **GIVEN** the "Seafood" category button becomes active
- **WHEN** the button is selected
- **THEN** the icon displays `public/images/icons/food-category/seafood-active.svg`
- **AND** the transition is smooth without DOM manipulation

#### Scenario: Selecting a category filters the display

- **GIVEN** the "All" button is currently selected
- **WHEN** the user clicks the "Seafood" category button
- **THEN** the component calls `onCategoryChange("seafood")`
- **AND** the "Seafood" button becomes visually active
- **AND** the "All" button becomes inactive

#### Scenario: Returning to "All" shows all categories

- **GIVEN** a category is currently selected (e.g., "Meat")
- **WHEN** the user clicks the "All" button
- **THEN** the component calls `onCategoryChange(null)`
- **AND** the "All" button becomes visually active
- **AND** the previously selected category button becomes inactive

### Requirement: See Our Food Page Category Filter Integration

The See Our Food page (`app/see-our-food/page.tsx`) SHALL render a `CategoryFilter` component directly below the Hero section with zero gap between components. The filter wrapper SHALL take full viewport width and SHALL contain the category buttons.

The page SHALL maintain single-select category filtering state, derive available categories from the dish data, and pass both the selected category and available categories to the `CategoryFilter`. Dishes displayed SHALL be filtered to show only those matching the selected category, OR all dishes when "All" is selected.

#### Scenario: Category filter appears below Hero with no gap

- **GIVEN** the See Our Food page is loaded
- **WHEN** the Hero section finishes rendering
- **THEN** the CategoryFilter component appears immediately below (zero gap)
- **AND** the filter wrapper takes full viewport width
- **AND** there is no padding or gap between Hero and filter on any viewport

#### Scenario: Filtering dishes by category works on the See Our Food page

- **GIVEN** the See Our Food page displays 20 dishes across 4 categories (Seafood, Meat, Vegetarian, Dessert)
- **WHEN** the user selects the "Seafood" category
- **THEN** only dishes with category="seafood" are displayed
- **AND** the DishGrid updates to show 8 seafood dishes
- **AND** the "Seafood" button remains active

#### Scenario: Selecting "All" restores full dish list

- **GIVEN** the "Fish" category is currently selected
- **WHEN** the user clicks the "All" button
- **THEN** all 20 dishes are displayed again
- **AND** the filter shows "All" plus only the categories present in the dishes
