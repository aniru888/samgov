"use client"

import { useState, useCallback, useEffect, useRef } from "react"

export interface UseTextToSpeechOptions {
  language: "en" | "kn"
}

export interface UseTextToSpeechReturn {
  /** Whether SpeechSynthesis API is available */
  isSupported: boolean
  /** Whether a Kannada voice is available on this device */
  hasKannadaVoice: boolean
  /** Whether audio is currently playing */
  isSpeaking: boolean
  /** Speak the given text */
  speak: (text: string) => void
  /** Stop all speech */
  stop: () => void
}

/**
 * Hook for text-to-speech using the browser SpeechSynthesis API.
 *
 * Voice selection:
 * - Kannada mode (`kn`): Uses `kn` voice. If none available, `hasKannadaVoice = false`.
 *   Parent component shows install instructions. NO silent English fallback.
 * - English mode (`en`): Uses `en-IN` voice, falls back to any `en` voice.
 *
 * Voices load asynchronously in Chrome — uses `voiceschanged` event to detect.
 */
export function useTextToSpeech({
  language,
}: UseTextToSpeechOptions): UseTextToSpeechReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [hasKannadaVoice, setHasKannadaVoice] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  // Feature detection + voice loading (SSR-safe)
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return
    }

    setIsSupported(true)

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      voicesRef.current = voices
      setHasKannadaVoice(voices.some((v) => v.lang.startsWith("kn")))
    }

    // Voices may already be loaded (Firefox) or load async (Chrome)
    loadVoices()

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }
  }, [])

  // Track speaking state changes
  useEffect(() => {
    if (!isSupported) return

    // Poll speaking state since there's no reliable event for utterance end
    // when queuing multiple utterances
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking)
    }, 200)

    return () => clearInterval(interval)
  }, [isSupported])

  const findVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current

    if (language === "kn") {
      // Look for Kannada voice — NO English fallback for Kannada text
      return voices.find((v) => v.lang.startsWith("kn")) || null
    }

    // English: prefer en-IN, fallback to any en voice
    return (
      voices.find((v) => v.lang === "en-IN") ||
      voices.find((v) => v.lang.startsWith("en") && v.lang.includes("IN")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null
    )
  }, [language])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text.trim()) return

      // Cancel any current speech first
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const voice = findVoice()

      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else {
        // Set lang even without a specific voice — the browser may still work
        utterance.lang = language === "kn" ? "kn-IN" : "en-IN"
      }

      utterance.rate = 0.9 // Slightly slower for clarity
      utterance.pitch = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [isSupported, language, findVoice]
  )

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  return {
    isSupported,
    hasKannadaVoice,
    isSpeaking,
    speak,
    stop,
  }
}
