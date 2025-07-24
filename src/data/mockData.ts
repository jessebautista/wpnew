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
    id: '1',
    name: 'Central Park Piano',
    description: 'Beautiful piano in the heart of Central Park, perfect for afternoon sessions.',
    location_name: 'Central Park, New York, NY',
    latitude: 40.7829,
    longitude: -73.9654,
    category: 'Park',
    condition: 'Good',
    accessibility: 'Wheelchair accessible',
    hours: '6:00 AM - 10:00 PM',
    verified: true,
    created_by: '2',
    verified_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[1],
    images: [
      {
        id: '1-1',
        piano_id: '1',
        image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=300&fit=crop',
        alt_text: 'Central Park Piano in beautiful setting',
        created_at: new Date().toISOString()
      },
      {
        id: '1-2', 
        piano_id: '1',
        image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&h=300&fit=crop',
        alt_text: 'Close-up of piano keys',
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: '2',
    name: 'JFK Airport Terminal 4',
    description: 'Piano available for travelers at JFK Airport Terminal 4.',
    location_name: 'JFK Airport Terminal 4, Queens, NY',
    latitude: 40.6413,
    longitude: -73.7781,
    category: 'Airport',
    condition: 'Excellent',
    accessibility: 'Wheelchair accessible',
    hours: '24/7',
    verified: true,
    created_by: '2',
    verified_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[1]
  },
  {
    id: '3',
    name: 'Times Square Piano',
    description: 'Street piano in the bustling Times Square area.',
    location_name: 'Times Square, New York, NY',
    latitude: 40.7580,
    longitude: -73.9855,
    category: 'Street',
    condition: 'Fair',
    accessibility: 'Street level',
    hours: 'Daylight hours',
    verified: false,
    created_by: '2',
    verified_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[1]
  },
  {
    id: '4',
    name: 'Hyde Park Corner Piano',
    description: 'Charming piano near Hyde Park Corner in London.',
    location_name: 'Hyde Park Corner, London, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    category: 'Park',
    condition: 'Good',
    accessibility: 'Wheelchair accessible',
    hours: '8:00 AM - 8:00 PM',
    verified: true,
    created_by: '2',
    verified_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[1]
  },
  {
    id: '5',
    name: 'St. Pancras Station Piano',
    description: 'Historic piano at the beautiful St. Pancras International station.',
    location_name: 'St. Pancras International, London, UK',
    latitude: 51.5308,
    longitude: -0.1261,
    category: 'Train Station',
    condition: 'Excellent',
    accessibility: 'Wheelchair accessible',
    hours: '5:00 AM - 1:00 AM',
    verified: true,
    created_by: '2',
    verified_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[1]
  }
]

// Mock events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Central Park Piano Meetup',
    description: 'Join us for a friendly piano meetup in Central Park. All skill levels welcome!',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    location_name: 'Central Park, New York, NY',
    latitude: 40.7829,
    longitude: -73.9654,
    category: 'Meetup',
    organizer: 'NYC Piano Group',
    verified: true,
    created_by: '2',
    verified_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[1]
  },
  {
    id: '2',
    title: 'Airport Piano Concert',
    description: 'Special concert performance at JFK Airport Terminal 4.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Two weeks from now
    location_name: 'JFK Airport Terminal 4, Queens, NY',
    latitude: 40.6413,
    longitude: -73.7781,
    category: 'Concert',
    organizer: 'JFK Cultural Events',
    verified: false,
    created_by: '2',
    verified_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[1]
  }
]

// Mock blog posts
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Magic of Public Pianos: Connecting Communities Through Music',
    content: 'Public pianos have become a beautiful phenomenon in cities worldwide, creating unexpected moments of joy and connection...',
    excerpt: 'Discover how public pianos are transforming urban spaces and bringing people together through the universal language of music.',
    featured_image: null,
    category: 'Community Stories',
    tags: ['community', 'public art', 'music'],
    published: true,
    allow_comments: true,
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[0]
  },
  {
    id: '2',
    title: 'Piano Care: How to Maintain Public Pianos',
    content: 'Maintaining public pianos requires special attention to weather conditions, security, and regular tuning...',
    excerpt: 'Learn about the challenges and best practices for keeping public pianos in great condition for everyone to enjoy.',
    featured_image: null,
    category: 'Maintenance',
    tags: ['maintenance', 'piano care', 'community'],
    published: true,
    allow_comments: true,
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockUsers[0]
  }
]

// Mock data service to simulate API calls when external services are unavailable
export class MockDataService {
  static isUsingMockData(): boolean {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    return !supabaseUrl || supabaseUrl === 'https://your-project.supabase.co'
  }

  static async getPianos(): Promise<Piano[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockPianos
  }

  static async getEvents(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockEvents
  }

  static async getBlogPosts(): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockBlogPosts
  }

  static async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUsers
  }

  static async getCurrentUser(): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Return admin user for demo purposes
    return mockUsers[0]
  }
}

// Mock geocoding service for when Google API is not available
export class MockGeocodingService {
  static isUsingMockData(): boolean {
    const apiKey = import.meta.env.VITE_GEOCODING_API_KEY
    return !apiKey
  }

  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Return mock coordinates based on common location names
    const mockLocations: Record<string, { lat: number; lng: number }> = {
      'new york': { lat: 40.7128, lng: -74.0060 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'sydney': { lat: -33.8688, lng: 151.2093 }
    }

    const key = address.toLowerCase()
    for (const location in mockLocations) {
      if (key.includes(location)) {
        return mockLocations[location]
      }
    }

    // Default to New York if no match found
    return mockLocations['new york']
  }
}