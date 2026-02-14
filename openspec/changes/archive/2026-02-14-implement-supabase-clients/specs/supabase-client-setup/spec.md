# Supabase Client Setup

## ADDED Requirements

### Requirement: SHALL Provide Client-Side Supabase Client
The application SHALL provide a client-side Supabase client that is safe for browser usage.

#### Scenario: Client Component Imports Client
Given a React component running in the browser
When it imports from `lib/supabaseClient.ts`
Then it receives a SupabaseClient configured with the publishable key
And the client is fully typed with TypeScript

#### Scenario: Missing Public URL
Given `NEXT_PUBLIC_SUPABASE_PROJECT_URL` is not set
When `lib/supabaseClient.ts` is imported
Then an error is thrown with message "Missing NEXT_PUBLIC_SUPABASE_PROJECT_URL"

#### Scenario: Missing Publishable Key
Given `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is not set
When `lib/supabaseClient.ts` is imported
Then an error is thrown with message "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

### Requirement: SHALL Provide Server-Side Supabase Client
The application SHALL provide a server-side Supabase client with elevated privileges for server-only operations.

#### Scenario: Server Action Imports Server Client
Given a Next.js server action or API route
When it imports from `lib/supabaseServer.ts`
Then it receives a SupabaseClient configured with the secret key
And the client has full database access privileges
And the client is fully typed with TypeScript

#### Scenario: Missing Project URL for Server
Given `NEXT_PUBLIC_SUPABASE_PROJECT_URL` is not set
When `lib/supabaseServer.ts` is imported
Then an error is thrown with message "Missing NEXT_PUBLIC_SUPABASE_PROJECT_URL"

#### Scenario: Missing Secret Key
Given `SUPABASE_SECRET_KEY` is not set
When `lib/supabaseServer.ts` is imported
Then an error is thrown with message "Missing SUPABASE_SECRET_KEY"

### Requirement: SHALL Enforce Security Boundaries
The client-side client SHALL not have access to or reference the secret key.

#### Scenario: Client Bundle Safety
Given the application is built for production
When inspecting the client bundle
Then the secret key is not present in any client-side JavaScript
And only the publishable key is exposed

#### Scenario: Server Client Documentation
Given `lib/supabaseServer.ts` is viewed
Then it contains a comment explaining elevated privileges
And warns against browser usage

### Requirement: SHALL Maintain Type Safety
Both clients SHALL maintain full TypeScript typing.

#### Scenario: Client Type Export
Given TypeScript code imports from `lib/supabaseClient.ts`
Then it can use `SupabaseClient` type annotations
And all Supabase operations are type-checked

#### Scenario: Server Type Export
Given TypeScript code imports from `lib/supabaseServer.ts`
Then it can use `SupabaseClient` type annotations
And all Supabase operations are type-checked