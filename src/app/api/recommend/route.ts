/**
 * Scheme Recommendation API
 * POST /api/recommend
 * Uses Cohere embedding + pgvector for semantic scheme matching
 * Cost: 1 Cohere call per request (no Gemini)
 */

import { NextRequest, NextResponse } from "next/server";
import { recommendSchemes } from "@/lib/recommend";
import { sanitizeQuery } from "@/lib/rag/sanitize";

// In-memory rate limiting (same pattern as /api/ask)
const rateLimitMap = new Map<string, { count: number; resetAt: number; dailyCount: number; dailyResetAt: number }>();
const RATE_LIMIT_PER_MINUTE = 5;
const RATE_LIMIT_PER_DAY = 50;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + 60_000,
      dailyCount: 1,
      dailyResetAt: now + 86_400_000,
    });
    return { allowed: true };
  }

  // Reset minute window
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 60_000;
  }

  // Reset daily window
  if (now > entry.dailyResetAt) {
    entry.dailyCount = 0;
    entry.dailyResetAt = now + 86_400_000;
  }

  if (entry.count >= RATE_LIMIT_PER_MINUTE) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  if (entry.dailyCount >= RATE_LIMIT_PER_DAY) {
    return { allowed: false, retryAfter: Math.ceil((entry.dailyResetAt - now) / 1000) };
  }

  entry.count++;
  entry.dailyCount++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      );
    }

    // Parse body
    const body = await request.json();
    const { query: rawQuery, category, level, language: rawLanguage } = body;

    if (!rawQuery || typeof rawQuery !== "string") {
      return NextResponse.json(
        { success: false, error: "Query is required" },
        { status: 400 }
      );
    }

    if (rawQuery.length > 500) {
      return NextResponse.json(
        { success: false, error: "Query must be under 500 characters" },
        { status: 400 }
      );
    }

    // Sanitize
    const sanitized = sanitizeQuery(rawQuery);
    if (sanitized.blocked) {
      return NextResponse.json(
        { success: false, error: "Invalid query" },
        { status: 400 }
      );
    }

    const language: "en" | "kn" = rawLanguage === "kn" ? "kn" : "en";

    // Search
    const results = await recommendSchemes(
      sanitized.sanitized,
      {
        category: category || undefined,
        level: level || undefined,
      },
      10,
      language
    );

    return NextResponse.json({
      success: true,
      data: {
        schemes: results,
        total: results.length,
      },
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to find matching schemes. Please try again.",
      },
      { status: 500 }
    );
  }
}
