/**
 * Debug utilities for troubleshooting authentication and database issues
 */

import { supabase } from '../lib/supabase'

/**
 * Check current database structure
 */
export async function checkDatabaseStructure() {
  console.log('🔍 Checking database structure...')
  
  try {
    // Check what tables exist
    const tables = ['users', 'pianos', 'events', 'blog_posts']
    const results: Record<string, any> = {}
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          results[table] = `❌ Error: ${error.message}`
        } else {
          results[table] = `✅ ${count} records`
        }
      } catch (err) {
        results[table] = `❌ Table does not exist or is inaccessible`
      }
    }
    
    console.log('📊 Database Structure:', results)
    return results
  } catch (error) {
    console.error('❌ Error checking database structure:', error)
    return {}
  }
}

/**
 * Test database connectivity and table existence
 */
export async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test basic connection
    const { data: version, error: versionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (versionError) {
      console.error('❌ Database connection failed:', versionError.message)
      
      if (versionError.message.includes('relation "public.users" does not exist')) {
        console.error('💡 Solution: The users table does not exist. Please run the supabase-setup.sql script in your Supabase SQL Editor.')
        return false
      }
      
      if (versionError.message.includes('RLS')) {
        console.error('💡 Solution: Row Level Security policy issue. Check your RLS policies in Supabase.')
        return false
      }
      
      return false
    }
    
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Unexpected database error:', error)
    return false
  }
}

/**
 * Test authentication status
 */
export async function testAuth() {
  console.log('🔍 Testing authentication...')
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Auth error:', error.message)
      return false
    }
    
    if (session) {
      console.log('✅ User is authenticated:', session.user.email)
      console.log('🔍 User ID:', session.user.id)
      
      // Test if user exists in users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (profileError) {
        console.error('❌ User profile not found in database:', profileError.message)
        console.log('💡 This user needs a profile created in the users table')
        return false
      }
      
      console.log('✅ User profile found:', userProfile)
      return true
    } else {
      console.log('ℹ️ No user currently authenticated')
      return true // This is not an error
    }
  } catch (error) {
    console.error('❌ Unexpected auth error:', error)
    return false
  }
}

/**
 * Test data loading
 */
export async function testDataLoading() {
  console.log('🔍 Testing data loading...')
  
  try {
    // Test pianos loading
    console.log('Testing pianos table...')
    const { data: pianos, error: pianosError } = await supabase
      .from('pianos')
      .select('count')
      .limit(1)
    
    if (pianosError) {
      console.error('❌ Pianos loading failed:', pianosError.message)
      return false
    }
    
    console.log('✅ Pianos table accessible')
    
    // Test events loading
    console.log('Testing events table...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('count')
      .limit(1)
    
    if (eventsError) {
      console.error('❌ Events loading failed:', eventsError.message)
      return false
    }
    
    console.log('✅ Events table accessible')
    return true
  } catch (error) {
    console.error('❌ Unexpected data loading error:', error)
    return false
  }
}

/**
 * Run comprehensive diagnostics
 */
export async function runDiagnostics() {
  console.log('🏥 Running WorldPianos diagnostics...')
  console.log('=====================================')
  
  const dbTest = await testDatabaseConnection()
  const authTest = await testAuth()  
  const dataTest = await testDataLoading()
  
  console.log('=====================================')
  console.log('📊 Diagnostic Results:')
  console.log(`Database Connection: ${dbTest ? '✅' : '❌'}`)
  console.log(`Authentication: ${authTest ? '✅' : '❌'}`)
  console.log(`Data Loading: ${dataTest ? '✅' : '❌'}`)
  
  if (!dbTest) {
    console.log('🚨 Critical: Database setup required')
    console.log('👉 Action: Run the supabase-setup.sql script in your Supabase SQL Editor')
  }
  
  if (!authTest) {
    console.log('🚨 Critical: Authentication issues detected')
    console.log('👉 Action: Check your Supabase credentials and RLS policies')
  }
  
  if (!dataTest) {
    console.log('🚨 Critical: Data loading issues detected')
    console.log('👉 Action: Check your table permissions and RLS policies')
  }
  
  if (dbTest && authTest && dataTest) {
    console.log('🎉 All systems operational!')
  }
  
  return { database: dbTest, auth: authTest, data: dataTest }
}

/**
 * Create admin user manually (emergency function)
 */
export async function createEmergencyAdmin(email: string) {
  console.log(`🚨 Creating emergency admin for: ${email}`)
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.error('❌ You must be logged in to create an admin user')
      return false
    }
    
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || null,
        role: 'admin',
        email_verified: true,
        last_login: new Date().toISOString()
      })
      .select()
    
    if (error) {
      console.error('❌ Failed to create admin user:', error.message)
      return false
    }
    
    console.log('✅ Emergency admin created:', data)
    return true
  } catch (error) {
    console.error('❌ Unexpected error creating admin:', error)
    return false
  }
}

// Export to window for console access
if (import.meta.env.DEV) {
  (window as any).debugUtils = {
    checkDatabaseStructure,
    testDatabaseConnection,
    testAuth,
    testDataLoading,
    runDiagnostics,
    createEmergencyAdmin
  }
  
  console.log('🔧 Debug utilities available:')
  console.log('- debugUtils.checkDatabaseStructure() - Check what tables exist')
  console.log('- debugUtils.runDiagnostics() - Run full diagnostics')
  console.log('- debugUtils.testDatabaseConnection() - Test DB connection')
  console.log('- debugUtils.testAuth() - Test authentication')
  console.log('- debugUtils.createEmergencyAdmin("your@email.com") - Create admin user')
}