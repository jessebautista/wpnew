/**
 * Data Service
 * Centralized service for switching between mock data and real Supabase data
 */

import { shouldUseMockData } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import type { Piano, Event, BlogPost, User } from '../types'

// Mock data
const mockPianos: Piano[] = [
  {
    id: '1',
    name: 'Central Park Piano',
    description: 'Beautiful grand piano located near the Bethesda Fountain',
    location_name: 'Central Park, New York',
    latitude: 40.7829,
    longitude: -73.9654,
    category: 'Park',
    condition: 'Good',
    accessibility: 'Wheelchair accessible',
    hours: '6AM - 10PM',
    verified: true,
    created_by: 'user123',
    verified_by: 'admin',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T10:30:00Z',
    images: [
      {
        id: 'img1',
        piano_id: '1',
        image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop',
        alt_text: 'Grand piano in Central Park with fountain in background',
        created_at: '2023-01-15T10:30:00Z'
      },
      {
        id: 'img2',
        piano_id: '1',
        image_url: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800&h=600&fit=crop',
        alt_text: 'Close-up view of the piano keys',
        created_at: '2023-01-15T11:00:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Times Square Street Piano',
    description: 'Colorful street piano in the heart of Times Square',
    location_name: 'Times Square, New York',
    latitude: 40.7580,
    longitude: -73.9855,
    category: 'Street',
    condition: 'Fair',
    accessibility: null,
    hours: '24/7',
    verified: true,
    created_by: 'user456',
    verified_by: 'moderator',
    created_at: '2023-02-20T14:20:00Z',
    updated_at: '2023-02-20T14:20:00Z',
    images: [
      {
        id: 'img3',
        piano_id: '2',
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        alt_text: 'Colorfully painted street piano in Times Square',
        created_at: '2023-02-20T14:20:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Airport Lounge Piano',
    description: 'Quiet piano in the departure lounge for travelers',
    location_name: 'JFK Airport Terminal 4, New York',
    latitude: 40.6413,
    longitude: -73.7781,
    category: 'Airport',
    condition: 'Excellent',
    accessibility: 'Wheelchair accessible',
    hours: 'Airport operating hours',
    verified: false,
    created_by: 'user789',
    verified_by: null,
    created_at: '2023-03-10T09:15:00Z',
    updated_at: '2023-03-10T09:15:00Z',
    images: [] // No images for this one to test fallback
  }
]

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Piano Concert in the Park',
    description: 'Join us for a beautiful evening of piano music',
    date: '2024-06-15T19:00:00Z',
    end_date: '2024-06-15T22:00:00Z',
    location_name: 'Central Park Bandshell',
    address: 'Central Park, NY 10024',
    latitude: 40.7829,
    longitude: -73.9654,
    piano_id: '1',
    category: 'Concert',
    max_attendees: 100,
    is_virtual: false,
    organizer_id: 'user123',
    contact_email: 'events@worldpianos.org',
    moderation_status: 'approved',
    status: 'upcoming',
    created_at: '2024-01-15T10:30:00Z',
    attendee_count: 0
  }
]

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Joy of Public Pianos',
    slug: 'joy-of-public-pianos',
    content: '<p>Public pianos bring music to unexpected places...</p>',
    excerpt: 'Exploring how public pianos create community connections',
    featured_image: 'https://example.com/piano-joy.jpg',
    category: 'Stories',
    tags: ['piano', 'community', 'music'],
    author_id: 'user123',
    published: true,
    featured: false,
    allow_comments: true,
    view_count: 1250,
    reading_time: 5,
    moderation_status: 'approved',
    published_at: '2023-06-15T12:00:00Z',
    created_at: '2023-06-10T10:30:00Z'
  }
]

export class DataService {
  /**
   * Get all pianos
   */
  static async getPianos(): Promise<Piano[]> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Fetching pianos from mock data')
      return Promise.resolve(mockPianos)
    }

    try {
      // Use Supabase client to get pianos with images
      console.log('[SUPABASE] Fetching pianos with images via Supabase client')
      const { data, error } = await supabase
        .from('pianos')
        .select(`
          *,
          piano_images (
            id,
            image_url,
            alt_text,
            created_at
          )
        `)
        .eq('moderation_status', 'approved')

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Map piano_images to images field for consistency with our types
      const pianos = data?.map((piano: any) => ({
        ...piano,
        images: piano.piano_images || []
      })) || []

      console.log(`[SUPABASE] Successfully fetched ${pianos.length} pianos with images`)
      return pianos
    } catch (error) {
      console.error('Supabase fetch error:', error)
      
      // Fallback to direct fetch without images
      try {
        console.log('[DIRECT FALLBACK] Fetching pianos via direct API call')
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/pianos?select=*&moderation_status=eq.approved`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`[DIRECT FALLBACK] Successfully fetched ${data.length} pianos`)
        return data
      } catch (directError) {
        console.error('Direct fetch fallback error:', directError)
        // Final fallback to mock data
        return mockPianos
      }
    }
  }

  /**
   * Get piano by ID
   */
  static async getPiano(id: string): Promise<Piano | null> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Fetching piano ${id} from mock data`)
      return Promise.resolve(mockPianos.find(p => p.id === id) || null)
    }

    try {
      // Use Supabase client to get piano with all images
      console.log(`[SUPABASE] Fetching piano ${id} with images via Supabase client`)
      const { data, error } = await supabase
        .from('pianos')
        .select(`
          *,
          piano_images (
            id,
            image_url,
            alt_text,
            created_at
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Map piano_images to images field for consistency with our types
      const piano = data ? {
        ...data,
        images: (data as any).piano_images || []
      } : null

      console.log(`[SUPABASE] Successfully fetched piano ${id} with ${piano?.images?.length || 0} images`)
      return piano
    } catch (error) {
      console.error('Supabase fetch error:', error)
      
      // Fallback to direct fetch without images
      try {
        console.log(`[DIRECT FALLBACK] Fetching piano ${id} via direct API call`)
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/pianos?select=*&id=eq.${id}`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`[DIRECT FALLBACK] Piano fetch result for ID ${id}:`, data)
        
        // Return the first result or null
        return data.length > 0 ? data[0] : null
      } catch (directError) {
        console.error('Direct fetch fallback error:', directError)
        // Final fallback to mock data
        return mockPianos.find(p => p.id === id) || null
      }
    }
  }

  /**
   * Get all pending moderation items
   */
  static async getPendingModerationItems(): Promise<{ pianos: Piano[], events: Event[], blogPosts: BlogPost[] }> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Fetching pending moderation items from mock data')
      return Promise.resolve({
        pianos: mockPianos.filter(p => !p.verified),
        events: mockEvents.filter(e => e.moderation_status === 'pending'),
        blogPosts: mockBlogPosts.filter(b => b.moderation_status === 'pending')
      })
    }

    try {
      console.log('[SUPABASE] Fetching all pending moderation items')
      
      const [pianos, events, blogPosts] = await Promise.all([
        // Get pending pianos
        supabase
          .from('pianos')
          .select(`
            *,
            piano_images (
              id,
              image_url,
              alt_text,
              created_at
            )
          `)
          .eq('moderation_status', 'pending')
          .order('created_at', { ascending: false }),
          
        // Get pending events  
        supabase
          .from('events')
          .select('*')
          .eq('moderation_status', 'pending')
          .order('created_at', { ascending: false }),
          
        // Get pending blog posts
        supabase
          .from('blog_posts')
          .select('*')
          .eq('moderation_status', 'pending')
          .order('created_at', { ascending: false })
      ])

      if (pianos.error) throw pianos.error
      if (events.error) throw events.error  
      if (blogPosts.error) throw blogPosts.error

      const processedPianos = pianos.data?.map((piano: any) => ({
        ...piano,
        images: piano.piano_images || []
      })) || []

      console.log(`[SUPABASE] Successfully fetched ${processedPianos.length} pending pianos, ${events.data?.length || 0} events, ${blogPosts.data?.length || 0} blog posts`)
      
      return {
        pianos: processedPianos,
        events: events.data || [],
        blogPosts: blogPosts.data || []
      }
    } catch (error) {
      console.error('Error fetching pending moderation items:', error)
      return { pianos: [], events: [], blogPosts: [] }
    }
  }

  /**
   * Update moderation status for a piano
   */
  static async updatePianoModerationStatus(pianoId: string, status: 'approved' | 'rejected', reviewerId: string, rejectionReason?: string): Promise<boolean> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Updating piano ${pianoId} moderation status to ${status}`)
      return Promise.resolve(true)
    }

    try {
      console.log(`[SUPABASE] Updating piano ${pianoId} moderation status to ${status}`)
      
      const updateData: any = {
        moderation_status: status,
        verified: status === 'approved',
        updated_at: new Date().toISOString()
      }

      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason
      }

      const { error } = await supabase
        .from('pianos')
        .update(updateData)
        .eq('id', pianoId)

      if (error) throw error

      console.log(`[SUPABASE] Successfully updated piano ${pianoId} moderation status`)
      return true
    } catch (error) {
      console.error(`Error updating piano moderation status:`, error)
      return false
    }
  }

  /**
   * Get user's pending piano submissions
   */
  static async getUserPendingPianos(userId: string): Promise<Piano[]> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Fetching pending pianos for user ${userId} from mock data`)
      return Promise.resolve(mockPianos.filter(p => p.created_by === userId))
    }

    try {
      console.log(`[SUPABASE] Fetching pending pianos for user ${userId}`)
      const { data, error } = await supabase
        .from('pianos')
        .select(`
          *,
          piano_images (
            id,
            image_url,
            alt_text,
            created_at
          )
        `)
        .eq('submitted_by', userId)
        .eq('moderation_status', 'pending')

      if (error) {
        console.error('Error fetching user pending pianos:', error)
        throw error
      }

      // Map piano_images to images field for consistency with our types
      const pianos = data?.map((piano: any) => ({
        ...piano,
        images: piano.piano_images || []
      })) || []

      console.log(`[SUPABASE] Successfully fetched ${pianos.length} pending pianos for user`)
      return pianos
    } catch (error) {
      console.error('Error fetching user pending pianos:', error)
      return []
    }
  }

  /**
   * Create new piano
   */
  static async createPiano(piano: Omit<Piano, 'id' | 'created_at'>): Promise<Piano> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Creating piano in mock data')
      const newPiano: Piano = {
        ...piano,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString()
      }
      mockPianos.push(newPiano)
      return Promise.resolve(newPiano)
    }

    try {
      const { data, error } = await supabase
        .from('pianos')
        .insert([piano])
        .select()
        .single()

      if (error) {
        console.error('Error creating piano:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Supabase connection error:', error)
      throw error
    }
  }

  /**
   * Create new event
   */
  static async createEvent(event: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Creating event in mock data')
      const newEvent: Event = {
        ...event,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString()
      }
      mockEvents.push(newEvent)
      return Promise.resolve(newEvent)
    }

    try {
      console.log('[SUPABASE] Creating event')
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single()

      if (error) {
        console.error('Error creating event:', error)
        throw error
      }

      console.log('[SUPABASE] Event created successfully:', data.id)
      return data
    } catch (error) {
      console.error('Supabase connection error:', error)
      throw error
    }
  }

  /**
   * Get all events
   */
  static async getEvents(): Promise<Event[]> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Fetching events from mock data')
      return Promise.resolve(mockEvents)
    }

    try {
      // Use direct fetch instead of Supabase client
      console.log('[DIRECT] Fetching events via direct API call')
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/events?select=*&moderation_status=eq.approved`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`[DIRECT] Successfully fetched ${data.length} events`)
      return data
    } catch (error) {
      console.error('Direct fetch error:', error)
      // Fallback to mock data on connection error
      return mockEvents
    }
  }

  /**
   * Get event by ID
   */
  static async getEvent(id: string): Promise<Event | null> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Fetching event ${id} from mock data`)
      return Promise.resolve(mockEvents.find(e => e.id === id) || null)
    }

    try {
      // Use direct fetch instead of Supabase client
      console.log(`[DIRECT] Fetching event ${id} via direct API call`)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/events?select=*&id=eq.${id}`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`[DIRECT] Event fetch result for ID ${id}:`, data)
      
      // Return the first result or null
      return data.length > 0 ? data[0] : null
    } catch (error) {
      console.error('Direct fetch error:', error)
      // Fallback to mock data
      return mockEvents.find(e => e.id === id) || null
    }
  }

  /**
   * Get all blog posts
   */
  static async getBlogPosts(): Promise<BlogPost[]> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Fetching blog posts from mock data')
      return Promise.resolve(mockBlogPosts)
    }

    try {
      // Use direct fetch instead of Supabase client for public access
      console.log('[DIRECT] Fetching blog posts via direct API call')
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/blog_posts?select=*&published=eq.true`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`[DIRECT] Successfully fetched ${data.length} blog posts`)
      return data
    } catch (error) {
      console.error('Direct fetch error for blog posts:', error)
      // Fallback to mock data on connection error
      return mockBlogPosts
    }
  }

  /**
   * Search functionality
   */
  static async searchContent(query: string, type?: 'pianos' | 'events' | 'blog'): Promise<{
    pianos: Piano[]
    events: Event[]
    blogPosts: BlogPost[]
  }> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Searching for "${query}" in mock data`)
      const lowerQuery = query.toLowerCase()
      
      return Promise.resolve({
        pianos: type === 'pianos' || !type ? 
          mockPianos.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery) ||
            p.location_name.toLowerCase().includes(lowerQuery)
          ) : [],
        events: type === 'events' || !type ?
          mockEvents.filter(e =>
            e.title.toLowerCase().includes(lowerQuery) ||
            e.description?.toLowerCase().includes(lowerQuery)
          ) : [],
        blogPosts: type === 'blog' || !type ?
          mockBlogPosts.filter(b =>
            b.title.toLowerCase().includes(lowerQuery) ||
            b.excerpt?.toLowerCase().includes(lowerQuery)
          ) : []
      })
    }

    // Real Supabase search implementation would use full-text search
    try {
      const results = await Promise.all([
        type === 'pianos' || !type ? 
          supabase.from('pianos').select('*').textSearch('name,description,location_name', query) : 
          Promise.resolve({ data: [] }),
        type === 'events' || !type ?
          supabase.from('events').select('*').textSearch('title,description', query) :
          Promise.resolve({ data: [] }),
        type === 'blog' || !type ?
          supabase.from('blog_posts').select('*').textSearch('title,excerpt,content', query) :
          Promise.resolve({ data: [] })
      ])

      return {
        pianos: results[0].data || [],
        events: results[1].data || [],
        blogPosts: results[2].data || []
      }
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to mock search
      return this.searchContent(query, type)
    }
  }

  /**
   * Get statistics
   */
  static async getStats(): Promise<{
    totalPianos: number
    totalEvents: number
    totalBlogPosts: number
    totalUsers: number
  }> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Getting stats from mock data')
      return Promise.resolve({
        totalPianos: mockPianos.length,
        totalEvents: mockEvents.length,
        totalBlogPosts: mockBlogPosts.length,
        totalUsers: 150 // Mock user count
      })
    }

    try {
      const [pianos, events, blogPosts, users] = await Promise.all([
        supabase.from('pianos').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true })
      ])

      return {
        totalPianos: pianos.count || 0,
        totalEvents: events.count || 0,
        totalBlogPosts: blogPosts.count || 0,
        totalUsers: users.count || 0
      }
    } catch (error) {
      console.error('Stats error:', error)
      return {
        totalPianos: mockPianos.length,
        totalEvents: mockEvents.length,
        totalBlogPosts: mockBlogPosts.length,
        totalUsers: 150
      }
    }
  }
}