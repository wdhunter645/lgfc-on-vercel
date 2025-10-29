-- Migration: Create faq_items table
-- Description: Table for storing frequently asked questions about Lou Gehrig

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_published ON faq_items(is_published);
CREATE INDEX IF NOT EXISTS idx_faq_display_order ON faq_items(display_order);

-- Enable Row Level Security
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access (only published items)
DROP POLICY IF EXISTS "Public read access" ON faq_items;
CREATE POLICY "Public read access" ON faq_items 
  FOR SELECT USING (is_published = true);
