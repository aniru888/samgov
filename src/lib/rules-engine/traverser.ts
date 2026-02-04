/**
 * SamGov Rules Engine Traverser
 * Step-by-step navigation through decision trees
 *
 * IMPORTANT: This is used by the debugger wizard.
 * Errors here will break the user experience.
 */

import type {
  DecisionTree,
  DecisionNode,
  QuestionNode,
  ResultNode,
  UserAnswer,
  WizardState,
} from "./types"
import { isValidDecisionTree } from "./validator"

/**
 * Error thrown when tree traversal fails
 * These errors should NEVER be silently swallowed.
 */
export class TraversalError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly nodeId?: string
  ) {
    super(message)
    this.name = "TraversalError"
  }
}

/**
 * Initialize a new wizard session
 * @throws TraversalError if tree is invalid
 */
export function initializeWizard(
  schemeId: string,
  treeId: string,
  tree: DecisionTree
): WizardState {
  // Validate tree before use - NEVER skip this
  if (!isValidDecisionTree(tree)) {
    throw new TraversalError(
      "Cannot initialize wizard with invalid decision tree",
      "INVALID_TREE"
    )
  }

  const startNode = tree.nodes[tree.start]
  if (!startNode) {
    throw new TraversalError(
      `Start node '${tree.start}' not found`,
      "MISSING_START_NODE",
      tree.start
    )
  }

  const isComplete = startNode.type === "result"

  return {
    schemeId,
    treeId,
    currentNodeId: tree.start,
    answers: [],
    isComplete,
    result: isComplete ? (startNode as ResultNode) : undefined,
  }
}

/**
 * Get the current node from the tree
 * @throws TraversalError if node not found
 */
export function getCurrentNode(
  tree: DecisionTree,
  state: WizardState
): DecisionNode {
  const node = tree.nodes[state.currentNodeId]
  if (!node) {
    throw new TraversalError(
      `Current node '${state.currentNodeId}' not found in tree`,
      "NODE_NOT_FOUND",
      state.currentNodeId
    )
  }
  return node
}

/**
 * Get current node if it's a question, null if result
 */
export function getCurrentQuestion(
  tree: DecisionTree,
  state: WizardState
): QuestionNode | null {
  const node = getCurrentNode(tree, state)
  return node.type === "question" ? node : null
}

/**
 * Answer the current question and advance to next node
 * @throws TraversalError if answer is invalid or state is already complete
 */
export function answerQuestion(
  tree: DecisionTree,
  state: WizardState,
  optionIndex: number
): WizardState {
  if (state.isComplete) {
    throw new TraversalError(
      "Cannot answer question - wizard is already complete",
      "ALREADY_COMPLETE"
    )
  }

  const currentNode = getCurrentNode(tree, state)

  if (currentNode.type !== "question") {
    throw new TraversalError(
      "Cannot answer - current node is not a question",
      "NOT_A_QUESTION",
      state.currentNodeId
    )
  }

  if (optionIndex < 0 || optionIndex >= currentNode.options.length) {
    throw new TraversalError(
      `Invalid option index: ${optionIndex}. Expected 0-${currentNode.options.length - 1}`,
      "INVALID_OPTION_INDEX",
      state.currentNodeId
    )
  }

  const selectedOption = currentNode.options[optionIndex]
  const nextNodeId = selectedOption.next

  const nextNode = tree.nodes[nextNodeId]
  if (!nextNode) {
    throw new TraversalError(
      `Next node '${nextNodeId}' not found in tree`,
      "NEXT_NODE_NOT_FOUND",
      nextNodeId
    )
  }

  const answer: UserAnswer = {
    nodeId: state.currentNodeId,
    optionIndex,
    optionLabel: selectedOption.label,
  }

  const isComplete = nextNode.type === "result"

  return {
    ...state,
    currentNodeId: nextNodeId,
    answers: [...state.answers, answer],
    isComplete,
    result: isComplete ? (nextNode as ResultNode) : undefined,
  }
}

/**
 * Go back to the previous question
 * @throws TraversalError if at start
 */
export function goBack(
  tree: DecisionTree,
  state: WizardState
): WizardState {
  if (state.answers.length === 0) {
    throw new TraversalError(
      "Cannot go back - already at first question",
      "AT_START"
    )
  }

  const newAnswers = [...state.answers]
  const lastAnswer = newAnswers.pop()!

  return {
    ...state,
    currentNodeId: lastAnswer.nodeId,
    answers: newAnswers,
    isComplete: false,
    result: undefined,
  }
}

/**
 * Reset wizard to the beginning
 */
export function resetWizard(
  tree: DecisionTree,
  state: WizardState
): WizardState {
  return initializeWizard(state.schemeId, state.treeId, tree)
}

/**
 * Get progress information
 */
export function getProgress(
  tree: DecisionTree,
  state: WizardState
): {
  currentStep: number
  estimatedTotal: number
  percentComplete: number
} {
  const currentStep = state.answers.length + 1

  // Estimate total by finding the longest path from current node
  let maxRemainingDepth = 0

  function findMaxDepth(nodeId: string, depth: number, visited: Set<string>): number {
    if (visited.has(nodeId)) return depth
    visited.add(nodeId)

    const node = tree.nodes[nodeId]
    if (!node || node.type === "result") return depth

    let maxChildDepth = depth
    for (const option of node.options) {
      const childDepth = findMaxDepth(option.next, depth + 1, new Set(visited))
      maxChildDepth = Math.max(maxChildDepth, childDepth)
    }

    return maxChildDepth
  }

  if (!state.isComplete) {
    maxRemainingDepth = findMaxDepth(state.currentNodeId, 0, new Set())
  }

  const estimatedTotal = currentStep + maxRemainingDepth
  const percentComplete = state.isComplete
    ? 100
    : Math.round((currentStep / estimatedTotal) * 100)

  return {
    currentStep,
    estimatedTotal,
    percentComplete,
  }
}

/**
 * Get a summary of the wizard session
 */
export function getSessionSummary(
  tree: DecisionTree,
  state: WizardState
): {
  answers: Array<{ question: string; answer: string }>
  result: ResultNode | null
} {
  const answers = state.answers.map((answer) => {
    const node = tree.nodes[answer.nodeId] as QuestionNode
    return {
      question: node.text_en,
      answer: answer.optionLabel,
    }
  })

  return {
    answers,
    result: state.result ?? null,
  }
}
