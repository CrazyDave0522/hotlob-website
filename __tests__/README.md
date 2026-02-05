# Test Structure

This directory contains all tests for the Hotlob Website project. Tests are organized by type:

## Directory Overview

```
__tests__/
├── unit/                 # Unit tests - individual components & functions
│   └── app/components/
│       └── Button.test.tsx
├── integration/          # Integration tests - multiple components working together
│   └── [add here as you build features]
├── snapshots/           # Snapshot tests - UI regression detection
│   └── [add here when components are stable]
└── README.md (this file)
```

## Test Types & When to Use Them

### 🎯 Unit Tests (`__tests__/unit/`)
Test individual components and functions in isolation.
- **When**: Write while building components
- **Example**: Button renders correctly, inputs validate on change
- **Speed**: ⚡ Very fast
- **Read**: `unit/README.md`

### 🔗 Integration Tests (`__tests__/integration/`)
Test how multiple components work together.
- **When**: After you have components that interact
- **Example**: User selects item from menu, adds to cart, cart updates
- **Speed**: 🔄 Medium
- **Read**: `integration/README.md`

### 📸 Snapshot Tests (`__tests__/snapshots/`)
Capture component output and detect unintended UI changes.
- **When**: Component is stable and you want to prevent regressions
- **Example**: MenuItem layout doesn't accidentally break
- **Speed**: ⚡ Fast (after initial capture)
- **Read**: `snapshots/README.md`

## Naming Conventions

- **Unit tests**: `ComponentName.test.tsx` in same folder structure as components
- **Integration tests**: `FeatureName.integration.test.tsx`
- **Snapshot tests**: `ComponentName.snapshot.test.tsx`

## Running Tests

```bash
pnpm test              # Run all tests
```

Vitest automatically finds all files matching `.test.ts` or `.test.tsx`.

## Next Steps

1. ✅ You've set up the structure
2. 📝 Read the README in each test type directory
3. 🚀 As you build features:
   - Add unit tests for components
   - Add integration tests when features involve multiple components
   - Add snapshot tests when components are stable

## Snapshot Files

Vitest creates `.snap` files automatically:
- `__snapshots__/ComponentName.snap`
- Commit these to git like any other test file
- Update with `pnpm test` → press 'u' to update

## Tips

- Start with unit tests
- Add integration tests as complexity grows
- Use snapshots to catch regressions, not as a replacement for real tests
- Mock API calls and external dependencies
- Focus on testing behavior, not implementation