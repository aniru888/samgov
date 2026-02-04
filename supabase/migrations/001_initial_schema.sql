-- SamGov Initial Schema
-- Creates the schemes table for Karnataka welfare schemes

CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_kn TEXT,
  department TEXT,
  eligibility_summary TEXT,
  benefits_summary TEXT,
  application_url TEXT,
  official_source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for slug lookups (used in URL routing)
CREATE INDEX idx_schemes_slug ON schemes(slug);

-- Enable Row Level Security
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to schemes
CREATE POLICY "Schemes are publicly readable"
  ON schemes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users with admin role can modify schemes
-- (We'll set up proper roles later in Phase 4)
CREATE POLICY "Authenticated users can insert schemes"
  ON schemes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update schemes"
  ON schemes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
CREATE TRIGGER update_schemes_updated_at
  BEFORE UPDATE ON schemes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
