# Implement Supabase Clients

## Summary

Implement a safe, explicit, production-ready Supabase setup with clear separation between client-side and server-side clients. The client-side client uses the Publishable key for browser components, while the server-side client uses the Secret key for server-only operations.

## Motivation

The current `lib/supabase.ts` file creates a single client with the publishable key, but for a production Next.js application with server actions and API routes, we need separate clients with appropriate security boundaries. This change ensures:

- Client components can only access the publishable key client
- Server operations use the secret key client with elevated privileges
- Fail-fast behavior prevents runtime errors from missing environment variables
- Clear naming prevents accidental misuse of privileged clients

## Impact

- **Breaking Change**: Existing imports of `supabase` from `lib/supabase.ts` will need to be updated to use either `lib/supabaseClient.ts` or `lib/supabaseServer.ts` depending on context
- **Security**: Prevents accidental exposure of secret keys in client bundles
- **Developer Experience**: Clear error messages at import time for missing configuration
- **Type Safety**: Full TypeScript typing maintained

## Files Changed

- `lib/supabaseClient.ts` (new) - Client-side Supabase client
- `lib/supabaseServer.ts` (new) - Server-side Supabase client
- `lib/supabase.ts` (deprecated) - Existing client, may be removed after migration

## Migration Guide

Replace imports:

- `import { supabase } from '@/lib/supabase'` → `import { supabase } from '@/lib/supabaseClient'` (for client components)
- For server contexts, use `import { supabase } from '@/lib/supabaseServer'`

Ensure environment variables are set:

- `NEXT_PUBLIC_SUPABASE_PROJECT_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-side only)
