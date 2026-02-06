/**
 * RAG Pipeline Orchestrator
 * Main entry point for the RAG system
 */

import { checkRateLimit, recordQuery } from "./rate-limit";
import { sanitizeQuery, sanitizeForLogging } from "./sanitize";
import { searchWithCache, saveToCache, calculateConfidence } from "./search";
import { generateQueryEmbedding } from "./embeddings";
import {
  generateResponse,
  generateLowConfidenceResponse,
  generateNoResultsResponse,
} from "./gemini";
import {
  type RAGResult,
  type RAGResponse,
  OFFICIAL_PORTAL_URL,
} from "./types";

/**
 * Main entry point for RAG Q&A
 * Handles rate limiting, sanitization, caching, retrieval, and generation
 *
 * @param query - User's question
 * @param sessionId - Optional session ID for history tracking
 * @param language - Response language ("en" or "kn")
 * @returns RAG result (success with response, or error)
 */
export async function askQuestion(
  query: string,
  _sessionId?: string, // Reserved for future session tracking
  language: "en" | "kn" = "en"
): Promise<RAGResult> {
  const startTime = Date.now();

  try {
    // Step 1: Rate limit check
    const rateStatus = checkRateLimit();
    if (!rateStatus.allowed) {
      return {
        success: false,
        error: {
          type: rateStatus.daily_remaining === 0 ? "daily_limit" : "rate_limit",
          message: language === "kn"
            ? (rateStatus.reason || "ದರ ಮಿತಿ ಮೀರಿದೆ")
            : (rateStatus.reason || "Rate limit exceeded"),
          fallback_url: OFFICIAL_PORTAL_URL,
          retry_after_ms: rateStatus.wait_ms,
          daily_remaining: rateStatus.daily_remaining,
        },
      };
    }

    // Step 2: Sanitize query
    const sanitized = sanitizeQuery(query);
    if (sanitized.blocked) {
      return {
        success: false,
        error: {
          type: "query_blocked",
          message: language === "kn"
            ? (sanitized.reason || "ಪ್ರಶ್ನೆ ಸುರಕ್ಷತೆಗಾಗಿ ತಡೆಯಲಾಗಿದೆ")
            : (sanitized.reason || "Query blocked for safety"),
          fallback_url: OFFICIAL_PORTAL_URL,
        },
      };
    }

    const cleanQuery = sanitized.sanitized;

    // Step 3: Check cache first
    const searchResult = await searchWithCache(cleanQuery);

    if (searchResult.fromCache && searchResult.cachedResponse) {
      // Cache hit - return cached response
      console.log(
        `Cache hit for query: ${sanitizeForLogging(cleanQuery)} (similarity: ${searchResult.cachedResponse.similarity.toFixed(3)})`
      );

      // Don't count cached responses against rate limit
      return {
        success: true,
        data: {
          ...searchResult.cachedResponse.response as RAGResponse,
          cached: true,
          processing_time_ms: Date.now() - startTime,
        },
      };
    }

    // Step 4: Check if we got any results
    if (searchResult.chunks.length === 0) {
      console.log(`No results for query: ${sanitizeForLogging(cleanQuery)}`);
      return {
        success: true,
        data: generateNoResultsResponse(language),
      };
    }

    // Step 5: Calculate confidence from retrieval
    const confidence = calculateConfidence(searchResult.chunks);

    if (confidence === "low") {
      console.log(
        `Low confidence for query: ${sanitizeForLogging(cleanQuery)}`
      );
      return {
        success: true,
        data: generateLowConfidenceResponse(language),
      };
    }

    // Step 6: Generate response with Gemini (with language)
    const response = await generateResponse(cleanQuery, searchResult.chunks, language);

    // Record the API call for rate limiting
    recordQuery();

    // Step 7: Cache the response for future similar queries
    try {
      const queryEmbedding = await generateQueryEmbedding(cleanQuery);
      await saveToCache(
        cleanQuery,
        queryEmbedding,
        response as unknown as Record<string, unknown>,
        response.tokens_used
      );
    } catch (cacheError) {
      // Cache save failure is not critical - log and continue
      console.warn("Failed to cache response:", cacheError);
    }

    // Step 8: Return successful response
    return {
      success: true,
      data: {
        ...response,
        processing_time_ms: Date.now() - startTime,
      },
    };
  } catch (error) {
    console.error("RAG pipeline error:", error);

    // Determine error type
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("rate") || errorMessage.includes("quota")) {
      return {
        success: false,
        error: {
          type: "rate_limit",
          message: language === "kn"
            ? "ಸೇವೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಬ್ಯುಸಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
            : "Service is temporarily busy. Please try again shortly.",
          fallback_url: OFFICIAL_PORTAL_URL,
        },
      };
    }

    if (errorMessage.includes("token") || errorMessage.includes("too large")) {
      return {
        success: false,
        error: {
          type: "token_limit",
          message: language === "kn"
            ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ತುಂಬಾ ಉದ್ದವಾಗಿದೆ. ದಯವಿಟ್ಟು ಚಿಕ್ಕ, ಹೆಚ್ಚು ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆ ಕೇಳಿ."
            : "Your question is too long. Please try a shorter, more specific question.",
          fallback_url: OFFICIAL_PORTAL_URL,
        },
      };
    }

    // Generic API error
    return {
      success: false,
      error: {
        type: "api_error",
        message: language === "kn"
          ? "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ."
          : "Something went wrong. Please try again or visit the official portal.",
        fallback_url: OFFICIAL_PORTAL_URL,
      },
    };
  }
}

/**
 * Quick confidence check for a query without full generation
 * Useful for preview/validation before full processing
 *
 * @param query - User's question
 * @returns Expected confidence level based on retrieval
 */
export async function checkQueryConfidence(
  query: string
): Promise<{
  confidence: "high" | "medium" | "low";
  matchCount: number;
  topScore: number;
}> {
  const sanitized = sanitizeQuery(query);
  if (sanitized.blocked) {
    return { confidence: "low", matchCount: 0, topScore: 0 };
  }

  const searchResult = await searchWithCache(sanitized.sanitized);

  if (searchResult.fromCache) {
    return {
      confidence: "high", // Cached responses were already validated
      matchCount: 1,
      topScore: searchResult.cachedResponse?.similarity || 1,
    };
  }

  const chunks = searchResult.chunks;
  return {
    confidence: calculateConfidence(chunks),
    matchCount: chunks.length,
    topScore: chunks.length > 0 ? chunks[0].semantic_score : 0,
  };
}

/**
 * Get suggested questions based on available documents
 * @param schemeSlug - Optional scheme to filter suggestions
 * @param language - Language for suggestions
 * @returns Array of suggested question strings
 */
export function getSuggestedQuestions(schemeSlug?: string, language: "en" | "kn" = "en"): string[] {
  if (language === "kn") {
    const generalKn = [
      "ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆಯ ಅರ್ಹತೆ ಮಾನದಂಡಗಳು ಏನು?",
      "ಅನ್ನ ಭಾಗ್ಯ ಯೋಜನೆಗೆ ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು?",
      "ಶಕ್ತಿ ಬಸ್ ಪಾಸ್‌ಗೆ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?",
      "ಯುವ ನಿಧಿ ನಿರುದ್ಯೋಗ ಭತ್ಯೆಗೆ ಯಾರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?",
      "ವಿದ್ಯಾಸಿರಿ ವಿದ್ಯಾರ್ಥಿವೇತನದ ಆದಾಯ ಮಿತಿ ಎಷ್ಟು?",
    ];

    const schemeKn: Record<string, string[]> = {
      "gruha-lakshmi": [
        "ಮಾಸಿಕ ಪ್ರಯೋಜನದ ಮೊತ್ತ ಎಷ್ಟು?",
        "ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಪಡಿತರ ಚೀಟಿ ಬೇಕೇ?",
        "ಉದ್ಯೋಗಸ್ಥ ಮಹಿಳೆಯರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದೇ?",
        "ಆದಾಯ ಮಿತಿ ಎಷ್ಟು?",
      ],
      "anna-bhagya": [
        "ತಿಂಗಳಿಗೆ ಎಷ್ಟು ಅಕ್ಕಿ ಸಿಗುತ್ತದೆ?",
        "ಯಾವ ಪಡಿತರ ಚೀಟಿ ವಿಧಗಳು ಅರ್ಹ?",
        "ಪ್ರತ್ಯೇಕವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕೇ?",
      ],
      shakti: [
        "ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಯಾವ ಬಸ್‌ಗಳು ಒಳಗೊಂಡಿವೆ?",
        "ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಬೇಕೇ?",
        "ವಯಸ್ಸಿನ ಮಿತಿ ಇದೆಯೇ?",
      ],
      "yuva-nidhi": [
        "ಮಾಸಿಕ ಭತ್ಯೆ ಮೊತ್ತ ಎಷ್ಟು?",
        "ಯಾವ ಪದವಿ ವರ್ಷಗಳು ಅರ್ಹ?",
        "ಅರೆಕಾಲಿಕ ಕೆಲಸ ಮಾಡಿ ಪ್ರಯೋಜನ ಪಡೆಯಬಹುದೇ?",
      ],
    };

    if (schemeSlug && schemeKn[schemeSlug]) {
      return schemeKn[schemeSlug];
    }
    return generalKn;
  }

  // English suggestions (default)
  const generalSuggestions = [
    "What are the eligibility criteria for Gruha Lakshmi?",
    "How do I apply for Anna Bhagya scheme?",
    "What documents are needed for Shakti bus pass?",
    "Who can apply for Yuva Nidhi unemployment allowance?",
    "What is the income limit for Vidyasiri scholarship?",
  ];

  const schemeSuggestions: Record<string, string[]> = {
    "gruha-lakshmi": [
      "What is the monthly benefit amount?",
      "Do I need a ration card to apply?",
      "Can working women apply?",
      "What is the income limit?",
    ],
    "anna-bhagya": [
      "How much rice do I get per month?",
      "Which ration card types are eligible?",
      "Do I need to apply separately?",
    ],
    shakti: [
      "Which buses are covered under Shakti?",
      "Do I need a smart card?",
      "Is there an age limit?",
    ],
    "yuva-nidhi": [
      "What is the monthly allowance amount?",
      "Which graduation years are eligible?",
      "Can I work part-time and still receive benefits?",
    ],
  };

  if (schemeSlug && schemeSuggestions[schemeSlug]) {
    return schemeSuggestions[schemeSlug];
  }

  return generalSuggestions;
}
