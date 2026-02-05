This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Testing

This project uses [Vitest](https://vitest.dev/) for testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

### Running Tests

```bash
# Run all tests
pnpm test
```

### Test Types & Organization

Tests are organized by type in the `__tests__/` directory:

1. **Unit Tests** (`__tests__/unit/`)
   - Test individual components and functions
   - Fast and focused
   - Start here when building components

2. **Integration Tests** (`__tests__/integration/`)
   - Test how multiple components work together
   - Test complete user workflows
   - Add as features become more complex

3. **Snapshot Tests** (`__tests__/snapshots/`)
   - Detect unintended UI changes
   - Useful after components are stable
   - Catch regressions automatically

### Test Structure

```
__tests__/
├── unit/
│   ├── app/components/
│   │   └── Button.test.tsx            # Unit tests for Button
│   └── README.md                       # Unit testing guide
├── integration/
│   └── README.md                       # Integration testing guide
├── snapshots/
│   └── README.md                       # Snapshot testing guide
└── README.md                           # Test overview
```

### Writing Tests

- Use React Testing Library for component testing
- Focus on testing behavior, not implementation details
- Test user-facing interactions and outcomes
- Read `__tests__/README.md` for detailed guidance

### Best Practices

1. **Start with unit tests** for individual components
2. **Add integration tests** as you build feature interactions
3. **Use snapshots** to catch UI regressions on stable components
4. **Run tests** before marking features complete
5. **Keep tests maintainable** - simple and clear assertions
