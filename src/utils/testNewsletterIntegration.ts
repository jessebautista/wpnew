/**
 * Test script to verify newsletter integration with real Supabase data
 * This can be run temporarily to test the connection
 */

import { NewsletterService } from '../services/newsletterService'
import { shouldUseMockData } from '../config/environment'

export async function testNewsletterIntegration() {
  console.log('🧪 Testing Newsletter Integration...')
  
  // Check if we're using mock or real data
  const usingMockData = shouldUseMockData('supabase')
  console.log(`📊 Using ${usingMockData ? 'MOCK' : 'REAL'} data`)
  
  try {
    // Test 1: Get existing subscribers
    console.log('📝 Test 1: Getting existing subscribers...')
    const subscribers = await NewsletterService.getSubscribers()
    console.log(`✅ Found ${subscribers.length} subscribers`)
    
    if (subscribers.length > 0) {
      console.log('📋 Sample subscriber:', {
        id: subscribers[0].id,
        email: subscribers[0].email,
        status: subscribers[0].status,
        source: subscribers[0].source,
        subscribed_at: subscribers[0].subscribed_at
      })
    }
    
    // Test 2: Get newsletter stats
    console.log('📝 Test 2: Getting newsletter stats...')
    const stats = await NewsletterService.getStats()
    console.log('✅ Stats:', {
      total_subscribers: stats.total_subscribers,
      active_subscribers: stats.active_subscribers,
      unsubscribed_count: stats.unsubscribed_count
    })
    
    // Test 3: Try filtering
    console.log('📝 Test 3: Testing filters...')
    const activeSubscribers = await NewsletterService.getSubscribers({ status: 'active' })
    console.log(`✅ Active subscribers: ${activeSubscribers.length}`)
    
    console.log('🎉 Newsletter integration test completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Newsletter integration test failed:', error)
    return false
  }
}

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testNewsletterIntegration = testNewsletterIntegration
}