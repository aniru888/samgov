import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

interface CompletionPayload {
  schemeId: string
  treeId: string
  resultStatus: "eligible" | "ineligible" | "needs_review"
  terminalNodeId: string
  answerPath: Array<{ nodeId: string; optionLabel: string }>
  answerCount: number
  language: "en" | "kn"
}

const VALID_STATUSES = new Set(["eligible", "ineligible", "needs_review"])
const VALID_LANGUAGES = new Set(["en", "kn"])

/**
 * POST /api/completions
 * Records anonymous wizard completion for analytics.
 * Zero PII - only stores decision path and outcome.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CompletionPayload

    // Validate required fields
    if (
      !body.schemeId ||
      !body.treeId ||
      !body.resultStatus ||
      !body.terminalNodeId ||
      !VALID_STATUSES.has(body.resultStatus) ||
      !VALID_LANGUAGES.has(body.language || "en")
    ) {
      return NextResponse.json(
        { error: "Invalid completion data" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { error } = await supabase.from("wizard_completions").insert({
      scheme_id: body.schemeId,
      tree_id: body.treeId,
      result_status: body.resultStatus,
      terminal_node_id: body.terminalNodeId,
      answer_path: body.answerPath || [],
      answer_count: body.answerCount || 0,
      language: body.language || "en",
    })

    if (error) {
      console.error("Failed to record completion:", error)
      // Don't fail the user experience for analytics
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch {
    // Analytics should never break the user experience
    return NextResponse.json({ ok: true })
  }
}
