import { createClient } from '@supabase/supabase-js'
import { getEnvironmentConfig, logConfigurationStatus } from '../config/environment'
import { getStoredSession } from '../utils/directAuth'

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

/**
 * Get an authenticated Supabase client with the current user's token
 */
export function getAuthenticatedSupabase() {
  const session = getStoredSession()
  
  if (session?.access_token) {
    // Create a new client instance with the user's access token
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  
  // Fallback to regular client
  return supabase
}

// Export configuration helpers
export { shouldUseMockData } from '../config/environment'