/**
 * Token Counter for Gemini API
 * Counts tokens before making API calls to respect limits
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TokenBudgetResult } from "./types";

// Lazy initialization to avoid errors when env vars not set
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
 * Maximum tokens for a single request
 * Gemini 2.0 Flash has a 1M token context window,
 * but we limit to 30K for cost/latency reasons
 */
const MAX_TOKENS_PER_REQUEST = 30000;

/**
 * Approximate token estimation (fast, no API call)
 * Rule of thumb: ~4 characters per token for English
 * @param text - Text to estimate
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English
  // For mixed English/Kannada, use slightly higher ratio
  return Math.ceil(text.length / 3.5);
}

/**
 * Count tokens using Gemini API (accurate but slow)
 * @param text - Text to count
 * @returns Actual token count
 */
export async function countTokens(text: string): Promise<number> {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.countTokens(text);
    return result.totalTokens;
  } catch (error) {
    // Fallback to estimation if API fails
    console.warn("Token counting failed, using estimation:", error);
    return estimateTokens(text);
  }
}

/**
 * Validate that a prompt fits within token budget
 * @param systemPrompt - System instructions
 * @param context - Retrieved document context
 * @param query - User query
 * @param maxTokens - Maximum allowed tokens (default: 30K)
 * @returns Validation result
 */
export async function validateTokenBudget(
  systemPrompt: string,
  context: string,
  query: string,
  maxTokens: number = MAX_TOKENS_PER_REQUEST
): Promise<TokenBudgetResult> {
  const fullPrompt = `${systemPrompt}\n\nCONTEXT:\n${context}\n\nQUERY: ${query}`;

  // First do quick estimation
  const estimated = estimateTokens(fullPrompt);

  // If clearly over budget, don't waste API call
  if (estimated > maxTokens * 1.2) {
    return {
      valid: false,
      total_tokens: estimated,
      error: `Query too large (~${estimated} tokens). Maximum: ${maxTokens}. Try a shorter question.`,
    };
  }

  // If clearly under budget, don't need exact count
  if (estimated < maxTokens * 0.5) {
    return {
      valid: true,
      total_tokens: estimated,
    };
  }

  // For borderline cases, get exact count
  try {
    const actual = await countTokens(fullPrompt);

    if (actual > maxTokens) {
      return {
        valid: false,
        total_tokens: actual,
        error: `Query too large (${actual} tokens). Maximum: ${maxTokens}. Try a shorter question.`,
      };
    }

    return {
      valid: true,
      total_tokens: actual,
    };
  } catch (_error) {
    // If counting fails, use estimation and proceed
    return {
      valid: estimated <= maxTokens,
      total_tokens: estimated,
      error:
        estimated > maxTokens
          ? `Query estimated at ${estimated} tokens, exceeds ${maxTokens} limit.`
          : undefined,
    };
  }
}

/**
 * Truncate context to fit within token budget
 * Keeps the most relevant chunks (assumes they're sorted by relevance)
 * @param chunks - Array of text chunks (sorted by relevance)
 * @param maxTokens - Maximum tokens for context
 * @returns Truncated context that fits within budget
 */
export function truncateContext(
  chunks: string[],
  maxTokens: number
): { context: string; chunks_used: number; tokens_used: number } {
  let context = "";
  let chunksUsed = 0;
  let tokensUsed = 0;

  for (const chunk of chunks) {
    const chunkTokens = estimateTokens(chunk);

    if (tokensUsed + chunkTokens > maxTokens) {
      break;
    }

    context += (context ? "\n\n---\n\n" : "") + chunk;
    chunksUsed++;
    tokensUsed += chunkTokens;
  }

  return {
    context,
    chunks_used: chunksUsed,
    tokens_used: tokensUsed,
  };
}

/**
 * Get token usage summary for a response
 * @param inputTokens - Tokens in the prompt
 * @param outputTokens - Tokens in the response
 * @returns Summary with cost estimate
 */
export function getTokenUsageSummary(
  inputTokens: number,
  outputTokens: number
): {
  input: number;
  output: number;
  total: number;
  cost_estimate_usd: number;
} {
  const total = inputTokens + outputTokens;

  // Gemini 2.0 Flash pricing (as of Feb 2026)
  // Free tier: No cost, but limited to 250 req/day
  // Paid: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens
  const costEstimate =
    (inputTokens * 0.075) / 1_000_000 + (outputTokens * 0.3) / 1_000_000;

  return {
    input: inputTokens,
    output: outputTokens,
    total,
    cost_estimate_usd: costEstimate,
  };
}
