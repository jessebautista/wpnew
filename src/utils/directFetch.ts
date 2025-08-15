/**
 * Direct fetch approach to bypass Supabase client issues
 * Since curl works, let's use direct fetch calls
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

/**
 * Direct fetch wrapper for Supabase REST API
 */
async function directSupabaseFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    signal: AbortSignal.timeout(10000) // 10 second timeout
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Get pianos using direct fetch
 */
export async function getDirectPianos() {
  console.log('🎹 Fetching pianos with direct fetch...')
  
  try {
    const data = await directSupabaseFetch('pianos?select=*&moderation_status=eq.approved')
    console.log('✅ Direct pianos fetch successful:', data.length, 'pianos')
    return data
  } catch (error: any) {
    console.error('❌ Direct pianos fetch failed:', error.message)
    throw error
  }
}

/**
 * Get events using direct fetch
 */
export async function getDirectEvents() {
  console.log('📅 Fetching events with direct fetch...')
  
  try {
    const data = await directSupabaseFetch('events?select=*&moderation_status=eq.approved')
    console.log('✅ Direct events fetch successful:', data.length, 'events')
    return data
  } catch (error: any) {
    console.error('❌ Direct events fetch failed:', error.message)
    throw error
  }
}

/**
 * Get users using direct fetch
 */
export async function getDirectUsers() {
  console.log('👥 Fetching users with direct fetch...')
  
  try {
    const data = await directSupabaseFetch('users?select=*')
    console.log('✅ Direct users fetch successful:', data.length, 'users')
    return data
  } catch (error: any) {
    console.error('❌ Direct users fetch failed:', error.message)
    throw error
  }
}

/**
 * Test all direct fetches
 */
export async function testDirectFetches() {
  console.log('📡 Testing direct fetch approach...')
  console.log('==================================')
  
  try {
    const [pianos, events, users] = await Promise.all([
      getDirectPianos().catch(e => ({ error: e.message })),
      getDirectEvents().catch(e => ({ error: e.message })),
      getDirectUsers().catch(e => ({ error: e.message }))
    ])
    
    console.log('📡 Direct Fetch Results:')
    console.log(`Pianos: ${Array.isArray(pianos) ? `✅ ${pianos.length} records` : `❌ ${pianos.error}`}`)
    console.log(`Events: ${Array.isArray(events) ? `✅ ${events.length} records` : `❌ ${events.error}`}`)
    console.log(`Users: ${Array.isArray(users) ? `✅ ${users.length} records` : `❌ ${users.error}`}`)
    
    return {
      pianos: Array.isArray(pianos) ? pianos : null,
      events: Array.isArray(events) ? events : null,
      users: Array.isArray(users) ? users : null
    }
  } catch (error: any) {
    console.error('❌ Direct fetch test failed:', error.message)
    return null
  }
}

/**
 * Create a direct fetch data service
 */
export class DirectDataService {
  static async getPianos() {
    return await getDirectPianos()
  }
  
  static async getEvents() {
    return await getDirectEvents()
  }
  
  static async getUsers() {
    return await getDirectUsers()
  }
  
  static async getPiano(id: string) {
    const data = await directSupabaseFetch(`pianos?select=*&id=eq.${id}`)
    return data[0] || null
  }
  
  static async getEvent(id: string) {
    const data = await directSupabaseFetch(`events?select=*&id=eq.${id}`)
    return data[0] || null
  }
}

// Export to window for console access
if (import.meta.env.DEV) {
  setTimeout(() => {
    (window as any).directFetch = {
      testDirectFetches,
      getDirectPianos,
      getDirectEvents,
      getDirectUsers,
      DirectDataService
    };
    
    console.log('📡 Direct fetch utilities available:');
    console.log('- directFetch.testDirectFetches() - Test direct API calls');
    console.log('- directFetch.getDirectPianos() - Get pianos directly');
    console.log('- directFetch.getDirectEvents() - Get events directly');
  }, 200);
}