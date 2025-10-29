-- Migration: Create vote_records table
-- Description: Table for tracking individual votes to prevent duplicates

CREATE TABLE IF NOT EXISTS vote_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id VARCHAR(50) NOT NULL,
  voter_ip VARCHAR(45),
  voter_fingerprint TEXT,
  selected_option CHAR(1) CHECK (selected_option IN ('A', 'B')),
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vote_records_tracking ON vote_records(week_id, voter_ip);
CREATE INDEX IF NOT EXISTS idx_vote_records_voted_at ON vote_records(voted_at);

-- Enable Row Level Security
ALTER TABLE vote_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow vote insertion
DROP POLICY IF EXISTS "Allow vote insertion" ON vote_records;
CREATE POLICY "Allow vote insertion" ON vote_records FOR INSERT WITH CHECK (true);
