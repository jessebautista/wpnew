/**
 * Data Service
 * Centralized service for switching between mock data and real Supabase data
 */

import { shouldUseMockData } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import type { Piano, Event, BlogPost, EventAttendee } from '../types'


// Mock data in new Sing for Hope format
const mockPianos: Piano[] = [
  {
    id: 1,
    piano_title: 'Harmony in the Park',
    piano_image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop',
    piano_statement: 'A beautiful grand piano installation celebrating community music in the heart of Central Park. This piece invites people of all ages to share their musical talents.',
    piano_url: 'harmony-in-the-park',
    piano_year: '2024',
    piano_artist: null,
    artist_name: 'Maria Rodriguez',
    piano_artist_bio: 'Maria Rodriguez is a renowned muralist and community artist based in New York. She specializes in large-scale public art that brings communities together through shared cultural experiences.',
    artist_photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=400&h=400&fit=crop',
    artist_website_url: null,
    artist_facebook_url: null,
    artist_instagram_url: '@maria_art_nyc',
    permanent_home_name: 'Central Park Conservancy',
    public_location_name: 'Central Park - Bethesda Fountain Area',
    perm_lat: '40.7829',
    perm_lng: '-73.9654',
    piano_program: 'NYC Street Pianos Initiative',
    contributors_info: 'Sponsored by Central Park Conservancy and NYC Department of Cultural Affairs',
    piano_site: 1,
    notes: 'Weather-protected with custom cover. Available during park hours.',
    piano_search: 'Harmony in the Park Maria Rodriguez Central Park piano community music',
    search_vector: null,
    created_at: '2024-03-15T10:30:00Z',
    updated_at: '2024-03-15T10:30:00Z',
    created_by: '00000000-0000-0000-0000-000000000000',
    verified_by: '00000000-0000-0000-0000-000000000000',
    moderation_status: 'approved',
    verified: true,
    piano_source: 'sing_for_hope',
    source: 'Sing for Hope',
    latitude: 40.7829,
    longitude: -73.9654,
    location_display_name: 'Central Park - Bethesda Fountain Area'
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
    organizer: null,
    contact_email: 'events@worldpianos.org',
    moderation_status: 'approved',
    status: 'upcoming',
    verified: true,
    created_by: 'user123',
    verified_by: 'admin',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    attendee_count: 0,
    // New piano-specific fields
    piano_count: 2,
    piano_type: 'Grand',
    piano_condition: 'Excellent',
    piano_special_features: ['Painted/Decorated', 'Bench Included', 'Weather Protected'],
    piano_accessibility: 'Wheelchair accessible with ramp access and clear pathways',
    piano_images: [
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800&h=600&fit=crop'
    ]
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
    allow_comments: true,
    moderation_status: 'approved',
    created_at: '2023-06-10T10:30:00Z',
    updated_at: '2023-06-10T10:30:00Z'
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
      // Use Supabase view to get pianos with computed coordinates
      console.log('[SUPABASE] Fetching pianos via pianos_with_coordinates view')
      const { data, error } = await supabase
        .from('pianos_with_coordinates')
        .select('*')
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Ensure computed fields are set
      const pianos = data?.map((piano: any) => {
        // Handle "null" strings and actual null values
        const latStr = piano.perm_lat
        const lngStr = piano.perm_lng
        const lat = (latStr && latStr !== 'null' && latStr !== '') ? parseFloat(latStr) : null
        const lng = (lngStr && lngStr !== 'null' && lngStr !== '') ? parseFloat(lngStr) : null
        
        return {
          ...piano,
          location_display_name: piano.location_display_name || piano.public_location_name || piano.permanent_home_name || 'Unknown Location',
          // Convert string coordinates to numbers for map display
          latitude: lat,
          longitude: lng
        }
      }) || []
      
      // Debug: Log sample coordinate conversion
      const samplePianos = pianos.slice(0, 3)
      const debugData = samplePianos.map(p => ({
        id: p.id,
        title: p.piano_title,
        perm_lat: p.perm_lat,
        perm_lng: p.perm_lng,
        latitude: p.latitude,
        longitude: p.longitude,
        hasValidCoords: p.latitude != null && p.longitude != null && !isNaN(p.latitude) && !isNaN(p.longitude)
      }))
      console.log('[COORDINATE DEBUG] Sample piano coordinates after conversion:')
      debugData.forEach((p, i) => {
        console.log(`  Piano ${i + 1}: ID=${p.id}, Title="${p.title}", perm_lat="${p.perm_lat}", perm_lng="${p.perm_lng}", lat=${p.latitude}, lng=${p.longitude}, valid=${p.hasValidCoords}`)
      })
      
      // Count total valid coordinates
      const validCoordCount = pianos.filter(p => p.latitude != null && p.longitude != null && !isNaN(p.latitude) && !isNaN(p.longitude)).length
      console.log(`[COORDINATE DEBUG] Total pianos with valid coordinates: ${validCoordCount} out of ${pianos.length} (${Math.round((validCoordCount / pianos.length) * 100)}%)`)

      console.log(`[SUPABASE] Successfully fetched ${pianos.length} pianos`)
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
        
        // Apply same coordinate conversion as main fetch
        const pianosWithCoords = data.map((piano: any) => {
          const latStr = piano.perm_lat
          const lngStr = piano.perm_lng
          const lat = (latStr && latStr !== 'null' && latStr !== '') ? parseFloat(latStr) : null
          const lng = (lngStr && lngStr !== 'null' && lngStr !== '') ? parseFloat(lngStr) : null
          
          return {
            ...piano,
            location_display_name: piano.location_display_name || piano.public_location_name || piano.permanent_home_name || 'Unknown Location',
            latitude: lat,
            longitude: lng
          }
        })
        
        return pianosWithCoords
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
  static async updatePianoModerationStatus(pianoId: string, status: 'approved' | 'rejected', _reviewerId: string): Promise<boolean> {
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

      // Note: rejection_reason column doesn't exist in current schema
      // TODO: Add rejection_reason column to pianos table if needed

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
   * Update event moderation status
   */
  static async updateEventModerationStatus(eventId: string, status: 'approved' | 'rejected', reviewerId: string): Promise<boolean> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Updating event ${eventId} moderation status to ${status}`)
      return Promise.resolve(true)
    }

    try {
      console.log(`[SUPABASE] Updating event ${eventId} moderation status to ${status}`)
      
      const updateData: any = {
        moderation_status: status,
        verified: status === 'approved',
        verified_by: reviewerId,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)

      if (error) throw error

      console.log(`[SUPABASE] Successfully updated event ${eventId} moderation status`)
      return true
    } catch (error) {
      console.error(`Error updating event moderation status:`, error)
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
        .eq('created_by', userId)
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
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/events?select=*&moderation_status=eq.approved&order=date.desc`, {
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
   * Get blog post by ID or slug
   */
  static async getBlogPostById(idOrSlug: string): Promise<BlogPost | null> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Fetching blog post ${idOrSlug} from mock data`)
      return Promise.resolve(
        mockBlogPosts.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null
      )
    }
    
    try {
      // Use direct fetch instead of Supabase client for public access
      console.log(`[DIRECT] Fetching blog post ${idOrSlug} via direct API call`)
      
      // Try to determine if it's a UUID (36 characters with dashes) or a slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)
      const searchField = isUUID ? 'id' : 'slug'
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/blog_posts?select=*&${searchField}=eq.${idOrSlug}&published=eq.true`, {
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
      console.log(`[DIRECT] Successfully fetched blog post ${idOrSlug}`)
      return data.length > 0 ? data[0] : null
    } catch (error) {
      console.error(`Direct fetch error for blog post ${idOrSlug}:`, error)
      // Fallback to mock data on connection error
      return mockBlogPosts.find(p => p.id === idOrSlug) || null
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

  /**
   * Toggle user interest in an event (email-based)
   */
  static async toggleEventInterest(eventId: string, userIdOrEmail: string, isEmail: boolean = false): Promise<{ isInterested: boolean; attendeeCount: number }> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Toggling interest for event ${eventId} and ${isEmail ? 'email' : 'user'} ${userIdOrEmail}`)
      // Mock implementation - just return random state
      return Promise.resolve({ 
        isInterested: Math.random() > 0.5, 
        attendeeCount: Math.floor(Math.random() * 50) + 1 
      })
    }

    try {
      console.log(`[SUPABASE] Toggling interest for event ${eventId} and ${isEmail ? 'email' : 'user'} ${userIdOrEmail}`)
      
      let queryBuilder = supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)

      // Check if user is already interested based on user_id or email
      if (isEmail) {
        queryBuilder = queryBuilder.eq('email', userIdOrEmail).is('user_id', null)
      } else {
        queryBuilder = queryBuilder.eq('user_id', userIdOrEmail)
      }

      const { data: existing, error: checkError } = await queryBuilder.maybeSingle()

      if (checkError) {
        console.error('Error checking existing attendance:', checkError)
        throw checkError
      }

      if (existing) {
        // User is already interested, remove interest
        console.log(`[SUPABASE] Removing interest for existing record:`, existing.id)
        const { error: deleteError } = await supabase
          .from('event_attendees')
          .delete()
          .eq('id', existing.id)

        if (deleteError) {
          console.error('Error removing interest:', deleteError)
          throw deleteError
        }

        // Get updated attendee count from event
        const updatedEvent = await this.getEvent(eventId)
        console.log(`[SUPABASE] Successfully removed interest for event ${eventId}`)
        return { isInterested: false, attendeeCount: updatedEvent?.attendee_count || 0 }
      } else {
        // User is not interested, add interest
        console.log(`[SUPABASE] Adding interest for event ${eventId}`)
        
        const insertData = isEmail ? {
          event_id: eventId,
          email: userIdOrEmail,
          user_id: null,
          status: 'interested'
        } : {
          event_id: eventId,
          user_id: userIdOrEmail,
          email: null,
          status: 'interested'
        }

        const { error: insertError } = await supabase
          .from('event_attendees')
          .insert([insertData])

        if (insertError) {
          console.error('Error adding interest:', insertError)
          throw insertError
        }

        // Get updated attendee count from event
        const updatedEvent = await this.getEvent(eventId)
        console.log(`[SUPABASE] Successfully added interest for event ${eventId}`)
        return { isInterested: true, attendeeCount: updatedEvent?.attendee_count || 0 }
      }
    } catch (error) {
      console.error('Error toggling event interest:', error)
      throw error
    }
  }

  /**
   * Check if user/email is interested in an event
   */
  static async checkEventInterest(eventId: string, userIdOrEmail: string, isEmail: boolean = false): Promise<boolean> {
    if (shouldUseMockData('supabase')) {
      return Promise.resolve(false)
    }

    try {
      let queryBuilder = supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)

      if (isEmail) {
        queryBuilder = queryBuilder.eq('email', userIdOrEmail).is('user_id', null)
      } else {
        queryBuilder = queryBuilder.eq('user_id', userIdOrEmail)
      }

      const { data, error } = await queryBuilder.maybeSingle()

      if (error) {
        console.error('Error checking event interest:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Error checking event interest:', error)
      return false
    }
  }

  /**
   * Get user's attendance status for an event
   */
  static async getEventAttendance(eventId: string, userId: string): Promise<EventAttendee | null> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Getting attendance for event ${eventId} and user ${userId}`)
      return Promise.resolve(null)
    }

    try {
      console.log(`[SUPABASE] Getting attendance for event ${eventId} and user ${userId}`)
      
      // Verify authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        console.log('[SUPABASE] User not authenticated for attendance check')
        return null
      }

      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error getting event attendance:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Error getting event attendance:', error)
      return null
    }
  }

  /**
   * Get all attendees for an event
   */
  static async getEventAttendees(eventId: string): Promise<EventAttendee[]> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Getting attendees for event ${eventId}`)
      return Promise.resolve([])
    }

    try {
      console.log(`[SUPABASE] Getting attendees for event ${eventId}`)
      
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          user:users(id, full_name, username, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('registered_at', { ascending: false })

      if (error) throw error

      console.log(`[SUPABASE] Successfully fetched ${data?.length || 0} attendees for event`)
      return data || []
    } catch (error) {
      console.error('Error fetching event attendees:', error)
      return []
    }
  }

  /**
   * Update user's attendance status for an event
   */
  static async updateEventAttendance(eventId: string, userId: string, status: EventAttendee['status']): Promise<EventAttendee> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Updating attendance status to ${status} for event ${eventId} and user ${userId}`)
      const mockAttendee: EventAttendee = {
        id: `mock-${Date.now()}`,
        event_id: eventId,
        user_id: userId,
        status,
        registered_at: new Date().toISOString(),
        checked_in: false,
        checked_in_at: null,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return Promise.resolve(mockAttendee)
    }

    try {
      console.log(`[SUPABASE] Updating attendance status to ${status} for event ${eventId} and user ${userId}`)
      
      // Try to update existing record first
      const { data: updateData, error: updateError } = await supabase
        .from('event_attendees')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .select()
        .single()

      if (updateError && updateError.code === 'PGRST116') {
        // No existing record, create new one
        const { data: insertData, error: insertError } = await supabase
          .from('event_attendees')
          .insert([{
            event_id: eventId,
            user_id: userId,
            status
          }])
          .select()
          .single()

        if (insertError) throw insertError
        console.log(`[SUPABASE] Created new attendance record with status ${status}`)
        return insertData
      } else if (updateError) {
        throw updateError
      }

      console.log(`[SUPABASE] Updated attendance status to ${status}`)
      return updateData
    } catch (error) {
      console.error('Error updating event attendance:', error)
      throw error
    }
  }

  /**
   * Get events with user's attendance status
   */
  static async getEventsWithAttendance(userId?: string): Promise<Event[]> {
    const events = await this.getEvents()
    
    if (!userId || shouldUseMockData('supabase')) {
      return events
    }

    try {
      // Get user's attendance for all events
      const { data: attendances, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching user attendances:', error)
        return events
      }

      // Map attendance data to events
      const attendanceMap = new Map(attendances?.map(a => [a.event_id, a]) || [])
      
      return events.map(event => ({
        ...event,
        userAttendance: attendanceMap.get(event.id) || undefined
      }))
    } catch (error) {
      console.error('Error getting events with attendance:', error)
      return events
    }
  }

  // ===== BLOG METHODS =====

  /**
   * Get all blog posts
   */
  static async getBlogPosts(): Promise<BlogPost[]> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Fetching mock blog posts')
      return mockBlogPosts
    }

    try {
      console.log('[SUPABASE] Fetching blog posts')
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('moderation_status', 'approved')
        .order('published_at', { ascending: false })

      if (error) throw error
      
      console.log(`[SUPABASE] Successfully fetched ${data?.length || 0} blog posts`)
      return data || []
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      console.log('[FALLBACK] Using mock blog posts due to Supabase error')
      return mockBlogPosts
    }
  }

  /**
   * Get all blog posts including drafts (admin only)
   */
  static async getAllBlogPosts(): Promise<BlogPost[]> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Fetching all mock blog posts')
      return mockBlogPosts
    }

    try {
      console.log('[SUPABASE] Fetching all blog posts (admin)')
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      console.log(`[SUPABASE] Successfully fetched ${data?.length || 0} blog posts`)
      return data || []
    } catch (error) {
      console.error('Error fetching all blog posts:', error)
      console.log('[FALLBACK] Using mock blog posts due to Supabase error')
      return mockBlogPosts
    }
  }

  /**
   * Get a single blog post by ID
   */
  static async getBlogPost(id: string): Promise<BlogPost | null> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Fetching mock blog post ${id}`)
      return mockBlogPosts.find(post => post.id === id) || null
    }

    try {
      console.log(`[SUPABASE] Fetching blog post ${id}`)
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id)

      console.log(`[SUPABASE] Successfully fetched blog post: ${data.title}`)
      return data
    } catch (error) {
      console.error('Error fetching blog post:', error)
      console.log('[FALLBACK] Using mock blog post due to Supabase error')
      return mockBlogPosts.find(post => post.id === id) || null
    }
  }

  /**
   * Create a new blog post
   */
  static async createBlogPost(postData: Partial<BlogPost>): Promise<BlogPost> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Creating mock blog post')
      const mockPost: BlogPost = {
        id: `mock-${Date.now()}`,
        title: postData.title || '',
        slug: postData.slug || '',
        content: postData.content || '',
        excerpt: postData.excerpt || null,
        featured_image: postData.featured_image || null,
        category: postData.category || null,
        tags: postData.tags || null,
        author_id: postData.author_id || 'mock-user',
        published: postData.published || false,
        featured: postData.featured || false,
        allow_comments: postData.allow_comments ?? true,
        view_count: 0,
        reading_time: postData.reading_time || null,
        meta_title: postData.meta_title || null,
        meta_description: postData.meta_description || null,
        moderation_status: 'approved',
        published_at: postData.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        legacy_id: null
      }
      return Promise.resolve(mockPost)
    }

    try {
      console.log('[SUPABASE] Creating blog post')
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...postData,
          published_at: postData.published ? new Date().toISOString() : null,
          moderation_status: 'approved' // Auto-approve for admin users
        }])
        .select('*')
        .single()

      if (error) throw error
      
      console.log(`[SUPABASE] Successfully created blog post: ${data.title}`)
      return data
    } catch (error) {
      console.error('Error creating blog post:', error)
      throw error
    }
  }

  /**
   * Update a blog post
   */
  static async updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Updating mock blog post ${id}`)
      const mockPost = mockBlogPosts.find(post => post.id === id)
      if (!mockPost) throw new Error('Blog post not found')
      
      return Promise.resolve({
        ...mockPost,
        ...postData,
        updated_at: new Date().toISOString(),
        published_at: postData.published ? new Date().toISOString() : mockPost.published_at
      })
    }

    try {
      console.log(`[SUPABASE] Updating blog post ${id}`)
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...postData,
          updated_at: new Date().toISOString(),
          published_at: postData.published ? new Date().toISOString() : postData.published_at
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error
      
      console.log(`[SUPABASE] Successfully updated blog post: ${data.title}`)
      return data
    } catch (error) {
      console.error('Error updating blog post:', error)
      throw error
    }
  }

  /**
   * Delete a blog post
   */
  static async deleteBlogPost(id: string): Promise<void> {
    if (shouldUseMockData('supabase')) {
      console.log(`[MOCK] Deleting mock blog post ${id}`)
      return Promise.resolve()
    }

    try {
      console.log(`[SUPABASE] Deleting blog post ${id}`)
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      console.log(`[SUPABASE] Successfully deleted blog post ${id}`)
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw error
    }
  }
}