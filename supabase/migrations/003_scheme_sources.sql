-- Migration: Add source tracking for scheme eligibility data
-- This tracks provenance of eligibility criteria for legal compliance

-- Add source columns to schemes table
ALTER TABLE schemes
ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS helpline JSONB DEFAULT '{}'::jsonb;

-- Create index for source searching
CREATE INDEX IF NOT EXISTS idx_schemes_sources ON schemes USING GIN (sources);

-- Add comment for documentation
COMMENT ON COLUMN schemes.sources IS 'Array of source objects with url, title, type (official/secondary), last_accessed date';
COMMENT ON COLUMN schemes.helpline IS 'Contact info object with phone array, email, address';

-- Create audit table for source changes
CREATE TABLE IF NOT EXISTS scheme_source_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL, -- 'verified', 'updated', 'added', 'removed'
  source_url TEXT,
  verified_by VARCHAR(255),
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_scheme_source_audit_scheme ON scheme_source_audit(scheme_id);
CREATE INDEX IF NOT EXISTS idx_scheme_source_audit_date ON scheme_source_audit(verified_at DESC);
