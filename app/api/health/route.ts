import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/app/lib/supabase';

export async function GET() {
  const supabase = createServerComponentClient();
  
  if (!supabase) {
    return NextResponse.json({ 
      supabase: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('weekly_votes').select('id').limit(1);
  
  if (error) {
    console.error('Health check failed:', error);
  }
  
  return NextResponse.json({ 
    supabase: error ? 'disconnected' : 'connected',
    timestamp: new Date().toISOString()
  });
}
