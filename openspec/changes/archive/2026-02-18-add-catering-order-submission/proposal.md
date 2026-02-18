# Change: Add Catering Order Submission and Store Email Notification

## Why

The catering page currently renders a non-functional submit button. Store staff need to receive catering order details and have the order persisted in the existing `catering_orders` table.

## What Changes

- Add server-side catering order submission handling that inserts records into `public.catering_orders`.
- Send a Resend HTML email to the selected store when a store email is available.
- Capture the customer-local submission time (with time zone) and include it in the email.
- Add inline submission state on the form submit button and show success/error toast feedback.

## Impact

- Affected specs: `catering-page`, new `catering-order-submission` capability.
- Affected code: `components/CateringForm.tsx`, new API route under `app/api/`, `lib/` email helper, tests under `__tests__/unit/`.
- External dependency: Resend (server-side only, uses env var key).
