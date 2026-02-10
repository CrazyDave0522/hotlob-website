# css-architecture Specification (Delta)

## ADDED Requirements

### Requirement: Category Filter Styling

The application SHALL provide component styles for a Category Filter using component-prefixed class names (e.g., `.CategoryFilter-wrapper`, `.CategoryFilter-button`). The filter styling SHALL differ between mobile and desktop viewports.

#### Desktop (≥ 768px)

The filter wrapper SHALL render with zero margin and zero padding gap between the Hero section and its content. The wrapper SHALL take full viewport width with zero horizontal padding. The wrapper SHALL have a white background and a box-shadow: `0 4px 12px 0 rgba(0, 0, 0, 0.08)`. The wrapper height SHALL be responsive, reaching 116px at 1920px.

Category buttons SHALL be rendered in a horizontal row, centered horizontally within the wrapper, fitting all buttons without scrolling. Buttons SHALL display with icon to the left of text (horizontal layout). Each button SHALL have:

- Display: flex
- Padding: responsive, reaching 12px 20px at 1920px
- Align-items: center
- Border-radius: 30px
- Min-width: responsive, reaching 140px at 1920px
- Height: responsive, reaching 46px at 1920px
- Gap to next button: responsive, reaching 40px at 1920px

Icons SHALL be responsive: 40px × 40px at 1920px.
Button text font size SHALL be responsive, reaching 18px at 1920px.

Button styling differentiates active and inactive states:

- **Inactive**: background white, no border, text #1D1E1F, no shadow
- **Active**: background #EA4148, text white, border: none

#### Mobile (< 768px)

The filter wrapper SHALL render with the standard section responsive padding (max 32px at 768px). The wrapper background SHALL use a background image (`public/images/section-bg/see-our-food-bg-mb.png`) with cover sizing and center positioning, with a fallback solid color background.

Category buttons SHALL be rendered in a horizontal evenly-spaced row. Buttons SHALL display with icon above text (vertical stack, centered). Each button SHALL have:

- Display: flex
- Padding: responsive, reaching 12px 20px at 768px
- Flex-direction: column
- Justify-content: center
- Align-items: center
- Border-radius: 10px
- Min-width: responsive, reaching 92px at 768px
- Height: responsive, reaching 92px at 768px
- Internal gap (icon-to-text): 6px (fixed)

Icons SHALL be responsive: 50px × 50px at 768px.
Button text font size SHALL be responsive, reaching 26px at 768px.

Button styling differentiates active and inactive states:

- **Inactive**: border `2px solid #FFFFFF`, background `rgba(255, 255, 255, 0.60)`, box-shadow `0 4px 8px 0 rgba(0, 0, 0, 0.12)`, backdrop-filter `blur(10px)`, text #1D1E1F
- **Active**: background `#EA4148`, box-shadow `0 4px 8px 0 rgba(234, 65, 72, 0.20)`, backdrop-filter `blur(10px)`, text white, border: none

The category icon source SHALL change based on button state:

- **Inactive state**: displays `[category].svg` (e.g., `fish.svg`, `all.svg`)
- **Active state**: displays `[category]-active.svg` (e.g., `fish-active.svg`, `all-active.svg`)

The icon swap SHALL use CSS background-image or img src attribute with smooth transition, avoiding DOM manipulation. Transitions on button state changes SHALL be smooth (0.2s ease-out)

#### Scenario: Category filter takes full width with zero gap from Hero

- **GIVEN** the CategoryFilter appears below the Hero on mobile (< 768px)
- **WHEN** the page renders
- **THEN** there is zero gap between Hero and filter
- **AND** the filter wrapper takes 100% viewport width
- **AND** the filter applies responsive horizontal padding (max 32px at 768px)

- **GIVEN** the CategoryFilter appears below the Hero on desktop (≥ 768px)
- **WHEN** the page renders
- **THEN** there is zero gap between Hero and filter
- **AND** the filter wrapper takes 100% viewport width
- **AND** the filter wrapper has zero horizontal padding

#### Scenario: Category buttons are responsive and evenly spaced on mobile

- **GIVEN** the CategoryFilter on mobile (< 768px) with buttons for "All" and available categories
- **WHEN** the page renders
- **THEN** buttons are evenly distributed across the available width using `justify-content: space-evenly`
- **AND** each button displays icon above text (vertical stack, centered)
- **AND** the icon is 50px × 50px at 768px
- **AND** button height reaches 92px at 768px
- **AND** button min-width reaches 92px at 768px
- **AND** internal gap (icon-to-text) is 6px (fixed)
- **AND** button has display flex, flex-direction column, justify-content center, align-items center
- **AND** button padding is responsive, reaching 12px 20px at 768px with border-radius 10px
- **AND** wrapper has background image `public/images/section-bg/see-our-food-bg-mb.png`

#### Scenario: Category buttons fit within viewport on desktop with horizontal layout

- **GIVEN** the CategoryFilter on desktop (≥ 768px) with buttons for "All" and available categories
- **WHEN** the page renders
- **THEN** all buttons fit within the viewport without scrolling
- **AND** the buttons are horizontally centered within the container
- **AND** each button displays icon to the left of text (horizontal layout)
- **AND** all buttons including "All" display both icon and text
- **AND** the icon is 40px × 40px at 1920px
- **AND** button height reaches 46px at 1920px
- **AND** button min-width reaches 140px at 1920px
- **AND** gap between buttons reaches 40px at 1920px
- **AND** button has display flex, align-items center, padding responsive reaching 12px 20px at 1920px
- **AND** button border-radius is 30px
- **AND** wrapper has white background with box-shadow: `0 4px 12px 0 rgba(0, 0, 0, 0.08)`
- **AND** wrapper height reaches 116px at 1920px

#### Scenario: Active button has distinct visual state

- **GIVEN** a category button (e.g., "Seafood") is active on desktop
- **WHEN** the button is displayed
- **THEN** the button background is `#EA4148`
- **AND** the text color is white
- **AND** no box-shadow
- **AND** no border

- **GIVEN** a category button (e.g., "Seafood") is active on mobile
- **WHEN** the button is displayed
- **THEN** the button background is `#EA4148`
- **AND** the text color is white
- **AND** the box-shadow is `0 4px 8px 0 rgba(234, 65, 72, 0.20)`
- **AND** backdrop-filter is `blur(10px)`
- **AND** no border

#### Scenario: Inactive button has distinct appearance

- **GIVEN** a category button (e.g., "Meat") is inactive on desktop
- **WHEN** the button is displayed
- **THEN** the button background is white
- **AND** the text color is #1D1E1F
- **AND** no border

- **GIVEN** a category button (e.g., "Meat") is inactive on mobile
- **WHEN** the button is displayed
- **THEN** the button border is `2px solid #FFFFFF`
- **AND** the button background is `rgba(255, 255, 255, 0.60)`
- **AND** the text color is #1D1E1F
- **AND** the box-shadow is `0 4px 8px 0 rgba(0, 0, 0, 0.12)`
- **AND** backdrop-filter is `blur(10px)`

#### Scenario: Button state transitions are smooth

- **GIVEN** an inactive button is clicked to become active
- **WHEN** the state changes
- **THEN** the background, text, and border colors transition smoothly
- **AND** the transition duration is 0.2s with ease-out timing

#### Scenario: Category button layout changes from vertical to horizontal at breakpoint

- **GIVEN** a category button (e.g., "Fish") displays on mobile (< 768px)
- **WHEN** the button is rendered
- **THEN** the icon is above the text in a vertical stack
- **AND** both are centered within the button

- **GIVEN** the same button is displayed on desktop (≥ 768px)
- **WHEN** the breakpoint changes
- **THEN** the layout switches to horizontal: icon on the left, text on the right
- **AND** the icon and text are vertically centered
- **AND** the transition is smooth without visual jank

#### Scenario: Category button icon swaps on active state

- **GIVEN** a "Fish" category button in inactive state
- **WHEN** the button is displayed
- **THEN** the icon displays `public/images/icons/food-category/fish.svg`

- **GIVEN** the "Fish" category button becomes active
- **WHEN** the user clicks or the button state changes
- **THEN** the icon source changes to `public/images/icons/food-category/fish-active.svg`
- **AND** the text color changes to white
- **AND** the background changes to primary red
- **AND** all transitions are smooth (0.2s ease-out)

- **GIVEN** the "All" button in inactive state
- **WHEN** the button is displayed
- **THEN** the icon displays `public/images/icons/food-category/all.svg`

- **GIVEN** the "All" button becomes active (default state on page load)
- **WHEN** the user clicks or the button is selected
- **THEN** the icon source changes to `public/images/icons/food-category/all-active.svg`
