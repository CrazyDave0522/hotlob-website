## Implementation Order

### 1. Database Query Functions
- [x] Create `fetchDishStores(dishId: string)` function in `lib/dishes.ts` to query `dish_store` table
- [x] Update `fetchVisibleDishes()` to join with `dish_store` table and filter by store availability
- [x] Add TypeScript types for dish_store data structure in `types/dish.ts`
- [x] Update dish types to include store availability information

### 2. Ordering Logic Utilities
- [x] Create `utils/dishOrdering.ts` with ordering logic functions:
  - `getAvailableStoresForDish(dishId: string)` - returns available stores for a dish with dish_store data
  - `handleDishOrder(dishId: string)` - opens store selection modal with available stores

### 3. Component Updates
- [x] Update `DishCard` component to accept `onOrder` prop
- [x] Update `DishCardGrid` component to:
  - Fetch dish availability data with store information using updated `fetchVisibleDishes`
  - Handle ordering logic (always open modal)
  - Manage store selection modal state
  - Calculate distances when location is available and pass to modal
  - Pass ordering handler to DishCard components

### 4. Store Selection Modal Enhancement
- [x] Extend StoreSelectionModal to accept optional distance data for each store
- [x] Update modal to display distance information when provided
- [x] Ensure stores remain sorted alphabetically regardless of distance display

### 5. Testing
- [x] Add unit tests for ordering logic utilities
- [x] Add integration tests for dish ordering flow
- [x] Test location permission scenarios
- [x] Test single vs multiple store scenarios

### 6. Validation
- [x] Run `pnpm test` to ensure all tests pass
- [x] Manual testing of ordering flows in browser
- [x] Validate accessibility of new interactions