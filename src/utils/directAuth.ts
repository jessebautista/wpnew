/**
 * Direct authentication using Supabase REST API
 * Bypasses the hanging Supabase client
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: {
    id: string
    email: string
    email_confirmed_at?: string
    user_metadata?: any
  }
}

interface AuthError {
  message: string
  status: number
}

/**
 * Sign in with email and password using direct API call
 */
export async function directSignIn(email: string, password: string): Promise<{
  session: AuthSession | null
  error: AuthError | null
}> {
  try {
    console.log('[DIRECT AUTH] Signing in with email:', email)
    
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[DIRECT AUTH] Sign in failed:', data)
      return {
        session: null,
        error: { message: data.error_description || data.message || 'Sign in failed', status: response.status }
      }
    }

    console.log('[DIRECT AUTH] Sign in successful')
    
    // Store session in localStorage
    if (data.access_token) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data))
    }

    return {
      session: data,
      error: null
    }
  } catch (error: any) {
    console.error('[DIRECT AUTH] Sign in error:', error)
    return {
      session: null,
      error: { message: error.message || 'Network error', status: 500 }
    }
  }
}

/**
 * Sign up with email and password using direct API call
 */
export async function directSignUp(email: string, password: string, userData?: any): Promise<{
  session: AuthSession | null
  error: AuthError | null
}> {
  try {
    console.log('[DIRECT AUTH] Signing up with email:', email)
    
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        data: userData || {}
      }),
      signal: AbortSignal.timeout(10000)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[DIRECT AUTH] Sign up failed:', data)
      return {
        session: null,
        error: { message: data.error_description || data.message || 'Sign up failed', status: response.status }
      }
    }

    console.log('[DIRECT AUTH] Sign up successful')
    
    // Store session in localStorage if provided
    if (data.access_token) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data))
    }

    return {
      session: data,
      error: null
    }
  } catch (error: any) {
    console.error('[DIRECT AUTH] Sign up error:', error)
    return {
      session: null,
      error: { message: error.message || 'Network error', status: 500 }
    }
  }
}

/**
 * Sign out using direct API call
 */
export async function directSignOut(): Promise<{ error: AuthError | null }> {
  try {
    console.log('[DIRECT AUTH] Signing out')
    
    const token = getStoredSession()?.access_token
    
    if (token) {
      const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        console.warn('[DIRECT AUTH] Logout API failed, clearing local session anyway')
      }
    }

    // Always clear local session
    localStorage.removeItem('supabase.auth.token')
    console.log('[DIRECT AUTH] Sign out successful')

    return { error: null }
  } catch (error: any) {
    console.error('[DIRECT AUTH] Sign out error:', error)
    // Even if API fails, clear local session
    localStorage.removeItem('supabase.auth.token')
    return { error: null } // Don't fail signout due to network issues
  }
}

/**
 * Get current session from localStorage
 */
export function getStoredSession(): AuthSession | null {
  try {
    const stored = localStorage.getItem('supabase.auth.token')
    if (!stored) return null

    const session = JSON.parse(stored)
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000)
    const expiry = session.expires_at || (session.expires_in ? now + session.expires_in : now + 3600)
    
    if (now >= expiry) {
      console.log('[DIRECT AUTH] Session expired, clearing')
      localStorage.removeItem('supabase.auth.token')
      return null
    }

    return session
  } catch (error) {
    console.error('[DIRECT AUTH] Error getting stored session:', error)
    localStorage.removeItem('supabase.auth.token')
    return null
  }
}

/**
 * Get current user from session
 */
export function getCurrentUser() {
  const session = getStoredSession()
  return session?.user || null
}

/**
 * Create or fetch user profile from database
 */
export async function getOrCreateUserProfile(authUser: any) {
  try {
    console.log('[DIRECT AUTH] Getting/creating user profile for:', authUser.email)
    
    // First try to get existing user
    const existingResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=*&id=eq.${authUser.id}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${getStoredSession()?.access_token || supabaseKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (existingResponse.ok) {
      const existing = await existingResponse.json()
      if (existing.length > 0) {
        console.log('[DIRECT AUTH] User profile found:', existing[0])
        return existing[0]
      }
    }

    // Create new user profile
    console.log('[DIRECT AUTH] Creating new user profile')
    
    // Determine user role based on email
    let userRole = 'user'
    if (authUser.email === 'jesse.bautista.101@gmail.com') {
      userRole = 'admin'
    }
    
    const newUser = {
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
      username: authUser.user_metadata?.username || null,
      avatar_url: authUser.user_metadata?.avatar_url || null,
      bio: null,
      location: null,
      website: null,
      role: userRole,
      email_verified: !!authUser.email_confirmed_at,
      last_login: new Date().toISOString()
    }

    const createResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${getStoredSession()?.access_token || supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(newUser),
      signal: AbortSignal.timeout(10000)
    })

    if (createResponse.ok) {
      const created = await createResponse.json()
      console.log('[DIRECT AUTH] User profile created:', created[0])
      return created[0]
    } else {
      const error = await createResponse.json()
      console.error('[DIRECT AUTH] Failed to create user profile:', error)
      // Return basic user info even if database creation fails
      return newUser
    }
  } catch (error) {
    console.error('[DIRECT AUTH] Error getting/creating user profile:', error)
    // Return basic user info even if database operations fail
    return {
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.user_metadata?.full_name || null,
      username: null,
      avatar_url: null,
      bio: null,
      location: null,
      website: null,
      role: 'user',
      email_verified: !!authUser.email_confirmed_at,
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

/**
 * Test direct authentication
 */
export async function testDirectAuth() {
  console.log('[DIRECT AUTH] Testing authentication system...')
  
  const session = getStoredSession()
  if (session) {
    console.log('[DIRECT AUTH] Current session:', {
      user: session.user.email,
      expires: new Date((session.expires_at || 0) * 1000).toISOString()
    })
    
    const profile = await getOrCreateUserProfile(session.user)
    console.log('[DIRECT AUTH] User profile:', profile)
    return { session, profile }
  } else {
    console.log('[DIRECT AUTH] No current session')
    return { session: null, profile: null }
  }
}

// Export to window for console access
if (import.meta.env.DEV) {
  setTimeout(() => {
    (window as any).directAuth = {
      directSignIn,
      directSignUp,
      directSignOut,
      getStoredSession,
      getCurrentUser,
      testDirectAuth
    };
    
    console.log('🔐 Direct auth utilities available:');
    console.log('- directAuth.testDirectAuth() - Test current auth state');
    console.log('- directAuth.directSignIn(email, password) - Sign in directly');
    console.log('- directAuth.directSignOut() - Sign out directly');
  }, 300);
}