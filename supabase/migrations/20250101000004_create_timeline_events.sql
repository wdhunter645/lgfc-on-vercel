-- Migration: Create timeline_events table
-- Description: Table for storing historical events from Lou Gehrig's life

CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_timeline_date ON timeline_events(date);
CREATE INDEX IF NOT EXISTS idx_timeline_category ON timeline_events(category);

-- Enable Row Level Security
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access
DROP POLICY IF EXISTS "Public read access" ON timeline_events;
CREATE POLICY "Public read access" ON timeline_events FOR SELECT USING (true);
