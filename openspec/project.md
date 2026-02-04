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
- **Styling**: Utility-first CSS with Tailwind classes
- **File Organization**:
  - app/ for pages and layouts
  - public/ for static assets (fonts, images)
  - openspec/ for project documentation

### Testing Strategy

[No testing framework configured yet - consider adding Jest or Vitest for unit tests]

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
