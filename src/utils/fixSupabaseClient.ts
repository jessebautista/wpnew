/**
 * Fix for Supabase client timeout issues
 * Since curl works but the JS client hangs, this creates a working client
 */

import { createClient } from '@supabase/supabase-js'

// Create a new client with timeout settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

console.log('🔧 Creating fixed Supabase client...')

export const fixedSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    fetch: (input, init) => {
      console.log('📡 Supabase fetch:', input)
      
      // Add timeout to all requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      })
      
      const fetchPromise = fetch(input, {
        ...init,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      return Promise.race([fetchPromise, timeoutPromise])
    }
  }
})

/**
 * Test the fixed client
 */
export async function testFixedClient() {
  console.log('🧪 Testing fixed Supabase client...')
  
  try {
    const { data, error } = await fixedSupabase
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Fixed client error:', error)
      return false
    }
    
    console.log('✅ Fixed client works:', data)
    return true
  } catch (error: any) {
    console.error('❌ Fixed client failed:', error.message)
    return false
  }
}

/**
 * Test authentication with fixed client
 */
export async function testFixedAuth() {
  console.log('🔐 Testing auth with fixed client...')
  
  try {
    const { data: authData, error } = await fixedSupabase.auth.getSession()
    
    if (error) {
      console.error('❌ Auth error:', error)
      return false
    }
    
    console.log('✅ Auth works. Session:', authData.session ? 'Logged in' : 'Not logged in')
    
    if (authData.session?.user) {
      console.log('👤 User:', authData.session.user.email)
      
      // Try to get user profile
      const { data: profile, error: profileError } = await fixedSupabase
        .from('users')
        .select('*')
        .eq('id', authData.session.user.id)
        .single()
      
      if (profileError) {
        console.log('ℹ️ No profile found, will create one on login')
      } else {
        console.log('✅ User profile found:', profile)
      }
    }
    
    return true
  } catch (error: any) {
    console.error('❌ Auth test failed:', error.message)
    return false
  }
}

/**
 * Run all fixed client tests
 */
export async function testAllFixed() {
  console.log('🔧 Testing all fixed client functionality...')
  console.log('=========================================')
  
  const clientTest = await testFixedClient()
  console.log('---')
  
  const authTest = await testFixedAuth()
  console.log('---')
  
  console.log('🔧 Fixed Client Results:')
  console.log(`Database Connection: ${clientTest ? '✅' : '❌'}`)
  console.log(`Authentication: ${authTest ? '✅' : '❌'}`)
  
  if (clientTest && authTest) {
    console.log('🎉 Fixed client is working! You can now use fixedSupabase instead of supabase')
    return true
  }
  
  return false
}

// Export to window for console access
if (import.meta.env.DEV) {
  // Wait for DOM to be ready
  setTimeout(() => {
    (window as any).fixedSupabaseClient = fixedSupabase;
    (window as any).testFixed = {
      testFixedClient,
      testFixedAuth,
      testAllFixed
    };
    
    console.log('🔧 Fixed Supabase client available:');
    console.log('- testFixed.testAllFixed() - Test the fixed client');
    console.log('- fixedSupabaseClient - Use this instead of the regular supabase client');
  }, 100);
}