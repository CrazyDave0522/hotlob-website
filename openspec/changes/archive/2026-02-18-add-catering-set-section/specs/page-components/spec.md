## ADDED Requirements

### Requirement: Home Page Catering Set Section

The system SHALL render a Catering Set section on the home page immediately after the See Our Food section.

#### Scenario: Placement below See Our Food

- **WHEN** the home page is rendered
- **THEN** the Catering Set section appears immediately after the See Our Food section.

#### Scenario: Background images by viewport

- **WHEN** the viewport width is less than 768px
- **THEN** the Catering Set section uses `/images/section-bg/home-bg-catering-mb.png` as its background image.
- **WHEN** the viewport width is 768px or greater
- **THEN** the Catering Set section uses `/images/section-bg/home-bg-catering.png` as its background image.
- **AND** the background image uses `cover` sizing.

#### Scenario: Title and line content

- **WHEN** the Catering Set section is rendered
- **THEN** the section displays the following lines, each on its own line, in this order: The ULTIMATE Catering Pack!; Leave as what you have; MIX 16 ROLL SET PAX 4-6; 6 x Lobster Roll; 5 x Soft Shell Crab Roll; 5 x Prawn Roll.

#### Scenario: Catering Set line typography

- **WHEN** the Catering Set section is rendered
- **THEN** the line "The ULTIMATE Catering Pack!" uses color `#FFD632`, font-style `normal`, font-weight `600`, line-height `normal`, and a responsive font size capped at `40px`.
- **AND** the line "Leave as what you have" uses color `#FFFFFF`, font-style `normal`, font-weight `600`, line-height `normal`, and a responsive font size capped at `40px`.
- **AND** the lines "MIX 16 ROLL SET PAX 4-6", "6 x Lobster Roll", "5 x Soft Shell Crab Roll", and "5 x Prawn Roll" use color `#FFFFFF`, font-style `normal`, font-weight `400`, a responsive line-height capped at `52px`, and a responsive font size capped at `24px`.

#### Scenario: Centered text alignment

- **WHEN** the Catering Set section is rendered
- **THEN** the two highlighted Catering Set lines are center-aligned.
- **AND** the item list container is centered while its lines are left-aligned.

#### Scenario: Order Online button

- **WHEN** the Catering Set section is rendered
- **THEN** an "Order Online" button appears below the Catering Set text.
- **AND** the button has a `30px` border radius and a `#FFFFFF` background color.
- **AND** the button text uses color `#1D1E1F`, font-style `normal`, font-weight `400`, line-height `normal`, and a responsive font size capped at `20px`.
- **AND** the button is centered within the section.
- **AND** hovering the button changes the button text color to the primary red token.
- **AND** clicking the button navigates to the Catering page.
- **AND** the button is responsive with a maximum size of `240px` by `56px` on mobile and `200px` by `48px` on desktop while maintaining the specified aspect ratio.
- **AND** at a `375px` viewport width, the button width is `120px` to maintain proportional scaling.
