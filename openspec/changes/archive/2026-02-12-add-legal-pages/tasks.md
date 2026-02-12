# Implementation Tasks: add-legal-pages

## Overview
This change implements legal content pages with improved footer link styling. Tasks are ordered to build incrementally with validation at each step.

## Tasks

### 1. Update Footer Link Styling
- [x] **Add hover effect to footer legal links**
  - Update `styles/components/footer.css` to add `.Footer-legalLink:hover` with `color: #EA4148`
  - Ensure hover effect is visible and accessible
  - Test hover behavior on different devices

### 2. Rename and Adapt Component
- [x] **Rename NewsDetail to ContentDetail**
  - Rename `components/NewsDetail.tsx` to `components/ContentDetail.tsx`
  - Rename `styles/components/news-detail.css` to `styles/components/content-detail.css`
  - Update component name and export
  - Update all CSS class names from `.NewsDetail-*` to `.ContentDetail-*`
  - Update all import statements across the codebase

- [x] **Rename component test file**
  - Rename `__tests__/unit/components/NewsDetail.test.tsx` to `__tests__/unit/components/ContentDetail.test.tsx`
  - Update all import statements in test files

- [x] **Adapt ContentDetail component for generic content**
  - Add optional HTML content prop for legal pages (backward compatible)
  - Add conditional rendering: show news layout for news, show legal layout for legal
  - Ensure existing news functionality remains completely unchanged

- [x] **Update news pages to use ContentDetail**
  - Update `app/hotlob-news/[slug]/page.tsx` to import and use ContentDetail
  - Ensure all props and functionality remain the same

### 3. Create Legal Page Routes
- [x] **Create privacy policy page**
  - Create `app/privacy-policy/page.tsx` with Next.js page structure
  - Implement metadata generation for SEO
  - Load and render privacy-policy.html content

- [x] **Create terms and conditions page**
  - Create `app/terms-and-conditions/page.tsx` with Next.js page structure
  - Implement metadata generation for SEO
  - Load and render terms-and-conditions.html content

### 4. Update Footer Navigation
- [x] **Update footer legal links**
  - Change Privacy Policy link from `href="#"` to `href="/privacy-policy"`
  - Change Terms & Conditions link from `href="#"` to `href="/terms-and-conditions"`
  - Add `target="_blank"` and `rel="noopener noreferrer"` for new tab behavior

### 5. Add HTML Content Styling
- [x] **Implement HTML content styling for legal documents**
  - Add CSS rules for HTML elements (h1-h6, p, ul, ol, li, strong, em, a, blockquote)
  - Use specific class `.ContentDetail-content--html` to avoid affecting news content
  - Ensure responsive typography and proper spacing
  - Add general link styling for all content types

### 6. Testing and Validation
- [x] **Update footer component tests**
  - Update `Footer.test.tsx` to test new link destinations and hover effects
  - Add tests for new tab behavior

- [x] **Create legal content component tests**
  - Update `__tests__/unit/components/ContentDetail.test.tsx` to test legal content rendering
  - Test HTML content rendering and news content rendering
  - Test responsive layout for both content types

- [x] **Create legal page tests**
  - Create `__tests__/integration/privacy-policy.test.tsx`
  - Create `__tests__/integration/terms-and-conditions.test.tsx`
  - Test page loading, metadata, and content display

- [x] **Run full test suite**
  - Execute `pnpm test` to ensure all tests pass
  - Validate no regressions in existing functionality

### 7. Documentation and Final Validation
- [x] **Update OpenSpec specifications**
  - Add legal-content capability to specs
  - Document requirements and scenarios

- [x] **Validate implementation**
  - Test legal pages load correctly
  - Verify hover effects work
  - Check responsive design
  - Confirm new tab behavior

- [x] **Final code review**
  - Ensure code follows project conventions
  - Validate TypeScript types
  - Check accessibility compliance