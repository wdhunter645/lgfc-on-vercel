/**
 * Database Type Definitions
 * Generated from Supabase schema
 * 
 * This file contains TypeScript interfaces for all database tables
 * and helper types for working with Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      weekly_votes: {
        Row: {
          id: string
          week_id: string
          image_a_url: string
          image_b_url: string
          votes_a: number
          votes_b: number
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          week_id: string
          image_a_url: string
          image_b_url: string
          votes_a?: number
          votes_b?: number
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          week_id?: string
          image_a_url?: string
          image_b_url?: string
          votes_a?: number
          votes_b?: number
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      vote_records: {
        Row: {
          id: string
          week_id: string
          voter_ip: string | null
          voter_fingerprint: string | null
          selected_option: 'A' | 'B'
          voted_at: string
        }
        Insert: {
          id?: string
          week_id: string
          voter_ip?: string | null
          voter_fingerprint?: string | null
          selected_option: 'A' | 'B'
          voted_at?: string
        }
        Update: {
          id?: string
          week_id?: string
          voter_ip?: string | null
          voter_fingerprint?: string | null
          selected_option?: 'A' | 'B'
          voted_at?: string
        }
      }
      friends_of_club: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          display_order: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          display_order?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          display_order?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      timeline_events: {
        Row: {
          id: string
          date: string
          title: string
          description: string | null
          category: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          title: string
          description?: string | null
          category?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          title?: string
          description?: string | null
          category?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      faq_items: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          display_order: number | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          display_order?: number | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          display_order?: number | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          end_date: string | null
          location: string | null
          event_type: string | null
          registration_url: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          end_date?: string | null
          location?: string | null
          event_type?: string | null
          registration_url?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          end_date?: string | null
          location?: string | null
          event_type?: string | null
          registration_url?: string | null
          is_published?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_vote: {
        Args: {
          week: string
          vote_column: string
        }
        Returns: void
      }
      get_current_voting: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          week_id: string
          image_a_url: string
          image_b_url: string
          votes_a: number
          votes_b: number
          start_date: string
          end_date: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Export individual table types for convenience
export type WeeklyVote = Tables<'weekly_votes'>
export type VoteRecord = Tables<'vote_records'>
export type FriendOfClub = Tables<'friends_of_club'>
export type TimelineEvent = Tables<'timeline_events'>
export type FaqItem = Tables<'faq_items'>
export type CalendarEvent = Tables<'calendar_events'>

// Insert types
export type WeeklyVoteInsert = Inserts<'weekly_votes'>
export type VoteRecordInsert = Inserts<'vote_records'>
export type FriendOfClubInsert = Inserts<'friends_of_club'>
export type TimelineEventInsert = Inserts<'timeline_events'>
export type FaqItemInsert = Inserts<'faq_items'>
export type CalendarEventInsert = Inserts<'calendar_events'>

// Update types
export type WeeklyVoteUpdate = Updates<'weekly_votes'>
export type VoteRecordUpdate = Updates<'vote_records'>
export type FriendOfClubUpdate = Updates<'friends_of_club'>
export type TimelineEventUpdate = Updates<'timeline_events'>
export type FaqItemUpdate = Updates<'faq_items'>
export type CalendarEventUpdate = Updates<'calendar_events'>
