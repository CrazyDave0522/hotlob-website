# store-list-display Specification

## Purpose
TBD - created by archiving change add-store-list-component. Update Purpose after archive.
## Requirements
### Requirement: Store List Layout Variants

The StoreList component SHALL support layout variants with responsive behavior. The component SHALL implement a stacked top-bottom layout on mobile and enhance to alternating left-right layout on desktop.

#### Scenario: Mobile stacked layout

- **GIVEN** the StoreList component is rendered on mobile (<768px)
- **WHEN** stores are provided
- **THEN** all stores display store info on top, map below
- **AND** no alternating pattern is applied
- **AND** each section uses full container width

#### Scenario: Desktop alternating layout

- **GIVEN** the StoreList component is rendered on desktop (≥768px)
- **WHEN** multiple stores are provided
- **THEN** odd-indexed stores display map on left, store info on right
- **AND** even-indexed stores display store info on left, map on right
- **AND** each store item uses full-width container with two equal columns

### Requirement: Component Width and Layout

The StoreList component SHALL utilize the full width of its outer wrapper container without artificial width constraints.

#### Scenario: Full width container utilization

- **GIVEN** the StoreList component is placed within a container
- **WHEN** the component renders
- **THEN** the component takes 100% width of its immediate parent container
- **AND** no max-width constraints are applied to the component
- **AND** layout adapts responsively to container width changes

### Requirement: Embedded Google Maps Display

Store locations SHALL display embedded Google Maps with responsive sizing and proper aspect ratio maintenance.

#### Scenario: Map embed URL source

- **GIVEN** a store has a google_maps_embed_url in the database
- **WHEN** the Google Maps embed is rendered
- **THEN** the iframe src uses the value from store.google_maps_embed_url
- **AND** no dynamic URL construction is performed
- **AND** the embed URL is used as-is from the database

#### Scenario: Mobile map scaling

- **GIVEN** a store item is displayed on mobile (<768px)
- **WHEN** the viewport width changes
- **THEN** the map scales proportionally below breakpoint maximums
- **AND** the height scales to maintain aspect ratio
- **AND** the map remains fully functional

#### Scenario: Tablet map dimensions

- **GIVEN** a store item is displayed on tablet (768px viewport)
- **WHEN** the Google Maps embed loads
- **THEN** the map displays at 650px width × 320px height at 768px viewport
- **AND** the aspect ratio is maintained (approximately 2.03:1)
- **AND** the map scales proportionally on smaller screens

#### Scenario: Desktop map dimensions

- **GIVEN** a store item is displayed on desktop (≥768px)
- **WHEN** the Google Maps embed loads
- **THEN** the map displays at maximum 800px width × 340px height at 1920px viewport
- **AND** the aspect ratio is maintained (approximately 2.35:1)
- **AND** the map scales proportionally below the 1920px breakpoint
- **AND** the map is fully interactive and embedded

### Requirement: Google Maps Navigation

Clicking on the embedded Google Maps SHALL open the full Google Maps page in a new browser tab with the store location.

#### Scenario: Map click opens Google Maps

- **GIVEN** an embedded Google Maps is displayed for a store
- **WHEN** the user clicks anywhere on the map
- **THEN** a new browser tab opens
- **AND** the tab navigates to the Google Maps URL for the store location
- **AND** the URL uses the value from the store.google_url field
- **AND** the original tab remains open with the store list page

### Requirement: Store Information Display

Each store SHALL display comprehensive information including name, rating, address, operating status, trading hours, and photos.

#### Scenario: Store name and rating display

- **GIVEN** a store has name and Google rating data
- **WHEN** the store info is rendered
- **THEN** the store name displays prominently
- **AND** Google rating displays as star icons using SVG files: `public/images/icons/star-filled.svg`, `public/images/icons/star-half.svg`, `public/images/icons/star-empty.svg`
- **AND** rating shows numeric value after the stars (e.g., "4.5")
- **AND** rating uses 5-star scale with appropriate star states
- **AND** rating component is reusable across the application

#### Scenario: Store name title styling

- **GIVEN** a store name is displayed
- **WHEN** the store title is rendered
- **THEN** title has font-weight: 500
- **AND** title has line-height: normal
- **AND** title has text-transform: uppercase
- **AND** title has color: #1D1E1F
- **AND** title has max font-size: 24px at 1920px viewport
- **AND** title has max font-size: 24px at 768px viewport
- **AND** font size scales proportionally below breakpoint maximums

#### Scenario: Store information text styling

- **GIVEN** store information is displayed (address, hours, rating text)
- **WHEN** the store info text is rendered
- **THEN** all text except the title has color: #4E5969
- **AND** text has max font-size: 18px at 1920px viewport
- **AND** text has max font-size: 18px at 768px viewport
- **AND** font size scales proportionally below breakpoint maximums

#### Scenario: Store address display

- **GIVEN** a store has address components (street, suburb, state, postcode)
- **WHEN** the store address is rendered
- **THEN** landmark icon displays before the address (`public/images/icons/landmark.svg`)
- **AND** the full address displays in readable format
- **AND** address is properly formatted for Australian locations

#### Scenario: Operating status and hours

- **GIVEN** a store has trading hours data
- **WHEN** the current time is known
- **THEN** clock icon displays with trading hours (`public/images/icons/clock.svg`)
- **AND** operating status displays as "Open" or "Closed"
- **AND** only the current day's hours are displayed

#### Scenario: Store photos gallery

- **GIVEN** a store has associated photos in the store_photos table
- **WHEN** the photos are rendered
- **THEN** photos display in a responsive gallery ordered by display_order
- **AND** maximum of 3 photos are shown (lowest display_order first)
- **AND** photos have max dimensions of 140px × 120px at 1920px viewport
- **AND** photos have max dimensions of 140px × 120px at 768px viewport
- **AND** images are optimized for web delivery
- **AND** photos are fetched via foreign key relationship with store table
- **AND** photo size scales proportionally below breakpoint maximums

### Requirement: Store Image Navigation

Clicking on store photos SHALL open the full-size image in an overlay modal for detailed viewing. The modal SHALL use a dedicated image viewing library for optimal performance and user experience.

#### Scenario: Photo click opens full image modal

- **GIVEN** a store photo is displayed in the gallery
- **WHEN** the user clicks on the photo
- **THEN** an overlay modal opens displaying the full-size image
- **AND** the modal overlays the current page content
- **AND** the image URL uses the original photo URL from the store_photos table
- **AND** a close button is displayed in the modal
- **AND** clicking outside the image or the close button closes the modal
- **AND** the page returns to the store list view
- **AND** the modal uses react-image-lightbox library

### Requirement: Rating Component

A reusable Rating component SHALL display star ratings using SVG icons followed by the numeric rating value.

#### Scenario: Rating display format

- **GIVEN** a rating value between 0 and 5
- **WHEN** the Rating component renders
- **THEN** it displays exactly 5 star positions
- **AND** full stars use `public/images/icons/star-filled.svg`
- **AND** half stars use `public/images/icons/star-half.svg`
- **AND** empty stars use `public/images/icons/star-empty.svg`
- **AND** numeric rating value displays after the stars

#### Scenario: Rating component reusability

- **GIVEN** the Rating component is created
- **WHEN** used in different parts of the application
- **THEN** it accepts rating value as a prop
- **AND** it supports optional size variants (sm, md, lg)
- **AND** it provides consistent visual appearance
- **AND** it includes proper accessibility features

#### Scenario: Rating star sizing

- **GIVEN** the Rating component displays stars
- **WHEN** rendered at different viewport sizes
- **THEN** stars have max dimensions of 28px × 28px at 768px viewport
- **AND** stars have max dimensions of 18px × 18px at 1920px viewport
- **AND** star size scales proportionally below breakpoint maximums

### Requirement: Data Integration

Store data SHALL be retrieved from the database with Google Places API (New) enrichment for ratings and hours. Store photos SHALL be fetched from the related store_photos table.

#### Scenario: Database store data retrieval

- **GIVEN** the store table contains store records
- **WHEN** the locations page loads
- **THEN** all active stores are retrieved from database
- **AND** store data includes URLs and embedded map data

#### Scenario: Store photos data retrieval

- **GIVEN** stores have associated photos in the store_photos table
- **WHEN** store data is loaded
- **THEN** photos are fetched via foreign key relationship
- **AND** photos are ordered by display_order ascending
- **AND** maximum of 3 photos per store are retrieved

#### Scenario: Google Places data caching

- **GIVEN** stores have google_place_id
- **WHEN** store data is loaded from database
- **THEN** cached Google Places data is retrieved
- **AND** no API calls are made during page load
- **AND** graceful fallback when cached data is unavailable

### Requirement: Responsive Design

The StoreList component SHALL provide optimal display across all device sizes with proper spacing and typography.

#### Scenario: Mobile optimization

- **GIVEN** stores display on mobile
- **WHEN** the layout renders
- **THEN** touch-friendly spacing and sizing
- **AND** readable text on small screens
- **AND** optimized image and map sizes

#### Scenario: Desktop spacing and layout

- **GIVEN** stores display on desktop
- **WHEN** the layout renders
- **THEN** appropriate spacing between map and info sections
- **AND** consistent margins and padding
- **AND** readable typography at all sizes

### Requirement: Accessibility

The store list SHALL be accessible to users with disabilities with proper semantic markup and keyboard navigation.

#### Scenario: Screen reader support

- **GIVEN** a screen reader user accesses the store list
- **WHEN** navigating the content
- **THEN** store names are proper headings
- **AND** images have descriptive alt text including store name and location

#### Scenario: Keyboard navigation for modals

- **GIVEN** a modal is open (image modal or other overlays)
- **WHEN** a keyboard-only user presses Tab
- **THEN** focus cycles through modal elements (close button, image)
- **AND** Escape key closes the modal
- **AND** focus returns to the triggering element when modal closes

### Requirement: Loading States and Performance

The component SHALL provide appropriate loading states and optimize performance for large datasets.

#### Scenario: Data loading indicators

- **GIVEN** store data is being fetched from the database
- **WHEN** the component initially loads
- **THEN** skeleton loading placeholders are displayed
- **AND** placeholders show the expected layout structure (map area, info sections)
- **AND** loading states are dismissed when data arrives
- **AND** skeleton components follow the existing DishCardSkeleton pattern for consistency

#### Scenario: Image lazy loading

- **GIVEN** stores have multiple photos
- **WHEN** the component renders
- **THEN** images use lazy loading to improve initial page load performance
- **AND** images load only when they enter the viewport
- **AND** a blur placeholder is shown until the image loads

### Requirement: Error Handling

The component SHALL handle API failures and missing data gracefully without breaking the user experience.

#### Scenario: Google API failure

- **GIVEN** Google Places API (New) is unavailable
- **WHEN** store data loads
- **THEN** store information displays without ratings
- **AND** operating hours section is not rendered
- **AND** no errors are shown to users

#### Scenario: Missing store photos

- **GIVEN** a store has no photos
- **WHEN** the store renders
- **THEN** the photo gallery is hidden
- **AND** layout adjusts appropriately
- **AND** no broken image placeholders appear

#### Scenario: Component error boundaries

- **GIVEN** a JavaScript error occurs in the StoreList component
- **WHEN** an error is thrown
- **THEN** the error boundary catches the error
- **AND** a user-friendly error message is displayed
- **AND** the rest of the page continues to function
- **AND** error details are logged for debugging

### Requirement: Google Places Data Sync

The system SHALL implement a server-side sync job to cache Google Places API (New) data and minimize API calls.

#### Scenario: Sync job execution

- **GIVEN** stores exist with google_place_id
- **WHEN** the sync job runs on schedule
- **THEN** stores with `google_last_synced_at IS NULL` are processed (cold start)
- **AND** stores with `google_last_synced_at > 30 days ago` are processed (refresh)
- **AND** stores with `google_last_synced_at <= 30 days ago` are skipped
- **AND** Google Places API (New) is called for each selected store
- **AND** database is updated with rating, hours, and sync timestamp
- **AND** `google_last_synced_at` is set to current timestamp for all processed stores

#### Scenario: Sync state independence

- **GIVEN** a store has `google_place_id` but NULL `google_rating` and `google_trading_hours`
- **WHEN** the sync job evaluates the store
- **THEN** sync decision is based only on `google_last_synced_at` value
- **AND** NULL data fields do not trigger unnecessary API calls
- **AND** legitimate NULL responses from Google are preserved

#### Scenario: Frontend data reading

- **GIVEN** the locations page loads
- **WHEN** store data is requested
- **THEN** frontend reads cached Google data from database
- **AND** no direct Google API calls are made by frontend
- **AND** cached data is used for ratings and trading hours display

#### Scenario: Cron job authentication

- **GIVEN** the sync job endpoint is called
- **WHEN** the request includes the correct CRON_SECRET header
- **THEN** the sync job executes successfully
- **AND** stores are processed according to sync rules

#### Scenario: Cron job unauthorized access

- **GIVEN** the sync job endpoint is called
- **WHEN** the request does not include the correct CRON_SECRET header
- **THEN** the request is rejected with 401 Unauthorized
- **AND** no sync operation is performed

### Requirement: Testing

The StoreList component SHALL have comprehensive test coverage including unit tests, integration tests, and accessibility tests.

#### Scenario: Unit tests for component variants

- **GIVEN** the StoreList component is tested
- **WHEN** different layout variants are provided
- **THEN** alternating desktop layout renders correctly
- **AND** mobile stacked layout renders correctly
- **AND** component takes full width of container

#### Scenario: Responsive layout testing

- **GIVEN** the StoreList component is rendered at different viewport sizes
- **WHEN** viewport width changes
- **THEN** mobile layout (<768px) shows stacked pattern
- **AND** desktop layout (≥768px) shows alternating pattern
- **AND** map and info sections scale proportionally

#### Scenario: Google API mocking

- **GIVEN** Google Places API responses are mocked
- **WHEN** store data loads
- **THEN** ratings display correctly from cached data
- **AND** operating hours display current day's hours
- **AND** API failures are handled gracefully

#### Scenario: Integration tests for locations page

- **GIVEN** the locations page includes StoreList component
- **WHEN** the page loads
- **THEN** store data is fetched from database
- **AND** StoreList renders below the hero section
- **AND** all component interactions work correctly

#### Scenario: Accessibility testing

- **GIVEN** screen reader users access the store list
- **WHEN** navigating with keyboard
- **THEN** store names are proper headings
- **AND** images have descriptive alt text
- **AND** modal can be closed with Escape key
- **AND** focus management works correctly

