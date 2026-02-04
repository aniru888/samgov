"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  /** Add padding at bottom for bottom nav (default: true) */
  hasBottomNav?: boolean
  /** Maximum width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full"
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-[1280px]",
  full: "max-w-full",
}

export function PageContainer({
  children,
  className,
  hasBottomNav = true,
  maxWidth = "xl",
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "flex-1",
        "px-4 py-6",
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        hasBottomNav && "pb-24", // Space for bottom nav (64px + padding)
        className
      )}
    >
      {children}
    </main>
  )
}
