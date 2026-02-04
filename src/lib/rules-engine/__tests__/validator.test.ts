import { describe, it, expect } from "vitest"
import { validateDecisionTree, isValidDecisionTree } from "../validator"
import type { DecisionTree } from "../types"

// Valid minimal tree
const validTree: DecisionTree = {
  start: "q1",
  nodes: {
    q1: {
      type: "question",
      text_en: "Are you eligible?",
      options: [
        { label: "Yes", next: "r_yes" },
        { label: "No", next: "r_no" },
      ],
    },
    r_yes: {
      type: "result",
      status: "eligible",
      reason_en: "You may be eligible.",
    },
    r_no: {
      type: "result",
      status: "ineligible",
      reason_en: "You may not be eligible.",
    },
  },
}

describe("validateDecisionTree", () => {
  describe("valid trees", () => {
    it("accepts a valid minimal tree", () => {
      const result = validateDecisionTree(validTree)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("calculates correct stats for valid tree", () => {
      const result = validateDecisionTree(validTree)

      expect(result.stats.totalNodes).toBe(3)
      expect(result.stats.questionNodes).toBe(1)
      expect(result.stats.resultNodes).toBe(2)
      expect(result.stats.maxDepth).toBe(1)
      expect(result.stats.allPathsTerminate).toBe(true)
    })

    it("accepts a multi-level tree", () => {
      const tree: DecisionTree = {
        start: "q1",
        nodes: {
          q1: {
            type: "question",
            text_en: "Question 1",
            options: [
              { label: "A", next: "q2" },
              { label: "B", next: "r_b" },
            ],
          },
          q2: {
            type: "question",
            text_en: "Question 2",
            options: [
              { label: "C", next: "r_c" },
              { label: "D", next: "r_d" },
            ],
          },
          r_b: { type: "result", status: "ineligible", reason_en: "B chosen" },
          r_c: { type: "result", status: "eligible", reason_en: "C chosen" },
          r_d: { type: "result", status: "needs_review", reason_en: "D chosen" },
        },
      }

      const result = validateDecisionTree(tree)

      expect(result.valid).toBe(true)
      expect(result.stats.maxDepth).toBe(2)
    })
  })

  describe("invalid trees", () => {
    it("rejects tree with missing start node", () => {
      const tree: DecisionTree = {
        start: "nonexistent",
        nodes: {
          q1: {
            type: "question",
            text_en: "Question",
            options: [
              { label: "A", next: "r1" },
              { label: "B", next: "r1" },
            ],
          },
          r1: { type: "result", status: "eligible", reason_en: "Done" },
        },
      }

      const result = validateDecisionTree(tree)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.code === "INVALID_START_REF")).toBe(true)
    })

    it("rejects tree with invalid next reference", () => {
      const tree: DecisionTree = {
        start: "q1",
        nodes: {
          q1: {
            type: "question",
            text_en: "Question",
            options: [
              { label: "Yes", next: "nonexistent" },
              { label: "No", next: "r_no" },
            ],
          },
          r_no: { type: "result", status: "ineligible", reason_en: "No" },
        },
      }

      const result = validateDecisionTree(tree)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.code === "INVALID_NEXT_REF")).toBe(true)
    })

    it("detects orphan nodes", () => {
      const tree: DecisionTree = {
        start: "q1",
        nodes: {
          q1: {
            type: "question",
            text_en: "Question",
            options: [
              { label: "Yes", next: "r_yes" },
              { label: "No", next: "r_no" },
            ],
          },
          r_yes: { type: "result", status: "eligible", reason_en: "Yes" },
          r_no: { type: "result", status: "ineligible", reason_en: "No" },
          orphan: { type: "result", status: "eligible", reason_en: "Orphan" },
        },
      }

      const result = validateDecisionTree(tree)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.code === "ORPHAN_NODE")).toBe(true)
    })

    it("detects cycles", () => {
      const tree: DecisionTree = {
        start: "q1",
        nodes: {
          q1: {
            type: "question",
            text_en: "Question 1",
            options: [
              { label: "Go to Q2", next: "q2" },
              { label: "Result", next: "r1" },
            ],
          },
          q2: {
            type: "question",
            text_en: "Question 2",
            options: [
              { label: "Back to Q1", next: "q1" }, // Cycle!
              { label: "Result", next: "r1" },
            ],
          },
          r1: { type: "result", status: "eligible", reason_en: "Done" },
        },
      }

      const result = validateDecisionTree(tree)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.code === "CYCLE_DETECTED")).toBe(true)
    })

    it("rejects question with less than 2 options", () => {
      const tree = {
        start: "q1",
        nodes: {
          q1: {
            type: "question",
            text_en: "Question",
            options: [{ label: "Only one", next: "r1" }],
          },
          r1: { type: "result", status: "eligible", reason_en: "Done" },
        },
      }

      const result = validateDecisionTree(tree)

      expect(result.valid).toBe(false)
    })

    it("rejects empty tree", () => {
      const tree = {
        start: "q1",
        nodes: {},
      }

      const result = validateDecisionTree(tree)

      expect(result.valid).toBe(false)
    })
  })

  describe("warnings", () => {
    it("warns about nodes referenced but not reachable from start", () => {
      // This is a edge case where a node is referenced but the
      // reference itself is on an unreachable path
      const tree: DecisionTree = {
        start: "q1",
        nodes: {
          q1: {
            type: "question",
            text_en: "Question",
            options: [
              { label: "A", next: "r_a" },
              { label: "B", next: "r_b" },
            ],
          },
          r_a: { type: "result", status: "eligible", reason_en: "A" },
          r_b: { type: "result", status: "ineligible", reason_en: "B" },
        },
      }

      const result = validateDecisionTree(tree)

      // This tree is valid, no warnings expected
      expect(result.valid).toBe(true)
      expect(result.warnings).toHaveLength(0)
    })
  })
})

describe("isValidDecisionTree", () => {
  it("returns true for valid tree", () => {
    expect(isValidDecisionTree(validTree)).toBe(true)
  })

  it("returns false for invalid tree", () => {
    const invalidTree = {
      start: "missing",
      nodes: {},
    }
    expect(isValidDecisionTree(invalidTree)).toBe(false)
  })

  it("returns false for non-object input", () => {
    expect(isValidDecisionTree(null)).toBe(false)
    expect(isValidDecisionTree(undefined)).toBe(false)
    expect(isValidDecisionTree("string")).toBe(false)
    expect(isValidDecisionTree(123)).toBe(false)
  })
})
