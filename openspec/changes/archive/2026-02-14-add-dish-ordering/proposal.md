# Add Dish Ordering Functionality

## Why

Currently, the "Order Now" button on dish cards is a non-functional placeholder. Users expect to be able to order specific dishes directly from the dish cards, but there's no mechanism to handle dish availability across multiple stores or determine the appropriate store for ordering. This creates a poor user experience where users can see dishes but cannot easily order them.

## What Changes

- Add functional behavior to the "Order Now" button on dish cards
- Implement dish availability checking using the `dish_store` table with proper filtering
- Always display StoreSelectionModal when ordering, showing all available stores for the dish
- Extend StoreSelectionModal to show distance information when user location is available
- Integrate with existing StoreSelectionModal for manual store selection
- Update DishCard and DishCardGrid components to handle ordering logic
- Add filtering logic to only display dishes available in at least one store (dish.is_visible = true AND dish.is_available = true AND dish_store.available = true)
- Add new utility functions for dish-store availability queries
- Add TypeScript types for dish_store data structure

## Impact

- Affected specs: dish-ordering (new capability), store-selection-modal (modified)
- Affected code: DishCard.tsx, DishCardGrid.tsx, lib/dishes.ts, StoreSelectionModal.tsx, new utility functions
- Breaking changes: None - this adds functionality to existing components