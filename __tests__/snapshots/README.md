## Snapshot Tests

Snapshot tests capture the rendered output of a component and detect when it changes unexpectedly.

### When to Write Snapshot Tests

- After a component's UI is stable
- To catch unintended UI regressions
- For components with complex conditional rendering
- To ensure styling/structure doesn't break accidentally

### When NOT to Write Snapshot Tests

- ❌ When component is still in flux (too many updates)
- ❌ For trivial components (one-liners)
- ❌ Instead of meaningful assertions (snapshots hide real issues)
- ❌ Without reviewing snapshot changes carefully

### Example Snapshot Test

```typescript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

describe('MenuItem Snapshot', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <MenuItem 
        name="Margherita Pizza" 
        price={12.99}
        description="Fresh mozzarella and basil"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
```

First run creates `MenuItem.test.tsx.snap`. Vitest stores the snapshot and compares future renders.

### How Snapshots Work in Vitest

1. **First run**: Creates a `.snap` file with the component output
2. **Next runs**: Compares output to the snapshot
3. **Change detected**: Vitest shows the diff and lets you review
4. **Update if intentional**: `pnpm vitest -u` to update snapshots

### Example Snapshot Diff

```
Expected: "Plan to eat pizza"
Received: "Let's eat pizza"

 Press 'u' to update the snapshot
```

Review the change carefully before updating!

### Snapshot File Management

- 📁 Snapshots stored in `__snapshots__/` directories  (created automatically)
- 📝 Commit `.snap` files to git (they're part of your test)
- 🔄 Update when intentional UI changes happen
- ⚠️ Be careful with inline snapshots - easy to hide bugs

### When to Update Snapshots

✅ **Do update when:**
- You intentionally changed the component design
- You updated styling
- You added new features

❌ **Don't update when:**
- Something looks wrong in the diff
- You're not sure what changed
- The change is unexpected

### Best Practices

1. **Small snapshots**: Test individual components, not huge trees
2. **Meaningful output**: Use `render` with `testing-library` to get accessible markup
3. **Review every change**: Always look at snapshot diffs carefully
4. **Document changes**: Explain why snapshot changed in commit message

### Integration with Unit Tests

Use snapshots alongside unit tests:
```typescript
describe('Button', () => {
  // Behavior tests
  it('calls onClick when clicked', () => { ... })
  
  // Snapshot test - catches visual regressions
  it('matches snapshot', () => { ... })
})
```

### Add Tests Here for:

- [ ] MenuItem component UI
- [ ] Menu layout structure
- [ ] Cart display
- [ ] Order summary display
- [ ] Any complex conditional rendering