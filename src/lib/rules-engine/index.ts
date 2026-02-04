/**
 * SamGov Rules Engine
 * Eligibility debugger decision tree system
 */

// Types
export type {
  ResultStatus,
  QuestionOption,
  QuestionNode,
  ResultNode,
  DecisionNode,
  DecisionTree,
  DecisionTreeRow,
  UserAnswer,
  WizardState,
  TreeValidationError,
  TreeValidationResult,
} from "./types"

// Schema validation
export {
  QuestionOptionSchema,
  QuestionNodeSchema,
  ResultNodeSchema,
  DecisionNodeSchema,
  DecisionTreeSchema,
  parseDecisionTree,
  safeParseDecisionTree,
} from "./schema"

// Tree validation
export {
  validateDecisionTree,
  isValidDecisionTree,
} from "./validator"

// Tree traversal
export {
  TraversalError,
  initializeWizard,
  getCurrentNode,
  getCurrentQuestion,
  answerQuestion,
  goBack,
  resetWizard,
  getProgress,
  getSessionSummary,
} from "./traverser"
