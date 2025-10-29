-- Migration: Create friends_of_club table
-- Description: Table for storing partner organizations and affiliates

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_friends_display_order ON friends_of_club(display_order);
CREATE INDEX IF NOT EXISTS idx_friends_active ON friends_of_club(is_active);

-- Enable Row Level Security
ALTER TABLE friends_of_club ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access (only active records)
DROP POLICY IF EXISTS "Public read access" ON friends_of_club;
CREATE POLICY "Public read access" ON friends_of_club 
  FOR SELECT USING (is_active = true);
