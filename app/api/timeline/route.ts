import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET() {
  if (!supabase) {
    // Return mock data if Supabase is not configured
    return NextResponse.json([
      {
        id: '1',
        date: '1923-06-15',
        title: 'MLB Debut',
        description: 'Gehrig debuts with the Yankees on June 15, 1923.',
        category: 'career'
      },
      {
        id: '2',
        date: '1925-06-01',
        title: 'The Streak Begins',
        description: 'Starts his consecutive games streak June 1, 1925.',
        category: 'career'
      },
      {
        id: '3',
        date: '1927-01-01',
        title: 'Murderers\' Row',
        description: 'Key part of the legendary 1927 Yankees lineup.',
        category: 'career'
      }
    ]);
  }

  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Timeline API error:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}
