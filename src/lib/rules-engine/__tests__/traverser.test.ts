import { describe, it, expect } from "vitest"
import {
  initializeWizard,
  getCurrentNode,
  getCurrentQuestion,
  answerQuestion,
  goBack,
  resetWizard,
  getProgress,
  getSessionSummary,
  TraversalError,
} from "../traverser"
import type { DecisionTree, WizardState } from "../types"

// Test tree
const testTree: DecisionTree = {
  start: "q1",
  nodes: {
    q1: {
      type: "question",
      text_en: "Are you a resident?",
      options: [
        { label: "Yes", next: "q2" },
        { label: "No", next: "r_not_resident" },
      ],
    },
    q2: {
      type: "question",
      text_en: "Do you have documents?",
      options: [
        { label: "Yes", next: "r_eligible" },
        { label: "No", next: "r_no_docs" },
      ],
    },
    r_not_resident: {
      type: "result",
      status: "ineligible",
      reason_en: "Must be a resident.",
    },
    r_eligible: {
      type: "result",
      status: "eligible",
      reason_en: "You may be eligible.",
    },
    r_no_docs: {
      type: "result",
      status: "needs_review",
      reason_en: "Documents needed.",
      fix_en: "Please gather required documents.",
    },
  },
}

describe("initializeWizard", () => {
  it("creates initial wizard state", () => {
    const state = initializeWizard("scheme-1", "tree-1", testTree)

    expect(state.schemeId).toBe("scheme-1")
    expect(state.treeId).toBe("tree-1")
    expect(state.currentNodeId).toBe("q1")
    expect(state.answers).toHaveLength(0)
    expect(state.isComplete).toBe(false)
    expect(state.result).toBeUndefined()
  })

  it("throws for invalid tree", () => {
    const invalidTree = { start: "missing", nodes: {} }

    expect(() => initializeWizard("s", "t", invalidTree as DecisionTree)).toThrow(
      TraversalError
    )
  })

  it("handles tree that starts with result node", () => {
    const resultOnlyTree: DecisionTree = {
      start: "r1",
      nodes: {
        r1: {
          type: "result",
          status: "eligible",
          reason_en: "Direct result",
        },
      },
    }

    const state = initializeWizard("s", "t", resultOnlyTree)

    expect(state.isComplete).toBe(true)
    expect(state.result).toBeDefined()
    expect(state.result?.status).toBe("eligible")
  })
})

describe("getCurrentNode", () => {
  it("returns current node", () => {
    const state = initializeWizard("s", "t", testTree)
    const node = getCurrentNode(testTree, state)

    expect(node.type).toBe("question")
    if (node.type === "question") {
      expect(node.text_en).toBe("Are you a resident?")
    }
  })

  it("throws for invalid node ID", () => {
    const state: WizardState = {
      schemeId: "s",
      treeId: "t",
      currentNodeId: "nonexistent",
      answers: [],
      isComplete: false,
    }

    expect(() => getCurrentNode(testTree, state)).toThrow(TraversalError)
  })
})

describe("getCurrentQuestion", () => {
  it("returns question node", () => {
    const state = initializeWizard("s", "t", testTree)
    const question = getCurrentQuestion(testTree, state)

    expect(question).not.toBeNull()
    expect(question?.text_en).toBe("Are you a resident?")
    expect(question?.options).toHaveLength(2)
  })

  it("returns null for result node", () => {
    const resultNode = testTree.nodes["r_eligible"]
    const state: WizardState = {
      schemeId: "s",
      treeId: "t",
      currentNodeId: "r_eligible",
      answers: [],
      isComplete: true,
      result: resultNode.type === "result" ? resultNode : undefined,
    }

    const question = getCurrentQuestion(testTree, state)

    expect(question).toBeNull()
  })
})

describe("answerQuestion", () => {
  it("advances to next node on valid answer", () => {
    const state = initializeWizard("s", "t", testTree)
    const newState = answerQuestion(testTree, state, 0) // Yes -> q2

    expect(newState.currentNodeId).toBe("q2")
    expect(newState.answers).toHaveLength(1)
    expect(newState.answers[0]).toEqual({
      nodeId: "q1",
      optionIndex: 0,
      optionLabel: "Yes",
    })
    expect(newState.isComplete).toBe(false)
  })

  it("reaches result node and marks complete", () => {
    let state = initializeWizard("s", "t", testTree)
    state = answerQuestion(testTree, state, 1) // No -> r_not_resident

    expect(state.currentNodeId).toBe("r_not_resident")
    expect(state.isComplete).toBe(true)
    expect(state.result).toBeDefined()
    expect(state.result?.status).toBe("ineligible")
  })

  it("throws for invalid option index", () => {
    const state = initializeWizard("s", "t", testTree)

    expect(() => answerQuestion(testTree, state, -1)).toThrow(TraversalError)
    expect(() => answerQuestion(testTree, state, 99)).toThrow(TraversalError)
  })

  it("throws when already complete", () => {
    let state = initializeWizard("s", "t", testTree)
    state = answerQuestion(testTree, state, 1) // Complete

    expect(() => answerQuestion(testTree, state, 0)).toThrow(TraversalError)
  })
})

describe("goBack", () => {
  it("returns to previous question", () => {
    let state = initializeWizard("s", "t", testTree)
    state = answerQuestion(testTree, state, 0) // Go to q2

    expect(state.currentNodeId).toBe("q2")

    const backState = goBack(testTree, state)

    expect(backState.currentNodeId).toBe("q1")
    expect(backState.answers).toHaveLength(0)
    expect(backState.isComplete).toBe(false)
  })

  it("can go back from result", () => {
    let state = initializeWizard("s", "t", testTree)
    state = answerQuestion(testTree, state, 1) // r_not_resident

    expect(state.isComplete).toBe(true)

    const backState = goBack(testTree, state)

    expect(backState.currentNodeId).toBe("q1")
    expect(backState.isComplete).toBe(false)
    expect(backState.result).toBeUndefined()
  })

  it("throws when at start", () => {
    const state = initializeWizard("s", "t", testTree)

    expect(() => goBack(testTree, state)).toThrow(TraversalError)
  })
})

describe("resetWizard", () => {
  it("resets to initial state", () => {
    let state = initializeWizard("s", "t", testTree)
    state = answerQuestion(testTree, state, 0)
    state = answerQuestion(testTree, state, 0)

    expect(state.isComplete).toBe(true)

    const resetState = resetWizard(testTree, state)

    expect(resetState.currentNodeId).toBe("q1")
    expect(resetState.answers).toHaveLength(0)
    expect(resetState.isComplete).toBe(false)
    expect(resetState.result).toBeUndefined()
  })

  it("preserves scheme and tree IDs", () => {
    let state = initializeWizard("my-scheme", "my-tree", testTree)
    state = answerQuestion(testTree, state, 0)

    const resetState = resetWizard(testTree, state)

    expect(resetState.schemeId).toBe("my-scheme")
    expect(resetState.treeId).toBe("my-tree")
  })
})

describe("getProgress", () => {
  it("calculates progress at start", () => {
    const state = initializeWizard("s", "t", testTree)
    const progress = getProgress(testTree, state)

    expect(progress.currentStep).toBe(1)
    expect(progress.estimatedTotal).toBeGreaterThanOrEqual(1)
    expect(progress.percentComplete).toBeGreaterThan(0)
    expect(progress.percentComplete).toBeLessThan(100)
  })

  it("shows 100% when complete", () => {
    let state = initializeWizard("s", "t", testTree)
    state = answerQuestion(testTree, state, 1)

    const progress = getProgress(testTree, state)

    expect(progress.percentComplete).toBe(100)
  })

  it("increases progress as questions are answered", () => {
    let state = initializeWizard("s", "t", testTree)
    const progress1 = getProgress(testTree, state)

    state = answerQuestion(testTree, state, 0)
    const progress2 = getProgress(testTree, state)

    expect(progress2.currentStep).toBeGreaterThan(progress1.currentStep)
  })
})

describe("getSessionSummary", () => {
  it("returns answered questions and result", () => {
    let state = initializeWizard("s", "t", testTree)
    state = answerQuestion(testTree, state, 0) // Yes to resident
    state = answerQuestion(testTree, state, 0) // Yes to docs

    const summary = getSessionSummary(testTree, state)

    expect(summary.answers).toHaveLength(2)
    expect(summary.answers[0].question).toBe("Are you a resident?")
    expect(summary.answers[0].answer).toBe("Yes")
    expect(summary.result).not.toBeNull()
    expect(summary.result?.status).toBe("eligible")
  })

  it("returns null result when incomplete", () => {
    const state = initializeWizard("s", "t", testTree)
    const summary = getSessionSummary(testTree, state)

    expect(summary.answers).toHaveLength(0)
    expect(summary.result).toBeNull()
  })
})
