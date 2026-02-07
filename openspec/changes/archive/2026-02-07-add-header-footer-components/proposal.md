# Proposal: add-header-footer-components

## Summary

Add site-wide Header and Footer components to provide consistent navigation and branding across all pages of the Hotlob website.

## Motivation

Currently, the root layout (`app/layout.tsx`) only renders child content without any site-wide navigation or footer elements. Users need a consistent way to:
- Navigate between main sections of the website (home, see-our-food, catering, locations, hotlob-news)
- Access social media links and call-to-action buttons
- View legal information placeholders (Privacy Policy, Terms & Conditions, Contact Us) with destinations deferred
- Identify the Hotlob brand across all pages

Adding dedicated Header and Footer components will establish the site chrome that frames all page content and provides essential navigation and information architecture.

## Affected Capabilities

- **site-chrome** (ADDED) - New capability defining the structure and behavior of site-wide header and footer components

## Impact Assessment

- **Breaking Changes**: None. This is purely additive functionality.
- **Dependencies**: Relies on existing `css-architecture` for styling patterns and `testing-capabilities` for test infrastructure.
- **Migration**: No migration needed. The components will be integrated into the root layout, automatically applying to all pages.

## Alternatives Considered

1. **Per-page headers/footers**: Rejected because it would lead to code duplication and inconsistent user experience.
2. **Third-party navigation library**: Rejected as overkill for this straightforward navigation structure. Custom components give us full control and align with the existing component architecture.

## Timeline

Estimated implementation: 2-3 hours
- Component scaffolding: 30 minutes
- Header implementation: 1 hour
- Footer implementation: 45 minutes
- Testing: 30 minutes
- Layout integration: 15 minutes
