/**
 * Most basic connection test to isolate the hanging issue
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Test with a fresh Supabase client
 */
export async function testFreshConnection() {
  console.log('🔍 Testing with fresh Supabase client...')
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('URL:', supabaseUrl)
  console.log('Key (first 20):', supabaseKey?.substring(0, 20) + '...')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    return false
  }
  
  try {
    // Create a completely fresh client
    const testClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false // Don't persist to avoid any auth issues
      }
    })
    
    console.log('Fresh client created successfully')
    
    // Test with a very short timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 3000)
    )
    
    // Try the simplest possible query
    const queryPromise = testClient
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    const result = await Promise.race([queryPromise, timeoutPromise])
    console.log('✅ Fresh connection successful:', result)
    return true
    
  } catch (error: any) {
    console.error('❌ Fresh connection failed:', error.message)
    
    if (error.message.includes('timeout')) {
      console.error('🚨 DIAGNOSIS: Network connectivity issue with Supabase')
      console.error('🔧 SOLUTIONS:')
      console.error('   1. Check if your Supabase project is active/not paused')
      console.error('   2. Check your internet connection')
      console.error('   3. Try accessing your Supabase dashboard to verify the project is running')
      console.error('   4. Check if there are any firewall/network restrictions')
    }
    
    return false
  }
}

/**
 * Test just the URL connectivity
 */
export async function testURLConnectivity() {
  console.log('🔍 Testing URL connectivity...')
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  
  if (!supabaseUrl) {
    console.error('❌ No Supabase URL configured')
    return false
  }
  
  try {
    // Test basic HTTP connectivity to the Supabase URL
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('URL timeout')), 5000)
    )
    
    const fetchPromise = fetch(supabaseUrl + '/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      }
    })
    
    const response = await Promise.race([fetchPromise, timeoutPromise])
    
    if (response.ok || response.status === 401) {
      // 401 is expected without proper auth, but means the server is reachable
      console.log('✅ URL is reachable, status:', response.status)
      return true
    } else {
      console.error('❌ URL returned error status:', response.status)
      return false
    }
    
  } catch (error: any) {
    console.error('❌ URL connectivity failed:', error.message)
    
    if (error.message.includes('timeout')) {
      console.error('🚨 DIAGNOSIS: Cannot reach Supabase servers')
      console.error('🔧 This could be:')
      console.error('   1. Your Supabase project is paused/inactive')
      console.error('   2. Network connectivity issues')
      console.error('   3. Incorrect Supabase URL')
    }
    
    return false
  }
}

/**
 * Run basic connectivity tests
 */
export async function runConnectivityTests() {
  console.log('🌐 Running connectivity tests...')
  console.log('===============================')
  
  const urlTest = await testURLConnectivity()
  console.log('---')
  
  if (urlTest) {
    const connectionTest = await testFreshConnection()
    console.log('---')
    
    console.log('🌐 Connectivity Results:')
    console.log(`URL Reachable: ${urlTest ? '✅' : '❌'}`)
    console.log(`Database Connection: ${connectionTest ? '✅' : '❌'}`)
    
    return { url: urlTest, connection: connectionTest }
  } else {
    console.log('🌐 Connectivity Results:')
    console.log(`URL Reachable: ${urlTest ? '✅' : '❌'}`)
    console.log('Skipping database test due to URL connectivity failure')
    
    return { url: urlTest, connection: false }
  }
}

// Export to window for console access
if (import.meta.env.DEV) {
  (window as any).connectionTest = {
    testURLConnectivity,
    testFreshConnection,
    runConnectivityTests
  }
  
  console.log('🌐 Connection test utilities available:')
  console.log('- connectionTest.runConnectivityTests() - Run all connectivity tests')
  console.log('- connectionTest.testURLConnectivity() - Test if Supabase URL is reachable')
}