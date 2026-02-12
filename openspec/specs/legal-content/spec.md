# legal-content Specification

## Purpose
TBD - created by archiving change add-legal-pages. Update Purpose after archive.
## Requirements
### Requirement: Footer Legal Link Styling

Footer legal links SHALL display hover effects with color #EA4148 to provide visual feedback and improve user experience.

#### Scenario: Legal link hover effect

- **GIVEN** the footer is displayed
- **WHEN** the user hovers over Privacy Policy or Terms & Conditions links
- **THEN** the link text color changes to #EA4148
- **AND** the color transition is smooth
- **AND** the effect is visible on all devices

### Requirement: Legal Content Page Layout

Legal content pages SHALL reuse the ContentDetail component (renamed from NewsDetail) while maintaining complete backward compatibility for existing news pages.

#### Scenario: Legal page layout structure

- **GIVEN** a user navigates to /privacy-policy or /terms-and-conditions
- **WHEN** the page loads
- **THEN** the page displays using the ContentDetail component
- **AND** the layout matches news detail pages for consistency
- **AND** the page is responsive across all screen sizes

#### Scenario: News page unchanged behavior

- **GIVEN** a user navigates to a news detail page
- **WHEN** the page loads
- **THEN** the page displays exactly the same as before the legal content changes
- **AND** all existing functionality (title, meta, image, EditorJS content) works unchanged
- **AND** no visual or behavioral differences are introduced

### Requirement: Legal Content Rendering

Legal pages SHALL load and render HTML content from the public/legal-docs directory with proper formatting and accessibility.

#### Scenario: Privacy Policy content display

- **GIVEN** a user navigates to /privacy-policy
- **WHEN** the page loads
- **THEN** the content from privacy-policy.html is displayed
- **AND** HTML formatting is preserved (headings, paragraphs, lists)
- **AND** the content is accessible and readable

#### Scenario: Terms and Conditions content display

- **GIVEN** a user navigates to /terms-and-conditions
- **WHEN** the page loads
- **THEN** the content from terms-and-conditions.html is displayed
- **AND** HTML formatting is preserved (headings, paragraphs, lists)
- **AND** the content is accessible and readable

### Requirement: HTML Content Styling

Legal HTML content SHALL be styled with proper typography, spacing, and visual hierarchy to ensure readability and professional appearance.

#### Scenario: HTML element styling

- **GIVEN** legal content contains HTML elements (headings, paragraphs, lists, links)
- **WHEN** the content is rendered
- **THEN** headings use appropriate font sizes and weights
- **AND** paragraphs have proper line height and spacing
- **AND** lists are properly indented with consistent styling
- **AND** links use primary brand colors with hover effects
- **AND** all text is readable and accessible

#### Scenario: Content type isolation

- **GIVEN** both news and legal content exist on the same site
- **WHEN** users view different content types
- **THEN** HTML styling only applies to legal content
- **AND** news content styling remains unchanged
- **AND** EditorJS content is not affected by HTML styling rules

### Requirement: Legal Link Navigation

Footer legal links SHALL navigate to appropriate pages and open in new tabs to preserve user context.

#### Scenario: Privacy Policy link navigation

- **GIVEN** the footer Privacy Policy link is clicked
- **WHEN** the user clicks the link
- **THEN** /privacy-policy opens in a new tab
- **AND** the current page remains open

#### Scenario: Terms and Conditions link navigation

- **GIVEN** the footer Terms & Conditions link is clicked
- **WHEN** the user clicks the link
- **THEN** /terms-and-conditions opens in a new tab
- **AND** the current page remains open

### Requirement: Legal Page SEO

Legal pages SHALL include appropriate metadata for search engine optimization and social sharing.

#### Scenario: Legal page metadata

- **GIVEN** a legal page is loaded
- **WHEN** search engines or social platforms access the page
- **THEN** appropriate title and description metadata is provided
- **AND** Open Graph tags are included for social sharing
- **AND** the page is indexed appropriately

