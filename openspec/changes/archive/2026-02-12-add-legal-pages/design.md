# Design: add-legal-pages

## Architecture Overview

The legal content implementation renames the NewsDetail component to ContentDetail to support both news and legal content while maintaining complete backward compatibility. News details pages will look and function exactly the same as before.

## Component Architecture

```
ContentDetail (renamed from NewsDetail, backward compatible)
├── Conditional rendering based on props:
│   ├── News content (existing behavior - unchanged):
│   │   ├── Title section
│   │   ├── Meta (author, date)
│   │   ├── Separator
│   │   ├── Cover image
│   │   └── EditorJS content
│   └── Legal content (new):
│       ├── Title section
│       └── HTML content rendering

Page Routes:
/hotlob-news/[slug] → ContentDetail with news prop (unchanged behavior)
/privacy-policy → ContentDetail with htmlContent prop
/terms-and-conditions → ContentDetail with htmlContent prop
```

## Content Loading Strategy

- HTML files stored in `public/legal-docs/` for static serving
- Loaded via Next.js `fs` module during build/static generation
- Rendered using `dangerouslySetInnerHTML` for full HTML support
- No client-side fetching to ensure SEO and performance

## Styling Approach

- Rename `styles/components/news-detail.css` to `styles/components/content-detail.css`
- Update all CSS class names from `.NewsDetail-*` to `.ContentDetail-*`
- Reuse ContentDetail component structure and spacing
- Component-prefixed CSS classes following project conventions
- Responsive design matching site standards
- Footer hover effects using standard CSS :hover pseudo-class

### IMPLEMENTED HTML Content Styling

Legal HTML content is styled with proper typography and visual hierarchy:

```css
/* HTML-specific styling for legal content */
.ContentDetail-content--html h1,
.ContentDetail-content--html h2,
.ContentDetail-content--html h3,
.ContentDetail-content--html h4,
.ContentDetail-content--html h5,
.ContentDetail-content--html h6 {
  /* Heading typography with appropriate font sizes and weights */
}

.ContentDetail-content--html p {
  /* Paragraph spacing and line height for readability */
}

.ContentDetail-content--html ul,
.ContentDetail-content--html ol {
  /* List formatting with proper indentation */
}

.ContentDetail-content--html a {
  /* Link styling with brand colors and hover effects */
}
```

- HTML styling is scoped to `.ContentDetail-content--html` class to avoid affecting news content
- General link styling applies to all content types via `.ContentDetail-content a`
- Typography hierarchy ensures legal documents are professional and readable
- Responsive design scales appropriately across devices

## Navigation Behavior

- Legal links open in new tabs to preserve user context
- Uses `target="_blank"` with security attributes
- Maintains accessibility with proper `rel` attributes

## Trade-offs Considered

1. **Content Format**: HTML vs Markdown
   - HTML chosen for existing legal content format and full styling control
   - Markdown would require additional parsing but offer better maintainability

2. **Component Reuse**: Separate vs Shared Component
   - Shared NewsDetail component chosen for consistency and reduced maintenance overhead
   - **Zero breaking changes**: Existing news functionality remains completely unchanged
   - Adds conditional logic but ensures unified user experience across content types

3. **Loading Strategy**: Static vs Dynamic
   - Static loading chosen for SEO benefits and build-time validation
   - Dynamic loading would add complexity without clear benefits
