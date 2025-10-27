import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');

  if (!supabase) {
    // Return mock data if Supabase is not configured
    const mockData = [
      {
        id: '1',
        question: 'When was the Farewell Speech?',
        answer: 'July 4, 1939 — Yankee Stadium.',
        category: 'history'
      },
      {
        id: '2',
        question: 'What position did Lou play?',
        answer: 'First base.',
        category: 'career'
      }
    ];

    if (search) {
      const filtered = mockData.filter(
        item =>
          item.question.toLowerCase().includes(search.toLowerCase()) ||
          item.answer.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json(filtered);
    }

    return NextResponse.json(mockData);
  }

  try {
    let query = supabase
      .from('faq_items')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (search) {
      query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('FAQ API error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 });
  }
}
