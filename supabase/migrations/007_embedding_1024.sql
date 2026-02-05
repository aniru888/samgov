-- Migration: Upgrade embeddings from 384 to 1024 dimensions
-- Reason: gte-small (384 dims) does NOT support Kannada
-- Solution: Migrate to Cohere embed-multilingual-v3 (1024 dims, 100+ languages including Kannada)
-- Date: 2026-02-04

-- ============================================
-- WARNING: This migration will:
-- 1. Drop existing indexes (required for column type change)
-- 2. Drop old 384-dim functions (prevent overloading)
-- 3. Change embedding dimensions (existing embeddings become invalid)
-- 4. Clear existing invalid embeddings
-- 5. Recreate indexes for 1024 dimensions
-- 6. Recreate functions with 1024-dim parameters
--
-- After running this migration:
-- 1. Add COHERE_API_KEY to environment variables
-- 2. Re-embed all existing documents (if any)
-- ============================================

-- Wrap in transaction for atomicity
BEGIN;

-- Step 1: Drop existing HNSW indexes (cannot alter column with index)
DROP INDEX IF EXISTS idx_chunks_embedding;
DROP INDEX IF EXISTS idx_cache_embedding;

-- Step 1b: Drop OLD 384-dim functions to prevent overloading
-- CRITICAL: CREATE OR REPLACE with different signature creates NEW overloaded function!
-- Must DROP the old signature first to ensure clean replacement.
DROP FUNCTION IF EXISTS hybrid_search(VECTOR(384), TEXT, FLOAT, INT);
DROP FUNCTION IF EXISTS find_cached_response(VECTOR(384), FLOAT);

-- Step 2: Alter document_chunks.embedding from VECTOR(384) to VECTOR(1024)
-- This will preserve NULL values, but existing non-null embeddings become invalid
ALTER TABLE document_chunks
  ALTER COLUMN embedding TYPE VECTOR(1024);

-- Step 3: Alter query_cache.query_embedding from VECTOR(384) to VECTOR(1024)
ALTER TABLE query_cache
  ALTER COLUMN query_embedding TYPE VECTOR(1024);

-- Step 4: Recreate HNSW indexes for 1024 dimensions
-- Using same parameters (m=16, ef_construction=64) for consistency
CREATE INDEX idx_chunks_embedding ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_cache_embedding ON query_cache
  USING hnsw (query_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Step 5: Clear all embeddings (old 384-dim embeddings are incompatible with 1024)
-- Use DELETE instead of TRUNCATE for better RLS compatibility
DELETE FROM query_cache;

-- Step 5b: Clear existing document chunk embeddings (must re-embed with Cohere)
UPDATE document_chunks SET embedding = NULL WHERE embedding IS NOT NULL;

-- Step 6: Update comments to reflect new embedding model
COMMENT ON COLUMN document_chunks.embedding IS '1024-dim embeddings from Cohere embed-multilingual-v3 (supports 100+ languages including Kannada)';
COMMENT ON COLUMN query_cache.query_embedding IS '1024-dim query embeddings for semantic cache lookup';
COMMENT ON TABLE document_chunks IS 'Chunked document text with 1024-dim embeddings for multilingual vector search';

-- Step 7: Recreate hybrid_search function with VECTOR(1024) parameter
CREATE OR REPLACE FUNCTION hybrid_search(
  query_embedding VECTOR(1024),
  search_query TEXT,
  match_threshold FLOAT DEFAULT 0.65,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  document_title TEXT,
  source_url TEXT,
  semantic_score FLOAT,
  keyword_score FLOAT,
  final_score FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH semantic AS (
    SELECT
      dc.id,
      dc.content,
      dc.metadata,
      d.title::TEXT AS document_title,
      d.source_url::TEXT AS source_url,
      1 - (dc.embedding <=> query_embedding) AS score,
      ROW_NUMBER() OVER (ORDER BY dc.embedding <=> query_embedding) AS rank
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    WHERE d.is_active = true
      AND dc.embedding IS NOT NULL
      AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ),
  keyword AS (
    SELECT
      dc.id,
      ts_rank(dc.search_vector, plainto_tsquery('english', search_query)) AS score,
      ROW_NUMBER() OVER (ORDER BY ts_rank(dc.search_vector, plainto_tsquery('english', search_query)) DESC) AS rank
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    WHERE d.is_active = true
      AND dc.search_vector @@ plainto_tsquery('english', search_query)
  )
  SELECT
    s.id,
    s.content,
    s.metadata,
    s.document_title,
    s.source_url,
    s.score AS semantic_score,
    COALESCE(k.score, 0)::FLOAT AS keyword_score,
    -- Reciprocal Rank Fusion with k=40 (better for small datasets)
    ((1.0 / (40 + s.rank)) + (1.0 / (40 + COALESCE(k.rank, 999))))::FLOAT AS final_score
  FROM semantic s
  LEFT JOIN keyword k ON s.id = k.id
  ORDER BY final_score DESC
  LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION hybrid_search IS 'Hybrid semantic + keyword search with RRF ranking for RAG retrieval (1024-dim Cohere embeddings)';

-- Step 8: Recreate find_cached_response function with VECTOR(1024) parameter
CREATE OR REPLACE FUNCTION find_cached_response(
  query_embedding VECTOR(1024),
  similarity_threshold FLOAT DEFAULT 0.94
)
RETURNS TABLE (
  id UUID,
  response JSONB,
  similarity FLOAT,
  query_text TEXT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    qc.id,
    qc.response,
    (1 - (query_embedding <=> qc.query_embedding))::FLOAT AS similarity,
    qc.query_text
  FROM query_cache qc
  WHERE qc.expires_at > NOW()
    AND qc.query_embedding IS NOT NULL
    AND 1 - (query_embedding <=> qc.query_embedding) > similarity_threshold
  ORDER BY query_embedding <=> qc.query_embedding
  LIMIT 1;
$$;

COMMENT ON FUNCTION find_cached_response IS 'Find cached RAG response for similar queries (1024-dim Cohere embeddings)';

-- Commit the transaction
COMMIT;

-- ============================================
-- VERIFICATION QUERIES (run manually after migration)
-- ============================================
-- Check embedding column type:
-- SELECT column_name, data_type, udt_name
-- FROM information_schema.columns
-- WHERE table_name = 'document_chunks' AND column_name = 'embedding';
--
-- Check index exists:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'document_chunks' AND indexname = 'idx_chunks_embedding';
--
-- Check function parameter type:
-- SELECT proname, pg_get_function_arguments(oid)
-- FROM pg_proc
-- WHERE proname = 'hybrid_search';
