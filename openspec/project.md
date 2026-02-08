# Project Context

## Purpose

Hotlob Website is a Next.js-based web application for the Hotlob food service platform. The project aims to provide a modern, responsive website for customers to browse food categories, view menus, and potentially place orders. Based on the project structure and assets, it appears to be focused on food delivery or restaurant services.

## Tech Stack

- **Framework**: Next.js 16.1.6 (React-based full-stack framework)
- **Frontend**: React 19.2.3 with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript 5.x
- **Linting**: ESLint 9 with Next.js configuration
- **Package Manager**: pnpm with workspace support
- **Build Tool**: Next.js built-in build system

## Project Conventions

### Code Style

- **TypeScript**: Strict mode enabled with ES2017 target
- **JSX**: Uses React JSX syntax
- **Imports**: ES modules with path mapping (@/\* for root)
- **Linting**: Follows Next.js ESLint rules for web vitals and TypeScript
- **File Extensions**: .tsx for React components, .ts for utilities

### Architecture Patterns

- **App Router**: Uses Next.js 13+ App Router structure (app/ directory)
- **Component Structure**: Standard React functional components with hooks
- **Styling**: Utility-first CSS with Tailwind classes combined with custom component styles
- **File Organization**:
  - app/ for pages and layouts
  - components/ for shared React components
  - utils/ for utility functions
  - public/ for static assets (fonts, images)
  - styles/ for CSS architecture (tokens, base, components, utilities)
  - openspec/ for project documentation

### CSS Architecture

- **Global Entrypoint**: `app/globals.css` imports Tailwind and project CSS layers in deterministic order
- **Layer Order**: Tokens → Base → Components → Utilities (follows CSS cascade)
- **Mobile-First Responsive Design**: All component styles default to mobile layouts with desktop enhancements applied via `@media (min-width: 768px)` breakpoint
- **Design Tokens**: CSS custom properties defined in `styles/token.css` with group prefixes:
  - Colors: `--color-primary`, `--color-black`, `--color-gray`, `--color-white`
  - Font sizes: `--font-size-[h1-h6, body-lg, body, body-sm, body-xs]` with responsive clamp values
  - Font weights: `--font-weight-[normal, medium, semibold, bold]`
  - Line heights: `--line-height-[tight, normal, relaxed]`
  - Spacing: `--space-[4...256]` - 4px-based scale with 16 values
  - Border radius: `--radius-[10, 20, 30]`
- **Component Styles**: Organized in `styles/components/` with component-prefixed naming (e.g., `.ComponentName-root`) to avoid collisions
- **Base Styles**: `styles/base.css` for foundational HTML element styling
- **Utilities**: `styles/utilities.css` for custom utility classes extending Tailwind
- **Specification**: Defined in `openspec/specs/css-architecture/spec.md`
- **Styling Principle**: Only use CSS files when necessary. Prefer Tailwind utility classes for:
  - Simple responsive utilities (spacing, colors, sizing, backgrounds)
  - One-off component variants
  - Standard layouts and alignments
  - Use CSS files ONLY when:
    - Adding complex selectors (hover states on children, pseudo-elements)
    - Component-specific animations/transitions
    - Tailwind becomes too verbose (5+ utility classes for one property)
    - Reusable component styling that benefits from organization

### Testing Strategy

- **Framework**: Vitest 4.0.18 with React Testing Library 16.3.2
- **Setup File**: `__tests__/setup.ts` loads @testing-library/jest-dom matchers globally
- **Test Organization**:
  - Unit tests: `__tests__/unit/` - individual components and functions
  - Integration tests: `__tests__/integration/` - multi-component workflows
  - Snapshot tests: `__tests__/snapshots/` - UI regression detection
- **Configuration**: `vitest.config.ts` with jsdom environment and @/ path aliases
- **Current Status**: Unit testing infrastructure complete with Button component example
- **Validation**: Run `pnpm test` after each feature implementation
- **Coverage**: Optional - can be added later with `@vitest/coverage-v8`
- **File Pattern**: `*.test.tsx` or `*.test.ts` in `__tests__` directory

### Development Workflow

- **Spec Implementation**: For each capability in `openspec/specs/`, implement corresponding tests
- **Test-First**: Write tests before or alongside feature implementation
- **Validation**: Run `npm test` after implementing each spec requirement
- **Coverage**: Ensure new code maintains or improves test coverage

### Git Workflow

[Not specified - standard Git practices recommended]

## Domain Context

This is a food service website with categories like food items, potentially including features for:

- Food category browsing
- Menu display
- Customer ordering interface
- Restaurant information

## Important Constraints

- Built for web browsers with modern JavaScript support
- Responsive design required for mobile and desktop
- Performance optimized for fast loading (Next.js best practices)

## External Dependencies

- **Next.js**: Core framework
- **React**: UI library
- **Tailwind CSS**: Styling framework
- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Vitest**: Testing framework
- **React Testing Library**: Component testing utilities
