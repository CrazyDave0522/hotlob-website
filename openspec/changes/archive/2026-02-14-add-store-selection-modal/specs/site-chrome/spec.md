# site-chrome Specification Delta

## MODIFIED Requirements

### Requirement: Header Social Icons and CTA

The Header component's "Order Online" CTA button SHALL trigger a store selection modal when clicked. After the user selects a store, the button SHALL open the store's Uber Eats URL in a new browser tab.

#### Scenario: Opening store selection modal from CTA button

- **GIVEN** the Header component is rendered with the "Order Online" CTA button
- **WHEN** the user clicks the "Order Online" button
- **THEN** the StoreSelectionModal component opens
- **AND** the modal displays all available stores from the database
- **AND** the modal title shows "Select a store"
- **AND** the page body scroll is locked while the modal is open

#### Scenario: CTA button state management

- **GIVEN** the Header component renders
- **WHEN** the component mounts
- **THEN** the Header maintains state for:
  - `isStoreModalOpen: boolean` - tracks modal open/close state
  - `stores: Store[]` - list of stores fetched from database
- **AND** stores are fetched on component mount using `fetchStores()` function
- **AND** the CTA button's `onClick` handler sets `isStoreModalOpen` to `true`
- **AND** stores are fetched on component mount using `fetchStores()` function
- **AND** when the modal opens, the UI SHALL sort stores by proximity if user location is available, otherwise the UI SHALL sort stores alphabetically by store name
- **AND** the CTA button's `onClick` handler sets `isStoreModalOpen` to `true`

#### Scenario: Automatic selection when location permission already granted

- **GIVEN** the Header component is rendered and the user has previously granted geolocation permission
- **WHEN** the user clicks the "Order Online" CTA button
- **THEN** the Header SHALL attempt to obtain a quick location (via Permissions API or a short `getCurrentPosition` call)
- **AND** if a valid user location is immediately available, the Header SHALL compute distances to all stores using `store.latitude` and `store.longitude`, select the closest store, and open the selected store's `uber_url` in a new browser tab
- **AND** the StoreSelectionModal SHALL NOT be displayed in this flow
- **AND** if location is not available immediately (permission revoked, request times out, or error), the Header SHALL open the StoreSelectionModal as the fallback behavior

#### Scenario: Handling store selection from modal

- **GIVEN** the store selection modal is open from the Header CTA button
- **WHEN** the user selects a store from the modal
- **THEN** the Header's `onStoreSelect` callback receives the selected store object
- **AND** `window.open(store.uber_url, '_blank')` is called to open Uber Eats in new tab
- **AND** the modal is closed by setting `isStoreModalOpen` to `false`
- **AND** the original tab remains on the current page

#### Scenario: Closing modal without selection

- **GIVEN** the store selection modal is open from the Header CTA button
- **WHEN** the user closes the modal without selecting a store (via close button, backdrop, or Escape)
- **THEN** the modal closes by setting `isStoreModalOpen` to `false`
- **AND** no new browser tab is opened
- **AND** the user remains on the current page

#### Scenario: CTA button with modal integration

- **GIVEN** the Header component with integrated StoreSelectionModal
- **WHEN** the component renders
- **THEN** the Button component shows "Order Online" text
- **AND** the Button has `onClick={() => setIsStoreModalOpen(true)}`
- **AND** the StoreSelectionModal is rendered with props:
  - `isOpen={isStoreModalOpen}`
  - `onClose={() => setIsStoreModalOpen(false)}`
  - `onStoreSelect={handleStoreSelect}`
  - `stores={stores}`
- **WHERE** `handleStoreSelect` is defined as:
  ```typescript
  const handleStoreSelect = (store: Store) => {
    window.open(store.uber_url, "_blank");
    setIsStoreModalOpen(false);
  };
  ```

#### Scenario: Error handling for missing stores

- **GIVEN** the Header component attempts to fetch stores on mount
- **WHEN** the fetch fails or returns an empty array
- **THEN** the CTA button remains clickable
- **AND** clicking the button opens the modal
- **AND** the modal displays "No stores available" message
- **AND** the user can close the modal

#### Scenario: CTA button accessibility

- **GIVEN** the Header CTA button is rendered
- **WHEN** keyboard users navigate to the button
- **THEN** the button is focusable via Tab key
- **WHEN** the button has focus and user presses Enter or Space
- **THEN** the store selection modal opens
- **AND** focus moves to the first interactive element in the modal (close button)
