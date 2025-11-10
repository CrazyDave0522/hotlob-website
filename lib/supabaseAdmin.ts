// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
