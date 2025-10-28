/**
 * Supabase Client Utility
 * Provides configured Supabase clients for both client-side and server-side use
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables
// Support both naming conventions for backwards compatibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_API_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Client-side Supabase client (uses anon key)
 * Safe to use in browser/client components
 */
export function createClientComponentClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Server-side Supabase client (uses service role key)
 * Only use in API routes and server components - never expose to client
 */
export function createServerComponentClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase service role not configured. Set SUPABASE_SERVICE_ROLE_KEY');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

/**
 * Check if Supabase service role is configured
 */
export function isServiceRoleConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}

// Database type definitions
export interface WeeklyVote {
  id: string;
  week_id: string;
  image_a_url: string;
  image_b_url: string;
  votes_a: number;
  votes_b: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface VoteRecord {
  id: string;
  week_id: string;
  voter_ip: string | null;
  voter_fingerprint: string | null;
  selected_option: 'A' | 'B';
  voted_at: string;
}

export interface FriendOfClub {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number | null;
  is_active: boolean;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  event_type: string | null;
  registration_url: string | null;
  is_published: boolean;
  created_at: string;
}
