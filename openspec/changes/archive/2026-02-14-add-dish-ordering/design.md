## Context

The dish ordering functionality needs to handle complex logic around dish availability across multiple stores, user location permissions, and different ordering scenarios. The existing codebase has store selection modal functionality for the header CTA, but dish-specific ordering requires integrating dish availability data with store selection logic.

## Goals / Non-Goals

### Goals

- Enable functional "Order Now" buttons on dish cards
- Always show store selection modal with all available stores for the dish
- Display distance information when user location is available
- Provide consistent user experience regardless of dish availability
- Reuse existing StoreSelectionModal component
- Maintain performance with efficient data fetching
- Provide clear user feedback during ordering process

### Non-Goals

- Implement automatic store selection based on location
- Add complex conditional logic for different availability scenarios
- Implement full cart/order management system
- Add dish customization options
- Modify existing store selection modal behavior
- Change dish display logic (availability filtering already exists)

## Decisions

### Ordering Logic Architecture

- **Decision**: Simple modal-based ordering - always show StoreSelectionModal with available stores
- **Rationale**: Provides consistent UX, eliminates complex conditional logic, easier to implement and maintain
- **Alternatives considered**: Automatic store selection vs manual selection

### Data Fetching Strategy

- **Decision**: Modify `fetchVisibleDishes` to join with `dish_store` table and filter dishes by store availability
- **Rationale**: Ensures dishes are only displayed when actually available at stores, provides all needed data in single query
- **Alternatives considered**: Separate API call for dish-store data vs batch loading

### Store Selection Modal Reuse

- **Decision**: Extend existing StoreSelectionModal component to optionally display distance information
- **Rationale**: Maintains consistency, avoids code duplication, adds distance capability for dish ordering use case
- **Alternatives considered**: Create dish-specific modal vs modify existing modal

## Risks / Trade-offs

### Performance Impact

- **Risk**: Additional database queries for dish-store availability
- **Mitigation**: Batch queries and caching where possible
- **Trade-off**: More data fetching vs simpler logic

### User Experience Complexity

- **Risk**: Multiple store selection scenarios may confuse users
- **Mitigation**: Clear modal messaging and consistent behavior
- **Trade-off**: Complex logic vs simplified single-store assumption

### Location Permission UX

- **Risk**: Location requests may be denied or slow
- **Mitigation**: Graceful fallback to store selection modal
- **Trade-off**: Better UX with location vs simpler implementation without

## Migration Plan

1. **Phase 1**: Implement core ordering logic and database queries
2. **Phase 2**: Update components to use new ordering functionality
3. **Phase 3**: Add comprehensive testing
4. **Phase 4**: Deploy and monitor user behavior

No database migrations required as `dish_store` table already exists.

## Open Questions

- Should we show loading states during location detection?
- How to handle cases where user's closest store becomes unavailable between page load and ordering?
- Should we add analytics tracking for ordering attempts?</content>
  <parameter name="filePath">/Users/zixiao_ma/Desktop/Work/Hotlob/hotlob-website/openspec/changes/add-dish-ordering/design.md
