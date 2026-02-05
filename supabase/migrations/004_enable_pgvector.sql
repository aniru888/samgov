-- Migration: Enable pgvector extension
-- CRITICAL: Must run before any vector operations
-- Date: 2026-02-04

-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension is active
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    RAISE EXCEPTION 'pgvector extension failed to install. Contact Supabase support.';
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON EXTENSION vector IS 'pgvector: vector similarity search for RAG document retrieval';
