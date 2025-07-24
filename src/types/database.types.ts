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
          verified: boolean
          created_by: string
          verified_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location_name: string
          latitude: number
          longitude: number
          category: string
          condition: string
          accessibility?: string | null
          hours?: string | null
          verified?: boolean
          created_by: string
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location_name?: string
          latitude?: number
          longitude?: number
          category?: string
          condition?: string
          accessibility?: string | null
          hours?: string | null
          verified?: boolean
          created_by?: string
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          location_name: string
          latitude: number | null
          longitude: number | null
          category: string
          organizer: string | null
          verified: boolean
          created_by: string
          verified_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          location_name: string
          latitude?: number | null
          longitude?: number | null
          category: string
          organizer?: string | null
          verified?: boolean
          created_by: string
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          location_name?: string
          latitude?: number | null
          longitude?: number | null
          category?: string
          organizer?: string | null
          verified?: boolean
          created_by?: string
          verified_by?: string | null
          created_at?: string
          updated_at?: string
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