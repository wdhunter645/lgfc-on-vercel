-- Migration: Create database functions
-- Description: Utility functions for voting and queries

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
