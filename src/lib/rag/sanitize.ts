/**
 * Query Sanitizer
 * Prevents prompt injection attacks and validates user input
 */

import type { SanitizeResult } from "./types";

/**
 * Maximum allowed query length (characters)
 */
const MAX_QUERY_LENGTH = 500;

/**
 * Minimum query length (characters)
 */
const MIN_QUERY_LENGTH = 3;

/**
 * Patterns that indicate potential prompt injection
 * These patterns attempt to manipulate the AI's behavior
 */
const INJECTION_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /ignore.*(?:previous|above|system|all)/i,
    reason: "Attempt to override system instructions",
  },
  {
    pattern: /disregard.*(?:instructions|rules|guidelines)/i,
    reason: "Attempt to override system instructions",
  },
  {
    pattern: /you are now/i,
    reason: "Attempt to change AI identity",
  },
  {
    pattern: /pretend (?:to be|you're|you are)/i,
    reason: "Attempt to change AI identity",
  },
  {
    pattern: /act as if/i,
    reason: "Attempt to change AI behavior",
  },
  {
    pattern: /new (?:instructions|role|persona)/i,
    reason: "Attempt to inject new instructions",
  },
  {
    pattern: /forget (?:everything|previous|your)/i,
    reason: "Attempt to clear AI context",
  },
  {
    pattern: /(?:system|admin|root) (?:prompt|access|mode)/i,
    reason: "Attempt to access system level",
  },
  {
    pattern: /\[(?:system|assistant|user)\]/i,
    reason: "Attempt to inject role markers",
  },
  {
    pattern: /```(?:system|instruction)/i,
    reason: "Attempt to inject code-formatted instructions",
  },
];

/**
 * Control characters to remove from queries
 */
const CONTROL_CHAR_REGEX = /[\x00-\x1F\x7F]/g;

/**
 * Excessive whitespace pattern
 */
const EXCESSIVE_WHITESPACE_REGEX = /\s{3,}/g;

/**
 * Sanitize a user query for safe RAG processing
 * @param query - Raw user input
 * @returns Sanitization result with cleaned query or block reason
 */
export function sanitizeQuery(query: string): SanitizeResult {
  // Handle null/undefined
  if (!query) {
    return {
      sanitized: "",
      blocked: true,
      reason: "Query cannot be empty",
    };
  }

  // Convert to string if needed
  let clean = String(query);

  // Remove control characters (null bytes, etc.)
  clean = clean.replace(CONTROL_CHAR_REGEX, "");

  // Normalize whitespace
  clean = clean.replace(EXCESSIVE_WHITESPACE_REGEX, " ");

  // Trim
  clean = clean.trim();

  // Check minimum length
  if (clean.length < MIN_QUERY_LENGTH) {
    return {
      sanitized: "",
      blocked: true,
      reason: `Query must be at least ${MIN_QUERY_LENGTH} characters`,
    };
  }

  // Truncate if too long
  if (clean.length > MAX_QUERY_LENGTH) {
    clean = clean.slice(0, MAX_QUERY_LENGTH);
  }

  // Check for injection patterns
  for (const { pattern, reason } of INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        sanitized: "",
        blocked: true,
        reason: `Query blocked: ${reason}`,
      };
    }
  }

  return {
    sanitized: clean,
    blocked: false,
  };
}

/**
 * Check if a query contains only safe characters
 * Allows: letters, numbers, spaces, common punctuation, Kannada script
 */
export function isQuerySafe(query: string): boolean {
  // Allow: alphanumeric, spaces, common punctuation, Kannada Unicode range
  const safePattern = /^[\p{L}\p{N}\p{P}\p{Z}\u0C80-\u0CFF]+$/u;
  return safePattern.test(query);
}

/**
 * Extract keywords from a query for logging/analytics
 * (Does not return the full query to protect privacy)
 */
export function extractQueryKeywords(query: string): string[] {
  // Common scheme-related keywords
  const keywords = [
    "eligible",
    "eligibility",
    "apply",
    "application",
    "document",
    "income",
    "age",
    "ration card",
    "aadhar",
    "bank",
    "deadline",
    "benefit",
    "amount",
    "scheme",
    // Scheme names
    "gruha lakshmi",
    "anna bhagya",
    "shakti",
    "yuva nidhi",
    "vidyasiri",
    "bhagya lakshmi",
    "sandhya suraksha",
    "raitha shakti",
  ];

  const lowerQuery = query.toLowerCase();
  return keywords.filter((kw) => lowerQuery.includes(kw));
}

/**
 * Sanitize query for logging (remove PII)
 * @param query - User query
 * @returns Redacted query safe for logging
 */
export function sanitizeForLogging(query: string): string {
  let redacted = query;

  // Redact potential Aadhaar numbers (12 digits)
  redacted = redacted.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[AADHAAR]");

  // Redact potential phone numbers (10 digits)
  redacted = redacted.replace(/\b\d{10}\b/g, "[PHONE]");

  // Redact email addresses
  redacted = redacted.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    "[EMAIL]"
  );

  // Redact potential account numbers (long digit sequences)
  redacted = redacted.replace(/\b\d{8,}\b/g, "[ACCOUNT]");

  // Truncate for logs
  if (redacted.length > 100) {
    redacted = redacted.slice(0, 100) + "...";
  }

  return redacted;
}
