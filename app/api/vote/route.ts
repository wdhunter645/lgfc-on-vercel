import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (will use environment variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only initialize if credentials are available
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request: NextRequest) {
  // Check if Supabase is configured
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Set up Supabase environment variables.' },
      { status: 503 }
    );
  }

  try {
    const { weekId, option } = await request.json();
    
    // Get IP for duplicate prevention
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check if already voted
    const { data: existing } = await supabase
      .from('vote_records')
      .select('id')
      .eq('week_id', weekId)
      .eq('voter_ip', ip)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: 'Already voted this week' },
        { status: 400 }
      );
    }
    
    // Record vote
    await supabase.from('vote_records').insert({
      week_id: weekId,
      voter_ip: ip,
      selected_option: option
    });
    
    // Update vote count
    const column = option === 'A' ? 'votes_a' : 'votes_b';
    const { data: voteData } = await supabase
      .from('weekly_votes')
      .select('*')
      .eq('week_id', weekId)
      .single();
    
    if (voteData) {
      await supabase
        .from('weekly_votes')
        .update({ [column]: (voteData[column] || 0) + 1 })
        .eq('week_id', weekId);
    }
    
    // Return updated counts
    const { data: votes } = await supabase
      .from('weekly_votes')
      .select('votes_a, votes_b')
      .eq('week_id', weekId)
      .single();
    
    return NextResponse.json({ success: true, votes });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Vote failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Check if Supabase is configured
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Set up Supabase environment variables.' },
      { status: 503 }
    );
  }

  try {
    // Get current week's voting data
    const { data, error } = await supabase
      .from('weekly_votes')
      .select('*')
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get vote error:', error);
    return NextResponse.json(
      { error: 'Failed to get voting data' },
      { status: 500 }
    );
  }
}
