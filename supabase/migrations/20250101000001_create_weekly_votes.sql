-- Migration: Create weekly_votes table
-- Description: Table for storing weekly photo matchups and vote counts

CREATE TABLE IF NOT EXISTS weekly_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id VARCHAR(50) NOT NULL UNIQUE,
  image_a_url TEXT NOT NULL,
  image_b_url TEXT NOT NULL,
  votes_a INTEGER DEFAULT 0,
  votes_b INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_weekly_votes_week_id ON weekly_votes(week_id);
CREATE INDEX IF NOT EXISTS idx_weekly_votes_dates ON weekly_votes(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE weekly_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access
DROP POLICY IF EXISTS "Public read access" ON weekly_votes;
CREATE POLICY "Public read access" ON weekly_votes FOR SELECT USING (true);
