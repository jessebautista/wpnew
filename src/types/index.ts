export type UserRole = 'user' | 'moderator' | 'admin'

export interface User {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  role: UserRole
  created_at: string
  updated_at: string
  // Supabase auth fields
  app_metadata?: any
  aud?: string
  email_confirmed_at?: string | null
  user_metadata?: any
  // Optional website field
  website?: string | null
}

export interface Piano {
  // Core piano identification  
  id: number | string
  piano_title: string
  piano_image: string | null
  piano_statement: string | null
  piano_url: string | null
  piano_year: string | null
  
  // Artist information
  piano_artist: string | null // UUID reference to users table
  artist_name: string | null
  piano_artist_bio: string | null
  artist_photo: string | null
  artist_website_url: string | null
  artist_facebook_url: string | null
  artist_instagram_url: string | null
  
  // Location information
  permanent_home_name: string | null
  public_location_name: string | null
  perm_lat: string | null // Keep as string to match DB
  perm_lng: string | null // Keep as string to match DB
  
  // Program and collaboration info
  piano_program: string | null
  contributors_info: string | null
  piano_site: number | null
  notes: string | null
  
  // Search functionality
  piano_search: string | null
  search_vector: any // tsvector type
  
  // Standard timestamps
  created_at: string
  updated_at: string
  
  // System fields
  created_by: string
  verified_by: string | null
  moderation_status: 'pending' | 'approved' | 'rejected'
  verified: boolean
  piano_source: 'sing_for_hope' | 'user_submitted'
  source: 'WorldPianos' | 'Sing for Hope' // New source field for display
  
  // Computed fields (from view or frontend)
  latitude?: number // Computed from perm_lat
  longitude?: number // Computed from perm_lng
  location_display_name?: string // Computed display name
  artist?: User // Populated from join
}

export interface PianoImage {
  id: string
  piano_id: string
  image_url: string
  alt_text: string | null
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  end_date?: string | null
  location_name: string
  address?: string | null
  latitude: number | null
  longitude: number | null
  piano_id?: string | null
  category: string
  max_attendees?: number | null
  is_virtual?: boolean
  meeting_url?: string | null
  organizer_id?: string | null
  organizer: string | null
  contact_email?: string | null
  contact_phone?: string | null
  moderation_status: 'pending' | 'approved' | 'rejected'
  status: 'upcoming' | 'completed' | 'cancelled'
  verified: boolean
  attendee_count: number
  created_by: string
  verified_by: string | null
  created_at: string
  updated_at: string
  // New piano-specific fields
  piano_count?: number | null
  piano_type?: string | null
  piano_condition?: string | null
  piano_special_features?: string[] | null
  piano_accessibility?: string | null
  piano_images?: string[] | null
  author?: User
  userAttendance?: EventAttendee
}

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  status: 'interested' | 'attending' | 'not_attending' | 'cancelled'
  registered_at: string
  checked_in: boolean
  checked_in_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  user?: User
  event?: Event
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  category: string | null
  tags: string[] | null
  author_id: string | null
  published: boolean
  featured: boolean
  allow_comments: boolean
  view_count: number
  reading_time: number | null
  meta_title: string | null
  meta_description: string | null
  moderation_status: 'pending' | 'approved' | 'rejected'
  published_at: string | null
  created_at: string
  updated_at: string
  legacy_id: string | null
  author?: User
}

export interface Comment {
  id: string
  content: string
  content_type: 'piano' | 'event' | 'blog_post'
  content_id: string
  author_id: string
  author_name?: string
  created_at: string
  updated_at: string
  author?: User
}

export interface PianoVisit {
  id: string
  piano_id: string
  user_id: string
  visited_at: string
  rating?: number
  notes?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'milestone' | 'exploration' | 'contribution' | 'social'
  earned: boolean
  earned_at: string | null
  progress: number
  target: number
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface SearchFilters {
  query?: string
  category?: string
  condition?: string
  verified?: boolean
  location?: {
    latitude: number
    longitude: number
    radius: number
  }
}

// Piano status options for the new schema
export const PIANO_MODERATION_STATUS = [
  'pending',
  'approved', 
  'rejected'
] as const

export const PIANO_YEARS = [
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018'
] as const

export const EVENT_CATEGORIES = [
  'Concert',
  'Meetup',
  'Workshop',
  'Installation',
  'Festival',
  'Community Event',
  'Other'
] as const

export const PIANO_TYPES = [
  'Public/Street',
  'Indoor Public',
  'Year-Round',
  'Seasonal',
  'Upright',
  'Grand',
  'Digital',
  'Other'
] as const

export const PIANO_SPECIAL_FEATURES = [
  'Painted/Decorated',
  'Themed Design',
  'Weather Protected',
  'Lighting',
  'Sound System',
  'Recording Equipment',
  'Bench Included',
  'Music Stand',
  'Other'
] as const

export const PIANO_CONDITIONS = [
  'Excellent',
  'Good',
  'Fair',
  'Needs Tuning',
  'Out of Order',
  'Unknown'
] as const

export const PIANO_CATEGORIES = [
  'Public/Street',
  'Indoor Public',
  'Park',
  'Station/Transit',
  'Library',
  'Hotel',
  'Mall/Shopping',
  'School/University',
  'Other'
] as const