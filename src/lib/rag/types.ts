/**
 * RAG Pipeline Types
 * Type definitions for the Retrieval-Augmented Generation system
 */

// ============================================
// CITATION TYPES
// ============================================

/**
 * Citation from a retrieved document chunk
 */
export interface Citation {
  chunk_id: string;
  document_title: string;
  source_url: string;
  excerpt: string;
  page?: number;
  section?: string;
  circular_number?: string;
  last_verified: string;
  similarity_score: number;
}

// ============================================
// RESPONSE TYPES
// ============================================

/**
 * Confidence level for RAG responses
 * - high: ≥0.80 semantic similarity, multiple supporting chunks
 * - medium: 0.65-0.80 similarity, some support
 * - low: <0.65 similarity or no good matches
 */
export type ConfidenceLevel = "high" | "medium" | "low";

/**
 * Successful RAG response
 */
export interface RAGResponse {
  answer: string;
  citations: Citation[];
  confidence: ConfidenceLevel;
  cached: boolean;
  tokens_used?: number;
  processing_time_ms?: number;
}

/**
 * RAG error types for user-friendly messaging
 */
export type RAGErrorType =
  | "rate_limit"
  | "daily_limit"
  | "low_confidence"
  | "no_results"
  | "query_blocked"
  | "token_limit"
  | "api_error"
  | "invalid_request";

/**
 * RAG error response
 */
export interface RAGError {
  type: RAGErrorType;
  message: string;
  fallback_url?: string;
  retry_after_ms?: number;
  daily_remaining?: number;
}

/**
 * Combined RAG result type
 */
export type RAGResult =
  | { success: true; data: RAGResponse }
  | { success: false; error: RAGError };

// ============================================
// SEARCH TYPES
// ============================================

/**
 * Retrieved document chunk from hybrid search
 */
export interface RetrievedChunk {
  id: string;
  content: string;
  metadata: ChunkMetadata;
  document_title: string;
  source_url: string;
  semantic_score: number;
  keyword_score: number;
  final_score: number;
}

/**
 * Metadata stored with each chunk
 */
export interface ChunkMetadata {
  section?: string;
  page_number?: number;
  circular_number?: string;
  source_url?: string;
  extraction_method?: "native" | "ocr";
}

/**
 * Cache lookup result
 */
export interface CacheHit {
  id: string;
  response: RAGResponse;
  similarity: number;
  query_text: string;
}

// ============================================
// DOCUMENT TYPES
// ============================================

/**
 * Document type classification
 */
export type DocumentType = "circular" | "faq" | "guideline" | "announcement";

/**
 * Document upload request
 */
export interface DocumentUpload {
  scheme_id?: string;
  document_type: DocumentType;
  title: string;
  filename: string;
  source_url: string;
  circular_number?: string;
  issue_date?: string;
  content: Buffer | ArrayBuffer;
}

/**
 * Processed document chunk ready for storage
 */
export interface ProcessedChunk {
  content: string;
  content_hash: string;
  metadata: ChunkMetadata;
  token_count: number;
  embedding?: number[];
}

/**
 * PDF extraction result
 */
export interface ExtractionResult {
  text: string;
  extraction_method: "native" | "ocr";
  confidence: number;
  page_count: number;
}

// ============================================
// RATE LIMITING TYPES
// ============================================

/**
 * Rate limit check result
 */
export interface RateLimitStatus {
  allowed: boolean;
  wait_ms: number;
  daily_remaining: number;
  reason?: string;
}

/**
 * Query sanitization result
 */
export interface SanitizeResult {
  sanitized: string;
  blocked: boolean;
  reason?: string;
}

/**
 * Token budget validation result
 */
export interface TokenBudgetResult {
  valid: boolean;
  total_tokens: number;
  error?: string;
}

// ============================================
// CHAT SESSION TYPES
// ============================================

/**
 * Chat message role
 */
export type MessageRole = "user" | "assistant";

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  confidence?: ConfidenceLevel;
  tokens_used?: number;
  from_cache: boolean;
  created_at: string;
}

/**
 * Chat session
 */
export interface ChatSession {
  id: string;
  session_token: string;
  messages: ChatMessage[];
  created_at: string;
  last_active: string;
}

// ============================================
// CONSTANTS
// ============================================

/**
 * Default fallback URL for official portal
 */
export const OFFICIAL_PORTAL_URL = "https://sevasindhu.karnataka.gov.in";

/**
 * Confidence thresholds
 */
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.80,
  MEDIUM: 0.65,
  LOW: 0.0,
} as const;

/**
 * Rate limiting constants (Gemini 2.0 Flash - verified Feb 2026)
 */
export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 10,
  REQUESTS_PER_DAY: 250,
  MIN_INTERVAL_MS: 6000, // 6 seconds between requests
  TOKENS_PER_MINUTE: 250000,
} as const;

/**
 * Cache constants
 */
export const CACHE_SETTINGS = {
  SIMILARITY_THRESHOLD: 0.94,
  EXPIRY_HOURS: 24,
} as const;
