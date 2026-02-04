import { describe, it, expect } from "vitest"
import {
  parseDecisionTree,
  safeParseDecisionTree,
  QuestionNodeSchema,
  ResultNodeSchema,
  DecisionTreeSchema,
} from "../schema"

describe("QuestionNodeSchema", () => {
  it("accepts valid question node", () => {
    const node = {
      type: "question",
      text_en: "What is your age?",
      text_kn: "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?",
      options: [
        { label: "Under 18", next: "r_minor" },
        { label: "18-65", next: "q_next" },
        { label: "Over 65", next: "r_senior" },
      ],
    }

    const result = QuestionNodeSchema.safeParse(node)
    expect(result.success).toBe(true)
  })

  it("rejects question with empty text", () => {
    const node = {
      type: "question",
      text_en: "",
      options: [
        { label: "Yes", next: "r1" },
        { label: "No", next: "r2" },
      ],
    }

    const result = QuestionNodeSchema.safeParse(node)
    expect(result.success).toBe(false)
  })

  it("rejects question with less than 2 options", () => {
    const node = {
      type: "question",
      text_en: "Question?",
      options: [{ label: "Only", next: "r1" }],
    }

    const result = QuestionNodeSchema.safeParse(node)
    expect(result.success).toBe(false)
  })

  it("rejects question with more than 6 options", () => {
    const node = {
      type: "question",
      text_en: "Question?",
      options: Array(7)
        .fill(null)
        .map((_, i) => ({ label: `Option ${i}`, next: `r${i}` })),
    }

    const result = QuestionNodeSchema.safeParse(node)
    expect(result.success).toBe(false)
  })

  it("rejects option with empty next reference", () => {
    const node = {
      type: "question",
      text_en: "Question?",
      options: [
        { label: "Yes", next: "" },
        { label: "No", next: "r2" },
      ],
    }

    const result = QuestionNodeSchema.safeParse(node)
    expect(result.success).toBe(false)
  })
})

describe("ResultNodeSchema", () => {
  it("accepts valid result node with all fields", () => {
    const node = {
      type: "result",
      status: "eligible",
      reason_en: "You may be eligible.",
      reason_kn: "ನೀವು ಅರ್ಹರಾಗಬಹುದು.",
      fix_en: "Apply online.",
      fix_kn: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
      next_steps_en: "Visit portal.",
      documents: ["Aadhaar", "Ration Card"],
    }

    const result = ResultNodeSchema.safeParse(node)
    expect(result.success).toBe(true)
  })

  it("accepts minimal result node", () => {
    const node = {
      type: "result",
      status: "ineligible",
      reason_en: "Not eligible.",
    }

    const result = ResultNodeSchema.safeParse(node)
    expect(result.success).toBe(true)
  })

  it("accepts all valid status values", () => {
    const statuses = ["eligible", "ineligible", "needs_review"]

    for (const status of statuses) {
      const node = {
        type: "result",
        status,
        reason_en: "Reason",
      }
      const result = ResultNodeSchema.safeParse(node)
      expect(result.success).toBe(true)
    }
  })

  it("rejects invalid status", () => {
    const node = {
      type: "result",
      status: "definitely_eligible", // Invalid!
      reason_en: "Reason",
    }

    const result = ResultNodeSchema.safeParse(node)
    expect(result.success).toBe(false)
  })

  it("rejects empty reason", () => {
    const node = {
      type: "result",
      status: "eligible",
      reason_en: "",
    }

    const result = ResultNodeSchema.safeParse(node)
    expect(result.success).toBe(false)
  })
})

describe("DecisionTreeSchema", () => {
  it("accepts valid tree", () => {
    const tree = {
      start: "q1",
      nodes: {
        q1: {
          type: "question",
          text_en: "Question?",
          options: [
            { label: "Yes", next: "r1" },
            { label: "No", next: "r2" },
          ],
        },
        r1: { type: "result", status: "eligible", reason_en: "Yes" },
        r2: { type: "result", status: "ineligible", reason_en: "No" },
      },
    }

    const result = DecisionTreeSchema.safeParse(tree)
    expect(result.success).toBe(true)
  })

  it("rejects tree without start", () => {
    const tree = {
      nodes: {
        q1: {
          type: "question",
          text_en: "Question?",
          options: [{ label: "Yes", next: "r1" }],
        },
      },
    }

    const result = DecisionTreeSchema.safeParse(tree)
    expect(result.success).toBe(false)
  })

  it("rejects tree with empty nodes", () => {
    const tree = {
      start: "q1",
      nodes: {},
    }

    const result = DecisionTreeSchema.safeParse(tree)
    expect(result.success).toBe(false)
  })
})

describe("parseDecisionTree", () => {
  it("returns parsed tree for valid input", () => {
    const tree = {
      start: "q1",
      nodes: {
        q1: {
          type: "question",
          text_en: "Q?",
          options: [
            { label: "A", next: "r1" },
            { label: "B", next: "r1" },
          ],
        },
        r1: { type: "result", status: "eligible", reason_en: "Done" },
      },
    }

    const parsed = parseDecisionTree(tree)

    expect(parsed.start).toBe("q1")
    expect(Object.keys(parsed.nodes)).toHaveLength(2)
  })

  it("throws for invalid input", () => {
    expect(() => parseDecisionTree(null)).toThrow()
    expect(() => parseDecisionTree({})).toThrow()
    expect(() => parseDecisionTree({ start: "" })).toThrow()
  })
})

describe("safeParseDecisionTree", () => {
  it("returns success result for valid tree", () => {
    const tree = {
      start: "r1",
      nodes: {
        r1: { type: "result", status: "eligible", reason_en: "Done" },
      },
    }

    const result = safeParseDecisionTree(tree)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.start).toBe("r1")
    }
  })

  it("returns error result for invalid tree", () => {
    const result = safeParseDecisionTree({ invalid: true })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0)
    }
  })
})
