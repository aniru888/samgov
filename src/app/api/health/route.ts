import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {
    api: "ok",
    database: "error",
  };

  // Check database connection
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("schemes").select("id").limit(1);
    if (!error) {
      checks.database = "ok";
    }
  } catch {
    checks.database = "error";
  }

  const allHealthy = Object.values(checks).every((status) => status === "ok");

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    {
      status: allHealthy ? 200 : 503,
    }
  );
}
