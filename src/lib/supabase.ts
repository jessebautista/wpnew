import { createClient } from '@supabase/supabase-js'
import { getEnvironmentConfig, logConfigurationStatus } from '../config/environment'

const config = getEnvironmentConfig()

// Log configuration status in development
logConfigurationStatus()

const supabaseUrl = config.supabase.url || 'https://placeholder.supabase.co'
const supabaseAnonKey = config.supabase.anonKey || 'placeholder-key'

// Create client - we'll add typing later when needed
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Export configuration helpers
export { shouldUseMockData } from '../config/environment'