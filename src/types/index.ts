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
  id: string
  name: string
  description: string | null
  location_name: string
  latitude: number
  longitude: number
  category: string
  condition: string
  accessibility: string | null
  hours: string | null
  hours_available?: string | null
  verified: boolean
  created_by: string
  verified_by: string | null
  submitted_by?: string | null
  moderation_status?: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  images?: PianoImage[]
  author?: User
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
  content: string
  excerpt: string | null
  featured_image: string | null
  category: string | null
  tags: string[] | null
  published: boolean
  allow_comments: boolean
  author_id: string
  moderation_status?: 'pending' | 'approved' | 'rejected'
  slug?: string
  created_at: string
  updated_at: string
  author?: User
}

export interface Comment {
  id: string
  content: string
  content_type: 'piano' | 'event' | 'blog_post'
  content_id: string
  author_id: string
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

export const PIANO_CATEGORIES = [
  'Airport',
  'Street',
  'Park',
  'Train Station',
  'Shopping Center',
  'University',
  'Hospital',
  'Hotel',
  'Restaurant',
  'Other'
] as const

export const PIANO_CONDITIONS = [
  'Excellent',
  'Good',
  'Fair',
  'Needs Tuning',
  'Damaged',
  'Unknown'
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