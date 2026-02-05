/**
 * API Quota Tracker
 * Tracks usage of Cohere, LlamaParse, and Gemini APIs against free tier limits.
 * Persists in Supabase `api_usage` table.
 *
 * Limits:
 * - Cohere: 1,000 calls/month (shared across all endpoints)
 * - LlamaParse: 10,000 credits/month
 * - Gemini: 20 RPD worst case (reserved for Q&A, not used for ingestion)
 */

import { createAdminClient } from "../../supabase/admin";

/**
 * Service identifiers matching api_usage.service column
 */
export type ApiService = "cohere" | "llamaparse" | "gemini";

/**
 * Free tier limits per service
 */
const SERVICE_LIMITS: Record<ApiService, { monthly: number; warning_pct: number }> = {
  cohere: { monthly: 1000, warning_pct: 0.8 },
  llamaparse: { monthly: 10000, warning_pct: 0.8 },
  gemini: { monthly: 600, warning_pct: 0.8 }, // 20 RPD * 30 days
};

/**
 * Quota check result
 */
export interface QuotaStatus {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  warning: boolean;
  message?: string;
}

/**
 * Get current month string in YYYY-MM format
 */
function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Check if a service has remaining quota for this month
 */
export async function checkQuota(service: ApiService): Promise<QuotaStatus> {
  const admin = createAdminClient();
  const month = getCurrentMonth();
  const limit = SERVICE_LIMITS[service];

  const { data, error } = await admin
    .from("api_usage")
    .select("units_used")
    .eq("service", service)
    .eq("month", month);

  if (error) {
    console.error(`Failed to check ${service} quota:`, error.message);
    // Fail open - allow the request but log the error
    return {
      allowed: true,
      used: 0,
      limit: limit.monthly,
      remaining: limit.monthly,
      warning: false,
      message: `Quota check failed: ${error.message}. Proceeding cautiously.`,
    };
  }

  const used = (data || []).reduce((sum, row) => sum + (row.units_used || 0), 0);
  const remaining = Math.max(0, limit.monthly - used);
  const warning = used >= limit.monthly * limit.warning_pct;

  if (remaining <= 0) {
    return {
      allowed: false,
      used,
      limit: limit.monthly,
      remaining: 0,
      warning: true,
      message: `${service} monthly quota exhausted (${used}/${limit.monthly}). Resets next month.`,
    };
  }

  return {
    allowed: true,
    used,
    limit: limit.monthly,
    remaining,
    warning,
    message: warning
      ? `${service} quota at ${Math.round((used / limit.monthly) * 100)}% (${used}/${limit.monthly}).`
      : undefined,
  };
}

/**
 * Record API usage
 */
export async function recordUsage(
  service: ApiService,
  usageType: string,
  units: number = 1,
  metadata?: Record<string, unknown>
): Promise<void> {
  const admin = createAdminClient();
  const month = getCurrentMonth();

  const { error } = await admin.from("api_usage").insert({
    service,
    usage_type: usageType,
    units_used: units,
    month,
    metadata: metadata || {},
  });

  if (error) {
    // Log but don't throw - usage tracking failure shouldn't block operations
    console.error(`Failed to record ${service} usage:`, error.message);
  }
}

/**
 * Get monthly usage summary for all services
 */
export async function getMonthlyUsage(): Promise<
  Record<ApiService, { used: number; limit: number; pct: number }>
> {
  const admin = createAdminClient();
  const month = getCurrentMonth();

  const { data, error } = await admin
    .from("api_usage")
    .select("service, units_used")
    .eq("month", month);

  if (error) {
    console.error("Failed to get monthly usage:", error.message);
    return {
      cohere: { used: 0, limit: 1000, pct: 0 },
      llamaparse: { used: 0, limit: 10000, pct: 0 },
      gemini: { used: 0, limit: 600, pct: 0 },
    };
  }

  const usage: Record<string, number> = {};
  for (const row of data || []) {
    usage[row.service] = (usage[row.service] || 0) + (row.units_used || 0);
  }

  const result: Record<ApiService, { used: number; limit: number; pct: number }> = {
    cohere: { used: 0, limit: 1000, pct: 0 },
    llamaparse: { used: 0, limit: 10000, pct: 0 },
    gemini: { used: 0, limit: 600, pct: 0 },
  };

  for (const service of ["cohere", "llamaparse", "gemini"] as ApiService[]) {
    const used = usage[service] || 0;
    const limit = SERVICE_LIMITS[service].monthly;
    result[service] = {
      used,
      limit,
      pct: Math.round((used / limit) * 100),
    };
  }

  return result;
}
