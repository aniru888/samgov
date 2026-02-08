"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

interface PrintButtonProps {
  className?: string
}

/**
 * Print button that triggers window.print().
 * Hidden in print via CSS class "no-print".
 */
export function PrintButton({ className }: PrintButtonProps) {
  const { language } = useTranslation()

  return (
    <Button
      variant="outline"
      className={`no-print ${className || ""} w-full h-12`}
      onClick={() => window.print()}
    >
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      {language === "kn" ? "ಮುದ್ರಿಸಿ" : "Print"}
    </Button>
  )
}
