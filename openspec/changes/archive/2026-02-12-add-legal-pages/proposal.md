# Proposal: add-legal-pages

## Summary

Implement legal content pages for Privacy Policy and Terms & Conditions with hover effects on footer links, reusing the news details page framework and layout structure.

## Why

Legal compliance requires websites to provide accessible privacy policy and terms & conditions. Currently, footer links are placeholders that don't lead anywhere, leaving users without access to important legal information. Adding hover effects improves user experience by providing visual feedback. Reusing the news details page framework ensures consistent layout and user experience across content types.

## What Changes

- Add hover effect (#EA4148) to footer legal links
- Create /privacy-policy and /terms-and-conditions pages
- Rename NewsDetail to ContentDetail component for generic content handling
- Adapt ContentDetail component to handle both news and legal content
- Load HTML content from public/legal-docs directory
- Update footer links to open in new tabs
- **IMPLEMENTED**: Add proper HTML content styling for legal documents (headings, paragraphs, lists, links)
- **IMPLEMENTED**: Ensure HTML styling doesn't affect news content through CSS specificity management

## Capabilities

- **legal-content** (IMPLEMENTED) - New capability for displaying legal documents with consistent layout and navigation

## Alternatives Considered

1. **External links**: Rejected because legal content should be hosted on the site for better user experience and SEO.
2. **Modal dialogs**: Rejected because legal documents are typically long and need dedicated pages for proper reading.
3. **Keep separate components**: Considered keeping NewsDetail and creating LegalContent, but chose to rename and generalize for better maintainability.

## Implementation Approach

1. Update footer CSS to add hover effects on legal links
2. Rename NewsDetail component to ContentDetail
3. Adapt ContentDetail component to handle both news and legal content
4. Update news pages to use ContentDetail instead of NewsDetail
5. Create page routes for /privacy-policy and /terms-and-conditions
6. Load and render HTML content from public/legal-docs
7. Update footer links to point to actual pages and open in new tabs

## Timeline

- Design and planning: 30 minutes
- Footer styling update: 15 minutes
- ContentDetail component: 45 minutes
- Page routes and content loading: 45 minutes
- Testing and validation: 30 minutes
- Documentation: 15 minutes

Total estimated time: 3 hours
