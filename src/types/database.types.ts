export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          role: 'user' | 'moderator' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          role?: 'user' | 'moderator' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          role?: 'user' | 'moderator' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      pianos: {
        Row: {
          id: number
          piano_title: string
          piano_image: string | null
          piano_statement: string | null
          piano_url: string | null
          piano_year: string | null
          piano_artist: string | null
          artist_name: string | null
          piano_artist_bio: string | null
          artist_photo: string | null
          artist_website_url: string | null
          artist_facebook_url: string | null
          artist_instagram_url: string | null
          permanent_home_name: string | null
          public_location_name: string | null
          perm_lat: string | null
          perm_lng: string | null
          piano_program: string | null
          contributors_info: string | null
          piano_site: number | null
          notes: string | null
          piano_search: string | null
          search_vector: any
          created_at: string
          updated_at: string
          created_by: string
          verified_by: string | null
          moderation_status: string
          verified: boolean
          piano_source: string
        }
        Insert: {
          id?: number
          piano_title: string
          piano_image?: string | null
          piano_statement?: string | null
          piano_url?: string | null
          piano_year?: string | null
          piano_artist?: string | null
          artist_name?: string | null
          piano_artist_bio?: string | null
          artist_photo?: string | null
          artist_website_url?: string | null
          artist_facebook_url?: string | null
          artist_instagram_url?: string | null
          permanent_home_name?: string | null
          public_location_name?: string | null
          perm_lat?: string | null
          perm_lng?: string | null
          piano_program?: string | null
          contributors_info?: string | null
          piano_site?: number | null
          notes?: string | null
          piano_search?: string | null
          search_vector?: any
          created_at?: string
          updated_at?: string
          created_by?: string
          verified_by?: string | null
          moderation_status?: string
          verified?: boolean
          piano_source?: string
        }
        Update: {
          id?: number
          piano_title?: string
          piano_image?: string | null
          piano_statement?: string | null
          piano_url?: string | null
          piano_year?: string | null
          piano_artist?: string | null
          artist_name?: string | null
          piano_artist_bio?: string | null
          artist_photo?: string | null
          artist_website_url?: string | null
          artist_facebook_url?: string | null
          artist_instagram_url?: string | null
          permanent_home_name?: string | null
          public_location_name?: string | null
          perm_lat?: string | null
          perm_lng?: string | null
          piano_program?: string | null
          contributors_info?: string | null
          piano_site?: number | null
          notes?: string | null
          piano_search?: string | null
          search_vector?: any
          created_at?: string
          updated_at?: string
          created_by?: string
          verified_by?: string | null
          moderation_status?: string
          verified?: boolean
          piano_source?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          end_date: string | null
          location_name: string
          address: string | null
          latitude: number | null
          longitude: number | null
          piano_id: string | null
          category: string
          max_attendees: number | null
          current_attendees: number | null
          is_virtual: boolean | null
          meeting_url: string | null
          ticket_price: number | null
          status: string | null
          organizer_id: string | null
          contact_email: string | null
          contact_phone: string | null
          moderation_status: string | null
          moderated_by: string | null
          moderated_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          legacy_id: string | null
          attendee_count: number | null
          created_by: string
          verified_by: string | null
          organizer: string | null
          verified: boolean | null
          piano_count: number | null
          piano_type: string | null
          piano_condition: string | null
          piano_special_features: string[] | null
          piano_accessibility: string | null
          piano_images: string[] | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          end_date?: string | null
          location_name: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          piano_id?: string | null
          category: string
          max_attendees?: number | null
          current_attendees?: number | null
          is_virtual?: boolean | null
          meeting_url?: string | null
          ticket_price?: number | null
          status?: string | null
          organizer_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          moderation_status?: string | null
          moderated_by?: string | null
          moderated_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          legacy_id?: string | null
          attendee_count?: number | null
          created_by: string
          verified_by?: string | null
          organizer?: string | null
          verified?: boolean | null
          piano_count?: number | null
          piano_type?: string | null
          piano_condition?: string | null
          piano_special_features?: string[] | null
          piano_accessibility?: string | null
          piano_images?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          end_date?: string | null
          location_name?: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          piano_id?: string | null
          category?: string
          max_attendees?: number | null
          current_attendees?: number | null
          is_virtual?: boolean | null
          meeting_url?: string | null
          ticket_price?: number | null
          status?: string | null
          organizer_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          moderation_status?: string | null
          moderated_by?: string | null
          moderated_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          legacy_id?: string | null
          attendee_count?: number | null
          created_by?: string
          verified_by?: string | null
          organizer?: string | null
          verified?: boolean | null
          piano_count?: number | null
          piano_type?: string | null
          piano_condition?: string | null
          piano_special_features?: string[] | null
          piano_accessibility?: string | null
          piano_images?: string[] | null
        }
      }
      blog_posts: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          category?: string | null
          tags?: string[] | null
          published?: boolean
          allow_comments?: boolean
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          category?: string | null
          tags?: string[] | null
          published?: boolean
          allow_comments?: boolean
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          content_type: 'piano' | 'event' | 'blog_post'
          content_id: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          content_type: 'piano' | 'event' | 'blog_post'
          content_id: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          content_type?: 'piano' | 'event' | 'blog_post'
          content_id?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      piano_images: {
        Row: {
          id: string
          piano_id: string
          image_url: string
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          piano_id: string
          image_url: string
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          piano_id?: string
          image_url?: string
          alt_text?: string | null
          created_at?: string
        }
      }
      newsletter_subscriptions: {
        Row: {
          id: string
          email: string
          confirmed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          confirmed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          confirmed?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}