-- Supabase Database Schema Migrations
-- Lou Gehrig Fan Club (lgfc-on-vercel)
--
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor (left sidebar)
-- 3. Create a new query
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute all migrations
--
-- This file is idempotent - safe to run multiple times

-- =================================================================
-- Migration 001: create weekly votes
-- =================================================================

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

CREATE INDEX IF NOT EXISTS idx_weekly_votes_week_id ON weekly_votes(week_id);
CREATE INDEX IF NOT EXISTS idx_weekly_votes_dates ON weekly_votes(start_date, end_date);

ALTER TABLE weekly_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON weekly_votes;
CREATE POLICY "Public read access" ON weekly_votes FOR SELECT USING (true);

-- =================================================================
-- Migration 002: create vote records
-- =================================================================

CREATE TABLE IF NOT EXISTS vote_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id VARCHAR(50) NOT NULL,
  voter_ip VARCHAR(45),
  voter_fingerprint TEXT,
  selected_option CHAR(1) CHECK (selected_option IN ('A', 'B')),
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vote_records_tracking ON vote_records(week_id, voter_ip);
CREATE INDEX IF NOT EXISTS idx_vote_records_voted_at ON vote_records(voted_at);

ALTER TABLE vote_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow vote insertion" ON vote_records;
CREATE POLICY "Allow vote insertion" ON vote_records FOR INSERT WITH CHECK (true);

-- =================================================================
-- Migration 003: create friends of club
-- =================================================================

CREATE TABLE IF NOT EXISTS friends_of_club (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_friends_display_order ON friends_of_club(display_order);
CREATE INDEX IF NOT EXISTS idx_friends_active ON friends_of_club(is_active);

ALTER TABLE friends_of_club ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON friends_of_club;
CREATE POLICY "Public read access" ON friends_of_club 
  FOR SELECT USING (is_active = true);

-- =================================================================
-- Migration 004: create timeline events
-- =================================================================

CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timeline_date ON timeline_events(date);
CREATE INDEX IF NOT EXISTS idx_timeline_category ON timeline_events(category);

ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON timeline_events;
CREATE POLICY "Public read access" ON timeline_events FOR SELECT USING (true);

-- =================================================================
-- Migration 005: create faq items
-- =================================================================

CREATE TABLE IF NOT EXISTS faq_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50),
  display_order INTEGER,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_category ON faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_published ON faq_items(is_published);
CREATE INDEX IF NOT EXISTS idx_faq_display_order ON faq_items(display_order);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON faq_items;
CREATE POLICY "Public read access" ON faq_items 
  FOR SELECT USING (is_published = true);

-- =================================================================
-- Migration 006: create calendar events
-- =================================================================

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

CREATE INDEX IF NOT EXISTS idx_calendar_event_date ON calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_published ON calendar_events(is_published);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON calendar_events;
CREATE POLICY "Public read access" ON calendar_events 
  FOR SELECT USING (is_published = true);

-- =================================================================
-- Migration 007: create functions
-- =================================================================

-- Function to increment vote counts
CREATE OR REPLACE FUNCTION increment_vote(week VARCHAR, vote_column VARCHAR)
RETURNS void AS $$
BEGIN
  IF vote_column = 'votes_a' THEN
    UPDATE weekly_votes SET votes_a = votes_a + 1 WHERE week_id = week;
  ELSE
    UPDATE weekly_votes SET votes_b = votes_b + 1 WHERE week_id = week;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current week's voting
CREATE OR REPLACE FUNCTION get_current_voting()
RETURNS TABLE (
  id UUID,
  week_id VARCHAR,
  image_a_url TEXT,
  image_b_url TEXT,
  votes_a INTEGER,
  votes_b INTEGER,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wv.id, wv.week_id, wv.image_a_url, wv.image_b_url, 
    wv.votes_a, wv.votes_b, wv.start_date, wv.end_date
  FROM weekly_votes wv
  WHERE wv.start_date <= NOW() AND wv.end_date >= NOW()
  ORDER BY wv.start_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================
-- Migration 008: create updated at trigger
-- =================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for faq_items
DROP TRIGGER IF EXISTS update_faq_items_updated_at ON faq_items;
CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON faq_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- All migrations completed!
-- =================================================================
