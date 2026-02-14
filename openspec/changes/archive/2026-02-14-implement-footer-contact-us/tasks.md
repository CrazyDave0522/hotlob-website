# implement-footer-contact-us Tasks

- [x] **Add state management to Footer component**
   - Convert Footer to client component by adding "use client" directive
   - Import necessary utilities: `fetchStores` from `@/lib/store`, `tryGetQuickLocation` from `@/utils/geolocation`, `calculateDistance` from `@/utils/distance`, `StoreWithDistance` type from `@/utils/dishOrdering`
   - Add React state for modal open/close
   - Add state for stores data (StoreWithDistance[])
   - Add useEffect to fetch stores and calculate distances on component mount:
     - Fetch stores using `fetchStores()`
     - Try to get user location with `tryGetQuickLocation({ timeoutMs: 2000 })`
     - For each store with latitude/longitude, calculate distance if user location available
     - Set stores state with StoreWithDistance objects

- [x] **Modify Contact Us link behavior**
   - Change link from `href="#"` to `onClick` handler
   - Prevent default link behavior
   - Open store selection modal on click

- [x] **Integrate StoreSelectionModal in Footer**
   - Import StoreSelectionModal component
   - Add modal to Footer JSX with proper props
   - Handle modal close callback

- [x] **Implement store selection handler**
   - Create onStoreSelect callback function
   - Close modal when store is selected
   - Open email client with `window.location.href = \`mailto:${store.email}\``

- [x] **Add error handling**
   - Handle case when no stores are available
   - Handle fetchStores errors gracefully
   - Ensure modal doesn't open if no stores

- [x] **Update component types**
   - Add proper TypeScript types for store data
   - Ensure compatibility with existing Store types

7. **Test implementation**
   - [x] Verify modal opens on Contact Us click
   - [x] Verify email client opens with correct recipient
   - [x] Test on different devices/browsers
   - [x] Ensure accessibility compliance

8. **Validate with existing specs**
   - [x] Ensure footer layout remains unchanged per site-chrome spec
   - [x] Verify store selection modal behavior per store-selection-modal spec