# catering-order-submission Specification

## Purpose
TBD - created by archiving change add-catering-order-submission. Update Purpose after archive.
## Requirements
### Requirement: Catering Order Persistence

The system SHALL persist submitted catering orders to `public.catering_orders` using server-side credentials.

#### Scenario: Successful order persistence

- **WHEN** a user submits the catering form with valid values
- **THEN** a row is inserted into `public.catering_orders` with `store_id`, `catering_date`, `pickup_time`, `first_name`, `last_name`, `email`, and `phone` populated from the form.

### Requirement: Store Notification Email

The system SHALL send a store notification email via Resend when the selected store has a non-empty email address.

#### Scenario: Store email present

- **GIVEN** the selected store has a non-empty `email`
- **WHEN** a catering order is stored
- **THEN** an HTML email is sent to the store using sender `catering-orders@hotlob.com.au`.
- **AND** the subject is `New Catering Order - {storeName} - {cateringDate} {pickupTime}`.
- **AND** the email body includes the order details and the customer-local submission time formatted using the `en-AU` locale, 12-hour clock, and the customer’s time zone identifier.

#### Scenario: Store email missing

- **GIVEN** the selected store has no email
- **WHEN** a catering order is stored
- **THEN** no email is sent.

### Requirement: Customer-Local Submission Time Formatting

The system SHALL include the customer-local submission time and time zone in the store email.

#### Scenario: Submission time rendering

- **WHEN** an order is submitted from the customer’s browser
- **THEN** the submission time is formatted using Australian date conventions (day-month-year) and a 12-hour clock.
- **AND** the time zone identifier from the customer’s browser locale is appended in parentheses.

### Requirement: Submission Toast Feedback

The system SHALL show centered toast feedback for catering order submission outcomes.

#### Scenario: Success toast

- **WHEN** a catering order is stored successfully
- **THEN** a toast appears centered in the viewport with rounded corners (`6px`) and background `rgba(43, 164, 113, 0.10)`.
- **AND** the toast has a height of `24px`, horizontal padding of `16px`, and vertical padding of `12px`, with width sized to content.
- **AND** the toast includes a green success icon (darker than the background tint) sized `20px` by `20px`, an `8px` gap between icon and text, and the text "Order submitted" in color `#4E5969` with a font size of `16px`.
- **AND** the toast auto-dismisses after a short duration with a fade-out effect.

#### Scenario: Error toast

- **WHEN** a catering order submission fails
- **THEN** a toast appears centered in the viewport with rounded corners (`4px`) and background `#FCF0F0`.
- **AND** the toast has a height of `24px`, horizontal padding of `16px`, and vertical padding of `12px`, with width sized to content.
- **AND** the toast includes a red error icon (darker than the background tint) sized `20px` by `20px`, an `8px` gap between icon and text, and the text "Submission failed" in color `#4E5969` with a font size of `16px`.
- **AND** the toast auto-dismisses after a short duration with a fade-out effect.

### Requirement: Form Reset After Successful Submission

The system SHALL reset the catering form after a successful submission.

#### Scenario: Form reset
- **WHEN** a catering order is stored successfully
- **THEN** the catering form fields are cleared and reset to their initial state.

