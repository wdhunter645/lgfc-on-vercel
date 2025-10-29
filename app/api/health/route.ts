import { createServerComponentClient } from '@/app/lib/supabase';

export async function GET() {
  const supabase = createServerComponentClient();
  
  if (!supabase) {
    return Response.json({ 
      supabase: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('weekly_votes').select('count').limit(1);
  return Response.json({ 
    supabase: error ? 'disconnected' : 'connected',
    timestamp: new Date().toISOString()
  });
}
