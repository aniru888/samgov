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
  schemeApplicationUrl?: string | null
  schemeRequiredDocuments?: string[] | null
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
  schemeApplicationUrl,
  schemeRequiredDocuments,
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

  // Build WhatsApp share message
  const buildShareText = () => {
    const statusLabel = result.status === "eligible"
      ? (language === "kn" ? "ಅರ್ಹರಾಗಬಹುದು" : "May be eligible")
      : result.status === "needs_review"
        ? (language === "kn" ? "ಪರಿಶೀಲನೆ ಅಗತ್ಯ" : "Needs review")
        : (language === "kn" ? "ಅನರ್ಹ" : "May not be eligible")

    const lines: string[] = [
      language === "kn"
        ? `*${schemeName}* - ${statusLabel}`
        : `*${schemeName}* - ${statusLabel}`,
      "",
      reasonText,
    ]

    if (fixText || nextStepsText) {
      lines.push("", fixText || nextStepsText || "")
    }

    const docs = result.documents && result.documents.length > 0
      ? result.documents
      : schemeRequiredDocuments
    if (docs && docs.length > 0) {
      lines.push(
        "",
        language === "kn" ? "ಅಗತ್ಯ ದಾಖಲೆಗಳು:" : "Documents needed:",
        ...docs.map(d => `- ${d}`)
      )
    }

    if (schemeApplicationUrl) {
      lines.push("", language === "kn" ? "ಅರ್ಜಿ ಲಿಂಕ್:" : "Apply:", schemeApplicationUrl)
    }

    lines.push(
      "",
      language === "kn"
        ? "⚠️ ಇದು ಸರ್ಕಾರದ ವೆಬ್‌ಸೈಟ್ ಅಲ್ಲ. ಮಾಹಿತಿ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ಮಾತ್ರ."
        : "⚠️ Not a government website. For guidance only."
    )

    return encodeURIComponent(lines.join("\n"))
  }

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

      {/* Required Documents - from tree node or scheme DB */}
      {(() => {
        const docs = result.documents && result.documents.length > 0
          ? result.documents
          : schemeRequiredDocuments;
        if (!docs || docs.length === 0) return null;
        return (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {language === "kn" ? "ಅಗತ್ಯ ದಾಖಲೆಗಳು" : "Documents You Will Need"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {docs.map((doc, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5 shrink-0">&#10003;</span>
                    {doc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })()}

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
        {/* Scheme-specific apply link (if available) */}
        {schemeApplicationUrl && (
          <Button asChild className="w-full h-14">
            <a
              href={schemeApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {language === "kn" ? "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ" : "Apply Now"} →
            </a>
          </Button>
        )}

        {/* Generic portal link */}
        <Button
          asChild
          variant={schemeApplicationUrl ? "outline" : "default"}
          className={schemeApplicationUrl ? "w-full h-12" : "w-full h-14"}
        >
          <a
            href={disclaimer.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("officialPortal")} →
          </a>
        </Button>

        {/* WhatsApp share */}
        <Button
          asChild
          variant="outline"
          className="w-full h-12 text-green-700 border-green-300 hover:bg-green-50"
        >
          <a
            href={`https://wa.me/?text=${buildShareText()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {language === "kn" ? "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ" : "Share via WhatsApp"}
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
