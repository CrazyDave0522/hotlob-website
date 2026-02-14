# Implementation Tasks

## 1. Create Client-Side Supabase Client
- [x] Create `lib/supabaseClient.ts` with publishable key client
- [x] Add import-time validation for `NEXT_PUBLIC_SUPABASE_PROJECT_URL`
- [x] Add import-time validation for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [x] Export typed `SupabaseClient`
- [x] Verify client is safe for browser bundles (no secret key references)

## 2. Create Server-Side Supabase Client
- [x] Create `lib/supabaseServer.ts` with secret key client
- [x] Add import-time validation for `NEXT_PUBLIC_SUPABASE_PROJECT_URL`
- [x] Add lazy validation for `SUPABASE_SECRET_KEY` (to avoid build issues)
- [x] Export typed `SupabaseClient`
- [x] Add comment about elevated privileges and server-only usage

## 3. Update Existing Usage
- [x] Identify all current imports of `lib/supabase.ts`
- [x] Update client-side imports to use `lib/supabaseClient.ts`
- [x] Update server-side imports to use `lib/supabaseServer.ts`
- [x] Test that all existing functionality works with new clients

## 4. Add Environment Variable Documentation
- [x] Update README.md with required environment variables
- [x] Document the purpose of each client
- [x] Include migration guide for existing code

## 5. Validation and Testing
- [x] Test import-time error handling for missing variables
- [x] Verify TypeScript types work correctly
- [x] Run build to ensure no client bundle contamination
- [x] Update any existing tests to use appropriate clients