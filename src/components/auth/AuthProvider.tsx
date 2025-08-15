import { createContext, useContext, useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { shouldUseMockData, supabase } from '../../lib/supabase'
import type { User } from '../../types'
import { MockDataService } from '../../data/mockData'
import { 
  directSignIn, 
  directSignUp, 
  directSignOut, 
  getStoredSession, 
  getOrCreateUserProfile 
} from '../../utils/directAuth'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: any) => Promise<void>
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we're using mock data
    if (shouldUseMockData('supabase')) {
      // For demo purposes, set a mock user
      MockDataService.getCurrentUser().then(mockUser => {
        setUser(mockUser)
        setLoading(false)
      })
      return
    }

    // Check for existing session using both direct auth and Supabase
    const initializeAuth = async () => {
      try {
        console.log('[AUTH] Initializing authentication...')
        
        // First try to get current session from Supabase (for OAuth)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('[AUTH] Found existing Supabase session for:', session.user.email)
          setSupabaseUser(session.user)
          const profile = await getOrCreateUserProfile(session.user)
          setUser(profile as User)
        } else {
          // Fallback to stored session (for email/password auth)
          const storedSession = getStoredSession()
          
          if (storedSession?.user) {
            console.log('[AUTH] Found existing stored session for:', storedSession.user.email)
            setSupabaseUser(storedSession.user as SupabaseUser)
            const profile = await getOrCreateUserProfile(storedSession.user)
            setUser(profile)
          } else {
            console.log('[AUTH] No existing session found')
          }
        }
      } catch (error) {
        console.error('[AUTH] Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes (important for OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] Auth state changed:', event)
        
        if (session?.user) {
          setSupabaseUser(session.user)
          const profile = await getOrCreateUserProfile(session.user)
          setUser(profile as User)
        } else {
          setSupabaseUser(null)
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])


  const signIn = async (email: string, password: string) => {
    if (shouldUseMockData('supabase')) {
      // Mock sign in - just set the admin user
      const mockUser = await MockDataService.getCurrentUser()
      setUser(mockUser)
      return
    }

    console.log('[AUTH] Signing in with:', email)
    const { session, error } = await directSignIn(email, password)
    
    if (error) {
      console.error('[AUTH] Sign in failed:', error)
      throw new Error(error.message)
    }

    if (session?.user) {
      console.log('[AUTH] Sign in successful')
      setSupabaseUser(session.user as SupabaseUser)
      const profile = await getOrCreateUserProfile(session.user)
      setUser(profile as User)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    if (shouldUseMockData('supabase')) {
      // Mock sign up
      const newUser: User = {
        id: Date.now().toString(),
        email,
        full_name: userData.full_name,
        username: userData.username,
        avatar_url: null,
        bio: null,
        location: null,
        website: null,
        role: 'user',
        email_confirmed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setUser(newUser)
      return
    }

    console.log('[AUTH] Signing up with:', email)
    const { session, error } = await directSignUp(email, password, userData)
    
    if (error) {
      console.error('[AUTH] Sign up failed:', error)
      throw new Error(error.message)
    }

    if (session?.user) {
      console.log('[AUTH] Sign up successful')
      setSupabaseUser(session.user as SupabaseUser)
      const profile = await getOrCreateUserProfile(session.user)
      setUser(profile as User)
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'facebook') => {
    if (shouldUseMockData('supabase')) {
      // Mock OAuth sign in - just set a demo user
      const mockUser = await MockDataService.getCurrentUser()
      setUser(mockUser)
      return
    }

    console.log(`[AUTH] Starting OAuth sign in with ${provider}`)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) {
      console.error(`[AUTH] ${provider} OAuth error:`, error)
      throw new Error(error.message)
    }

    console.log(`[AUTH] ${provider} OAuth redirect initiated`)
  }

  const signOut = async () => {
    if (shouldUseMockData('supabase')) {
      setUser(null)
      return
    }

    console.log('[AUTH] Signing out')
    const { error } = await directSignOut()
    
    if (error) {
      console.error('[AUTH] Sign out error:', error)
      // Don't throw error for signout - just clear local state
    }

    // Clear local state
    setUser(null)
    setSupabaseUser(null)
    console.log('[AUTH] Sign out completed')
  }

  const value = {
    user,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}