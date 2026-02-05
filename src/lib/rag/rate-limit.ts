/**
 * Rate Limiter for Gemini API
 * Verified Feb 2026: 10 RPM, 250 requests/day
 */

import { RATE_LIMITS, type RateLimitStatus } from "./types";

// In-memory state (resets on server restart)
// For production, consider using Redis or database
let lastQueryTime = 0;
let dailyCount = 0;
let lastResetDate = new Date().toDateString();

/**
 * Check if a query is allowed under rate limits
 * @returns Status with allowed flag, wait time, and daily remaining
 */
export function checkRateLimit(): RateLimitStatus {
  const now = Date.now();
  const today = new Date().toDateString();

  // Reset daily counter at midnight
  if (today !== lastResetDate) {
    dailyCount = 0;
    lastResetDate = today;
  }

  // Check daily limit (250 req/day)
  if (dailyCount >= RATE_LIMITS.REQUESTS_PER_DAY) {
    return {
      allowed: false,
      wait_ms: 0,
      daily_remaining: 0,
      reason: "Daily limit reached. Service resets at midnight.",
    };
  }

  // Check per-minute rate (10 RPM = 6s minimum between requests)
  const elapsed = now - lastQueryTime;
  if (elapsed < RATE_LIMITS.MIN_INTERVAL_MS) {
    const waitMs = RATE_LIMITS.MIN_INTERVAL_MS - elapsed;
    return {
      allowed: false,
      wait_ms: waitMs,
      daily_remaining: RATE_LIMITS.REQUESTS_PER_DAY - dailyCount,
      reason: `Please wait ${Math.ceil(waitMs / 1000)} seconds`,
    };
  }

  return {
    allowed: true,
    wait_ms: 0,
    daily_remaining: RATE_LIMITS.REQUESTS_PER_DAY - dailyCount,
  };
}

/**
 * Record a successful query (call after Gemini API returns)
 */
export function recordQuery(): void {
  lastQueryTime = Date.now();
  dailyCount++;
}

/**
 * Get current rate limit status without checking
 */
export function getRateLimitStatus(): {
  daily_used: number;
  daily_remaining: number;
  last_query_ms_ago: number;
} {
  const now = Date.now();
  const today = new Date().toDateString();

  // Reset if new day
  if (today !== lastResetDate) {
    dailyCount = 0;
    lastResetDate = today;
  }

  return {
    daily_used: dailyCount,
    daily_remaining: RATE_LIMITS.REQUESTS_PER_DAY - dailyCount,
    last_query_ms_ago: lastQueryTime > 0 ? now - lastQueryTime : -1,
  };
}

/**
 * Reset rate limits (for testing only)
 */
export function resetRateLimits(): void {
  lastQueryTime = 0;
  dailyCount = 0;
  lastResetDate = new Date().toDateString();
}

/**
 * Create a rate-limited wrapper for async functions
 * @param fn - The async function to wrap
 * @returns Wrapped function that respects rate limits
 */
export function withRateLimit<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const status = checkRateLimit();

    if (!status.allowed) {
      if (status.daily_remaining === 0) {
        throw new Error(
          "Daily API limit reached. Please try again tomorrow."
        );
      }
      throw new Error(
        `Rate limited. Please wait ${Math.ceil(status.wait_ms / 1000)} seconds.`
      );
    }

    try {
      const result = await fn(...args);
      recordQuery();
      return result;
    } catch (error) {
      // Don't count failed requests against limit
      throw error;
    }
  };
}
