## Unit Tests

Unit tests verify that individual components and functions work correctly in isolation.

### When to Write Unit Tests

- Testing individual components
- Testing utility functions
- Testing hooks
- Testing individual features in isolation

### What You Have

```
app/components/
  Button.test.tsx    ✅ Tests a single component
```

### Example Unit Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('MenuItem', () => {
  it('renders item name', () => {
    render(<MenuItem name="Pizza" price={12.99} />)
    expect(screen.getByText('Pizza')).toBeInTheDocument()
  })

  it('shows price', () => {
    render(<MenuItem name="Pizza" price={12.99} />)
    expect(screen.getByText('$12.99')).toBeInTheDocument()
  })
})
```

### Key Characteristics

- 🎯 **Focused**: Tests one thing at a time
- ⚡ **Fast**: No waiting for external resources
- 🔍 **Specific**: Clear failure messages
- 🧪 **Independent**: Each test doesn't depend on others

### Best Practices

1. **One assertion per test** (or closely related assertions)
2. **Clear test names**: Describe what component does, not implementation
3. **Test user-facing behavior**: What users see, not how it works
4. **Mock external dependencies**: Don't call real APIs in unit tests

### Common Unit Test Patterns for Hotlob

```typescript
// Test rendering
it('renders with correct props', () => { ... })

// Test interactions  
it('calls onClick when clicked', () => { ... })

// Test conditional rendering
it('shows loading state', () => { ... })

// Test styling variants
it('applies primary variant', () => { ... })

// Test accessibility
it('has accessible label', () => { ... })
```

### Add Tests Here for:

- [ ] All UI components as you build them
- [ ] Form inputs and validation
- [ ] Buttons and interactive elements
- [ ] Images and icons
- [ ] Typography and text components