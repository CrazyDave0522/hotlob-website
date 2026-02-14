## ADDED Requirements

### Requirement: Dish Ordering Button Functionality

The "Order Now" button on dish cards SHALL always open the StoreSelectionModal displaying all available stores for that dish. The modal SHALL show distance information when user location is available, and allow manual store selection for ordering.

#### Scenario: Order Now button always opens modal

- **GIVEN** a dish is available at one or more stores in the `dish_store` table
- **WHEN** user clicks "Order Now" button on the dish card
- **THEN** the StoreSelectionModal opens showing all available stores for the dish
- **AND** stores are sorted alphabetically by name
- **AND** when user selects a store, a new browser tab opens to the selected store's dish `uber_url` from the `dish_store` table

#### Scenario: Modal with location permission shows distances

- **GIVEN** the StoreSelectionModal is opened for dish ordering
- **AND** user has granted location permission
- **WHEN** the modal displays available stores
- **THEN** it SHALL attempt to get user location with 2-second timeout
- **AND** display distance from user location to each store
- **AND** stores remain sorted alphabetically by name (not by distance)

#### Scenario: Modal without location permission hides distances

- **GIVEN** the StoreSelectionModal is opened for dish ordering
- **AND** user has denied location permission or location request fails/times out
- **WHEN** the modal displays available stores
- **THEN** it SHALL NOT display distance information
- **AND** stores are sorted alphabetically by name

#### Scenario: Dish availability data fetching

- **GIVEN** the DishCardGrid component is rendering dish cards
- **WHEN** the component mounts and fetches dish data
- **THEN** it SHALL query the `dish` table joined with `dish_store` table
- **AND** only include dishes that have `dish.is_visible = true`, `dish.is_available = true`, AND at least one `dish_store.available = true`
- **AND** include store information (id, uber_url, location) for each dish's available stores
- **AND** filter out dishes with no available stores before displaying

### Requirement: Store Selection Modal Distance Display

The StoreSelectionModal SHALL be extended to optionally display distance information for each store when location data is available.

#### Scenario: Modal distance display capability

- **GIVEN** the StoreSelectionModal is used for dish ordering
- **WHEN** location data is provided via props
- **THEN** it SHALL display distance information next to each store name
- **AND** distance SHALL be formatted as "X.X km" (e.g., "2.3 km")
- **AND** stores SHALL remain sorted alphabetically regardless of distance

### Requirement: Dish Availability Filtering

Dishes SHALL only be displayed if they meet ALL of the following criteria:
- `dish.is_visible = true`
- `dish.is_available = true`  
- At least one entry in `dish_store` table with `available = true` for that dish

#### Scenario: Dish not available at any store

- **GIVEN** a dish exists in the database with `is_visible = true` and `is_available = true`
- **BUT** the dish has no entries in `dish_store` table with `available = true`
- **WHEN** the application fetches dishes for display
- **THEN** the dish SHALL NOT be displayed in any dish grid or list

#### Scenario: Dish availability changes

- **GIVEN** a dish is currently displayed
- **WHEN** all its store availabilities are set to `available = false`
- **THEN** the dish SHALL be removed from display on next data fetch
- **AND** existing dish cards SHALL remain functional until page refresh