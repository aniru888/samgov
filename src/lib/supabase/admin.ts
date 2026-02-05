import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using service role key
 * ⚠️ SERVER-SIDE ONLY - Never expose to client
 *
 * Use this for:
 * - RPC calls (hybrid_search, find_cached_response)
 * - Admin operations (document uploads, cache management)
 * - Bypassing RLS for server-side operations
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL not configured");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY not configured. " +
      "Get it from Supabase Dashboard > Settings > API > service_role key"
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Type-safe admin client type for use in function signatures
 */
export type AdminClient = ReturnType<typeof createAdminClient>;
