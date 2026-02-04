"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "kn" : "en")}
      className={cn(
        "inline-flex items-center justify-center gap-1 px-3 py-2",
        "text-sm font-medium",
        "bg-muted hover:bg-muted/80 rounded-lg",
        "touch-target",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      aria-label={`Switch to ${language === "en" ? "Kannada" : "English"}`}
    >
      <span className={cn(language === "en" ? "font-semibold text-primary" : "text-muted-foreground")}>
        EN
      </span>
      <span className="text-muted-foreground">/</span>
      <span className={cn(language === "kn" ? "font-semibold text-primary" : "text-muted-foreground")}>
        ಕನ್ನಡ
      </span>
    </button>
  )
}
