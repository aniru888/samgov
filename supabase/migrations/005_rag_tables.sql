-- Migration: RAG Tables for AI Document Q&A
-- Creates tables for document storage, chunks, semantic cache, and chat history
-- Date: 2026-02-04

-- ============================================
-- DOCUMENTS TABLE
-- Stores uploaded PDFs, circulars, FAQs
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID REFERENCES schemes(id) ON DELETE SET NULL,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('circular', 'faq', 'guideline', 'announcement')),
  title VARCHAR(500) NOT NULL,
  filename VARCHAR(255),
  source_url TEXT,
  circular_number VARCHAR(100), -- e.g., "GO/2024/WCD/123"
  issue_date DATE,
  extraction_method VARCHAR(20) DEFAULT 'native' CHECK (extraction_method IN ('native', 'ocr')),
  extraction_confidence FLOAT DEFAULT 1.0,
  last_verified TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DOCUMENT CHUNKS TABLE
-- Stores chunked text with embeddings (384 dims for gte-small)
-- ============================================
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_hash VARCHAR(64) NOT NULL, -- SHA-256 for deduplication
  metadata JSONB DEFAULT '{}', -- {section, page, circular_number, source_url}
  embedding VECTOR(384), -- gte-small dimensions
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index for fast similarity search (better than IVFFlat for <10K docs)
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_chunks_document ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_hash ON document_chunks(content_hash);

-- Full-text search for hybrid retrieval
ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX IF NOT EXISTS idx_chunks_fts ON document_chunks USING gin(search_vector);

-- ============================================
-- QUERY CACHE TABLE
-- Semantic cache for similar queries (saves Gemini API calls)
-- ============================================
CREATE TABLE IF NOT EXISTS query_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  query_embedding VECTOR(384),
  response JSONB NOT NULL, -- Full RAGResponse object
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  hit_count INTEGER DEFAULT 0
);

-- HNSW index for cache lookup
CREATE INDEX IF NOT EXISTS idx_cache_embedding ON query_cache
  USING hnsw (query_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_cache_expires ON query_cache(expires_at);

-- ============================================
-- CHAT SESSIONS TABLE
-- Tracks user chat sessions (anonymous, cookie-based)
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(64) UNIQUE NOT NULL,
  user_agent TEXT,
  ip_hash VARCHAR(64), -- Hashed IP for analytics, not tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON chat_sessions(session_token);

-- ============================================
-- CHAT MESSAGES TABLE
-- Stores individual messages in a session
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  confidence VARCHAR(20) CHECK (confidence IN ('high', 'medium', 'low')),
  tokens_used INTEGER,
  from_cache BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON chat_messages(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Documents: Public read (if active), authenticated write
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Documents are publicly readable when active"
  ON documents FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage documents"
  ON documents FOR ALL
  TO authenticated
  USING (true);

-- Document chunks: Public read, authenticated write
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chunks are publicly readable"
  ON document_chunks FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage chunks"
  ON document_chunks FOR ALL
  TO authenticated
  USING (true);

-- Query cache: Service role only (managed by backend)
ALTER TABLE query_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cache is managed by service role"
  ON query_cache FOR ALL
  TO service_role
  USING (true);

-- Chat sessions/messages: Anon can create, no direct access
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions managed by API"
  ON chat_sessions FOR ALL
  TO anon, authenticated
  USING (true);

CREATE POLICY "Messages managed by API"
  ON chat_messages FOR ALL
  TO anon, authenticated
  USING (true);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE documents IS 'Uploaded scheme documents (PDFs, circulars, FAQs) for RAG retrieval';
COMMENT ON TABLE document_chunks IS 'Chunked document text with 384-dim embeddings for vector search';
COMMENT ON TABLE query_cache IS 'Semantic cache - similar queries return cached responses';
COMMENT ON TABLE chat_sessions IS 'Anonymous chat sessions for conversation tracking';
COMMENT ON TABLE chat_messages IS 'Individual messages in chat sessions with citations';
