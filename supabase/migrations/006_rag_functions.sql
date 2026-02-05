-- Migration: RAG Functions for hybrid search and cache
-- Date: 2026-02-04

-- ============================================
-- HYBRID SEARCH FUNCTION
-- Combines semantic (pgvector) + keyword (tsvector) search
-- Uses Reciprocal Rank Fusion (RRF) with k=40
-- ============================================
CREATE OR REPLACE FUNCTION hybrid_search(
  query_embedding VECTOR(384),
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

COMMENT ON FUNCTION hybrid_search IS 'Hybrid semantic + keyword search with RRF ranking for RAG retrieval';

-- ============================================
-- SEMANTIC CACHE LOOKUP
-- Finds cached response for similar queries (0.94 threshold)
-- ============================================
CREATE OR REPLACE FUNCTION find_cached_response(
  query_embedding VECTOR(384),
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

COMMENT ON FUNCTION find_cached_response IS 'Find cached RAG response for similar queries (0.94 similarity threshold)';

-- ============================================
-- CACHE HIT COUNTER
-- Increments hit count when cache is used
-- ============================================
CREATE OR REPLACE FUNCTION increment_cache_hit(cache_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE query_cache
  SET hit_count = hit_count + 1
  WHERE id = cache_id;
$$;

COMMENT ON FUNCTION increment_cache_hit IS 'Increment cache hit counter for analytics';

-- ============================================
-- CACHE CLEANUP
-- Removes expired cache entries (run daily via cron)
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM query_cache
  WHERE expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_expired_cache IS 'Remove expired cache entries - call daily';

-- ============================================
-- SESSION CLEANUP
-- Removes old inactive sessions (run weekly via cron)
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_sessions(days_old INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM chat_sessions
  WHERE last_active < NOW() - (days_old || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_old_sessions IS 'Remove old chat sessions - call weekly';

-- ============================================
-- GRANTS
-- ============================================
GRANT EXECUTE ON FUNCTION hybrid_search TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION find_cached_response TO service_role;
GRANT EXECUTE ON FUNCTION increment_cache_hit TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_cache TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_sessions TO service_role;
