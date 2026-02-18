# catering-page Specification

## Purpose
TBD - created by archiving change add-catering-page. Update Purpose after archive.
## Requirements
### Requirement: Catering Page Sections

The catering page SHALL render a top section followed by a bottom section within the main content area.

#### Scenario: Section presence and order

- **WHEN** the catering page is rendered
- **THEN** a top section appears first
- **AND** a bottom section appears after the top section.

### Requirement: Catering Page Top Text

The top section SHALL display the catering text lines from the home page catering section and SHALL NOT render an order button.

#### Scenario: Top text content

- **WHEN** the top section is rendered
- **THEN** the following lines appear in order, each on its own line: The ULTIMATE Catering Pack!; Leave as what you have; MIX 16 ROLL SET PAX 4-6; 6 x Lobster Roll; 5 x Soft Shell Crab Roll; 5 x Prawn Roll.
- **AND** no "Order Online" button is rendered in the top section.

### Requirement: Catering Page Bottom Headings

The bottom section SHALL display the title and subtitle centered horizontally using the SectionTitle component, with subtitle support as an optional prop when needed.

#### Scenario: Bottom section headings

- **WHEN** the bottom section is rendered
- **THEN** the SectionTitle component renders the title "ORDER NOW" centered horizontally.
- **AND** the SectionTitle component renders the subtitle "Please note that orders need to be placed 48 hours (business days) ahead of pick up day." centered horizontally.
- **AND** the subtitle font size is half of the title font size.
- **AND** the subtitle text color is `#86909C`.

#### Scenario: Mobile heading placement

- **WHEN** the viewport width is less than 768px
- **THEN** the top background section renders at full image height before ending after the catering text lines.
- **AND** the SectionTitle component is structurally inside the top section and visually placed near its bottom edge.

#### Scenario: Desktop heading placement

- **WHEN** the viewport width is 768px or greater
- **THEN** the SectionTitle component is rendered above the two-column bottom section layout and centered in the viewport.

### Requirement: Catering Page Form Placeholder Layout

The bottom section SHALL provide a form container positioned on the left side of the section, with the right side intentionally empty on desktop viewports.

#### Scenario: Desktop form placement

- **WHEN** the viewport width is 768px or greater
- **THEN** the bottom section presents a left-side form container area
- **AND** the right-side area remains empty.

#### Scenario: Mobile form placement

- **WHEN** the viewport width is less than 768px
- **THEN** the form container appears below the bottom section headings in a single-column layout.

### Requirement: Catering Order Form Fields

The catering page form SHALL include fields for store selection, first name, last name, email, phone, catering date, and pickup time.

#### Scenario: Form fields rendered

- **WHEN** the catering page is rendered
- **THEN** a store dropdown is present with a prompt option and store options labeled as `Pick up @[store name]`.
- **AND** the store field label reads "Select a store".
- **AND** text inputs for first name, last name, email, and phone are present.
- **AND** a date input for catering date is present.
- **AND** a pickup time dropdown is present.

### Requirement: Catering Order Form Layout

The form SHALL lay out fields with consistent widths, using a single-row store select and two fields per row for the remaining inputs.

#### Scenario: Field row structure

- **WHEN** the catering form is rendered
- **THEN** the store selection field occupies its own row.
- **AND** the remaining fields are arranged in rows with two fields per row.
- **AND** all field containers have equal width, including the single-field row.

#### Scenario: Mobile single-column layout

- **WHEN** the viewport width is less than 768px
- **THEN** each form field occupies its own row.

### Requirement: Catering Form Validation

The form SHALL validate name, email, and phone fields according to the defined input rules.

#### Scenario: Name validation

- **WHEN** a user enters first or last name
- **THEN** the value is required
- **AND** the value only permits letters, spaces, hyphens, and apostrophes.

#### Scenario: Email validation

- **WHEN** a user enters an email address
- **THEN** the value is required
- **AND** the value must pass standard HTML5 email validation (local-part@domain).

#### Scenario: Australian phone validation

- **WHEN** a user enters a phone number
- **THEN** the value is required
- **AND** the value must match Australian landline or mobile formats (e.g., `04xx xxx xxx`, `+61 4xx xxx xxx`, `02/03/07/08 xxxx xxxx`, `+61 2/3/7/8 xxxx xxxx`), allowing optional spaces.

### Requirement: Catering Form Field Text Styling

Form field labels and placeholders SHALL use the specified colors and relative sizing.

#### Scenario: Label and placeholder appearance

- **WHEN** the catering form is rendered
- **THEN** field label text uses color `#1D1E1F`.
- **AND** placeholder text uses color `#919AA5`.
- **AND** placeholder text font size is `2px` smaller than the field label font size.

### Requirement: Catering Form Field Visual Styling

Form fields SHALL use the specified border radius, border, and background styling.

#### Scenario: Field border and background

- **WHEN** the catering form fields are rendered
- **THEN** each input/select field uses a `4px` border radius.
- **AND** each field uses a `1px` solid border with color `#CCCFD7`.
- **AND** each field uses a `#FFF` background color.

### Requirement: Catering Form Field Aspect Ratio

Form fields SHALL maintain a 340x40 aspect ratio while scaling responsively (not fixed size).

#### Scenario: Field aspect ratio

- **WHEN** the catering form fields are rendered
- **THEN** each input/select field maintains an aspect ratio equivalent to `340px` by `40px`.

#### Scenario: Field size at 1920px

- **WHEN** the viewport width is 1920px
- **THEN** each input/select field renders at `340px` by `40px`.

#### Scenario: Field size at 768px

- **WHEN** the viewport width is 768px
- **THEN** each input/select field renders at `630px` by `70px`.

### Requirement: Catering Date Constraints

The catering date field SHALL only allow dates starting from the current date plus two calendar days.

#### Scenario: Minimum selectable date

- **WHEN** the user opens the catering date picker
- **THEN** the earliest selectable date is current local date + 2 days.

#### Scenario: Catering date helper text

- **WHEN** the catering date field is rendered
- **THEN** the helper text "Orders must be placed at least 2 days in advance" is displayed with the field.

### Requirement: Catering Pickup Time Options

The pickup time dropdown SHALL be disabled until a store is selected and SHALL reflect 30-minute intervals based on the store’s trading hours for the selected date.

#### Scenario: Time dropdown disabled without store selection

- **GIVEN** no store has been selected
- **WHEN** the user views the pickup time field
- **THEN** the pickup time dropdown is disabled.

#### Scenario: Time options from store trading hours

- **GIVEN** a store is selected and has trading hours for the selected date
- **WHEN** the pickup time options are generated
- **THEN** the first option starts at the store opening time rounded to the nearest 30 minutes.
- **AND** subsequent options appear at 30-minute intervals.
- **AND** the last option is the final 30-minute slot strictly before the store closing time.

#### Scenario: Fallback hours when trading hours are missing

- **GIVEN** a store is selected but trading hours for the selected date are unavailable
- **WHEN** the pickup time options are generated
- **THEN** options span 10:00 through 17:00 at 30-minute intervals.

### Requirement: Catering Form Submit Button

The form SHALL include a submit button labeled "SUBMIT" with no functional behavior beyond being present as a placeholder.

#### Scenario: Submit button rendered

- **WHEN** the catering form is rendered
- **THEN** a submit button with the label "SUBMIT" is displayed.

#### Scenario: Submit button styling

- **WHEN** the submit button is rendered
- **THEN** it uses a `30px` border radius.
- **AND** it uses a linear gradient background of `90deg` from `#EA4148` at `0%` to `#FFA159` at `100%`.
- **AND** it uses a box shadow of `3px 3px 0 0 rgba(175, 23, 23, 0.16)`.
- **AND** the button text color is white.

#### Scenario: Submit button hover styling

- **GIVEN** the device supports hover
- **WHEN** the user hovers the submit button
- **THEN** the background becomes a linear gradient of `180deg` from `#FB8225` at `0%` to `#D51D24` at `100%`.

#### Scenario: Submit button responsive sizing

- **WHEN** the viewport width is 1920px
- **THEN** the submit button size is `300px` by `46px` while preserving its aspect ratio.
- **WHEN** the viewport width is less than 1920px and at least 768px
- **THEN** the submit button scales down proportionally from the 300x46 size.
- **WHEN** the viewport width is 768px
- **THEN** the submit button size is `600px` by `80px` while preserving its aspect ratio.
- **WHEN** the viewport width is less than 768px
- **THEN** the submit button scales down proportionally from the 600x80 size.

#### Scenario: Submit button text sizing

- **WHEN** the viewport width is 768px
- **THEN** the submit button text uses a maximum font size of `34px`.
- **WHEN** the viewport width is less than 768px
- **THEN** the submit button text scales down proportionally from the 34px size.
- **WHEN** the viewport width is 1920px
- **THEN** the submit button text uses a maximum font size of `18px`.
- **WHEN** the viewport width is less than 1920px and at least 768px
- **THEN** the submit button text scales down proportionally from the 18px size.

### Requirement: Catering Page Background Images

The catering page SHALL use responsive background images with `100% auto` sizing for the whole page (desktop) and split sections (mobile).

#### Scenario: Desktop background image

- **WHEN** the viewport width is 768px or greater
- **THEN** the catering page uses `/images/section-bg/catering-bg.png` as a background image for the overall page container.
- **AND** the background uses `100% auto` sizing.

#### Scenario: Mobile background images

- **WHEN** the viewport width is less than 768px
- **THEN** the top section uses `/images/section-bg/catering-bg-mb.png` as its background image.
- **AND** the bottom section uses `/images/section-bg/catering-form-bg-mb.png` as its background image.
- **AND** both backgrounds use `100% auto` sizing.

