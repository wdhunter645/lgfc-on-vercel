/**
 * Supabase Client Utility
 * Provides configured Supabase clients for both client-side and server-side use
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

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
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
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
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
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

// Re-export types from database.types.ts for backwards compatibility
export type {
  WeeklyVote,
  VoteRecord,
  FriendOfClub,
  TimelineEvent,
  FaqItem,
  CalendarEvent,
  WeeklyVoteInsert,
  VoteRecordInsert,
  FriendOfClubInsert,
  TimelineEventInsert,
  FaqItemInsert,
  CalendarEventInsert,
  WeeklyVoteUpdate,
  VoteRecordUpdate,
  FriendOfClubUpdate,
  TimelineEventUpdate,
  FaqItemUpdate,
  CalendarEventUpdate,
  Database
} from './database.types';
