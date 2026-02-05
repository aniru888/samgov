"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import type { DecisionTree, WizardState, QuestionNode, ResultNode } from "@/lib/rules-engine"
import {
  initializeWizard,
  getCurrentQuestion,
  answerQuestion,
  goBack,
  resetWizard,
  getProgress,
  getSessionSummary,
  TraversalError,
} from "@/lib/rules-engine"

interface UseWizardResult {
  state: WizardState | null
  currentQuestion: QuestionNode | null
  result: ResultNode | null
  progress: { currentStep: number; estimatedTotal: number; percentComplete: number }
  summary: { answers: Array<{ question: string; answer: string }>; result: ResultNode | null }
  isComplete: boolean
  error: string | null
  answer: (optionIndex: number) => void
  back: () => void
  reset: () => void
}

/**
 * Hook to manage wizard state and navigation
 * @param tree - The decision tree
 * @param schemeId - The scheme ID
 * @param treeId - The tree ID
 */
export function useWizard(
  tree: DecisionTree | null,
  schemeId: string | null,
  treeId: string | null
): UseWizardResult {
  const [state, setState] = useState<WizardState | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize wizard when tree becomes available
  // This is an intentional synchronous effect for initialization
  useEffect(() => {
    if (tree && schemeId && treeId && !state) {
      try {
        const initialState = initializeWizard(schemeId, treeId, tree)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(initialState)
        setError(null)
      } catch (err) {
        if (err instanceof TraversalError) {
          setError(err.message)
        } else {
          setError("Failed to initialize wizard")
        }
      }
    }
  }, [tree, schemeId, treeId, state])

  // Get current question (null if at result)
  const currentQuestion = useMemo(() => {
    if (!tree || !state) return null
    try {
      return getCurrentQuestion(tree, state)
    } catch {
      return null
    }
  }, [tree, state])

  // Get progress
  const progress = useMemo(() => {
    if (!tree || !state) {
      return { currentStep: 0, estimatedTotal: 0, percentComplete: 0 }
    }
    return getProgress(tree, state)
  }, [tree, state])

  // Get session summary
  const summary = useMemo(() => {
    if (!tree || !state) {
      return { answers: [], result: null }
    }
    return getSessionSummary(tree, state)
  }, [tree, state])

  // Answer a question
  const answer = useCallback(
    (optionIndex: number) => {
      if (!tree || !state) return

      try {
        const newState = answerQuestion(tree, state, optionIndex)
        setState(newState)
        setError(null)
      } catch (err) {
        if (err instanceof TraversalError) {
          // IMPORTANT: Show errors to the user, never swallow them
          setError(err.message)
        } else {
          setError("An unexpected error occurred")
        }
      }
    },
    [tree, state]
  )

  // Go back to previous question
  const back = useCallback(() => {
    if (!tree || !state) return

    try {
      const newState = goBack(tree, state)
      setState(newState)
      setError(null)
    } catch (err) {
      if (err instanceof TraversalError) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }, [tree, state])

  // Reset wizard
  const reset = useCallback(() => {
    if (!tree || !state) return

    try {
      const newState = resetWizard(tree, state)
      setState(newState)
      setError(null)
    } catch (err) {
      if (err instanceof TraversalError) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }, [tree, state])

  return {
    state,
    currentQuestion,
    result: state?.result ?? null,
    progress,
    summary,
    isComplete: state?.isComplete ?? false,
    error,
    answer,
    back,
    reset,
  }
}
