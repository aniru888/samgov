-- Migration 009: Scheme recommendation columns + vector search function
-- Applied via Supabase MCP on 2026-02-06

-- Add recommendation-related columns to schemes table
ALTER TABLE schemes
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS target_group TEXT,
ADD COLUMN IF NOT EXISTS benefits_type TEXT,
ADD COLUMN IF NOT EXISTS scheme_level TEXT CHECK (scheme_level IN ('state', 'central', 'both')),
ADD COLUMN IF NOT EXISTS search_text TEXT,
ADD COLUMN IF NOT EXISTS scheme_embedding VECTOR(1024),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'manual';

-- Indexes for recommendation queries
CREATE INDEX IF NOT EXISTS idx_schemes_embedding_hnsw
ON schemes USING hnsw (scheme_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_schemes_tags_gin
ON schemes USING gin (tags);

CREATE INDEX IF NOT EXISTS idx_schemes_category
ON schemes (category);

CREATE INDEX IF NOT EXISTS idx_schemes_active
ON schemes (is_active);

-- Recommendation search function
CREATE OR REPLACE FUNCTION scheme_recommend(
  query_embedding VECTOR(1024),
  match_count INT DEFAULT 10,
  similarity_threshold FLOAT DEFAULT 0.55,
  filter_category TEXT DEFAULT NULL,
  filter_level TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_kn TEXT,
  department TEXT,
  category TEXT,
  target_group TEXT,
  benefits_summary TEXT,
  eligibility_summary TEXT,
  application_url TEXT,
  tags TEXT[],
  scheme_level TEXT,
  data_source TEXT,
  benefits_type TEXT,
  similarity_score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.slug::TEXT,
    s.name_en::TEXT,
    s.name_kn::TEXT,
    s.department::TEXT,
    s.category::TEXT,
    s.target_group::TEXT,
    s.benefits_summary::TEXT,
    s.eligibility_summary::TEXT,
    s.application_url::TEXT,
    s.tags,
    s.scheme_level::TEXT,
    s.data_source::TEXT,
    s.benefits_type::TEXT,
    (1 - (s.scheme_embedding <=> query_embedding))::FLOAT AS similarity_score
  FROM schemes s
  WHERE s.is_active = true
    AND s.scheme_embedding IS NOT NULL
    AND (1 - (s.scheme_embedding <=> query_embedding)) > similarity_threshold
    AND (filter_category IS NULL OR s.category = filter_category)
    AND (filter_level IS NULL OR s.scheme_level = filter_level)
  ORDER BY s.scheme_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute to authenticated and anon roles
GRANT EXECUTE ON FUNCTION scheme_recommend TO authenticated;
GRANT EXECUTE ON FUNCTION scheme_recommend TO anon;

-- Backfill existing 8 schemes with category/tags
UPDATE schemes SET category = 'women_children', tags = ARRAY['women', 'financial', 'bpl'], target_group = 'Women', benefits_type = 'financial', scheme_level = 'state' WHERE slug = 'gruha-lakshmi';
UPDATE schemes SET category = 'employment', tags = ARRAY['youth', 'graduates', 'unemployed'], target_group = 'Youth', benefits_type = 'financial', scheme_level = 'state' WHERE slug = 'yuva-nidhi';
UPDATE schemes SET category = 'housing', tags = ARRAY['electricity', 'household', 'utility'], target_group = 'All', benefits_type = 'subsidy', scheme_level = 'state' WHERE slug = 'gruha-jyothi';
UPDATE schemes SET category = 'food_security', tags = ARRAY['food', 'rice', 'bpl', 'household'], target_group = 'BPL Families', benefits_type = 'service', scheme_level = 'state' WHERE slug = 'anna-bhagya';
UPDATE schemes SET category = 'transport', tags = ARRAY['women', 'bus', 'transport', 'free'], target_group = 'Women', benefits_type = 'service', scheme_level = 'state' WHERE slug = 'shakti-free-bus';
UPDATE schemes SET category = 'women_children', tags = ARRAY['girl-child', 'financial', 'bpl', 'insurance'], target_group = 'Girl Children', benefits_type = 'financial', scheme_level = 'state' WHERE slug = 'bhagyalakshmi';
UPDATE schemes SET category = 'agriculture', tags = ARRAY['farmers', 'irrigation', 'borewell', 'sc-st'], target_group = 'Farmers', benefits_type = 'subsidy', scheme_level = 'state' WHERE slug = 'ganga-kalyana';
UPDATE schemes SET category = 'health', tags = ARRAY['maternal', 'women', 'health', 'bpl'], target_group = 'Pregnant Women', benefits_type = 'service', scheme_level = 'state' WHERE slug = 'thayi-bhagya';
