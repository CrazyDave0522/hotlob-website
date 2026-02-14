# store-selection-modal Specification

## Purpose

Enable users to select a store location via a reusable modal component, providing store information and distance from user's location when available. The modal serves as an intermediary step before initiating online ordering, ensuring users select the correct store location.

## ADDED Requirements

### Requirement: Modal Component Structure

The StoreSelectionModal component SHALL render a modal dialog with a backdrop overlay, title "Select a store", close button, and a list of store items. The modal SHALL be controlled via `isOpen` prop and notify parent component via `onClose` and `onStoreSelect` callback props.

#### Scenario: Opening the store selection modal

- **GIVEN** the StoreSelectionModal component is mounted with `isOpen={false}`
- **WHEN** the `isOpen` prop changes to `true`
- **THEN** a full-screen backdrop overlay is displayed with background color `rgba(0, 0, 0, 0.90)`
- **AND** the modal content container appears centered on the screen
- **AND** the modal title "Select a store" is displayed at the top
- **AND** a close button is displayed in the top-right corner (prefer using the `X` icon from `lucide-react` when available)
- **AND** the page body scroll is locked to prevent background scrolling

#### Scenario: Modal component props interface

- **GIVEN** a parent component wants to use StoreSelectionModal
- **WHEN** the component is integrated
- **THEN** it MUST accept the following props:
  - `isOpen: boolean` - controls modal visibility
  - `onClose: () => void` - callback when modal should close
  - `onStoreSelect: (store: Store) => void` - callback when user selects a store
  - `stores: Store[]` - array of store data to display

#### Scenario: Modal bypassed due to automatic selection

- **GIVEN** the application already has a valid user location when the Order Online CTA is triggered
- **WHEN** the Header attempts automatic selection
- **THEN** the StoreSelectionModal MAY not be opened at all
- **AND** the selected store SHALL be the closest store by distance and the parent flow SHALL handle navigation (e.g., opening `store.uber_url`)

### Requirement: Store List Display

The modal SHALL display all provided stores in a vertically scrollable list. Each store item SHALL show the store name and full address. The modal SHALL NOT render any distance values, labels, or placeholders; distance calculation, display, and any automatic nearest-store selection are the responsibility of the caller component (for example, the Header flow).

#### Scenario: Rendering the store list

- **GIVEN** the modal is open with a list of stores
- **WHEN** rendering the list
- **THEN** each store displays:
  - Store name using font size `--font-size-body-lg` and font weight `--font-weight-semibold`
  - Full address (street, suburb, state, postcode) using font size `--font-size-body` and color `--color-gray`
- **AND** stores are displayed sorted alphabetically by store name (A→Z)

#### Scenario: Clickable store items

- **GIVEN** the modal displays a list of stores
- **WHEN** the user hovers over a store item
- **THEN** the item displays a visual hover state: the background color changes (recommend `--color-surface-100`), the item may receive a subtle elevation or transform for emphasis, and transitions are applied (e.g., `background-color 120ms ease-in-out, transform 120ms ease-in-out`).
- **AND** the cursor changes to pointer
- **WHEN** the user clicks on a store item
- **THEN** the `onStoreSelect` callback is invoked with the selected store object
- **AND** the modal closes (parent component responsibility via state update)

### Requirement: Geolocation Integration and Responsibility

Geolocation permission and quick-location attempts SHALL be performed by the caller (for example, the Header flow) before deciding whether to open the StoreSelectionModal. The modal itself SHALL NOT initiate permission requests or perform geolocation probes. If the caller obtains a valid user location and chooses to perform automatic selection, it SHALL do so prior to opening the modal; otherwise the modal opens as a manual-selection UI and shall not display any distance-related information.

#### Scenario: Caller handles quick location attempt

- **GIVEN** the user triggers the Order Online CTA
- **WHEN** the caller decides whether to open the modal
- **THEN** the caller MAY attempt a quick location probe (short timeout) or query the Permissions API
- **AND** if a valid user location is immediately available, the caller SHALL compute distances using `store.latitude`/`store.longitude` and may perform automatic selection (skipping the modal)
- **AND** if location is not available immediately, the caller SHALL open the StoreSelectionModal without userLocation

### Requirement: Modal Close Interactions

The modal SHALL provide multiple ways for users to close it: close button, backdrop click, Escape key, and automatic close after store selection.

#### Scenario: Close via close button

- **GIVEN** the modal is open
- **WHEN** the user clicks the close button (preferably the `X` icon from `lucide-react`)
- **THEN** the `onClose` callback is invoked
- **AND** the modal is hidden (parent component responsibility)
- **AND** page body scroll lock is removed

#### Scenario: Close via backdrop click

- **GIVEN** the modal is open
- **WHEN** the user clicks on the backdrop overlay (outside the modal content)
- **THEN** the `onClose` callback is invoked
- **AND** the modal is hidden
- **WHEN** the user clicks inside the modal content area
- **THEN** the click event does NOT trigger modal close

#### Scenario: Close via Escape key

- **GIVEN** the modal is open
- **WHEN** the user presses the Escape key
- **THEN** the `onClose` callback is invoked
- **AND** the modal is hidden

#### Scenario: Automatic close after store selection

- **GIVEN** the modal is open
- **WHEN** the user selects a store (clicks a store item)
- **THEN** the `onStoreSelect` callback is invoked with the selected store
- **AND** the parent component receives the selected store and can act on it (e.g., open Uber URL)
- **NOTE** The parent component is responsible for closing the modal by setting `isOpen={false}`

### Requirement: Accessibility

The modal SHALL be fully accessible with proper ARIA attributes, keyboard navigation, and screen reader support.

#### Scenario: ARIA attributes

- **GIVEN** the modal is rendered
- **WHEN** assistive technologies inspect the modal
- **THEN** the modal overlay has `role="dialog"` and `aria-modal="true"`
- **AND** the modal has `aria-labelledby` pointing to the title element ID
- **AND** the close button has `aria-label="Close store selection modal"`
- **AND** each store item has appropriate role and accessible name

#### Scenario: Keyboard navigation

- **GIVEN** the modal is open
- **WHEN** the user presses Tab
- **THEN** focus cycles through:
  1. Close button
  2. Each store item in order
  3. Back to close button (focus trap)
- **AND** focus does NOT escape to elements behind the modal
- **WHEN** the user presses Shift+Tab
- **THEN** focus cycles backward through the same elements

#### Scenario: Store selection via keyboard

- **GIVEN** the modal is open and a store item has focus
- **WHEN** the user presses Enter or Space key
- **THEN** the store is selected (same as clicking)
- **AND** the `onStoreSelect` callback is invoked

#### Scenario: Screen reader announcements

- **GIVEN** the modal opens
- **WHEN** a screen reader is active
- **THEN** the modal title "Select a store" is announced
- **AND** the number of stores available is announced (e.g., "5 stores available")
- **WHEN** a store item receives focus
- **THEN** the store name, address, and distance (if available) are announced

### Requirement: Responsive Design

The modal SHALL adapt to different screen sizes with mobile-first responsive behavior.

#### Scenario: Mobile modal layout (< 768px)

- **GIVEN** the modal is open on a mobile device (viewport width < 768px)
- **WHEN** the modal renders
- **THEN** the modal content takes near full-width with minimal horizontal padding (`--space-16`)
- **AND** the modal content is positioned with small top margin for accessibility
- **AND** the store list is scrollable vertically
- **AND** store items use full available width
- **AND** font sizes scale appropriately for mobile readability

#### Scenario: Desktop modal layout (≥ 768px)

- **GIVEN** the modal is open on a desktop device (viewport width ≥ 768px)
- **WHEN** the modal renders
- **THEN** the modal content is centered on screen with max-width of approximately 600px
- **AND** the modal has padding `--space-48` on all sides
- **AND** the modal content has border-radius `--radius-30`
- **AND** store items have comfortable spacing and hover states

### Requirement: Styling Practices

The StoreSelectionModal SHALL follow the project's established styling conventions and mobile-first principles.

#### Scenario: Styling follows project conventions

- **GIVEN** project-wide styling conventions exist (Tailwind utilities + component CSS files)
- **WHEN** the StoreSelectionModal is implemented
- **THEN** prefer Tailwind utility classes for simple layout and spacing
- **AND** use component-scoped CSS files in `styles/components/` for complex selectors, animations, and persistent component styles
- **AND** follow the project's component naming prefix (e.g., `.StoreSelectionModal-`)
- **AND** ensure CSS is written mobile-first (styles for small viewports first, then media queries for larger breakpoints)

<!-- Loading states related to geolocation removed: the caller handles geolocation. -->

### Requirement: Empty State Handling

The modal SHALL handle scenarios where no stores are available.

#### Scenario: No stores provided

- **GIVEN** the modal is opened with an empty stores array
- **WHEN** the modal renders
- **THEN** a message "No stores available" is displayed
- **AND** the close button remains functional
- **AND** no store items are rendered

### Requirement: Scroll Lock

The modal SHALL prevent scrolling of the page content behind it when open.

#### Scenario: Scroll lock on modal open

- **GIVEN** the modal is closed
- **WHEN** the modal opens
- **THEN** `document.body.style.overflow` is set to 'hidden'
- **AND** the page content behind the modal cannot be scrolled
- **AND** the modal content itself remains scrollable if it exceeds viewport height

#### Scenario: Scroll unlock on modal close

- **GIVEN** the modal is open with scroll lock active
- **WHEN** the modal closes
- **THEN** `document.body.style.overflow` is restored to its original value
- **AND** the page becomes scrollable again
