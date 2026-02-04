"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import { disclaimer } from "@/lib/design-system"
import type { ResultNode, ResultStatus } from "@/lib/rules-engine"

interface ResultStepProps {
  result: ResultNode
  schemeName: string
  schemeSlug: string
  onReset: () => void
  className?: string
}

// Status colors and icons
const statusConfig: Record<
  ResultStatus,
  { icon: React.ReactNode; bgColor: string; textColor: string; borderColor: string }
> = {
  eligible: {
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-200",
  },
  needs_review: {
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
  },
  ineligible: {
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
  },
}

export function ResultStep({
  result,
  schemeName,
  schemeSlug,
  onReset,
  className,
}: ResultStepProps) {
  const { t, language } = useTranslation()
  const config = statusConfig[result.status]

  // Get localized text
  const reasonText = language === "kn" && result.reason_kn
    ? result.reason_kn
    : result.reason_en

  const fixText = language === "kn" && result.fix_kn
    ? result.fix_kn
    : result.fix_en

  const nextStepsText = language === "kn" && result.next_steps_kn
    ? result.next_steps_kn
    : result.next_steps_en

  const disclaimerText = language === "kn"
    ? disclaimer.shortKn
    : disclaimer.short

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Result Icon and Status */}
      <div
        className={cn(
          "flex flex-col items-center p-6 rounded-2xl mb-6",
          config.bgColor,
          config.borderColor,
          "border"
        )}
      >
        <div className={config.textColor}>{config.icon}</div>
        <p className={cn("mt-4 text-lg font-semibold text-center", config.textColor)}>
          {result.status === "eligible" && t("mayBeEligible")}
          {result.status === "needs_review" && t("needsReview")}
          {result.status === "ineligible" && t("likelyIssue")}
        </p>
      </div>

      {/* Reason */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-base text-foreground leading-relaxed">
            {reasonText}
          </p>
        </CardContent>
      </Card>

      {/* Fix/Next Steps */}
      {(fixText || nextStepsText) && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {result.status === "eligible"
                ? language === "kn" ? "ಮುಂದಿನ ಹಂತಗಳು" : "Next Steps"
                : language === "kn" ? "ಪರಿಹಾರ" : "How to Fix"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground leading-relaxed">
              {fixText || nextStepsText}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Required Documents */}
      {result.documents && result.documents.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === "kn" ? "ಅಗತ್ಯ ದಾಖಲೆಗಳು" : "Required Documents"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {result.documents.map((doc, index) => (
                <li key={index} className="text-base">{doc}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Important Disclaimer - CRITICAL */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex gap-3">
          <svg
            className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800 mb-1">
              {language === "kn" ? "ಪ್ರಮುಖ" : "Important"}
            </p>
            <p className="text-sm text-yellow-700">
              {disclaimerText}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-auto">
        <Button asChild className="w-full h-14">
          <a
            href={disclaimer.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("officialPortal")} →
          </a>
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex-1 h-12"
          >
            {language === "kn" ? "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ" : "Start Over"}
          </Button>
          <Button
            variant="outline"
            asChild
            className="flex-1 h-12"
          >
            <Link href={`/schemes/${schemeSlug}`}>
              {language === "kn" ? "ಯೋಜನೆ ವಿವರಗಳು" : "Scheme Details"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
