# customer-reviews-display Specification

## Purpose

Enable display of customer reviews fetched from the `curated_reviews` table in a dedicated component on the locations page, providing social proof and building trust with website visitors.

## ADDED Requirements

### Requirement: Component Location

The system SHALL add a new CustomerReviews section below the store list on the `/locations` page.

#### Scenario: Add reviews section to locations page

**GIVEN** the locations page exists
**WHEN** a user visits `/locations`
**THEN** they see the CustomerReviews component wrapped in a `<section>` tag below the StoreList
**AND** the component loads and displays reviews
**AND** the layout remains responsive

#### Scenario: Responsive design across devices

**GIVEN** the CustomerReviews component is displayed
**WHEN** viewed on mobile devices (screen width < 768px)
**THEN** the component displays properly with full-width review items
**AND** review text is readable with appropriate font sizes
**AND** touch targets are appropriately sized for mobile interaction
**AND** layout is optimized for mobile viewing
**WHEN** viewed on desktop devices (screen width >= 768px)
**THEN** the component displays properly with enhanced desktop layout
**AND** spacing and typography are optimized for desktop viewing
**AND** maintains readability and usability across different desktop screen sizes

## ADDED Requirements

### Requirement: Data Source

The system SHALL fetch customer reviews from the `curated_reviews` table via Supabase client.

#### Scenario: Fetch reviews from database

**GIVEN** the CustomerReviews component is rendered
**WHEN** the component mounts
**THEN** it fetches all reviews from `curated_reviews` table
**AND** filters to only include reviews where `language = 'en'`
**AND** sorts them by `rating` descending (highest first)
**AND** displays them in the component

### Requirement: Sorting

The system SHALL sort reviews by rating descending to display highest rating first (5-star reviews displayed first).

#### Scenario: Sort reviews by rating

**GIVEN** reviews are fetched from the database
**WHEN** displaying the reviews
**THEN** they are ordered by `rating` descending (highest first)
**AND** 5-star reviews appear before lower-rated reviews

### Requirement: Display Format

The system SHALL display each review as a row with user icon, author name, rating stars, and review text.

#### Scenario: Display review with all required elements

**GIVEN** a review exists in the database
**WHEN** rendering the review item
**THEN** it shows the author photo from `author_photo_url` or `User` icon from Lucide React if not available
**AND** displays the `author_name` next to the user icon
**AND** shows the `rating` using the Rating component below the user name/date area
**AND** displays the `review_text` below the rating
**AND** displays the `review_time` as date in Australian format (DD/MM/YYYY) below the user name

#### Scenario: Review layout structure

**GIVEN** a review is displayed
**WHEN** the layout is rendered
**THEN** user icon is on the left
**AND** user name is next to the icon (on the right)
**AND** review date is below user name
**AND** rating stars are below user name/date area
**AND** review text is below the rating

#### Scenario: Review separator styling

**GIVEN** multiple reviews are displayed
**WHEN** rendering the review list
**THEN** each review item has a separator line with `border-bottom: 1px solid #E1E4E9`
**AND** the last review does not have a bottom border

#### Scenario: Handle missing optional data

**GIVEN** a review has `author_photo_url` missing or invalid
**WHEN** rendering the review
**THEN** it uses the `User` icon from Lucide React as the default user icon
**AND** maintains consistent layout and appearance

### Requirement: Rating Component

The system SHALL reuse the existing `Rating` component for displaying star ratings.

#### Scenario: Use existing Rating component

**GIVEN** a review has a rating value
**WHEN** displaying the rating
**THEN** it uses the existing Rating component
**AND** displays the appropriate number of stars
**AND** maintains consistency with other rating displays in the application

### Requirement: User Icon

The system SHALL use `author_photo_url` from review data for user icons, with fallback to default user icon.

#### Scenario: Display author photo

**GIVEN** a review has `author_photo_url` available
**WHEN** rendering the review
**THEN** it displays the author photo as the user icon

#### Scenario: Fallback to default icon

**GIVEN** a review has `author_photo_url` missing or invalid
**WHEN** rendering the review
**THEN** it uses the `User` icon from Lucide React as the default user icon
**AND** maintains consistent layout and appearance

### Requirement: No Store Filtering

The system SHALL display all reviews across all stores for maximum social proof, without filtering by specific store.

#### Scenario: Display all reviews

**GIVEN** reviews exist for multiple stores
**WHEN** displaying reviews on the locations page
**THEN** all reviews are shown regardless of which store they belong to
**AND** no store-specific filtering is applied

### Requirement: Typography and Visual Styling

The system SHALL apply specific typography styles to user names and review text for consistent visual hierarchy and readability.

#### Scenario: User name typography

**GIVEN** a review is displayed
**WHEN** the author name is rendered
**THEN** it uses font-weight: 600
**AND** it uses line-height: normal
**AND** it uses text-transform: uppercase
**AND** it uses color: var(--color-black)

#### Scenario: Review text typography

**GIVEN** a review is displayed
**WHEN** the review text is rendered
**THEN** it uses font-style: normal
**AND** it uses font-weight: 400
**AND** it uses line-height: normal
**AND** it uses color: var(--color-gray)

#### Scenario: Review date formatting

**GIVEN** a review has a `review_time` value
**WHEN** the review date is displayed
**THEN** it shows only the date portion
**AND** uses Australian date format (DD/MM/YYYY)
**AND** uses color: var(--color-gray)
**AND** appears in a subtle/secondary color to indicate metadata

### Requirement: Component Structure

The CustomerReviews component SHALL not include `<section>` elements in its markup. Section wrappers SHALL be provided at the page level where the component is used.

#### Scenario: Component does not contain section elements

**GIVEN** the CustomerReviews component is implemented
**WHEN** inspecting the component's rendered HTML
**THEN** no `<section>` tags are present within the component
**AND** the component renders its content in appropriate semantic elements

### Requirement: Cross-Device Display Compatibility

The CustomerReviews component SHALL display properly and be fully functional on both desktop and mobile devices, ensuring consistent user experience across all supported screen sizes.

#### Scenario: Desktop display compatibility

**GIVEN** the CustomerReviews component is viewed on desktop devices
**WHEN** the screen width is 768px or greater
**THEN** all review content is visible and accessible
**AND** the layout takes advantage of available screen space
**AND** hover states and desktop-specific interactions work correctly

#### Scenario: Mobile display compatibility

**GIVEN** the CustomerReviews component is viewed on mobile devices
**WHEN** the screen width is less than 768px
**THEN** all review content is visible and accessible
**AND** the layout is optimized for touch interaction
**AND** text is readable without requiring horizontal scrolling
**AND** the component works properly in mobile browsers

### Requirement: Loading States and Empty Handling

The system SHALL provide appropriate user feedback during data loading and handle cases when no reviews are available by not rendering the component.

#### Scenario: Show loading state during fetch

**GIVEN** the component is fetching reviews
**WHEN** data is loading
**THEN** it displays the same spinner used in NewsList component
**AND** prevents layout shift
**AND** provides visual feedback to the user

#### Scenario: Handle empty review state

**GIVEN** no reviews exist in the database
**WHEN** the component loads
**THEN** the component does not render
**AND** no reviews section appears on the page

### Requirement: Accessibility

The system SHALL ensure the reviews display is accessible to users with disabilities.

#### Scenario: Screen reader compatibility

**GIVEN** a screen reader user accesses the reviews
**WHEN** navigating the component
**THEN** all review information is announced properly
**AND** rating information is conveyed clearly
**AND** semantic HTML structure is used

#### Scenario: Keyboard navigation

**GIVEN** a keyboard-only user
**WHEN** navigating the reviews section
**THEN** focus management works appropriately
**AND** interactive elements are reachable
**AND** visual focus indicators are present

### Requirement: Error Handling

The system SHALL handle fetch errors gracefully with user-friendly messages and logging.

#### Scenario: Handle fetch errors gracefully

**GIVEN** the review fetch fails due to network or database issues
**WHEN** the component attempts to load reviews
**THEN** it displays a user-friendly error message
**AND** logs the error for debugging
**AND** allows the user to retry or continue browsing
