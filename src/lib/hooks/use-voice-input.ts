"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { VoiceButtonState } from "@/components/ui/voice-button"

export interface UseVoiceInputOptions {
  language: "en" | "kn"
  onTranscript: (text: string, isFinal: boolean) => void
  onError?: (error: string) => void
}

export interface UseVoiceInputReturn {
  /** Whether Web Speech API is available in this browser */
  isSupported: boolean
  /** Current state for the VoiceButton UI */
  state: VoiceButtonState
  /** Translated error message (null when no error) */
  errorMessage: string | null
  /** Start listening */
  start: () => void
  /** Stop listening */
  stop: () => void
  /** Toggle listening on/off */
  toggle: () => void
}

/**
 * Hook for speech-to-text using the Web Speech API.
 *
 * Uses `continuous: false` (single utterance) to avoid:
 * - Chrome's 60-second hard timeout on continuous mode
 * - Android Chrome mic cutoff bug (speechend fires prematurely)
 *
 * NEVER silently falls back to English if Kannada isn't supported.
 * Shows explicit error messages per CLAUDE.md Rule #14.
 */
export function useVoiceInput({
  language,
  onTranscript,
  onError,
}: UseVoiceInputOptions): UseVoiceInputReturn {
  const [state, setState] = useState<VoiceButtonState>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const onTranscriptRef = useRef(onTranscript)
  const onErrorRef = useRef(onError)

  // Keep callback refs current without re-creating recognition
  useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  // Feature detection (SSR-safe)
  // Check truthiness, not just property existence — `in` returns true for undefined props
  useEffect(() => {
    if (typeof window !== "undefined") {
      const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
      setIsSupported(supported)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
        recognitionRef.current = null
      }
    }
  }, [])

  const getErrorMessage = useCallback(
    (errorCode: string): string => {
      // Map Web Speech API error codes to i18n keys
      // These are the actual error strings from the spec
      switch (errorCode) {
        case "not-allowed":
        case "service-not-allowed":
          return language === "kn"
            ? "ಮೈಕ್ರೋಫೋನ್ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಅನುಮತಿಸಿ."
            : "Microphone access denied. Allow in browser settings."
        case "network":
          return language === "kn"
            ? "ಧ್ವನಿಗೆ ಅಂತರ್ಜಾಲ ಸಂಪರ್ಕ ಬೇಕು"
            : "Voice needs internet connection"
        case "no-speech":
          return language === "kn"
            ? "ಯಾವುದೇ ಮಾತು ಕಂಡುಬಂದಿಲ್ಲ. ಮೈಕ್ ಒತ್ತಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
            : "No speech detected. Tap mic and try again."
        case "language-not-supported":
          return language === "kn"
            ? "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ಧ್ವನಿಗಾಗಿ Chrome ಬಳಸಿ."
            : "Voice input not supported on this browser. Use Chrome for voice."
        case "aborted":
          // User intentionally stopped — no error message needed
          return ""
        default:
          return language === "kn"
            ? "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ದೋಷ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ"
            : "Voice input error, tap to retry"
      }
    },
    [language]
  )

  const start = useCallback(() => {
    if (!isSupported) return

    // Clean up any previous instance
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionClass) return

    const recognition = new SpeechRecognitionClass()

    // Configure for single-utterance mode
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.lang = language === "kn" ? "kn-IN" : "en-IN"

    recognition.onstart = () => {
      setState("listening")
      setErrorMessage(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Collect all results into a single transcript
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (finalTranscript) {
        onTranscriptRef.current(finalTranscript, true)
      } else if (interimTranscript) {
        onTranscriptRef.current(interimTranscript, false)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const msg = getErrorMessage(event.error)

      if (event.error === "aborted") {
        // User-initiated stop, not an error
        setState("idle")
        return
      }

      setState("error")
      setErrorMessage(msg)
      onErrorRef.current?.(msg)
    }

    recognition.onend = () => {
      // Recognition ended (either naturally after final result, or after error)
      // Only reset to idle if we're still in "listening" state
      // (error handler already set "error" state if there was an error)
      setState((prev) => (prev === "listening" ? "idle" : prev))
      recognitionRef.current = null
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      // start() can throw if already started or other issues
      setState("error")
      setErrorMessage(
        language === "kn"
          ? "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ದೋಷ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ"
          : "Voice input error, tap to retry"
      )
    }
  }, [isSupported, language, getErrorMessage])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setState("idle")
  }, [])

  const toggle = useCallback(() => {
    if (state === "listening") {
      stop()
    } else if (state === "idle" || state === "error") {
      start()
    }
    // Do nothing if "processing" — shouldn't happen in single-utterance mode
  }, [state, start, stop])

  return {
    isSupported,
    state,
    errorMessage,
    start,
    stop,
    toggle,
  }
}
