/**
 * Gemini Integration
 * Wrapper for Google Gemini 2.5 Flash API with safety features
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt, validateResponse, formatChunksAsContext, getLowConfidenceResponse, getNoResultsResponse } from "./prompts";
import { validateTokenBudget } from "./token-counter";
import type { RetrievedChunk, RAGResponse, Citation } from "./types";
import { OFFICIAL_PORTAL_URL } from "./types";
import { calculateConfidence } from "./search";

// Lazy initialization
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Check if response contains Kannada characters
 * Used to detect if Gemini actually responded in Kannada
 */
function containsKannada(text: string): boolean {
  // Kannada Unicode range: \u0C80-\u0CFF
  return /[\u0C80-\u0CFF]/.test(text);
}

/**
 * Generate response using Gemini 2.5 Flash
 * @param query - User's question
 * @param chunks - Retrieved document chunks
 * @param language - Response language
 * @returns RAG response with citations
 */
export async function generateResponse(
  query: string,
  chunks: RetrievedChunk[],
  language: "en" | "kn" = "en"
): Promise<RAGResponse> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.3, // Low temperature for factual responses
      topP: 0.8,
      maxOutputTokens: 2048,
    },
  });

  // Format chunks as numbered sources
  const formattedChunks = chunks.map((chunk) => ({
    content: chunk.content,
    document_title: chunk.document_title,
    source_url: chunk.source_url,
    metadata: chunk.metadata,
  }));

  const context = formatChunksAsContext(formattedChunks);

  // Validate token budget before calling API
  const { SYSTEM_PROMPT } = await import("./prompts");
  const tokenCheck = await validateTokenBudget(SYSTEM_PROMPT, context, query);

  if (!tokenCheck.valid) {
    throw new Error(tokenCheck.error || "Token budget exceeded");
  }

  // Build the full prompt (with language instruction for Kannada)
  const fullPrompt = buildPrompt(context, query, language);

  // Call Gemini API
  const startTime = Date.now();
  const result = await model.generateContent(fullPrompt);
  const processingTime = Date.now() - startTime;

  const response = result.response;
  let text = response.text();

  // Get token usage
  const usageMetadata = response.usageMetadata;
  const inputTokens = usageMetadata?.promptTokenCount || tokenCheck.total_tokens;
  const outputTokens = usageMetadata?.candidatesTokenCount || 0;
  const tokensUsed = inputTokens + outputTokens;

  // NO SILENT FALLBACKS: If Kannada was requested but response is English, flag it
  if (language === "kn" && !containsKannada(text)) {
    text = "Note: Kannada response was unavailable. Showing English response.\n\n" + text;
  }

  // Validate response follows safety rules (language-aware)
  const validation = validateResponse(text, language);
  if (!validation.valid) {
    console.warn("Response validation issues:", validation.issues);
    // Don't block - just log the issues
  }

  // Extract citations from response
  const citations = extractCitationsFromResponse(text, chunks);

  // Calculate confidence
  const confidence = calculateConfidence(chunks);

  return {
    answer: text,
    citations,
    confidence,
    cached: false,
    tokens_used: tokensUsed,
    processing_time_ms: processingTime,
  };
}

/**
 * Extract citations from response text and map to source chunks
 * @param response - Generated response text
 * @param chunks - Original retrieved chunks
 * @returns Array of citations with metadata
 */
function extractCitationsFromResponse(
  response: string,
  chunks: RetrievedChunk[]
): Citation[] {
  const citations: Citation[] = [];
  const pattern = /\[Source (\d+)\]/g;
  const citedSources = new Set<number>();
  let match;

  while ((match = pattern.exec(response)) !== null) {
    const sourceNum = parseInt(match[1], 10);
    citedSources.add(sourceNum);
  }

  // Map cited sources to chunks
  for (const sourceNum of citedSources) {
    const chunkIndex = sourceNum - 1; // Source numbers are 1-indexed
    if (chunkIndex >= 0 && chunkIndex < chunks.length) {
      const chunk = chunks[chunkIndex];
      citations.push({
        chunk_id: chunk.id,
        document_title: chunk.document_title,
        source_url: chunk.source_url,
        excerpt: truncateExcerpt(chunk.content),
        page: chunk.metadata?.page_number,
        section: chunk.metadata?.section,
        circular_number: chunk.metadata?.circular_number,
        last_verified: new Date().toISOString(), // TODO: Get from document metadata
        similarity_score: chunk.semantic_score,
      });
    }
  }

  return citations;
}

/**
 * Truncate content for citation excerpt
 * @param content - Full chunk content
 * @param maxLength - Maximum length (default: 200)
 * @returns Truncated excerpt
 */
function truncateExcerpt(content: string, maxLength: number = 200): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.slice(0, maxLength - 3) + "...";
}

/**
 * Generate a low-confidence response when retrieval doesn't find good matches
 * @param language - Response language
 * @returns Low-confidence response with fallback guidance
 */
export function generateLowConfidenceResponse(language: "en" | "kn" = "en"): RAGResponse {
  return {
    answer: getLowConfidenceResponse(language),
    citations: [],
    confidence: "low",
    cached: false,
    tokens_used: 0,
  };
}

/**
 * Generate a no-results response when no documents are found
 * @param language - Response language
 * @returns No-results response
 */
export function generateNoResultsResponse(language: "en" | "kn" = "en"): RAGResponse {
  return {
    answer: getNoResultsResponse(language),
    citations: [],
    confidence: "low",
    cached: false,
    tokens_used: 0,
  };
}

/**
 * Generate an error response for API failures
 * @param errorType - Type of error
 * @param language - Response language
 * @returns User-friendly error response
 */
export function generateErrorResponse(
  errorType: "rate_limit" | "api_error" | "token_limit",
  language: "en" | "kn" = "en"
): RAGResponse {
  const messages: Record<string, Record<string, string>> = {
    en: {
      rate_limit: `I'm currently handling many requests. Please wait a moment and try again.\n\nIn the meantime, you can check the official portal for information: ${OFFICIAL_PORTAL_URL}`,
      api_error: `I'm having trouble processing your question right now.\n\nPlease try again in a few moments, or visit the official portal: ${OFFICIAL_PORTAL_URL}`,
      token_limit: `Your question is too long for me to process. Please try asking a shorter, more specific question.\n\nYou can also check the official portal directly: ${OFFICIAL_PORTAL_URL}`,
    },
    kn: {
      rate_limit: `ಪ್ರಸ್ತುತ ಅನೇಕ ವಿನಂತಿಗಳನ್ನು ನಿರ್ವಹಿಸುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯ ಕಾಯಿರಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.\n\nಈ ಮಧ್ಯೆ, ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಿ: ${OFFICIAL_PORTAL_URL}`,
      api_error: `ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಮಸ್ಯೆ ಎದುರಾಗಿದೆ.\n\nದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ, ಅಥವಾ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ: ${OFFICIAL_PORTAL_URL}`,
      token_limit: `ನಿಮ್ಮ ಪ್ರಶ್ನೆ ತುಂಬಾ ಉದ್ದವಾಗಿದೆ. ದಯವಿಟ್ಟು ಚಿಕ್ಕ, ಹೆಚ್ಚು ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆ ಕೇಳಿ.\n\nನೇರವಾಗಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ: ${OFFICIAL_PORTAL_URL}`,
    },
  };

  return {
    answer: messages[language][errorType],
    citations: [],
    confidence: "low",
    cached: false,
    tokens_used: 0,
  };
}
