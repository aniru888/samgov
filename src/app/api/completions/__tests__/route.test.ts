import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

// Mock Supabase admin client
const mockInsert = vi.fn()
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      insert: mockInsert,
    }),
  }),
}))

// Import after mocks
import { POST } from "../route"

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

const validPayload = {
  schemeId: "123e4567-e89b-12d3-a456-426614174000",
  treeId: "223e4567-e89b-12d3-a456-426614174000",
  resultStatus: "eligible" as const,
  terminalNodeId: "result_eligible_1",
  answerPath: [
    { nodeId: "q1", optionLabel: "Yes" },
    { nodeId: "q2", optionLabel: "No" },
  ],
  answerCount: 2,
  language: "en" as const,
}

describe("POST /api/completions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
  })

  it("records valid completion and returns ok", async () => {
    const res = await POST(makeRequest(validPayload))
    const json = await res.json()

    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalledWith({
      scheme_id: validPayload.schemeId,
      tree_id: validPayload.treeId,
      result_status: "eligible",
      terminal_node_id: "result_eligible_1",
      answer_path: validPayload.answerPath,
      answer_count: 2,
      language: "en",
    })
  })

  it("accepts ineligible status", async () => {
    const res = await POST(makeRequest({ ...validPayload, resultStatus: "ineligible" }))
    const json = await res.json()
    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalled()
  })

  it("accepts needs_review status", async () => {
    const res = await POST(makeRequest({ ...validPayload, resultStatus: "needs_review" }))
    const json = await res.json()
    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalled()
  })

  it("accepts Kannada language", async () => {
    const res = await POST(makeRequest({ ...validPayload, language: "kn" }))
    const json = await res.json()
    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ language: "kn" })
    )
  })

  it("defaults language to en when not provided", async () => {
    const { language: _, ...noLang } = validPayload
    const res = await POST(makeRequest(noLang))
    const json = await res.json()
    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ language: "en" })
    )
  })

  it("rejects missing schemeId", async () => {
    const { schemeId: _, ...payload } = validPayload
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe("Invalid completion data")
  })

  it("rejects missing treeId", async () => {
    const { treeId: _, ...payload } = validPayload
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(400)
  })

  it("rejects missing resultStatus", async () => {
    const { resultStatus: _, ...payload } = validPayload
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(400)
  })

  it("rejects missing terminalNodeId", async () => {
    const { terminalNodeId: _, ...payload } = validPayload
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(400)
  })

  it("rejects invalid resultStatus", async () => {
    const res = await POST(makeRequest({ ...validPayload, resultStatus: "approved" }))
    expect(res.status).toBe(400)
  })

  it("rejects invalid language", async () => {
    const res = await POST(makeRequest({ ...validPayload, language: "hi" }))
    expect(res.status).toBe(400)
  })

  it("returns ok even when database insert fails (analytics never breaks UX)", async () => {
    mockInsert.mockResolvedValue({ error: { message: "DB connection failed" } })
    const res = await POST(makeRequest(validPayload))
    const json = await res.json()
    expect(json).toEqual({ ok: true })
  })

  it("returns ok on malformed JSON (analytics never breaks UX)", async () => {
    const badReq = new NextRequest("http://localhost:3000/api/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    })
    const res = await POST(badReq)
    const json = await res.json()
    expect(json).toEqual({ ok: true })
  })

  it("defaults answerPath to empty array when not provided", async () => {
    const { answerPath: _, ...payload } = validPayload
    const res = await POST(makeRequest(payload))
    const json = await res.json()
    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ answer_path: [] })
    )
  })

  it("defaults answerCount to 0 when not provided", async () => {
    const { answerCount: _, ...payload } = validPayload
    const res = await POST(makeRequest(payload))
    const json = await res.json()
    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ answer_count: 0 })
    )
  })
})
