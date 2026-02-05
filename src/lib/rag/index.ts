/**
 * RAG Library Index
 * Export all RAG functionality from a single entry point
 */

// Main pipeline
export { askQuestion, checkQueryConfidence, getSuggestedQuestions } from "./pipeline";

// Types
export type {
  RAGResult,
  RAGResponse,
  RAGError,
  RAGErrorType,
  Citation,
  ConfidenceLevel,
  RetrievedChunk,
  ChunkMetadata,
  CacheHit,
  DocumentType,
  DocumentUpload,
  ProcessedChunk,
  ExtractionResult,
  RateLimitStatus,
  SanitizeResult,
  TokenBudgetResult,
  ChatMessage,
  ChatSession,
  MessageRole,
} from "./types";

// Constants
export {
  OFFICIAL_PORTAL_URL,
  CONFIDENCE_THRESHOLDS,
  RATE_LIMITS,
  CACHE_SETTINGS,
} from "./types";

// Rate limiting
export {
  checkRateLimit,
  recordQuery,
  getRateLimitStatus,
  resetRateLimits,
  withRateLimit,
} from "./rate-limit";

// Query sanitization
export {
  sanitizeQuery,
  isQuerySafe,
  extractQueryKeywords,
  sanitizeForLogging,
} from "./sanitize";

// Token counting
export {
  estimateTokens,
  countTokens,
  validateTokenBudget,
  truncateContext,
  getTokenUsageSummary,
} from "./token-counter";

// Search
export {
  hybridSearch,
  checkCache,
  saveToCache,
  calculateConfidence,
  searchWithCache,
  getChunksByIds,
} from "./search";

// Embeddings
export {
  EMBEDDING_DIMENSIONS,
  generateEmbedding,
  generateEmbeddingsBatch,
  generateQueryEmbedding,
  cosineSimilarity,
  normalizeVector,
  isValidEmbedding,
} from "./embeddings";

// Generation
export {
  generateResponse,
  generateLowConfidenceResponse,
  generateNoResultsResponse,
  generateErrorResponse,
} from "./gemini";

// Prompts
export {
  SYSTEM_PROMPT,
  LOW_CONFIDENCE_RESPONSE,
  NO_RESULTS_RESPONSE,
  buildPrompt,
  formatChunksAsContext,
  extractCitations,
  validateResponse,
} from "./prompts";
