# footer-contact Specification

## Purpose
Enable users to contact stores directly via email by selecting a store from a modal triggered by the footer "Contact Us" link.

## ADDED Requirements

### Requirement: Footer Contact Us Link Functionality

The Footer component SHALL make the "Contact Us" link functional by opening a store selection modal when clicked, and upon store selection, SHALL open the system's default email application with the selected store's email address as the recipient.

#### Scenario: Clicking Contact Us link opens store selection modal

- **GIVEN** the user is viewing any page with the Footer component
- **WHEN** the user clicks the "Contact Us" link
- **THEN** a store selection modal opens
- **AND** the modal displays all available stores (as StoreWithDistance objects)
- **AND** distance information is shown when user location is available (same logic as dish card modal)
- **AND** the page background is dimmed with a backdrop

#### Scenario: Selecting a store opens email client

- **GIVEN** the store selection modal is open
- **WHEN** the user selects a store from the list
- **THEN** the modal closes
- **AND** the system's default email application opens
- **AND** the selected store's email address is set as the recipient
- **AND** the email subject and body are empty (allowing user to compose)

#### Scenario: Closing modal without selection

- **GIVEN** the store selection modal is open
- **WHEN** the user closes the modal (via close button, backdrop click, or Escape key)
- **THEN** the modal closes
- **AND** no email client is opened
- **AND** the user remains on the current page

#### Scenario: No stores available

- **GIVEN** no stores are available (fetch failed or empty)
- **WHEN** the user clicks the "Contact Us" link
- **THEN** the store selection modal opens
- **AND** displays "No stores available" message
- **AND** no store selection is possible

#### Scenario: Email client availability

- **GIVEN** the user has selected a store
- **WHEN** the system attempts to open the email client
- **THEN** the `mailto:` protocol is used with the store's email address
- **AND** the system handles email client availability (browser-dependent behavior)