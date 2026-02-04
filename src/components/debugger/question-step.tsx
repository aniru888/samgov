"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import type { QuestionNode } from "@/lib/rules-engine"

interface QuestionStepProps {
  question: QuestionNode
  onAnswer: (optionIndex: number) => void
  onBack: () => void
  canGoBack: boolean
  className?: string
}

export function QuestionStep({
  question,
  onAnswer,
  onBack,
  canGoBack,
  className,
}: QuestionStepProps) {
  const { t, language } = useTranslation()
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)

  // Get localized text
  const questionText = language === "kn" && question.text_kn
    ? question.text_kn
    : question.text_en

  const handleSubmit = () => {
    if (selectedIndex !== null) {
      onAnswer(selectedIndex)
      setSelectedIndex(null) // Reset for next question
    }
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Question */}
      <h2 className="text-xl font-semibold text-foreground mb-6 leading-relaxed">
        {questionText}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          const optionText = language === "kn" && option.label_kn
            ? option.label_kn
            : option.label
          const isSelected = selectedIndex === index

          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "w-full p-4 text-left rounded-xl border-2 transition-all",
                "touch-target-comfortable",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
              )}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-base font-medium">{optionText}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-auto">
        {canGoBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-14"
          >
            {t("back")}
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={selectedIndex === null}
          className={cn("h-14", canGoBack ? "flex-1" : "w-full")}
        >
          {t("next")}
        </Button>
      </div>
    </div>
  )
}
