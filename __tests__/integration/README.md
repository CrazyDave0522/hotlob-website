## Integration Tests

Integration tests verify how multiple components work together and test complete user workflows.

### When to Write Integration Tests

- Testing interactions between multiple components
- Testing user flows (e.g., adding item to cart, submitting order)
- Testing component state changes across interactions
- Testing props passing and event handling chains

### Example Integration Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

describe('Food Menu Integration', () => {
  it('user can select a food item', () => {
    // Setup multiple components working together
    render(<Menu />)
    
    // User interacts with the menu
    const pizzaButton = screen.getByRole('button', { name: /pizza/i })
    fireEvent.click(pizzaButton)
    
    // Verify the integrated behavior
    expect(screen.getByText(/pizza selected/i)).toBeInTheDocument()
  })
})
```

### Key Differences from Unit Tests

- 🔗 **Multiple components**: Tests real interactions, not isolated parts
- 👤 **User-centric**: Tests what users do, not implementation details
- 📊 **State management**: Tests how state flows between components
- 🎯 **Business logic**: Tests complete features, not individual functions

### Setup Tips

1. Mock external dependencies (API calls, timers)
2. Use realistic user interactions (`fireEvent`, `userEvent`)
3. Query by accessible roles/labels, not implementation details
4. Test visible behavior, not internal state

### Common Integration Test Scenarios for Hotlob

- [ ] User browses menu categories
- [ ] User adds item to cart
- [ ] User views cart details
- [ ] User proceeds to checkout
- [ ] Cart updates when item quantity changes
- [ ] Filters affect menu display

Add tests here as you build features that involve multiple components working together.