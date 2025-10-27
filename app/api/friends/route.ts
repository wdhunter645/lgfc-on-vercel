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
        name: 'Baseball Hall of Fame',
        description: 'Preserving baseball history and honoring legends like Lou Gehrig',
        website_url: 'https://baseballhall.org',
        logo_url: null
      },
      {
        id: '2',
        name: 'ALS Association',
        description: 'Fighting ALS and supporting families affected by Lou Gehrig\'s Disease',
        website_url: 'https://www.als.org',
        logo_url: null
      },
      {
        id: '3',
        name: 'New York Yankees',
        description: 'Lou\'s legendary team where he played his entire career',
        website_url: 'https://www.mlb.com/yankees',
        logo_url: null
      }
    ]);
  }

  try {
    const { data, error } = await supabase
      .from('friends_of_club')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Friends API error:', error);
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 });
  }
}
