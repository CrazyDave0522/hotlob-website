# Change: Add Catering Page Layout

## Why

The `/catering` route currently shows a placeholder. We need the dedicated catering page layout and background treatment to match the intended design.

## What Changes

- Create a catering page layout with distinct top and bottom sections.
- Apply responsive background images: a single desktop background for the whole page and split mobile backgrounds for the top and bottom sections, all using `100% auto` sizing.
- Render the top text lines exactly as shown on the home page catering section (no "Order Online" button).
- Add the bottom section headings using the SectionTitle component (extend it with an optional subtitle prop if needed) with the subtitle sized at half the title, and layout scaffolding for a left-side order form area, leaving the right side empty on desktop.
- Add the catering order form fields (store, name, email, phone, date, time) with input validation, date constraints, and time slot generation based on store trading hours (with a default fallback when hours are missing).
- Apply form field label and placeholder styling for color and size.
- Ensure form fields scale with a 340x40 aspect ratio (not fixed size).
- Lay out the form so the store select spans its own row and all other fields are paired two-per-row with equal widths (including the single-field row).
- On mobile, stack all fields one per row.
- Add helper text for the catering date field to communicate the minimum lead time.
- Add a submit button labeled "SUBMIT" as a placeholder (no functional behavior yet).
- Style the submit button with the specified border radius, gradient background, and box shadow.
- Size the submit button responsively with aspect ratio preserved: max 300x46 at 1920 desktop, max 600x80 at 768 mobile, scaling down proportionally below each breakpoint.
- Set the submit button text color to white.
- Set responsive submit button text sizing: max 34px at 768 (mobile) and max 18px at 1920 (desktop), scaling down proportionally below each breakpoint.
- Defer submission behavior and backend wiring until specified.

## Impact

- Affected specs: `catering-page` (new)
- Affected code: `app/catering/page.tsx`, new/updated components and styles under `components/` and `styles/components/`
- Tests: add a basic render test for the catering page sections and headings

## Open Questions

- None. Submission has no functional behavior yet.
