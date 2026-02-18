## 1. Implementation
- [x] 1.1 Add server route to accept catering order submissions and validate required fields.
- [x] 1.2 Insert catering order into `public.catering_orders` via `supabaseServer`.
- [x] 1.3 Add Resend email helper and send HTML email to store when store email is present.
- [x] 1.4 Update `CateringForm` to submit to the new endpoint and include customer-local submission time + time zone.
- [x] 1.5 Add centered success/error toast feedback and inline submission state on the submit button.
- [x] 1.6 Update or add unit tests for catering form submission behavior and server handler response.

## 2. Validation
- [x] 2.1 Run `pnpm test`.
