// This client uses the Supabase Secret key and has elevated privileges.
// It must NEVER be used in client components or exposed to the browser.
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_PROJECT_URL')
}

if (!supabaseSecretKey) {
    throw new Error('Missing SUPABASE_SECRET_KEY')
}

export const supabaseServer: SupabaseClient = createClient(
    supabaseUrl,
    supabaseSecretKey,
)