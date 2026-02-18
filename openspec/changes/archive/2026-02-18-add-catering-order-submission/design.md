## Context
The catering page currently prevents submission. The request requires persisting orders in Supabase and notifying store staff via email using Resend, without exposing secrets to the browser. The order submission time should reflect the customer’s local time and time zone in Australian formatting.

## Goals / Non-Goals
- Goals:
  - Persist catering orders in `public.catering_orders`.
  - Send a store email notification when the selected store has an email address.
  - Include customer-local submission time with time zone in the email.
- Non-Goals:
  - Toast UX beyond success/error feedback and inline submission state.
  - Database migrations (table already exists).

## Decisions
- Use a Next.js route handler to accept catering order submissions.
- Use `supabaseServer` for database insert to avoid exposing secret keys.
- Use Resend server-side with `RESEND_API_KEY` and sender `catering-orders@hotlob.com.au`.
- Client captures `submittedAt` using `Intl.DateTimeFormat('en-AU', { ... , hour12: true })` and `Intl.DateTimeFormat().resolvedOptions().timeZone`, then sends the formatted string to the server for email content.
- If the selected store has no email, skip sending an email but still persist the order.
- Toasts are shown centered in the viewport with success and error variants; submission uses inline "Submitting…" button state.

## Risks / Trade-offs
- Customer-local time may differ from store local time; this is intentional for simplicity.
- Email delivery failures should not block order persistence.

## Migration Plan
- No data migration required.

## Open Questions
- None for this proposal; toast UX will be handled in a future change.
