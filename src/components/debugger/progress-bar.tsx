"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  percentComplete: number
  className?: string
}

export function ProgressBar({
  currentStep,
  totalSteps,
  percentComplete,
  className,
}: ProgressBarProps) {
  const { language } = useTranslation()

  const stepText =
    language === "kn"
      ? `ಹಂತ ${currentStep} / ${totalSteps}`
      : `Step ${currentStep} of ${totalSteps}`

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {stepText}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {percentComplete}%
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentComplete}%` }}
          role="progressbar"
          aria-valuenow={percentComplete}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={stepText}
        />
      </div>
    </div>
  )
}
