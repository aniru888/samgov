/**
 * RAG Q&A API Route
 * POST /api/ask - Ask questions about Karnataka welfare schemes
 */

import { NextResponse } from "next/server";
import { askQuestion, getRateLimitStatus } from "@/lib/rag";
import type { RAGError } from "@/lib/rag";

// Disable body size limit for this route
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, sessionId, language: rawLanguage } = body;

    // Validate language param (only "en" and "kn" allowed)
    const language: "en" | "kn" = rawLanguage === "kn" ? "kn" : "en";

    // Validate query
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: "invalid_request",
            message: "Missing or invalid 'query' parameter",
          } as RAGError,
        },
        { status: 400 }
      );
    }

    // Query length check (before any processing)
    if (query.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: "invalid_request",
            message:
              "Query too long. Please ask a shorter, more specific question (max 500 characters).",
          } as RAGError,
        },
        { status: 400 }
      );
    }

    // Process the question through RAG pipeline
    const result = await askQuestion(query, sessionId, language);

    // Return appropriate status based on result
    if (!result.success) {
      const error = result.error;
      let status = 500;

      switch (error.type) {
        case "rate_limit":
        case "daily_limit":
          status = 429;
          break;
        case "query_blocked":
          status = 400;
          break;
        case "token_limit":
          status = 413;
          break;
        default:
          status = 500;
      }

      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: "api_error",
          message: "An unexpected error occurred. Please try again.",
          fallback_url: "https://sevasindhu.karnataka.gov.in",
        } as RAGError,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ask - Check rate limit status
 * Useful for client-side rate limit display
 */
export async function GET() {
  const status = getRateLimitStatus();

  return NextResponse.json({
    rate_limit: {
      requests_per_minute: 10,
      daily_limit: 250,
      current: {
        daily_used: status.daily_used,
        daily_remaining: status.daily_remaining,
        last_query_ms_ago: status.last_query_ms_ago,
      },
    },
    service: {
      model: "gemini-2.0-flash",
      embeddings: "cohere-embed-multilingual-v3 (1024 dims)",
      search: "hybrid (semantic + keyword)",
    },
  });
}
