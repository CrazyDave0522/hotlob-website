// Ensure test environment utilities are installed
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Lightweight typed result used by the noop supabase mock below.
type NoopQueryResult<T = unknown> = {
    data: T | null
    error: { message?: string } | null
}

// Provide required env vars for modules that validate them at import-time.
// This matches production names but uses safe test placeholders.
process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || 'test'
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'test'

// Provide a lightweight noop/mock supabase for tests so importing modules
// that call `createClient` or reference `supabase` at module-eval doesn't
// throw when the real client isn't needed by the test.
vi.mock('@/lib/supabase', () => {
    const chainable = () => ({
        select: () => chainable(),
        not: () => chainable(),
        or: () => chainable(),
        update: () => chainable(),
        insert: () => chainable(),
        eq: () => chainable(),
        limit: () => chainable(),
        order: () => chainable(),
        then: <T = unknown>(cb: (res: NoopQueryResult<T>) => unknown) =>
            Promise.resolve(cb({ data: null, error: null } as NoopQueryResult<T>)),
    })

    return {
        supabase: {
            from: () => chainable(),
            rpc: () => chainable(),
        },
    }
})