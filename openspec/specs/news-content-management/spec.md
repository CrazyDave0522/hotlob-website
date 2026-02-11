# news-content-management Specification

## Purpose
TBD - created by archiving change add-news-list-and-details. Update Purpose after archive.
## Requirements
### Requirement: News List Display

The news page SHALL display a list of published news articles in a left-right layout with cover images on the left and article details on the right, arranged one article per row.

#### Scenario: Customer views published news articles

GIVEN the customer navigates to the news page
WHEN the page loads
THEN they see a list of news articles where is_published = true
AND articles are ordered by publish_date descending (newest first)
AND each article displays in left-right layout:
  - Left side: Cover image
  - Right side: Title, excerpt, and publish date
AND articles are displayed one per row on all screen sizes
AND the list is wrapped in a semantic `<section>` element
AND on mobile: section has background image `our-locations-bg-stores-mb.png`
AND on desktop: section has solid background color `#F7F8FA`

#### Scenario: Customer clicks on news article

GIVEN the customer is viewing the news list
WHEN they click on a news article
THEN the article opens in a new browser tab
AND the URL follows the pattern `/hotlob-news/{slug}`

### Requirement: News Detail Display

Individual news articles SHALL be accessible via unique URLs and display full content with proper formatting and metadata, but only for published articles.

#### Scenario: Customer views individual news article

GIVEN the customer navigates to a news detail URL for a published article
WHEN the page loads with a valid slug where is_published = true
THEN they see the full article with title, cover image, content, and publish date
AND the content is rendered from Editor.js JSON structure
AND the page includes proper SEO meta tags
AND the content is wrapped in a semantic `<section>` element with no additional styling

#### Scenario: Customer views non-existent or unpublished news article

GIVEN the customer navigates to an invalid slug OR a slug for an unpublished article (is_published = false)
WHEN the page attempts to load
THEN they see an appropriate 404 not found page

### Requirement: Content Rendering

News content stored as Editor.js JSON SHALL be properly rendered as HTML with appropriate styling and fallback handling.

#### Scenario: News content contains Editor.js blocks

GIVEN a news article contains Editor.js formatted content
WHEN the detail page renders
THEN all supported Editor.js block types are displayed correctly
AND unsupported blocks show appropriate fallback content
AND the content maintains proper typography and spacing

### Requirement: Mobile-First Design

News components SHALL follow mobile-first CSS architecture with base styles optimized for mobile devices and desktop enhancements applied via min-width media queries.

#### Scenario: Mobile-first base styles

GIVEN news components are implemented
WHEN CSS is written
THEN mobile styles are applied as base styles (no media queries)
AND desktop styles override base styles using min-width media queries
AND components are fully functional on mobile without desktop enhancements

### Requirement: Image Sizing Formulas

News item images SHALL use mobile-first CSS clamp() formulas with separate scaling for desktop breakpoints to ensure optimal proportions at each screen size.

#### Scenario: Mobile-first image scaling (base styles)

GIVEN the viewport is any size
WHEN news item images are displayed
THEN images use mobile-optimized clamp() formulas as base styles
AND reach maximum 200px × 200px at 768px viewport on mobile
AND scale proportionally across all screen sizes

#### Scenario: Desktop image scaling enhancement (≥768px)

GIVEN the viewport is 768px or wider
WHEN news item images are displayed
THEN images use desktop-specific clamp() formulas that override mobile base styles
AND reach maximum 280px × 160px at 1920px viewport
AND scale proportionally below 1920px

### Requirement: Typography Scaling

News item text elements SHALL scale responsively with maximum font sizes.

#### Scenario: Title typography scaling

GIVEN news items are displayed in the list
WHEN the viewport changes
THEN title text uses clamp() scaling with maximum 18px font size
AND scales down proportionally on smaller viewports

#### Scenario: Excerpt typography scaling

GIVEN news items are displayed in the list
WHEN the viewport is desktop (>=768px)
THEN excerpt text uses clamp() scaling with maximum 16px font size
WHEN the viewport is mobile (<768px)
THEN excerpt text uses clamp() scaling with maximum 18px font size
AND scales down proportionally on smaller viewports

#### Scenario: Author and date typography scaling

GIVEN news items are displayed in the list
WHEN the viewport is desktop (>=768px)
THEN date text uses clamp() scaling with maximum 14px font size
WHEN the viewport is mobile (<768px)
THEN date text uses clamp() scaling with maximum 16px font size
AND scales down proportionally on smaller viewports
AND author information is not displayed

### Requirement: Gap Spacing

News list items SHALL have responsive gap spacing between each item.

#### Scenario: Desktop gap spacing

GIVEN news items are displayed in the list
WHEN the viewport is desktop (>=768px)
THEN gap between news items uses clamp() scaling with maximum 60px at 1920px viewport
AND scales down proportionally below 1920px

#### Scenario: Mobile gap spacing

GIVEN news items are displayed in the list
WHEN the viewport is mobile (<768px)
THEN gap between news items uses clamp() scaling with maximum 20px at 768px viewport
AND scales down proportionally below 768px

### Requirement: Mobile Item Styling

News item wrappers on mobile devices SHALL have card-like styling with responsive padding. The news list wrapper SHALL NOT have its own styling.

#### Scenario: Mobile item wrapper appearance

GIVEN news items are displayed on mobile devices (<768px)
WHEN the news item wrapper is rendered
THEN it has border-radius of 20px
AND it has white background (#FFF)
AND it has box-shadow of 0 0 20px 0 rgba(0, 0, 0, 0.12)
AND it has responsive padding using clamp(12px, 3.2vw, 20px)

#### Scenario: Mobile list wrapper absence

GIVEN the news list is displayed on mobile devices (<768px)
WHEN the news list is rendered
THEN the list container does not have wrapper styling
AND only individual news items have the card-like appearance

### Requirement: Desktop List Styling

The news list section on desktop devices SHALL have a solid background color. Individual news items SHALL NOT have their own wrapper styling.

#### Scenario: Desktop list section appearance

GIVEN the news list is displayed on desktop devices (>=768px)
WHEN the news list section is rendered
THEN it has solid background color #F7F8FA

#### Scenario: Desktop item wrapper absence

GIVEN news items are displayed on desktop devices (>=768px)
WHEN the news items are rendered
THEN individual news items do not have wrapper styling
AND only the section container has background styling

### Requirement: Desktop Item Separators

News items on desktop devices SHALL have separator lines for visual organization.

#### Scenario: Desktop item separators

GIVEN news items are displayed on desktop devices (>=768px)
WHEN news items are rendered
THEN there is a 1px solid separator line between each news item
AND the separator color is #E1E4E9

### Requirement: News Detail Page Layout

The news detail page SHALL follow a structured layout with specific content ordering and no wrapper styling.

#### Scenario: News detail content order

GIVEN the customer navigates to a news detail page
WHEN the page is rendered
THEN content appears in this order from top to bottom:
  Title, publish date, separator line, cover image, news content
AND the separator line has height of 1px
AND the separator line has background color #E1E4E9
AND the content is wrapped in a semantic `<section>` element with no additional styling

#### Scenario: News detail wrapper absence

GIVEN the customer navigates to a news detail page
WHEN the content is rendered
THEN there is no card-like wrapper styling around the content
AND the section element provides semantic structure only

### Requirement: News Detail Cover Image Sizing

News detail page cover images SHALL scale responsively with full container width and no maximum width constraints.

#### Scenario: Detail image scaling (all viewports)

GIVEN the customer views a news detail page on any device
WHEN the cover image is displayed
THEN images take full width of their container
AND images use responsive height with object-fit: cover
AND images scale proportionally with viewport size

News pages SHALL load efficiently with optimized images and minimal bundle impact.

#### Scenario: News pages load efficiently

GIVEN the customer navigates to news pages
WHEN the pages load
THEN content appears within 2 seconds on fast connections
AND images are optimized for web delivery
AND no unnecessary re-renders occur during navigation

### Requirement: News List Pagination

The news list SHALL implement infinite loading pagination to handle large numbers of articles efficiently.

#### Scenario: News list loads initial articles

GIVEN the customer navigates to the news page
WHEN the page first loads
THEN 10 news articles are displayed initially
AND articles are ordered by publish_date descending (newest first)

#### Scenario: News list loads more articles on scroll

GIVEN the customer is viewing the news list with articles loaded
WHEN they scroll near the bottom of the current articles
THEN the next 10 articles are automatically loaded and appended
AND the loading process is seamless without page refresh
AND articles maintain their chronological order

### Requirement: Site Navigation

The site navigation SHALL include a "Hotlob News" link that navigates to the news list page.

#### Scenario: News page is accessible from site navigation

GIVEN the customer is on any page
WHEN they click the "Hotlob News" link in the site navigation
THEN they are navigated to the news list page
AND the URL becomes `/hotlob-news`
AND the page displays the list of published news articles

