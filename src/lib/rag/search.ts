/**
 * Hybrid Search Module
 * Combines semantic (pgvector) and keyword (tsvector) search with RRF
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { generateQueryEmbedding } from "./embeddings";
import {
  CACHE_SETTINGS,
  CONFIDENCE_THRESHOLDS,
  type RetrievedChunk,
  type CacheHit,
  type ConfidenceLevel,
} from "./types";

/**
 * Perform hybrid search (semantic + keyword with RRF)
 * @param query - User's question
 * @param matchThreshold - Minimum similarity threshold (default: 0.65)
 * @param matchCount - Maximum results to return (default: 5)
 * @returns Array of retrieved chunks sorted by relevance
 */
export async function hybridSearch(
  query: string,
  matchThreshold: number = CONFIDENCE_THRESHOLDS.MEDIUM,
  matchCount: number = 5
): Promise<RetrievedChunk[]> {
  const supabase = createAdminClient();

  // Generate query embedding
  const queryEmbedding = await generateQueryEmbedding(query);

  // Call hybrid search RPC function
  const { data, error } = await supabase.rpc("hybrid_search", {
    query_embedding: queryEmbedding,
    search_query: query,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("Hybrid search failed:", error);
    throw new Error(`Search failed: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map database response to RetrievedChunk type
  return data.map((row: {
    id: string;
    content: string;
    metadata: Record<string, unknown>;
    document_title: string;
    source_url: string;
    semantic_score: number;
    keyword_score: number;
    final_score: number;
  }) => ({
    id: row.id,
    content: row.content,
    metadata: row.metadata as RetrievedChunk["metadata"],
    document_title: row.document_title,
    source_url: row.source_url,
    semantic_score: row.semantic_score,
    keyword_score: row.keyword_score,
    final_score: row.final_score,
  }));
}

/**
 * Check semantic cache for similar queries
 * @param query - User's question
 * @param similarityThreshold - Minimum similarity for cache hit (default: 0.94)
 * @returns Cached response if found, null otherwise
 */
export async function checkCache(
  query: string,
  similarityThreshold: number = CACHE_SETTINGS.SIMILARITY_THRESHOLD
): Promise<CacheHit | null> {
  const supabase = createAdminClient();

  // Generate query embedding
  const queryEmbedding = await generateQueryEmbedding(query);

  // Call cache lookup RPC function
  const { data, error } = await supabase.rpc("find_cached_response", {
    query_embedding: queryEmbedding,
    similarity_threshold: similarityThreshold,
  });

  if (error) {
    console.error("Cache lookup failed:", error);
    // Don't throw - cache miss is not critical
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const hit = data[0];

  // Increment cache hit counter (fire and forget)
  void supabase.rpc("increment_cache_hit", { cache_id: hit.id }).then(() => {
    // Success - counter incremented
  }, () => {
    // Ignore errors from counter increment
  });

  return {
    id: hit.id,
    response: hit.response,
    similarity: hit.similarity,
    query_text: hit.query_text,
  };
}

/**
 * Save query and response to cache
 * @param query - Original query text
 * @param queryEmbedding - Query embedding vector
 * @param response - RAG response to cache
 * @param tokensUsed - Tokens consumed for this response
 */
export async function saveToCache(
  query: string,
  queryEmbedding: number[],
  response: Record<string, unknown>,
  tokensUsed?: number
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("query_cache").insert({
    query_text: query,
    query_embedding: queryEmbedding,
    response,
    tokens_used: tokensUsed,
  });

  if (error) {
    console.error("Failed to save to cache:", error);
    // Don't throw - cache save failure is not critical
  }
}

/**
 * Calculate confidence level from search results
 * @param chunks - Retrieved chunks
 * @returns Confidence level (high/medium/low)
 */
export function calculateConfidence(chunks: RetrievedChunk[]): ConfidenceLevel {
  if (chunks.length === 0) {
    return "low";
  }

  const topScore = chunks[0].semantic_score;
  const hasMultipleGoodMatches =
    chunks.filter((c) => c.semantic_score > CONFIDENCE_THRESHOLDS.MEDIUM)
      .length >= 2;

  // High confidence: Top score > 0.80 and multiple supporting documents
  if (topScore >= CONFIDENCE_THRESHOLDS.HIGH && hasMultipleGoodMatches) {
    return "high";
  }

  // Medium confidence: Top score > 0.65
  if (topScore >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return "medium";
  }

  // Low confidence
  return "low";
}

/**
 * Search with automatic cache check
 * @param query - User's question
 * @returns Search results or cached response
 */
export async function searchWithCache(query: string): Promise<{
  chunks: RetrievedChunk[];
  fromCache: boolean;
  cachedResponse?: CacheHit;
}> {
  // First, check cache
  const cached = await checkCache(query);

  if (cached) {
    return {
      chunks: [],
      fromCache: true,
      cachedResponse: cached,
    };
  }

  // Cache miss - perform full search
  const chunks = await hybridSearch(query);

  return {
    chunks,
    fromCache: false,
  };
}

/**
 * Get document chunks by IDs
 * Useful for re-fetching chunks after cache hit
 * @param chunkIds - Array of chunk IDs
 * @returns Array of chunks
 */
export async function getChunksByIds(
  chunkIds: string[]
): Promise<RetrievedChunk[]> {
  if (chunkIds.length === 0) {
    return [];
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("document_chunks")
    .select(
      `
      id,
      content,
      metadata,
      documents!inner(title, source_url)
    `
    )
    .in("id", chunkIds);

  if (error) {
    console.error("Failed to fetch chunks by ID:", error);
    throw new Error(`Failed to fetch chunks: ${error.message}`);
  }

  return (data || []).map((row) => {
    // Supabase returns joined data as array even with !inner
    const docsArray = row.documents as unknown as Array<{ title: string; source_url: string }> | null;
    const docs = docsArray?.[0];
    return {
      id: row.id,
      content: row.content,
      metadata: row.metadata,
      document_title: docs?.title ?? "Unknown",
      source_url: docs?.source_url ?? "",
      semantic_score: 1, // Not applicable for direct fetch
      keyword_score: 0,
      final_score: 1,
    };
  });
}
