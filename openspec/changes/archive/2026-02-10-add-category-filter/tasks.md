# Tasks: Add Category Filter to See Our Food Page

## 1. Component Structure
- [ ] Create `components/CategoryFilter.tsx` with single-select category filtering
- [ ] Define allowed categories: dessert, fish, meat, vegetarian (plus "All")
- [ ] Accept `selectedCategory` prop (string or null), `onCategoryChange` callback, and `availableCategories` array
- [ ] Render only categories present in `availableCategories`, plus "All"
- [ ] Render "All" button with icon from `public/images/icons/food-category/all.svg` and text label
- [ ] Render category buttons with icon from `public/images/icons/food-category/[category].svg` and category text
- [ ] Implement icon swap: inactive uses `[category].svg`, active uses `[category]-active.svg` (including `all.svg` → `all-active.svg`)
- [ ] On mobile: stack icon above text (vertical)
- [ ] On desktop: position icon to left of text (horizontal)

## 2. Styling
- [ ] Create `styles/components/category-filter.css` with full-width wrapper below hero
- [ ] Implement desktop (≥ 768px) styling:
  - Full width wrapper with zero horizontal padding, white background and gradient shadow: `linear-gradient(180deg, #EA4148 -12.86%, rgba(255, 255, 255, 0.00) 29.29%)`
  - Wrapper height responsive, reaching 116px at 1920px
  - Buttons centered horizontally in a row without scrolling
  - Button: display flex, padding responsive (reaching 12px 20px at 1920px), align-items center, border-radius 30px
  - Button height responsive, reaching 46px at 1920px
  - Icon size responsive, reaching 40px × 40px at 1920px
  - Font size responsive, reaching 16px at 1920px
  - Gap between buttons responsive, reaching 40px at 1920px
  - Inactive: white background, white text, no border
  - Active: #EA4148 background, white text, box-shadow `0 4px 8px 0 rgba(234, 65, 72, 0.20)`, backdrop-filter blur(10px)
- [ ] Implement mobile (< 768px) styling:
  - Transparent wrapper with standard section padding
  - Buttons in horizontal scrollable row with icon above text
  - Button: display flex, padding responsive (reaching 12px 20px at 768px), flex-direction column, justify-content center, align-items center, border-radius 10px
  - Button height responsive, reaching 92px at 768px
  - Icon size responsive, reaching 50px × 50px at 768px
  - Font size responsive, reaching 26px at 768px
  - Gap between buttons responsive, reaching 20px at 768px
  - Internal gap (icon-to-text) is 6px (fixed)
  - Inactive: 2px solid #FFFFFF border, `rgba(255, 255, 255, 0.60)` background, white text, box-shadow `0 4px 8px 0 rgba(0, 0, 0, 0.12)`, backdrop-filter blur(10px)
  - Active: #EA4148 background, white text, box-shadow `0 4px 8px 0 rgba(234, 65, 72, 0.20)`, backdrop-filter blur(10px)

## 3. Page Integration
- [ ] Update `app/see-our-food/page.tsx` to import CategoryFilter component
- [ ] Derive available categories from dish data and pass to CategoryFilter
- [ ] Implement category filtering logic (single-select)
- [ ] Update DishGrid to show filtered dishes based on selected category
- [ ] Position filter wrapper between Hero and DishGrid with zero gap

## 4. Tests
- [ ] Write unit tests for CategoryFilter component rendering
- [ ] Test category selection and onChange callback
- [ ] Test "All" button resets to show all dishes
- [ ] Test button active states

## 5. Validation & Polish
- [ ] Run `pnpm test` and verify all tests pass
- [ ] Run `pnpm build` and verify production build succeeds
- [ ] Test responsive behavior: mobile, tablet, desktop viewports
- [ ] Verify zero gap between hero and filter on all viewports
