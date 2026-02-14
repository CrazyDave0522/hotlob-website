# Supabase Client Architecture Design

## Overview

This design establishes a secure, type-safe Supabase client architecture for Next.js applications using the App Router. It separates client-side and server-side concerns while maintaining fail-fast behavior for configuration errors.

## Architecture Principles

### Security Separation
- **Client Client**: Uses publishable key, safe for browser bundles
- **Server Client**: Uses secret key, restricted to server-side execution
- **No Fallbacks**: Missing environment variables cause immediate import-time failures

### Type Safety
- Full TypeScript typing maintained for both clients
- Clear naming conventions prevent misuse
- Import-time validation ensures configuration correctness

### Fail-Fast Behavior
- Environment variable validation at module import time
- Clear error messages indicating missing variables
- No silent degradation or mock clients

## Client Architecture

### supabaseClient.ts
- **Purpose**: Browser-safe client for React components and client-side operations
- **Environment**: Browser/client components, hooks, event handlers
- **Security**: Publishable key only, no elevated privileges
- **Validation**: Checks `NEXT_PUBLIC_SUPABASE_PROJECT_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### supabaseServer.ts
- **Purpose**: Server-side client with full database access
- **Environment**: Server components, route handlers, server actions, API routes
- **Security**: Secret key with elevated privileges, never exposed to browser
- **Validation**: Checks `NEXT_PUBLIC_SUPABASE_PROJECT_URL` and `SUPABASE_SECRET_KEY`

## Implementation Details

### Environment Variable Strategy
- Public variables prefixed with `NEXT_PUBLIC_` for client access
- Secret variables server-only, not exposed to build
- Consistent naming: `NEXT_PUBLIC_SUPABASE_PROJECT_URL` shared between clients

### Error Handling
- Import-time validation prevents runtime surprises
- Descriptive error messages for missing variables
- No try-catch around client creation - failures should be fatal

### TypeScript Integration
- Uses `@supabase/supabase-js` types
- Exports `SupabaseClient` type for both clients
- Maintains type safety across client/server boundary

## Trade-offs

### Strictness vs Flexibility
- **Chosen**: Fail-fast prevents production issues from misconfiguration
- **Alternative**: Could allow optional clients with runtime checks, but increases complexity

### Single vs Multiple Clients
- **Chosen**: Separate files for clear intent and security boundaries
- **Alternative**: Single file with environment-based client selection, but harder to enforce usage

### Import-time vs Runtime Validation
- **Chosen**: Import-time for immediate feedback during development
- **Alternative**: Runtime validation allows graceful degradation, but masks configuration issues

## Migration Strategy

1. Implement new client files alongside existing `supabase.ts`
2. Update imports gradually, starting with new code
3. Deprecate old client after full migration
4. Update documentation and examples

## Future Considerations

- Row Level Security (RLS) policies should be designed with these client boundaries in mind
- Server actions using server client for data mutations
- Client components using client client for reads and optimistic updates