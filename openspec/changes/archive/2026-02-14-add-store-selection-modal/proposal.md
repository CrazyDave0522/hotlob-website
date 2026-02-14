# Proposal: Add Store Selection Modal

## Change ID

`add-store-selection-modal`

## Problem Statement

Currently, the Header component has an "Order Online" CTA button that has no functional behavior. Users need a way to select a store location before being directed to order online via Uber Eats. Without a store selection mechanism, users cannot complete the ordering flow from the CTA button.

## Proposed Solution

Create a reusable `StoreSelectionModal` component that:

- Displays a modal dialog with a list of all available stores
- Shows store name, address, and distance from user (when location permission is granted)
- Requests geolocation permission when the modal is triggered (if not already granted)
- Requests geolocation permission when the modal is triggered (if not already granted)
- Returns the selected store to the caller via a callback function
- Integrates with the Header CTA button to open the selected store's Uber Eats URL in a new tab

The modal will be designed as a reusable component that can be triggered from any part of the application, with the Header CTA button as the initial use case.
## Why

Users currently cannot complete the ordering flow from the Header CTA because
there's no way to select which store they want to order from. This introduces
friction and leads to failed conversions. The modal provides a lightweight,
accessible, and reusable UI for store selection that integrates with the
existing Header CTA without changing global navigation patterns.

## What Changes

- Add a new `store-selection-modal` capability that implements the modal UI and
	keyboard/ARIA behavior described in this proposal.
- Modify the `site-chrome` spec to wire the Header CTA button to the new modal
	and define the integration scenarios for automatic selection and fallback
	behavior.

## Goals

- Provide a user-friendly way to select a store location
- Enable the Header CTA button to direct users to the correct Uber Eats ordering page
- Create a reusable modal component that can be used for other store selection scenarios
- Improve user experience by showing distance information when location access is available
- Improve user experience by showing distance information when location access is available

## Non-Goals

## Scope

This change adds a new capability: `store-selection-modal`

### New Capabilities

- **store-selection-modal**: Modal component for selecting a store from the available locations

### Modified Capabilities

- **site-chrome**: Update Header CTA button to trigger the store selection modal

## Dependencies

- Existing `store-list-display` spec provides the Store type and fetchStores() function
- Browser Geolocation API for distance calculation
- Existing modal/overlay patterns established in the Header mobile navigation

## Implementation Notes

- The modal will follow the same overlay pattern used in the Header mobile navigation
- Distance calculation will use the Haversine formula for client-side computation
- Location permission will be requested only when the modal opens (not on page load)
- The modal will gracefully handle denied location permissions by continuing to show stores without distance
- The component will be accessible with proper ARIA attributes and keyboard navigation

## Alternatives Considered

1. **Direct Uber Eats link without store selection**: Rejected because Uber Eats URLs are store-specific
2. **Dropdown in the header**: Rejected due to poor UX for displaying multiple stores with details
3. **Dedicated store selection page**: Rejected as it adds unnecessary navigation friction
4. **Request location permission on page load**: Rejected as it's intrusive and affects initial page load; better to request when needed

## Security & Performance Considerations

- Location permission request is user-initiated (when modal opens)
- No sensitive data is stored or transmitted
- Distance calculations are performed client-side
- Modal uses the same scroll-lock mechanism as Header mobile navigation to prevent performance issues

## Testing Strategy

- Unit tests for StoreSelectionModal component
- Integration tests for Header CTA button → modal → Uber Eats navigation flow
- Accessibility testing with keyboard navigation and screen readers
- Cross-browser testing for Geolocation API compatibility

## Rollout Plan

1. Implement StoreSelectionModal component with tests
2. Integrate with Header CTA button
3. Deploy and monitor for any geolocation permission issues
