-- Seed data for Lou Gehrig Fan Club database
-- Description: Sample data for development and testing

-- Insert sample FAQ items
INSERT INTO faq_items (question, answer, category, display_order, is_published) VALUES
  ('Who was Lou Gehrig?', 
   'Henry Louis Gehrig (June 19, 1903 – June 2, 1941) was an American professional baseball first baseman who played 17 seasons in Major League Baseball (MLB) for the New York Yankees. Gehrig was renowned for his prowess as a hitter and for his durability, which earned him his nickname "The Iron Horse".',
   'Biography',
   1,
   true),
  
  ('What is Lou Gehrig''s disease?', 
   'Amyotrophic lateral sclerosis (ALS), also known as Lou Gehrig''s disease, is a progressive neurodegenerative disease that affects nerve cells in the brain and spinal cord. Lou Gehrig was diagnosed with ALS in 1939, and the disease now bears his name.',
   'Health',
   2,
   true),
  
  ('What was Lou Gehrig''s famous consecutive games streak?',
   'Lou Gehrig played in 2,130 consecutive games from 1925 to 1939, a record that stood for 56 years until it was broken by Cal Ripken Jr. in 1995. This remarkable achievement earned him the nickname "The Iron Horse".',
   'Career',
   3,
   true),
  
  ('When did Lou Gehrig give his famous farewell speech?',
   'Lou Gehrig delivered his famous "Luckiest Man" speech on July 4, 1939, at Yankee Stadium during Lou Gehrig Appreciation Day. Despite his devastating diagnosis, he declared himself "the luckiest man on the face of the earth".',
   'Legacy',
   4,
   true),
  
  ('What were Lou Gehrig''s major achievements?',
   'Lou Gehrig was a 7-time All-Star, won the Triple Crown in 1934, was a 2-time AL MVP, and helped the Yankees win 6 World Series championships. He had a lifetime batting average of .340 and hit 493 home runs.',
   'Career',
   5,
   true)
ON CONFLICT DO NOTHING;

-- Insert sample timeline events
INSERT INTO timeline_events (date, title, description, category) VALUES
  ('1903-06-19', 'Birth of Lou Gehrig', 
   'Henry Louis Gehrig was born in New York City to German immigrant parents.',
   'Early Life'),
  
  ('1923-06-15', 'Major League Debut', 
   'Lou Gehrig made his MLB debut with the New York Yankees.',
   'Career'),
  
  ('1925-06-01', 'Consecutive Games Streak Begins', 
   'Gehrig replaced Wally Pipp at first base, beginning his legendary 2,130-game streak.',
   'Career'),
  
  ('1927-01-01', 'Part of Murderers'' Row', 
   'Gehrig was a key member of the legendary 1927 Yankees lineup known as "Murderers'' Row".',
   'Career'),
  
  ('1934-01-01', 'Triple Crown Winner', 
   'Gehrig won the Triple Crown, leading the American League in batting average, home runs, and RBIs.',
   'Achievement'),
  
  ('1939-05-02', 'Consecutive Games Streak Ends', 
   'After 2,130 consecutive games, Gehrig voluntarily took himself out of the lineup.',
   'Career'),
  
  ('1939-06-21', 'ALS Diagnosis', 
   'Lou Gehrig was diagnosed with amyotrophic lateral sclerosis at the Mayo Clinic.',
   'Health'),
  
  ('1939-07-04', '"Luckiest Man" Speech', 
   'Gehrig delivered his famous farewell speech at Yankee Stadium.',
   'Legacy'),
  
  ('1941-06-02', 'Passing of Lou Gehrig', 
   'Lou Gehrig passed away at his home in Riverdale, New York, at age 37.',
   'Legacy'),
  
  ('1939-12-07', 'Hall of Fame Induction', 
   'The Baseball Hall of Fame waived the usual waiting period and inducted Gehrig immediately.',
   'Achievement')
ON CONFLICT DO NOTHING;

-- Insert sample friends of the club
INSERT INTO friends_of_club (name, description, website_url, display_order, is_active) VALUES
  ('Baseball Hall of Fame', 
   'The National Baseball Hall of Fame and Museum in Cooperstown, New York, where Lou Gehrig was inducted in 1939.',
   'https://baseballhall.org',
   1,
   true),
  
  ('ALS Association', 
   'Leading organization fighting Lou Gehrig''s disease through research, care services, and advocacy.',
   'https://www.als.org',
   2,
   true),
  
  ('New York Yankees', 
   'The legendary team where Lou Gehrig spent his entire 17-year career.',
   'https://www.mlb.com/yankees',
   3,
   true),
  
  ('Columbia University', 
   'Lou Gehrig''s alma mater, where he played college baseball before joining the Yankees.',
   'https://www.columbia.edu',
   4,
   true)
ON CONFLICT DO NOTHING;

-- Insert a sample weekly voting entry
INSERT INTO weekly_votes (
  week_id, 
  image_a_url, 
  image_b_url, 
  votes_a, 
  votes_b,
  start_date,
  end_date
) VALUES (
  'week-' || TO_CHAR(CURRENT_DATE, 'YYYY-WW'),
  '/images/gehrig-batting.jpg',
  '/images/gehrig-fielding.jpg',
  0,
  0,
  DATE_TRUNC('week', CURRENT_DATE),
  DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days'
)
ON CONFLICT (week_id) DO NOTHING;

-- Insert sample calendar events
INSERT INTO calendar_events (title, description, event_date, end_date, location, event_type, is_published) VALUES
  ('Lou Gehrig Day Celebration', 
   'Annual celebration honoring Lou Gehrig''s legacy and raising awareness for ALS research.',
   CURRENT_DATE + INTERVAL '30 days',
   CURRENT_DATE + INTERVAL '30 days',
   'Yankee Stadium, New York',
   'Annual Event',
   true),
  
  ('ALS Awareness Walk', 
   'Community walk to raise funds and awareness for ALS research in honor of Lou Gehrig.',
   CURRENT_DATE + INTERVAL '60 days',
   CURRENT_DATE + INTERVAL '60 days',
   'Central Park, New York',
   'Fundraiser',
   true),
  
  ('Virtual Lou Gehrig Trivia Night', 
   'Test your knowledge about the Iron Horse in our monthly trivia competition.',
   CURRENT_DATE + INTERVAL '15 days',
   NULL,
   'Online',
   'Social Event',
   true)
ON CONFLICT DO NOTHING;
