"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "./language-toggle"

interface HeaderProps {
  title?: string
  showBack?: boolean
  showLogo?: boolean
  className?: string
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

export function Header({ title, showBack, showLogo = true, className }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Auto-detect if we should show back button (not on home page)
  const shouldShowBack = showBack ?? pathname !== "/"

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "h-14 px-4",
        "bg-background border-b border-border",
        "flex items-center justify-between",
        className
      )}
    >
      {/* Left: Back button or Logo */}
      <div className="flex items-center gap-2">
        {shouldShowBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className={cn(
              "inline-flex items-center justify-center",
              "w-12 h-12 -ml-2",
              "rounded-full",
              "hover:bg-muted",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Go back"
          >
            <BackIcon className="w-6 h-6" />
          </button>
        ) : showLogo ? (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">SamGov</span>
          </Link>
        ) : null}
      </div>

      {/* Center: Title */}
      {title && (
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-foreground truncate max-w-[50%]">
          {title}
        </h1>
      )}

      {/* Right: Language toggle */}
      <div className="flex items-center">
        <LanguageToggle />
      </div>
    </header>
  )
}
