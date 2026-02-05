-- Migration: API Usage Tracking
-- Tracks Cohere, LlamaParse, and Gemini API usage for free tier quota management
-- Date: 2026-02-05

-- ============================================
-- API USAGE TABLE
-- Tracks API calls per service per month
-- ============================================
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service VARCHAR(50) NOT NULL,       -- 'cohere', 'llamaparse', 'gemini'
  usage_type VARCHAR(50),             -- 'embed_batch', 'parse_page', 'query', 'ingestion'
  units_used INTEGER DEFAULT 1,       -- Number of units consumed (calls, credits, etc.)
  month VARCHAR(7) NOT NULL,          -- '2026-02' format for monthly aggregation
  metadata JSONB DEFAULT '{}',        -- Optional context (document_id, filename, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast monthly quota lookups
CREATE INDEX IF NOT EXISTS idx_usage_service_month ON api_usage(service, month);

-- Index for time-range queries
CREATE INDEX IF NOT EXISTS idx_usage_created ON api_usage(created_at DESC);

-- ============================================
-- QUOTA LIMITS (reference, enforced in code)
-- ============================================
COMMENT ON TABLE api_usage IS 'API usage tracking for free tier quota management. Limits: Cohere 1000 calls/month, LlamaParse 10000 credits/month, Gemini 20 RPD (worst case)';

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write usage data
CREATE POLICY "Usage managed by service role"
  ON api_usage FOR ALL
  TO service_role
  USING (true);

-- Authenticated users can read usage stats (for admin dashboard)
CREATE POLICY "Authenticated users can view usage"
  ON api_usage FOR SELECT
  TO authenticated
  USING (true);
