/**
 * SamGov Rules Engine Types
 * Type definitions for decision tree structures
 */

/**
 * Status of an eligibility check result
 * IMPORTANT: Never use "You ARE eligible" language.
 * - eligible: "You MAY meet basic eligibility criteria"
 * - ineligible: "Based on your answers, you may not meet criteria"
 * - needs_review: "Some criteria need verification"
 */
export type ResultStatus = "eligible" | "ineligible" | "needs_review"

/**
 * An option in a question node
 */
export interface QuestionOption {
  label: string
  label_kn?: string
  next: string // Node ID to navigate to
}

/**
 * A question node in the decision tree
 */
export interface QuestionNode {
  type: "question"
  text_en: string
  text_kn?: string
  options: QuestionOption[]
}

/**
 * A result node (terminal) in the decision tree
 */
export interface ResultNode {
  type: "result"
  status: ResultStatus
  reason_en: string
  reason_kn?: string
  fix_en?: string
  fix_kn?: string
  next_steps_en?: string
  next_steps_kn?: string
  documents?: string[]
}

/**
 * Union type for any node in the tree
 */
export type DecisionNode = QuestionNode | ResultNode

/**
 * The decision tree structure stored in JSONB
 */
export interface DecisionTree {
  start: string // Node ID of the first node
  nodes: Record<string, DecisionNode>
}

/**
 * Database row for a decision tree
 */
export interface DecisionTreeRow {
  id: string
  scheme_id: string
  version: number
  is_active: boolean
  tree: DecisionTree
  created_by?: string
  created_at: string
  updated_at: string
}

/**
 * User's answer to a question
 */
export interface UserAnswer {
  nodeId: string
  optionIndex: number
  optionLabel: string
}

/**
 * State of a wizard session
 */
export interface WizardState {
  schemeId: string
  treeId: string
  currentNodeId: string
  answers: UserAnswer[]
  isComplete: boolean
  result?: ResultNode
}

/**
 * Validation error for decision trees
 */
export interface TreeValidationError {
  code:
    | "MISSING_START"
    | "INVALID_START_REF"
    | "ORPHAN_NODE"
    | "INVALID_NEXT_REF"
    | "NO_TERMINAL"
    | "CYCLE_DETECTED"
    | "EMPTY_OPTIONS"
    | "INVALID_STATUS"
  message: string
  nodeId?: string
  details?: string
}

/**
 * Result of tree validation
 */
export interface TreeValidationResult {
  valid: boolean
  errors: TreeValidationError[]
  warnings: string[]
  stats: {
    totalNodes: number
    questionNodes: number
    resultNodes: number
    maxDepth: number
    allPathsTerminate: boolean
  }
}
