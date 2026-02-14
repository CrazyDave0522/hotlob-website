## MODIFIED Requirements

### Requirement: Store List Display

The modal SHALL display all provided stores in a vertically scrollable list. Each store item SHALL show the store name and full address. The modal MAY optionally display distance information when provided by the caller component.

#### Scenario: Rendering the store list with optional distances

- **GIVEN** the modal is open with a list of stores
- **WHEN** rendering the list
- **THEN** each store displays:
  - Store name using font size `--font-size-body-lg` and font weight `--font-weight-semibold`
  - Full address (street, suburb, state, postcode) using font size `--font-size-body` and color `--color-gray`
  - Distance information (formatted as "X.X km") when provided by caller, displayed below the address
- **AND** stores are displayed sorted alphabetically by store name (A→Z) regardless of distance information

#### Scenario: Modal accepts optional distance data

- **GIVEN** the StoreSelectionModal component accepts store data
- **WHEN** stores include optional distance information
- **THEN** the modal SHALL display distance when available
- **AND** the modal SHALL NOT display distance placeholders or labels when distance data is not provided
- **AND** store sorting SHALL remain alphabetical regardless of distance values