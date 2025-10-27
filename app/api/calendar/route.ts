import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET() {
  if (!supabase) {
    // Return empty array if Supabase is not configured
    return NextResponse.json([]);
  }

  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('is_published', true)
      .gte('event_date', now)
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
