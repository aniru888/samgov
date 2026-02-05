"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type VoiceButtonState = "idle" | "listening" | "processing" | "error"

export interface VoiceButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: VoiceButtonState
  onStateChange?: (state: VoiceButtonState) => void
  size?: "default" | "lg"
}

const VoiceButton = React.forwardRef<HTMLButtonElement, VoiceButtonProps>(
  (
    {
      className,
      state = "idle",
      onStateChange: _onStateChange, // Reserved for voice implementation
      size = "default",
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      default: "h-12 w-12", // 48px
      lg: "h-14 w-14", // 56px
    }

    const stateClasses = {
      idle: "bg-primary text-primary-foreground hover:bg-primary/90",
      listening: "bg-red-500 text-white animate-pulse",
      processing: "bg-muted text-muted-foreground cursor-wait",
      error: "bg-destructive text-white",
    }

    const isDisabled = disabled || state === "processing"

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "touch-target", // Ensures 48px minimum
          sizeClasses[size],
          stateClasses[state],
          className
        )}
        aria-label={
          state === "idle"
            ? "Start voice input"
            : state === "listening"
            ? "Stop listening"
            : state === "processing"
            ? "Processing speech"
            : "Voice input error, tap to retry"
        }
        {...props}
      >
        {state === "idle" && <MicIcon className="h-6 w-6" />}
        {state === "listening" && <StopIcon className="h-6 w-6" />}
        {state === "processing" && <SpinnerIcon className="h-6 w-6 animate-spin" />}
        {state === "error" && <AlertIcon className="h-6 w-6" />}
      </button>
    )
  }
)
VoiceButton.displayName = "VoiceButton"

// Icon components
function MicIcon({ className }: { className?: string }) {
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

export { VoiceButton }
