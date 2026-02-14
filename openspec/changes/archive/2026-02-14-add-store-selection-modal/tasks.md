# Tasks: Add Store Selection Modal

## Implementation Order

### Phase 1: Utility Functions and Types
These foundational utilities enable distance calculation and a short quick-location probe used by callers (Header) to attempt automatic selection.

- [x] Create `utils/distance.ts` with Haversine formula implementation
  - Implement `calculateDistance(lat1, lon1, lat2, lon2)` function
  - Add helper `toRadians(degrees)` function
  - Return distance in kilometers rounded to 1 decimal place
  - Add helper `findClosestStore(userLocation, stores)` that uses `store.latitude`/`store.longitude`
  - Write unit tests to verify accuracy against known coordinates

- [x] Create `utils/geolocation.ts` with a quick-location probe used by callers
  - Implement `tryGetQuickLocation({ timeoutMs?: number })` which attempts a short `navigator.geolocation.getCurrentPosition()` probe and resolves `{ lat, lon }` or `null` on timeout/error
  - Do NOT make the modal call this function directly; it is intended for callers like `Header`
  - Handle error cases (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT) and return `null` for any non-successful outcome
  - Set a short default timeout (e.g., 2000 ms) to avoid blocking the UI
  - Write unit tests with mocked Geolocation API

### Phase 2: Store Selection Modal Component
Core modal component with all features except Header integration.

- [x] Create `components/StoreSelectionModal.tsx` component
  - Define TypeScript interface for props: `isOpen`, `onClose`, `onStoreSelect`, `stores`
  - Implement modal overlay with backdrop (rgba(0, 0, 0, 0.90))
  - Render modal content container with centering
  - Add modal title "Select a store"
  - Add close button in top-right corner (prefer the `X` icon from `lucide-react`)
  - Implement conditional rendering based on `isOpen` prop

- [x] Implement store list rendering in StoreSelectionModal
  - Map over `stores` prop to render list of store items
  - Display store name (font size `--font-size-body-lg`, font weight `--font-weight-semibold`)
  - Display full address: street, suburb, state, postcode (font size `--font-size-body`, color `--color-gray`)
  - Make each store item clickable with hover state
  - Handle click to invoke `onStoreSelect(store)` callback

The `StoreSelectionModal` is strictly a manual-selection UI and SHALL NOT perform geolocation probes or render distance values. All location-based behavior is handled by the calling component (e.g., `Header`).

- [x] Implement modal close interactions
  - Close button onClick handler calls `onClose()`
  - Backdrop overlay onClick handler calls `onClose()`
  - Modal content onClick handler with `stopPropagation()` to prevent backdrop click
  - Add keyboard event listener for Escape key → calls `onClose()`
  - Clean up event listener on unmount

- [x] Implement scroll lock behavior
  - On modal open: set `document.body.style.overflow = 'hidden'`
  - On modal close: restore `document.body.style.overflow = ''`
  - Use useEffect with `isOpen` dependency
  - Clean up on unmount

- [x] Create `styles/components/store-selection-modal.css`
  - Define `.StoreSelectionModal-overlay` with full viewport coverage, fixed position, z-index
  - Define `.StoreSelectionModal-content` with centered positioning, white background, border-radius `--radius-30`
  - Define `.StoreSelectionModal-title` styling
  - Define `.StoreSelectionModal-closeButton` with positioning and hover state
  - Define `.StoreSelectionModal-storeList` with vertical layout and scrolling
  - Define `.StoreSelectionModal-storeItem` with padding, border-radius `--radius-20`, hover state (background color change), cursor pointer
  - Define `.StoreSelectionModal-storeName`, `.StoreSelectionModal-storeAddress` styles
  - Define `.StoreSelectionModal-loadingText` for geolocation loading state
  - Define `.StoreSelectionModal-emptyMessage` for no stores case
  - Mobile styles (< 768px): full-width modal with minimal padding (`--space-16`)
  - Desktop styles (≥ 768px): max-width ~600px, padding `--space-48`

- [x] Import CSS in `styles/components/index.css`
  - Add `@import './store-selection-modal.css';` to component styles index

### Styling Implementation Guidance

- Follow the project's styling practices: prefer Tailwind utility classes for simple layout and spacing, and use component-scoped CSS files under `styles/components/` for complex selectors, persistent component styles, or animations.
- Use the project's component naming convention (e.g., `.StoreSelectionModal-` prefix) for CSS class names.
- Implement styles mobile-first: author base styles for small viewports first, then add media queries for larger breakpoints (≥ 768px).


### Phase 3: Accessibility Implementation
Ensure modal is fully accessible to all users.

- [x] Add ARIA attributes to StoreSelectionModal
  - Modal overlay: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`
  - Modal title: `id="modal-title"`
  - Close button: `aria-label="Close store selection modal"`
  - Store items: ensure proper semantic elements (button or div with role="button")

- [x] Implement keyboard navigation and focus management
  - Create focus trap to keep focus within modal when open
  - Set focus to close button when modal opens
  - Tab key cycles through: close button → store items → back to close button
  - Shift+Tab reverses the cycle
  - Enter/Space on store item selects the store
  - Ensure focus returns to CTA button after modal closes

- [ ] Add screen reader support
  - Announce modal title when opened (use `aria-labelledby`)
  - Optionally announce "X stores available" with aria-live region (in-progress)
  - Ensure store information (name, address, distance) is read in logical order
  - Test with VoiceOver (macOS) or NVDA (Windows)

### Phase 4: Header Component Integration
Connect the modal to the Header CTA button.

- [x] Update `components/Header.tsx` to integrate StoreSelectionModal
  - Import `StoreSelectionModal` component
  - Import `fetchStores` from `lib/store.ts`
  - Import `Store` type from `types/store.ts`
  - Add state: `const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)`
  - Add state: `const [stores, setStores] = useState<Store[]>([])`
  - Add useEffect to fetch stores on mount: `useEffect(() => { fetchStores().then(setStores) }, [])`
  - Define `handleStoreSelect` callback:
    ```typescript
    const handleStoreSelect = (store: Store) => {
      window.open(store.uber_url, '_blank')
      setIsStoreModalOpen(false)
    }
    ```
  - Update CTA Button's onClick to attempt automatic selection when possible:
    - On click, attempt a quick location check (Permissions API or `getCurrentPosition` with short timeout).
    - If a valid user location is immediately available, compute distances using `store.latitude`/`store.longitude`, pick the closest store, and call `handleStoreSelect(closestStore)` — do not open the modal.
    - If location is not available immediately (permission denied, times out, or error), open the modal by setting `setIsStoreModalOpen(true)`.
    - Example flow (pseudo-code):
    ```typescript
    async function onOrderOnlineClick() {
      try {
        const fastLocation = await tryGetQuickLocation({ timeout: 2000 }) // short timeout
        if (fastLocation) {
          const closest = findClosestStore(fastLocation, stores)
          handleStoreSelect(closest)
          return
        }
      } catch (e) {
        // fall through to showing modal
      }
      setIsStoreModalOpen(true)
    }
    ```
  - Render StoreSelectionModal component at the end of Header JSX:
    ```tsx
    <StoreSelectionModal
      isOpen={isStoreModalOpen}
      onClose={() => setIsStoreModalOpen(false)}
      onStoreSelect={handleStoreSelect}
      stores={stores}
    />
    ```

### Phase 5: Testing
Comprehensive test coverage for all functionality.

- [x] Write unit tests for `utils/distance.ts`
  - Test Haversine formula with known coordinate pairs and expected distances
  - Test edge cases (same location = 0 km, opposite sides of Earth)
  - Test rounding to 1 decimal place

- [x] Write unit tests for `utils/geolocation.ts`
  - Mock `navigator.geolocation.getCurrentPosition`
  - Test success case returns coordinates
  - Test permission denied error
  - Test position unavailable error
  - Test timeout error

- [x] Write unit tests for `components/StoreSelectionModal.tsx`
  - Test modal renders when `isOpen={true}`
  - Test modal does not render when `isOpen={false}`
  - Test modal title displays "Select a store"
  - Test close button calls `onClose` callback
  - Test backdrop click calls `onClose` callback
  - Test modal content click does NOT call `onClose`
  - Test Escape key calls `onClose` callback
  - Test store item click calls `onStoreSelect` with correct store
  - Test store list renders all provided stores
  - Test empty state displays "No stores available"
  - Test modal does not request geolocation and does not display distances
  - Test stores rendered in alphabetical order when passed that way by caller
  - Test scroll lock on open and unlock on close

- [ ] Write integration tests for Header CTA → Modal → Uber URL flow
  - Test clicking "Order Online" button opens modal
  - Test modal displays list of stores fetched from database
  - Test selecting a store opens new tab with `store.uber_url`
  - Test modal closes after store selection
  - Test closing modal without selection does not open new tab

- [ ] Write accessibility tests
  - Test keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape) (in-progress)
  - Test focus trap keeps focus within modal (in-progress)
  - Test focus returns to CTA button after modal closes (in-progress)
  - Test ARIA attributes are present and correct
  - Test screen reader announces modal title and store information

- [ ] Manual testing checklist
  - Test on mobile (< 768px) and desktop (≥ 768px) viewports
  - Test in different browsers (Chrome, Firefox, Safari, Edge)
  - Test geolocation permission flows in Header caller:
    - Allow permission → Header can compute distances and auto-select closest store
    - Deny permission → Header should open modal for manual selection (modal shows no distances)
    - Permission prompt state/timeouts → Header should fall back to opening modal
  - Test opening modal multiple times
  - Test with slow network (stores loading delayed)
  - Test with no stores in database
  - Test keyboard navigation thoroughly
  - Test screen reader experience (VoiceOver/NVDA)

### Phase 6: Documentation and Cleanup
Finalize the implementation with documentation.

- [x] Add JSDoc comments to StoreSelectionModal component
  - Document props interface
  - Document key functions and behavior

- [ ] Add README entry for StoreSelectionModal in `components/README.md`
  - Describe component purpose
  - Show usage example
  - Document props
  - Mention geolocation behavior
 - [x] Add README entry for StoreSelectionModal in `components/README.md`
  - Describe component purpose
  - Show usage example
  - Document props
  - Mention geolocation behavior

- [ ] Update AGENTS.md or project.md if needed
  - Document modal pattern if it's reusable for other modals
  - Document geolocation usage pattern

- [ ] Run linter and fix any issues
  - `pnpm lint` to check for linting errors
  - Fix any TypeScript or ESLint warnings

- [ ] Run all tests and ensure they pass
  - `pnpm test` to run test suite
  - Ensure all new tests pass
  - Ensure no existing tests are broken

## Dependencies Between Tasks
- Phase 1 (Utilities) must complete before Phase 2 (Modal component) can use them
- Phase 2 (Modal component) must complete before Phase 4 (Header integration)
- Phase 3 (Accessibility) can be done in parallel with Phase 2, but requires modal structure to be in place
- Phase 5 (Testing) should happen after each phase completes, but comprehensive testing is at the end
- Phase 6 (Documentation) is final cleanup after everything works

## Validation Checklist
After completing all tasks, verify:
- [ ] `pnpm test` passes all tests
- [ ] `pnpm lint` shows no errors
- [ ] Modal opens and closes correctly
- [ ] Store selection opens Uber URL in new tab
- [ ] Geolocation works with permission granted
- [ ] Geolocation fails gracefully without permission
- [ ] Keyboard navigation works completely
- [ ] Screen reader experience is smooth
- [ ] Mobile and desktop layouts render correctly
- [ ] No console errors or warnings
