import { createClient } from '@supabase/supabase-js'
import { getSession } from './session'

const supabaseUrl      = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export function createAdminClient() {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function getSessionUser() {
  const session = await getSession()
  if (!session?.id) return null
  return session
}