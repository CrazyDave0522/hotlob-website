## 1. Implementation
- [x] 1.1 Build the catering page structure with top and bottom sections.
- [x] 1.2 Render the top section text lines (matching the home catering section) without an order button.
- [x] 1.3 Add bottom section headings using the SectionTitle component (extend it to support an optional subtitle if needed) with subtitle font size set to half of the title, and layout scaffolding for a left-side form area with an empty right-side column on desktop.
- [x] 1.4 Implement the catering order form fields (store, first name, last name, email, phone, date, time) with labels and placeholders.
- [x] 1.5 Enforce input validation rules for name, email, and AU phone number formats.
- [x] 1.6 Enforce date minimum as current date +2 days (calendar days).
- [x] 1.7 Generate 30-minute pickup time options based on selected store trading hours for the selected date, with a 10:00–17:00 fallback when hours are missing, and disable time selection until a store is chosen.
- [x] 1.8 Implement form grid layout: store select on its own row; remaining fields in two-column rows with equal field widths (including the single-field row); on mobile stack one field per row.
- [x] 1.9 Add catering date helper text indicating the 2-day lead time.
- [x] 1.10 Apply form field label and placeholder styling (colors and placeholder size offset) and input aspect ratio (340x40).
- [x] 1.11 Add a non-functional submit button labeled "SUBMIT" with the specified border radius, gradient background, box shadow, and white text.
- [x] 1.12 Implement responsive submit button sizing that preserves aspect ratio (max 300x46 at 1920 desktop, max 600x80 at 768 mobile) with proportional downscaling below each breakpoint.
- [x] 1.13 Implement responsive submit button text sizing (max 34px at 768 mobile, max 18px at 1920 desktop) with proportional downscaling below each breakpoint.
- [x] 1.14 Apply responsive background images (desktop single background; mobile split top/bottom) using `100% auto` sizing.

## 2. Tests
- [x] 2.1 Add a basic render test covering the catering page sections, headings, and form fields.
- [x] 2.2 Add a unit or component test for time slot generation (store hours vs fallback) and time dropdown disabled state before store selection.

## 3. Validation
- [x] 3.1 Run `pnpm test`.
