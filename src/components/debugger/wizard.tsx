"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { useDecisionTree } from "@/lib/hooks/use-decision-tree"
import { useWizard } from "@/lib/hooks/use-wizard"
import { ProgressBar } from "./progress-bar"
import { QuestionStep } from "./question-step"
import { ResultStep } from "./result-step"

interface WizardProps {
  schemeSlug: string
  schemeName: string
  className?: string
}

export function Wizard({ schemeSlug, schemeName, className }: WizardProps) {
  const { t, language } = useTranslation()
  const { tree, treeId, schemeId, schemeApplicationUrl, schemeRequiredDocuments, loading, error: treeError } = useDecisionTree(schemeSlug)
  const {
    currentQuestion,
    result,
    progress,
    isComplete,
    error: wizardError,
    answer,
    back,
    reset,
    state,
  } = useWizard(tree, schemeId, treeId)

  // Loading state
  if (loading) {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[400px]", className)}>
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground">{t("loading")}</p>
      </div>
    )
  }

  // Error state - IMPORTANT: Always show errors explicitly
  if (treeError || wizardError) {
    const errorMessage = treeError?.message || wizardError || t("error")

    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-6", className)}>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">{t("error")}</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          {errorMessage}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {t("retry")}
        </button>
      </div>
    )
  }

  // No tree available
  if (!tree) {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-6", className)}>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {language === "kn" ? "ಪರಿಶೀಲನೆ ಲಭ್ಯವಿಲ್ಲ" : "Check Not Available"}
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          {language === "kn"
            ? "ಈ ಯೋಜನೆಗೆ ಅರ್ಹತೆ ಪರಿಶೀಲನೆ ಇನ್ನೂ ಸೆಟಪ್ ಆಗಿಲ್ಲ."
            : "The eligibility check for this scheme is not yet available."}
        </p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Progress Bar */}
      {!isComplete && (
        <ProgressBar
          currentStep={progress.currentStep}
          totalSteps={progress.estimatedTotal}
          percentComplete={progress.percentComplete}
          className="mb-6"
        />
      )}

      {/* Question or Result */}
      <div className="flex-1 flex flex-col">
        {!isComplete && currentQuestion && (
          <QuestionStep
            question={currentQuestion}
            onAnswer={answer}
            onBack={back}
            canGoBack={state?.answers.length ? state.answers.length > 0 : false}
          />
        )}

        {isComplete && result && (
          <ResultStep
            result={result}
            schemeName={schemeName}
            schemeSlug={schemeSlug}
            schemeApplicationUrl={schemeApplicationUrl}
            schemeRequiredDocuments={schemeRequiredDocuments}
            onReset={reset}
          />
        )}
      </div>
    </div>
  )
}
