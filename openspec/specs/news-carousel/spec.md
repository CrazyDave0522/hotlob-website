# news-carousel Specification

## Purpose
TBD - created by archiving change 2026-02-12-add-news-carousel-component. Update Purpose after archive.
## Requirements
### Requirement: Carousel Display and Navigation

The NewsCarousel component SHALL display news articles in a horizontally scrollable carousel with responsive layouts, auto-advance functionality, and navigation controls.

#### Scenario: Desktop carousel layout and navigation

GIVEN the NewsCarousel component is rendered on desktop (≥768px viewport)
WHEN news data is provided (1 or more items)
THEN the carousel displays in left-right layout:

- Left side: Cover image (max 600×340px at 1920px, scales proportionally below 1920px)
- Right side: Title (font-weight: 600, font-style: normal, line-height: normal, max 24px at 1920px, scales proportionally below 1920px) and excerpt text (font-weight: 400, font-style: normal, line-height: normal, max 18px at 768px, scales proportionally below 768px)
  AND auto-advances to the next item every 3 seconds
  AND WHEN more than 1 item is provided:
- carousel indicators show current position below the carousel
- clicking indicators jumps to specific items
- keyboard navigation (arrow keys) navigates between items
- hover or focus pauses auto-advance for 5 seconds
  AND WHEN only 1 item is provided:
- no carousel indicators are displayed
- no auto-advance occurs
  AND title color changes to #EA4148 on hover
  AND excerpt text color is #86909C
  AND the entire carousel item area (image and text) is clickable and opens the news link in a new tab
  AND each article has white background, 20px border-radius, and subtle shadow

#### Scenario: Mobile carousel layout and navigation

GIVEN the NewsCarousel component is rendered on mobile (<768px viewport)
WHEN news data is provided (1 or more items)
THEN the carousel displays in top-bottom layout:

- Top: Cover image (max 690×340px at 768px viewport, scales proportionally below 768px)
- Bottom: Title (font-weight: 600, font-style: normal, line-height: normal, max 36px at 768px, scales proportionally below 768px) and excerpt text (font-weight: 400, font-style: normal, line-height: normal, max 30px at 768px, scales proportionally below 768px) stacked below
  AND auto-advances to the next item every 3 seconds
  AND WHEN more than 1 item is provided:
- swipe gestures navigate between items with looping (last → first, first → last)
- carousel indicators show current position below the carousel
- keyboard navigation (arrow keys) navigates between items
- touch interaction pauses auto-advance for 5 seconds
  AND WHEN only 1 item is provided:
- no carousel indicators are displayed
- no auto-advance occurs
  AND title color changes to #EA4148 on hover
  AND excerpt text color is #86909C
  AND the entire carousel item area (image and text) is clickable and opens the news link in a new tab
  AND each article has white background, 20px border-radius, and subtle shadow

#### Scenario: Carousel with empty data

GIVEN the NewsCarousel component receives no news data OR empty array
WHEN the component attempts to render
THEN the component does not render any visible content
AND no DOM elements are created

#### Scenario: Carousel with multiple items

GIVEN the NewsCarousel component receives multiple news items
WHEN the component renders
THEN all provided items are displayed
AND navigation works within the available items
AND auto-advance cycles through all items

### Requirement: Carousel Looping Navigation

The carousel SHALL implement looping navigation where reaching the last item and navigating forward wraps to the first item, and reaching the first item and navigating backward wraps to the last item.

#### Scenario: Looping forward navigation

GIVEN the carousel is displaying the last item (position N of N items)
WHEN the user presses the right arrow key OR swipes left on mobile
THEN the carousel navigates to the first item (position 1 of N)
AND the active indicator updates to show position 1
AND the transition is smooth and continuous

#### Scenario: Looping backward navigation

GIVEN the carousel is displaying the first item (position 1 of N items)
WHEN the user presses the left arrow key OR swipes right on mobile
THEN the carousel navigates to the last item (position N of N)
AND the active indicator updates to show position N
AND the transition is smooth and continuous

#### Scenario: Looping with single item

GIVEN the carousel contains only 1 item
WHEN the user attempts to navigate forward or backward
THEN the carousel remains on the single item
AND no navigation occurs (looping is not applicable with single item)

### Requirement: Carousel Indicators

The carousel SHALL display visual indicators below the carousel showing the current position and total number of items, with distinct active and inactive states that scale responsively while maintaining aspect ratio, when more than one item is present.

#### Scenario: Indicator states and interaction

GIVEN the NewsCarousel component is displaying more than 1 news item
WHEN the carousel renders
THEN indicators are displayed with:

- Active indicator: 1.875rem × 0.5rem (30px × 8px at 16px base font size), border-radius 20px, background #EA4148, scales responsively
- Inactive indicators: 0.5rem × 0.5rem (8px × 8px at 16px base font size), aspect-ratio 1/1, fill #000, opacity 0.2, scales responsively
- On mobile (<768px): Active indicators scale to 1.5rem × 0.4rem, inactive to 0.4rem × 0.4rem
  AND the number of indicators matches the number of items
  AND the active indicator reflects the current carousel position
  AND clicking an indicator navigates to that item position
  AND indicators maintain their aspect ratios across all screen sizes

### Requirement: Auto-Advance Functionality

The carousel SHALL automatically advance to the next item every 3 seconds when more than one item is present, with smart pause behavior on user interaction.

#### Scenario: Auto-advance timing and behavior

GIVEN the NewsCarousel component is displaying more than 1 news item
WHEN the carousel is visible and not being interacted with
THEN the carousel automatically advances to the next item every 3 seconds
AND the transition uses the same smooth animation as manual navigation
AND auto-advance cycles through all items with looping (last → first)

#### Scenario: Auto-advance pause on interaction

GIVEN the carousel is auto-advancing
WHEN the user hovers over the carousel OR focuses on it OR manually navigates
THEN auto-advance pauses immediately
AND resumes automatically after 5 seconds of no interaction
AND manual navigation resets the pause timer

#### Scenario: Auto-advance with single item

GIVEN the carousel contains only 1 item
WHEN the carousel renders
THEN no auto-advance occurs
AND the single item remains static

### Requirement: Visual Styling and Layout

The carousel SHALL implement modern card-based styling with gradient background section and elevated article appearance.

#### Scenario: Article card styling

GIVEN the NewsCarousel component is rendering articles
WHEN the carousel displays
THEN each article has:

- White background (#FFF)
- 20px border-radius for rounded corners
- Subtle shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05)
- Minimum height of 200px
- Smooth opacity transitions on state changes

#### Scenario: Section background styling

GIVEN the news carousel section is rendered on the home page
WHEN the section displays
THEN the section has a gradient background:

- Linear gradient from top to bottom (180deg)
- Start color: #FBF3F3 (light pink/cream)
- End color: #FFF (pure white)
- Creates visual separation and warmth for the news content

### Requirement: Clickable Carousel Items

The carousel SHALL make each news item clickable, opening the associated news article link in a new browser tab when clicked.

#### Scenario: Clicking carousel item opens link in new tab

GIVEN the NewsCarousel component is displaying news items with associated links
WHEN the user clicks anywhere on a carousel item (image or text area)
THEN the news article link opens in a new browser tab
AND the current page remains open
AND the cursor shows pointer style on hover to indicate clickability

#### Scenario: Carousel item accessibility

GIVEN the NewsCarousel component is displaying news items
WHEN the carousel renders
THEN each carousel item has appropriate ARIA attributes for link navigation
AND keyboard navigation (Enter/Space) opens the link in a new tab
AND screen readers announce the item as a clickable link to the news article

### Requirement: Responsive Image Sizing with Aspect Ratio Preservation

The carousel SHALL implement separate responsive image sizing formulas for desktop and mobile viewports while maintaining the original aspect ratio.

#### Scenario: Desktop image sizing

GIVEN the carousel is viewed on desktop (≥768px)
WHEN the viewport width changes
THEN cover images scale proportionally below 1920px while maintaining aspect ratio:

- Maximum: 600×340px at 1920px viewport
- Example: At 960px (half of 1920px), dimensions = 300×170px (half of 600×340px)
- Formula: width = min(600, 600 × (viewport ÷ 1920))
- Formula: height = min(340, 340 × (viewport ÷ 1920))

#### Scenario: Mobile image sizing

GIVEN the carousel is viewed on mobile (<768px)
WHEN the viewport width changes
THEN cover images scale proportionally below 768px while maintaining aspect ratio:

- Maximum: 690×340px at 768px viewport
- Example: At 384px (half of 768px), dimensions = 345×170px (half of 690×340px)
- Formula: width = min(690, 690 × (viewport ÷ 768))
- Formula: height = min(340, 340 × (viewport ÷ 768))

### Requirement: Typography Responsive Scaling

The carousel SHALL implement responsive typography scaling formulas for title and excerpt text across desktop and mobile viewports.

#### Scenario: Desktop title typography scaling

GIVEN the carousel is viewed on desktop (≥768px)
WHEN the viewport width changes
THEN title text scales proportionally below 1920px:

- Maximum: 24px at 1920px viewport
- Example: At 960px (half of 1920px), font-size = 12px (half of 24px)
- Formula: font-size = min(24, 24 × (viewport ÷ 1920))px
- Font properties: font-weight: 600, font-style: normal, line-height: normal

#### Scenario: Mobile title typography scaling

GIVEN the carousel is viewed on mobile (<768px)
WHEN the viewport width changes
THEN title text scales proportionally below 768px:

- Maximum: 36px at 768px viewport
- Example: At 384px (half of 768px), font-size = 18px (half of 36px)
- Formula: font-size = min(36, 36 × (viewport ÷ 768))px
- Font properties: font-weight: 600, font-style: normal, line-height: normal

#### Scenario: Desktop excerpt typography scaling

GIVEN the carousel is viewed on desktop (≥768px)
WHEN the viewport width changes
THEN excerpt text scales proportionally below 768px:

- Maximum: 18px at 768px viewport
- Example: At 384px (half of 768px), font-size = 9px (half of 18px)
- Formula: font-size = min(18, 18 × (viewport ÷ 768))px
- Font properties: font-weight: 400, font-style: normal, line-height: normal, color: #86909C

#### Scenario: Mobile excerpt typography scaling

GIVEN the carousel is viewed on mobile (<768px)
WHEN the viewport width changes
THEN excerpt text scales proportionally below 768px:

- Maximum: 30px at 768px viewport
- Example: At 384px (half of 768px), font-size = 15px (half of 30px)
- Formula: font-size = min(30, 30 × (viewport ÷ 768))px
- Font properties: font-weight: 400, font-style: normal, line-height: normal, color: #86909C

### Requirement: Home Page Integration

The news carousel SHALL be integrated into the home page as a new section positioned under the "see our food" section.

#### Scenario: Home page carousel placement

GIVEN the user visits the home page
WHEN the page loads
THEN a news carousel section appears under the "see our food" section
AND the carousel displays recent published news items
AND the section follows the page's responsive layout patterns
AND the carousel is only visible when news data is available
AND the section has a gradient background from #FBF3F3 to #FFF

### Requirement: Component Reusability

The NewsCarousel component SHALL be designed as a reusable component that accepts news data as props.

#### Scenario: Component reusability

GIVEN a developer wants to use the NewsCarousel component
WHEN they import and use the component
THEN they can pass news data as props
AND the component handles rendering and navigation internally
AND the component can be used in different pages or sections
AND the component maintains consistent behavior across usages

