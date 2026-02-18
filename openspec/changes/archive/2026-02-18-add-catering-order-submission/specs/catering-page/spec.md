## MODIFIED Requirements

### Requirement: Catering Form Submit Button

The form SHALL include a submit button labeled "SUBMIT".

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
