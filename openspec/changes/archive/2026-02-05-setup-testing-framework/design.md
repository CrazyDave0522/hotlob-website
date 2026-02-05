# Testing Framework Design

## Framework Selection

### Options Considered

1. **Jest**
   - Mature, battle-tested framework
   - Excellent Next.js integration
   - Rich ecosystem and plugins
   - Slower test execution
   - More configuration required

2. **Vitest**
   - Modern, fast alternative to Jest
   - Built on Vite (similar to Next.js build system)
   - Faster test runs and HMR-like experience
   - Smaller ecosystem
   - Less mature but rapidly improving

### Recommendation

**Vitest** is the chosen testing framework for this project because:

- Next.js uses Vite internally, so Vitest aligns better with the build system
- Faster test execution improves developer experience
- Modern API and better TypeScript support
- Growing ecosystem with good React Testing Library integration

## Architecture Decisions

### Test Structure

Three types of tests organized by directory:

```
__tests__/
├── unit/
│   ├── app/components/
│   │   └── Button.test.tsx        # Unit tests for individual components
│   └── README.md
├── integration/
│   └── README.md                  # Integration tests for feature workflows
├── snapshots/
│   └── README.md                  # Snapshot tests for UI regressions
└── README.md                      # Test overview & guidance
```

### Test Types & When to Use

**Unit Tests** (Current focus)
- Test individual components, functions, hooks
- Fast and focused
- Write while building features

**Integration Tests** (Future, when needed)
- Test how multiple components work together
- Test complete user workflows
- Add when features become complex

**Snapshot Tests** (Future, when components stabilize)
- Detect unintended UI changes
- Add after component design is stable

### Testing Patterns

- Use React Testing Library for component testing (behavior over implementation)
- Mock external dependencies (API calls, timers, etc.)
- Focus on user-facing behavior rather than implementation details
- Organize tests by feature, not by file location

### Configuration

- Use jsdom environment for DOM testing
- Configure path aliases to match Next.js (@/\*)
- Enable TypeScript support

## Trade-offs

### Vitest vs Jest

- **Pros of Vitest**: Faster, modern, better DX
- **Cons of Vitest**: Less mature, smaller community
- **Mitigation**: Jest can be adopted later if Vitest proves insufficient

### Testing Scope

- **Unit tests**: Fast, isolated tests for functions and components
- **Integration tests**: Test component interactions and data flow
- **E2E tests**: Deferred to future change (requires Playwright/Cypress)

## Dependencies

### Core Testing

- `vitest`: Test runner and framework
- `@testing-library/react`: React component testing utilities
- `@testing-library/jest-dom`: Additional DOM matchers
- `jsdom`: DOM environment for Node.js
- `@vitejs/plugin-react`: React support in Vite/Vitest

## Migration Path

1. Start with Vitest for new tests
2. Migrate existing tests if any (none currently)
3. Consider Jest if Vitest limitations are encountered
4. Add E2E testing in separate change
