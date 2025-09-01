import { shouldUseMockData, supabase } from '../lib/supabase'

export interface NewsletterSubscriber {
  id: string
  email: string
  first_name?: string
  last_name?: string
  status: 'active' | 'unsubscribed' | 'bounced'
  source: string // Where they subscribed from
  subscribed_at: string
  unsubscribed_at?: string
  preferences: {
    weekly_digest: boolean
    event_notifications: boolean
    new_piano_alerts: boolean
    blog_updates: boolean
  }
  tags: string[]
}

export interface NewsletterTemplate {
  id: string
  name: string
  subject: string
  content: string
  template_type: 'weekly_digest' | 'event_announcement' | 'new_piano' | 'blog_update' | 'custom'
  created_at: string
  updated_at: string
  created_by: string
}

export interface NewsletterCampaign {
  id: string
  name: string
  subject: string
  content: string
  template_id?: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
  recipient_count: number
  sent_count: number
  opened_count: number
  clicked_count: number
  bounced_count: number
  scheduled_at?: string
  sent_at?: string
  created_at: string
  created_by: string
  tags: string[]
  segment_criteria?: {
    include_tags?: string[]
    exclude_tags?: string[]
    subscription_date_from?: string
    subscription_date_to?: string
    preferences?: Partial<NewsletterSubscriber['preferences']>
  }
}

export interface NewsletterStats {
  total_subscribers: number
  active_subscribers: number
  unsubscribed_count: number
  bounced_count: number
  campaigns_sent: number
  average_open_rate: number
  average_click_rate: number
  recent_growth: number
  weekly_signups: number[]
}

export class NewsletterService {
  private static subscribers: NewsletterSubscriber[] = []
  private static templates: NewsletterTemplate[] = []
  private static campaigns: NewsletterCampaign[] = []

  // Subscriber Management
  static async subscribe(
    email: string, 
    firstName?: string, 
    lastName?: string, 
    source: string = 'website',
    preferences?: Partial<NewsletterSubscriber['preferences']>
  ): Promise<NewsletterSubscriber> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Newsletter subscription')
      // Check if already subscribed
      const existing = this.subscribers.find(sub => sub.email === email)
      if (existing) {
        if (existing.status === 'unsubscribed') {
          // Resubscribe
          existing.status = 'active'
          existing.subscribed_at = new Date().toISOString()
          existing.unsubscribed_at = undefined
          if (preferences) {
            existing.preferences = { ...existing.preferences, ...preferences }
          }
          return existing
        }
        throw new Error('Email already subscribed')
      }

      const subscriber: NewsletterSubscriber = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email,
        first_name: firstName,
        last_name: lastName,
        status: 'active',
        source,
        subscribed_at: new Date().toISOString(),
        preferences: {
          weekly_digest: true,
          event_notifications: true,
          new_piano_alerts: true,
          blog_updates: true,
          ...preferences
        },
        tags: [source]
      }

      this.subscribers.push(subscriber)
      return subscriber
    }

    try {
      console.log('[SUPABASE] Newsletter subscription')
      
      // Check if already subscribed
      const { data: existing, error: checkError } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('email', email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing subscription:', checkError)
        throw checkError
      }

      if (existing) {
        if (existing.status === 'unsubscribed') {
          // Resubscribe
          const { data: updated, error: updateError } = await supabase
            .from('newsletter_subscriptions')
            .update({
              status: 'active',
              subscribed_at: new Date().toISOString(),
              unsubscribed_at: null,
              preferences: preferences ? { ...existing.preferences, ...preferences } : existing.preferences
            })
            .eq('id', existing.id)
            .select()
            .single()

          if (updateError) throw updateError
          return updated
        }
        throw new Error('Email already subscribed')
      }

      // Create new subscription
      const newSubscription = {
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        status: 'active' as const,
        source,
        subscribed_at: new Date().toISOString(),
        preferences: {
          weekly_digest: true,
          event_notifications: true,
          new_piano_alerts: true,
          blog_updates: true,
          ...preferences
        },
        tags: [source]
      }

      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([newSubscription])
        .select()
        .single()

      if (error) {
        console.error('Error creating newsletter subscription:', error)
        throw error
      }

      console.log('[SUPABASE] Newsletter subscription created successfully:', data.id)
      return data
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      // Fallback to mock data
      return this.subscribe(email, firstName, lastName, source, preferences)
    }
  }

  static async unsubscribe(email: string): Promise<boolean> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Newsletter unsubscribe')
      const subscriber = this.subscribers.find(sub => sub.email === email)
      if (!subscriber) return false

      subscriber.status = 'unsubscribed'
      subscriber.unsubscribed_at = new Date().toISOString()
      return true
    }

    try {
      console.log('[SUPABASE] Newsletter unsubscribe')
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email)

      if (error) {
        console.error('Error unsubscribing:', error)
        return false
      }

      console.log('[SUPABASE] Successfully unsubscribed:', email)
      return true
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error)
      return false
    }
  }

  static async updateSubscriber(
    subscriberId: string, 
    updates: Partial<NewsletterSubscriber>
  ): Promise<NewsletterSubscriber | null> {
    if (shouldUseMockData('supabase')) {
      const index = this.subscribers.findIndex(sub => sub.id === subscriberId)
      if (index === -1) return null

      this.subscribers[index] = { ...this.subscribers[index], ...updates }
      return this.subscribers[index]
    }

    try {
      console.log('[SUPABASE] Updating subscriber:', subscriberId)
      
      // Clean updates to match database schema
      const cleanedUpdates: any = {}
      if (updates.first_name !== undefined) cleanedUpdates.first_name = updates.first_name
      if (updates.last_name !== undefined) cleanedUpdates.last_name = updates.last_name
      if (updates.status !== undefined) cleanedUpdates.status = updates.status
      if (updates.source !== undefined) cleanedUpdates.source = updates.source
      if (updates.preferences !== undefined) cleanedUpdates.preferences = updates.preferences
      if (updates.tags !== undefined) cleanedUpdates.tags = updates.tags
      if (updates.unsubscribed_at !== undefined) cleanedUpdates.unsubscribed_at = updates.unsubscribed_at

      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update(cleanedUpdates)
        .eq('id', subscriberId)
        .select()
        .single()

      if (error) throw error

      // Map back to service format
      const subscriber: NewsletterSubscriber = {
        id: data.id,
        email: data.email,
        first_name: data.first_name || undefined,
        last_name: data.last_name || undefined,
        status: data.status || 'active',
        source: data.source || 'website',
        subscribed_at: data.subscribed_at || data.created_at,
        unsubscribed_at: data.unsubscribed_at || undefined,
        preferences: data.preferences || {
          weekly_digest: true,
          event_notifications: true,
          new_piano_alerts: true,
          blog_updates: true
        },
        tags: data.tags || ['website']
      }

      return subscriber
    } catch (error) {
      console.error('Update subscriber error:', error)
      return null
    }
  }

  static async deleteSubscriber(subscriberId: string): Promise<boolean> {
    if (shouldUseMockData('supabase')) {
      const index = this.subscribers.findIndex(sub => sub.id === subscriberId)
      if (index === -1) return false

      this.subscribers.splice(index, 1)
      return true
    }

    try {
      console.log('[SUPABASE] Deleting subscriber:', subscriberId)
      
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', subscriberId)

      if (error) throw error

      console.log('[SUPABASE] Successfully deleted subscriber')
      return true
    } catch (error) {
      console.error('Delete subscriber error:', error)
      return false
    }
  }

  static async getSubscribers(
    filters?: {
      status?: NewsletterSubscriber['status']
      source?: string
      tags?: string[]
      search?: string
    }
  ): Promise<NewsletterSubscriber[]> {
    if (shouldUseMockData('supabase')) {
      let filtered = [...this.subscribers]

      if (filters?.status) {
        filtered = filtered.filter(sub => sub.status === filters.status)
      }

      if (filters?.source) {
        filtered = filtered.filter(sub => sub.source === filters.source)
      }

      if (filters?.tags && filters.tags.length > 0) {
        filtered = filtered.filter(sub => 
          filters.tags!.some(tag => sub.tags.includes(tag))
        )
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(sub => 
          sub.email.toLowerCase().includes(search) ||
          sub.first_name?.toLowerCase().includes(search) ||
          sub.last_name?.toLowerCase().includes(search)
        )
      }

      return filtered.sort((a, b) => new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime())
    }

    try {
      console.log('[SUPABASE] Getting newsletter subscribers')
      
      // Start with a basic query
      let query = supabase.from('newsletter_subscriptions').select('*')

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.source) {
        query = query.eq('source', filters.source)
      }

      if (filters?.search) {
        const searchTerm = `%${filters.search}%`
        query = query.or(`email.ilike.${searchTerm}`)
      }

      // Simple execution with fallback ordering
      const { data, error } = await query.limit(1000)

      if (error) {
        console.error('Error getting subscribers:', error)
        throw error
      }

      // Map database format to service format
      const subscribers: NewsletterSubscriber[] = (data || []).map(item => ({
        id: item.id,
        email: item.email,
        first_name: item.first_name || undefined,
        last_name: item.last_name || undefined,
        status: item.status || 'active',
        source: item.source || 'website',
        subscribed_at: item.subscribed_at || item.created_at || new Date().toISOString(),
        unsubscribed_at: item.unsubscribed_at || undefined,
        preferences: item.preferences || {
          weekly_digest: true,
          event_notifications: true,
          new_piano_alerts: true,
          blog_updates: true
        },
        tags: item.tags || ['website']
      }))

      // Sort in JavaScript to avoid column issues
      subscribers.sort((a, b) => new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime())

      console.log('[SUPABASE] Retrieved subscribers:', subscribers.length)
      return subscribers
    } catch (error) {
      console.error('Newsletter getSubscribers error:', error)
      // Don't recursively call - just return empty array or fallback to mock
      if (shouldUseMockData('supabase')) {
        const mockFiltered = [...this.subscribers]
        return mockFiltered
      }
      return []
    }
  }

  // Template Management
  static async createTemplate(template: Omit<NewsletterTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<NewsletterTemplate> {
    const newTemplate: NewsletterTemplate = {
      ...template,
      id: `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.templates.push(newTemplate)
    return newTemplate
  }

  static async getTemplates(): Promise<NewsletterTemplate[]> {
    return [...this.templates].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  static async updateTemplate(templateId: string, updates: Partial<NewsletterTemplate>): Promise<NewsletterTemplate | null> {
    const index = this.templates.findIndex(tpl => tpl.id === templateId)
    if (index === -1) return null

    this.templates[index] = { 
      ...this.templates[index], 
      ...updates, 
      updated_at: new Date().toISOString() 
    }
    return this.templates[index]
  }

  static async deleteTemplate(templateId: string): Promise<boolean> {
    const index = this.templates.findIndex(tpl => tpl.id === templateId)
    if (index === -1) return false

    this.templates.splice(index, 1)
    return true
  }

  // Campaign Management
  static async createCampaign(campaign: Omit<NewsletterCampaign, 'id' | 'created_at' | 'recipient_count' | 'sent_count' | 'opened_count' | 'clicked_count' | 'bounced_count'>): Promise<NewsletterCampaign> {
    // Calculate recipient count based on segment criteria
    const recipients = await this.getSegmentedSubscribers(campaign.segment_criteria)
    
    const newCampaign: NewsletterCampaign = {
      ...campaign,
      id: `camp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      recipient_count: recipients.length,
      sent_count: 0,
      opened_count: 0,
      clicked_count: 0,
      bounced_count: 0
    }

    this.campaigns.push(newCampaign)
    return newCampaign
  }

  static async getCampaigns(): Promise<NewsletterCampaign[]> {
    return [...this.campaigns].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  static async updateCampaign(campaignId: string, updates: Partial<NewsletterCampaign>): Promise<NewsletterCampaign | null> {
    const index = this.campaigns.findIndex(camp => camp.id === campaignId)
    if (index === -1) return null

    this.campaigns[index] = { ...this.campaigns[index], ...updates }
    return this.campaigns[index]
  }

  static async sendCampaign(campaignId: string): Promise<boolean> {
    const campaign = this.campaigns.find(camp => camp.id === campaignId)
    if (!campaign || campaign.status !== 'draft') return false

    // Simulate sending process
    campaign.status = 'sending'
    
    // Mock sending delay
    setTimeout(() => {
      campaign.status = 'sent'
      campaign.sent_at = new Date().toISOString()
      campaign.sent_count = campaign.recipient_count
      // Mock engagement stats
      campaign.opened_count = Math.floor(campaign.recipient_count * (0.15 + Math.random() * 0.25)) // 15-40% open rate
      campaign.clicked_count = Math.floor(campaign.opened_count * (0.1 + Math.random() * 0.2)) // 10-30% click rate
      campaign.bounced_count = Math.floor(campaign.recipient_count * (0.01 + Math.random() * 0.03)) // 1-4% bounce rate
    }, 2000)

    return true
  }

  private static async getSegmentedSubscribers(criteria?: NewsletterCampaign['segment_criteria']): Promise<NewsletterSubscriber[]> {
    let subscribers = this.subscribers.filter(sub => sub.status === 'active')

    if (!criteria) return subscribers

    if (criteria.include_tags && criteria.include_tags.length > 0) {
      subscribers = subscribers.filter(sub => 
        criteria.include_tags!.some(tag => sub.tags.includes(tag))
      )
    }

    if (criteria.exclude_tags && criteria.exclude_tags.length > 0) {
      subscribers = subscribers.filter(sub => 
        !criteria.exclude_tags!.some(tag => sub.tags.includes(tag))
      )
    }

    if (criteria.subscription_date_from) {
      const fromDate = new Date(criteria.subscription_date_from)
      subscribers = subscribers.filter(sub => 
        new Date(sub.subscribed_at) >= fromDate
      )
    }

    if (criteria.subscription_date_to) {
      const toDate = new Date(criteria.subscription_date_to)
      subscribers = subscribers.filter(sub => 
        new Date(sub.subscribed_at) <= toDate
      )
    }

    if (criteria.preferences) {
      subscribers = subscribers.filter(sub => {
        return Object.entries(criteria.preferences!).every(([key, value]) => 
          sub.preferences[key as keyof typeof sub.preferences] === value
        )
      })
    }

    return subscribers
  }

  // Analytics & Stats
  static async getStats(): Promise<NewsletterStats> {
    const totalSubscribers = this.subscribers.length
    const activeSubscribers = this.subscribers.filter(sub => sub.status === 'active').length
    const unsubscribed = this.subscribers.filter(sub => sub.status === 'unsubscribed').length
    const bounced = this.subscribers.filter(sub => sub.status === 'bounced').length
    
    const sentCampaigns = this.campaigns.filter(camp => camp.status === 'sent')
    const totalOpened = sentCampaigns.reduce((sum, camp) => sum + camp.opened_count, 0)
    const totalSent = sentCampaigns.reduce((sum, camp) => sum + camp.sent_count, 0)
    const totalClicked = sentCampaigns.reduce((sum, camp) => sum + camp.clicked_count, 0)

    // Calculate weekly signups for the last 8 weeks
    const weeklySignups: number[] = []
    const now = new Date()
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000))
      const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000))
      
      const weekSignups = this.subscribers.filter(sub => {
        const subDate = new Date(sub.subscribed_at)
        return subDate >= weekStart && subDate < weekEnd
      }).length
      
      weeklySignups.push(weekSignups)
    }

    const lastWeekSignups = weeklySignups[weeklySignups.length - 1] || 0
    const previousWeekSignups = weeklySignups[weeklySignups.length - 2] || 0
    const recentGrowth = previousWeekSignups > 0 
      ? ((lastWeekSignups - previousWeekSignups) / previousWeekSignups) * 100 
      : 0

    return {
      total_subscribers: totalSubscribers,
      active_subscribers: activeSubscribers,
      unsubscribed_count: unsubscribed,
      bounced_count: bounced,
      campaigns_sent: sentCampaigns.length,
      average_open_rate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
      average_click_rate: totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0,
      recent_growth: recentGrowth,
      weekly_signups: weeklySignups
    }
  }

  // Initialize with mock data
  static initializeMockData() {
    if (this.subscribers.length > 0) return // Already initialized

    // Mock subscribers
    const mockSubscribers: NewsletterSubscriber[] = [
      {
        id: 'sub-1',
        email: 'sarah.johnson@example.com',
        first_name: 'Sarah',
        last_name: 'Johnson',
        status: 'active',
        source: 'website',
        subscribed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        preferences: {
          weekly_digest: true,
          event_notifications: true,
          new_piano_alerts: true,
          blog_updates: true
        },
        tags: ['website', 'piano-enthusiast']
      },
      {
        id: 'sub-2',
        email: 'mike.composer@example.com',
        first_name: 'Mike',
        last_name: 'Composer',
        status: 'active',
        source: 'event_signup',
        subscribed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        preferences: {
          weekly_digest: false,
          event_notifications: true,
          new_piano_alerts: false,
          blog_updates: true
        },
        tags: ['event_signup', 'musician']
      },
      {
        id: 'sub-3',
        email: 'emma.pianist@example.com',
        first_name: 'Emma',
        last_name: 'Wilson',
        status: 'unsubscribed',
        source: 'website',
        subscribed_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        unsubscribed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        preferences: {
          weekly_digest: true,
          event_notifications: false,
          new_piano_alerts: true,
          blog_updates: false
        },
        tags: ['website']
      }
    ]

    // Mock templates
    const mockTemplates: NewsletterTemplate[] = [
      {
        id: 'tpl-1',
        name: 'Weekly Piano Digest',
        subject: 'Your Weekly Piano Update - {{week_date}}',
        content: `
          <h1>Weekly Piano Digest</h1>
          <p>Discover new pianos, upcoming events, and community stories!</p>
          
          <h2>New Pianos This Week</h2>
          {{#new_pianos}}
          <div>
            <h3>{{name}}</h3>
            <p>{{location_name}} - {{category}}</p>
          </div>
          {{/new_pianos}}
          
          <h2>Upcoming Events</h2>
          {{#upcoming_events}}
          <div>
            <h3>{{title}}</h3>
            <p>{{date}} - {{location_name}}</p>
          </div>
          {{/upcoming_events}}
        `,
        template_type: 'weekly_digest',
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'admin'
      }
    ]

    // Mock campaigns
    const mockCampaigns: NewsletterCampaign[] = [
      {
        id: 'camp-1',
        name: 'Welcome New Piano in Central Park',
        subject: '🎹 New Piano Alert: Beautiful Grand in Central Park!',
        content: `
          <h1>Exciting News!</h1>
          <p>A beautiful grand piano has been installed in Central Park and is ready for the community to enjoy!</p>
          <p>Location: Near Bethesda Fountain</p>
          <p>Perfect tuning and excellent condition. Come play and share your music!</p>
        `,
        status: 'sent',
        recipient_count: 2,
        sent_count: 2,
        opened_count: 1,
        clicked_count: 1,
        bounced_count: 0,
        sent_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'admin',
        tags: ['new-piano'],
        segment_criteria: {
          include_tags: ['website', 'piano-enthusiast']
        }
      }
    ]

    this.subscribers = mockSubscribers
    this.templates = mockTemplates
    this.campaigns = mockCampaigns
  }
}

// Initialize mock data
NewsletterService.initializeMockData()