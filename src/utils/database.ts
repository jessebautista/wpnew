import { supabase } from '../lib/supabase'
import type { Piano, Event, BlogPost, Comment, User } from '../types'
import { MockDataService } from '../data/mockData'

// Check if we should use mock data
const useMockData = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  return !supabaseUrl || supabaseUrl === 'https://your-project.supabase.co'
}

// Piano operations
export const pianoService = {
  async getAll(): Promise<Piano[]> {
    if (useMockData()) {
      return MockDataService.getPianos()
    }

    const { data, error } = await supabase
      .from('pianos')
      .select(`
        *,
        author:profiles!created_by(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Piano | null> {
    if (useMockData()) {
      const pianos = await MockDataService.getPianos()
      return pianos.find(p => p.id === id) || null
    }

    const { data, error } = await supabase
      .from('pianos')
      .select(`
        *,
        author:profiles!created_by(*),
        images:piano_images(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async searchNearLocation(
    latitude: number,
    longitude: number,
    radius: number = 50,
    filters?: {
      query?: string
      category?: string
      condition?: string
      verified?: boolean
    }
  ): Promise<Piano[]> {
    if (useMockData()) {
      // Simple mock implementation - return all pianos for now
      return MockDataService.getPianos()
    }

    const { data, error } = await supabase
      .rpc('search_pianos_near_location', {
        search_lat: latitude,
        search_lng: longitude,
        radius_km: radius,
        search_query: filters?.query,
        category_filter: filters?.category,
        condition_filter: filters?.condition,
        verified_only: filters?.verified || false
      })

    if (error) throw error
    return data || []
  },

  async create(piano: Omit<Piano, 'id' | 'created_at' | 'updated_at' | 'author'>): Promise<Piano> {
    if (useMockData()) {
      // In mock mode, just return the piano with a generated ID
      const newPiano: Piano = {
        ...piano,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return newPiano
    }

    const { data, error } = await supabase
      .from('pianos')
      .insert(piano)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Piano>): Promise<Piano> {
    if (useMockData()) {
      const pianos = await MockDataService.getPianos()
      const piano = pianos.find(p => p.id === id)
      if (!piano) throw new Error('Piano not found')
      return { ...piano, ...updates, updated_at: new Date().toISOString() }
    }

    const { data, error } = await supabase
      .from('pianos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Event operations
export const eventService = {
  async getAll(): Promise<Event[]> {
    if (useMockData()) {
      return MockDataService.getEvents()
    }

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        author:profiles!created_by(*)
      `)
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getUpcoming(limit?: number): Promise<Event[]> {
    if (useMockData()) {
      const events = await MockDataService.getEvents()
      const upcoming = events.filter(e => new Date(e.date) > new Date())
      return limit ? upcoming.slice(0, limit) : upcoming
    }

    const query = supabase
      .from('events')
      .select(`
        *,
        author:profiles!created_by(*)
      `)
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })

    if (limit) {
      query.limit(limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async create(event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'author'>): Promise<Event> {
    if (useMockData()) {
      const newEvent: Event = {
        ...event,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return newEvent
    }

    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Blog operations
export const blogService = {
  async getPublished(): Promise<BlogPost[]> {
    if (useMockData()) {
      return MockDataService.getBlogPosts()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles!author_id(*)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<BlogPost | null> {
    if (useMockData()) {
      const posts = await MockDataService.getBlogPosts()
      return posts.find(p => p.id === id) || null
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles!author_id(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}

// Comment operations
export const commentService = {
  async getForContent(contentType: 'piano' | 'event' | 'blog_post', contentId: string): Promise<Comment[]> {
    if (useMockData()) {
      // Return empty array for mock data - comments will be implemented later
      return []
    }

    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!author_id(*)
      `)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async create(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'author'>): Promise<Comment> {
    if (useMockData()) {
      const newComment: Comment = {
        ...comment,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return newComment
    }

    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// User operations
export const userService = {
  async getProfile(userId: string): Promise<User | null> {
    if (useMockData()) {
      const users = await MockDataService.getUsers()
      return users.find(u => u.id === userId) || null
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    if (useMockData()) {
      const users = await MockDataService.getUsers()
      const user = users.find(u => u.id === userId)
      if (!user) throw new Error('User not found')
      return { ...user, ...updates, updated_at: new Date().toISOString() }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getPianoStats(userId: string): Promise<any> {
    if (useMockData()) {
      return {
        pianos_added: 5,
        pianos_visited: 12,
        events_created: 2,
        events_interested: 8,
        achievements_earned: 4,
        countries_visited: 3
      }
    }

    try {
      // Try to use the stored procedure first
      const { data, error } = await supabase
        .rpc('get_user_piano_stats', { user_uuid: userId })

      if (error) throw error
      return data
    } catch (error) {
      console.warn('get_user_piano_stats function not available, calculating manually:', error)
      
      // Fallback: Calculate stats manually using direct queries
      try {
        const [pianosData, eventsData, visitsData] = await Promise.all([
          supabase
            .from('pianos')
            .select('id')
            .eq('created_by', userId),
          supabase
            .from('events')
            .select('id')
            .eq('created_by', userId),
          supabase
            .from('piano_visits')
            .select('piano_id, pianos!inner(location_name)')
            .eq('user_id', userId)
        ])

        const pianosAdded = pianosData.data?.length || 0
        const eventsCreated = eventsData.data?.length || 0
        const pianosVisited = visitsData.data?.length || 0
        
        // Extract unique countries from piano visits
        const countries = new Set(
          visitsData.data?.map(v => {
            const location = v.pianos?.location_name || ''
            // Simple country extraction - get last part after comma
            const parts = location.split(',')
            return parts[parts.length - 1]?.trim()
          }).filter(Boolean) || []
        )

        return {
          pianos_added: pianosAdded,
          pianos_visited: pianosVisited,
          events_created: eventsCreated,
          events_interested: 0, // TODO: Implement when events_interest table exists
          achievements_earned: 0, // TODO: Implement when achievements system exists
          countries_visited: countries.size
        }
      } catch (fallbackError) {
        console.error('Failed to calculate stats manually:', fallbackError)
        // Return zeros if everything fails
        return {
          pianos_added: 0,
          pianos_visited: 0,
          events_created: 0,
          events_interested: 0,
          achievements_earned: 0,
          countries_visited: 0
        }
      }
    }
  }
}

// Newsletter operations
export const newsletterService = {
  async subscribe(email: string): Promise<void> {
    if (useMockData()) {
      console.log('Mock newsletter subscription for:', email)
      return
    }

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({ email })

    if (error) throw error
  },

  async unsubscribe(email: string): Promise<void> {
    if (useMockData()) {
      console.log('Mock newsletter unsubscription for:', email)
      return
    }

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .delete()
      .eq('email', email)

    if (error) throw error
  }
}