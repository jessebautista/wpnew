/**
 * Simple diagnostic tests to isolate the hanging issue
 */

import { supabase } from '../lib/supabase'

/**
 * Test the most basic Supabase connection
 */
export async function testBasicConnection() {
  console.log('🔍 Testing basic Supabase connection...')
  
  try {
    // Test 1: Simple count query with timeout
    console.log('Test 1: Basic count query')
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000)
    )
    
    const queryPromise = supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    const result = await Promise.race([queryPromise, timeoutPromise])
    console.log('✅ Basic query successful:', result)
    
    return true
  } catch (error: any) {
    console.error('❌ Basic query failed:', error.message)
    if (error.message.includes('timeout')) {
      console.error('💡 The query is hanging - this suggests a network or RLS issue')
    }
    return false
  }
}

/**
 * Test raw SQL query
 */
export async function testRawSQL() {
  console.log('🔍 Testing raw SQL query...')
  
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SQL timeout after 5 seconds')), 5000)
    )
    
    const sqlPromise = supabase.rpc('exec_sql', { 
      sql: 'SELECT 1 as test_value' 
    })
    
    const result = await Promise.race([sqlPromise, timeoutPromise])
    console.log('✅ Raw SQL successful:', result)
    return true
  } catch (error: any) {
    console.error('❌ Raw SQL failed:', error.message)
    return false
  }
}

/**
 * Test Supabase client configuration
 */
export async function testSupabaseConfig() {
  console.log('🔍 Testing Supabase configuration...')
  
  try {
    // Check if Supabase client is properly configured
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('Supabase Key (first 20 chars):', (import.meta.env.VITE_SUPABASE_ANON_KEY || '').substring(0, 20) + '...')
    
    // Test if we can access the auth system
    const { data: session, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Auth session error:', error.message)
      return false
    }
    
    console.log('✅ Supabase client configured correctly')
    console.log('Current session:', session ? 'Logged in' : 'Not logged in')
    
    return true
  } catch (error: any) {
    console.error('❌ Supabase config error:', error.message)
    return false
  }
}

/**
 * Test with direct database query (bypassing RLS)
 */
export async function testDirectQuery() {
  console.log('🔍 Testing direct database query...')
  
  try {
    // This should work even with RLS enabled
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Direct query timeout')), 5000)
    )
    
    // Try a very simple query that should always work
    const queryPromise = supabase
      .from('users')
      .select('email')
      .limit(1)
    
    const result = await Promise.race([queryPromise, timeoutPromise])
    console.log('✅ Direct query successful:', result)
    return true
  } catch (error: any) {
    console.error('❌ Direct query failed:', error.message)
    
    if (error.message.includes('timeout')) {
      console.error('💡 This suggests a network connectivity issue with Supabase')
      console.error('💡 Check your Supabase project status and network connection')
    }
    
    return false
  }
}

/**
 * Run isolated tests
 */
export async function runIsolatedTests() {
  console.log('🧪 Running isolated diagnostic tests...')
  console.log('==========================================')
  
  const configTest = await testSupabaseConfig()
  console.log('---')
  
  const basicTest = await testBasicConnection()
  console.log('---')
  
  const directTest = await testDirectQuery()
  console.log('---')
  
  const sqlTest = await testRawSQL()
  console.log('---')
  
  console.log('🧪 Isolated Test Results:')
  console.log(`Configuration: ${configTest ? '✅' : '❌'}`)
  console.log(`Basic Connection: ${basicTest ? '✅' : '❌'}`)
  console.log(`Direct Query: ${directTest ? '✅' : '❌'}`)
  console.log(`Raw SQL: ${sqlTest ? '✅' : '❌'}`)
  
  if (!configTest) {
    console.log('🚨 Issue: Supabase client misconfiguration')
    console.log('👉 Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  }
  
  if (!basicTest && !directTest) {
    console.log('🚨 Issue: Network connectivity or Supabase service issue')
    console.log('👉 Check Supabase project status and your internet connection')
  }
  
  return { config: configTest, basic: basicTest, direct: directTest, sql: sqlTest }
}

// Export to window for console access
if (import.meta.env.DEV) {
  (window as any).simpleTest = {
    testBasicConnection,
    testSupabaseConfig,
    testDirectQuery,
    runIsolatedTests
  }
  
  console.log('🧪 Simple test utilities available:')
  console.log('- simpleTest.runIsolatedTests() - Run all isolated tests')
  console.log('- simpleTest.testSupabaseConfig() - Check Supabase configuration')
  console.log('- simpleTest.testBasicConnection() - Test basic query with timeout')
}