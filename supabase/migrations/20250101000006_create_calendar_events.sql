-- Migration: Create calendar_events table
-- Description: Table for storing club events and activities

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(200),
  event_type VARCHAR(50),
  registration_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_calendar_event_date ON calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_published ON calendar_events(is_published);

-- Enable Row Level Security
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access (only published events)
DROP POLICY IF EXISTS "Public read access" ON calendar_events;
CREATE POLICY "Public read access" ON calendar_events 
  FOR SELECT USING (is_published = true);
