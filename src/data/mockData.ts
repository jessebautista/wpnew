import type { Piano, Event, BlogPost, User } from '../types'

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@worldpianos.org',
    full_name: 'Admin User',
    username: 'admin',
    avatar_url: null,
    bio: 'Administrator of WorldPianos',
    location: 'New York, USA',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'john@example.com',
    full_name: 'John Piano',
    username: 'johnpiano',
    avatar_url: null,
    bio: 'Piano enthusiast from London',
    location: 'London, UK',
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Mock pianos
export const mockPianos: Piano[] = [
  {
    id: 1,
    piano_title: 'Central Park Piano',
    piano_image: null,
    piano_statement: 'Beautiful piano in the heart of Central Park, perfect for afternoon sessions.',
    piano_url: null,
    piano_year: '2023',
    piano_artist: null,
    artist_name: 'Street Art Collective',
    piano_artist_bio: 'Local artists collective dedicated to bringing music to public spaces.',
    artist_photo: null,
    artist_website_url: null,
    artist_facebook_url: null,
    artist_instagram_url: null,
    permanent_home_name: 'Central Park',
    public_location_name: 'Near Bethesda Fountain',
    perm_lat: '40.7829',
    perm_lng: '-73.9654',
    piano_program: 'Sing for Hope',
    contributors_info: 'NYC Parks Department',
    piano_site: null,
    notes: null,
    piano_search: null,
    search_vector: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1',
    verified_by: '1',
    moderation_status: 'approved',
    verified: true,
    piano_source: 'sing_for_hope',
    source: 'Sing for Hope',
    latitude: 40.7829,
    longitude: -73.9654,
    location_display_name: 'Central Park, New York, NY'
  },
  {
    id: 2,
    piano_title: 'Times Square Piano',
    piano_image: null,
    piano_statement: 'A vibrant piano in the bustling heart of NYC.',
    piano_url: null,
    piano_year: '2023',
    piano_artist: null,
    artist_name: 'Urban Musicians',
    piano_artist_bio: null,
    artist_photo: null,
    artist_website_url: null,
    artist_facebook_url: null,
    artist_instagram_url: null,
    permanent_home_name: 'Times Square',
    public_location_name: 'Red Steps',
    perm_lat: '40.7580',
    perm_lng: '-73.9855',
    piano_program: 'Sing for Hope',
    contributors_info: null,
    piano_site: null,
    notes: null,
    piano_search: null,
    search_vector: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1',
    verified_by: '1',
    moderation_status: 'approved',
    verified: true,
    piano_source: 'sing_for_hope',
    source: 'Sing for Hope',
    latitude: 40.7580,
    longitude: -73.9855,
    location_display_name: 'Times Square, New York, NY'
  },
  {
    id: 3,
    piano_title: 'Brooklyn Bridge Piano',
    piano_image: null,
    piano_statement: 'Community submitted piano with amazing bridge views.',
    piano_url: null,
    piano_year: null,
    piano_artist: null,
    artist_name: null,
    piano_artist_bio: null,
    artist_photo: null,
    artist_website_url: null,
    artist_facebook_url: null,
    artist_instagram_url: null,
    permanent_home_name: 'Brooklyn Bridge Park',
    public_location_name: 'Main Street Park',
    perm_lat: '40.7061',
    perm_lng: '-73.9969',
    piano_program: null,
    contributors_info: null,
    piano_site: null,
    notes: 'Great for sunset sessions',
    piano_search: null,
    search_vector: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '2',
    verified_by: null,
    moderation_status: 'pending',
    verified: false,
    piano_source: 'user_submitted',
    source: 'WorldPianos',
    latitude: 40.7061,
    longitude: -73.9969,
    location_display_name: 'Brooklyn Bridge Park, New York, NY'
  }
]

// Mock events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Community Piano Jam',
    description: 'Join us for an evening of collaborative piano music in Central Park.',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    location_name: 'Central Park, New York, NY',
    latitude: 40.7829,
    longitude: -73.9654,
    category: 'Meetup',
    organizer: 'Piano Community NYC',
    moderation_status: 'approved',
    status: 'upcoming',
    verified: true,
    attendee_count: 15,
    created_by: '1',
    verified_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Mock blog posts
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Magic of Public Pianos',
    content: 'Public pianos have transformed urban spaces around the world...',
    excerpt: 'Exploring how public pianos bring communities together.',
    featured_image: null,
    category: 'Community',
    tags: ['public-pianos', 'community', 'music'],
    published: true,
    allow_comments: true,
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Mock Data Service
export const MockDataService = {
  async getCurrentUser(): Promise<User> {
    // Return the admin user for demo purposes
    return mockUsers[0]
  },
  
  async getUser(id: string): Promise<User | null> {
    return mockUsers.find(user => user.id === id) || null
  },
  
  async getPianos(): Promise<Piano[]> {
    return mockPianos
  },
  
  async getEvents(): Promise<Event[]> {
    return mockEvents
  },
  
  async getBlogPosts(): Promise<BlogPost[]> {
    return mockBlogPosts
  }
}