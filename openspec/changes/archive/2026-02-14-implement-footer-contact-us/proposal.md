# implement-footer-contact-us Proposal

## Summary
Implement functional behavior for the "Contact Us" link in the footer. When clicked, the link should open a store selection modal, and upon store selection, open the system's default email application with the selected store's email address as the recipient. The modal will display distance information when user location is available, using the same logic as the dish card modal.

## Motivation
Currently, the "Contact Us" link in the footer navigates to "#" (no-op). Users need a way to contact specific stores directly via email. This feature provides a streamlined way to select a store and initiate email contact.

## Scope
- Modify the Footer component to handle "Contact Us" click events
- Integrate StoreSelectionModal for store selection
- Add email functionality to open default mail app with store email
- Implement distance calculation and display when user location is available (same as dish card modal)
- Ensure proper state management and user flow

## Impact
- Changes Footer component behavior
- Adds new user interaction flow
- No breaking changes to existing functionality
- Requires store data with email field (already available)

## Dependencies
- StoreSelectionModal component (already implemented and fully functional)
- Store data with email field (already available in database)
- fetchStores function (already implemented)

## Risks
- Email client availability on user's device
- Store email addresses must be valid and current