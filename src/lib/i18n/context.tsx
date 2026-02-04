"use client"

import * as React from "react"
import type { Language, TranslationKey } from "./types"
import { translations, t } from "./translations"

const STORAGE_KEY = "samgov-language"

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const LanguageContext = React.createContext<LanguageContextValue | undefined>(undefined)

/**
 * Detect preferred language from browser/device
 */
function detectLanguage(): Language {
  if (typeof window === "undefined") return "en"

  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "en" || stored === "kn") return stored

  // Check browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith("kn")) return "kn"

  return "en"
}

interface LanguageProviderProps {
  children: React.ReactNode
  defaultLanguage?: Language
}

export function LanguageProvider({ children, defaultLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = React.useState<Language>(defaultLanguage ?? "en")
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Hydrate from localStorage after mount
  React.useEffect(() => {
    const detected = detectLanguage()
    setLanguageState(detected)
    setIsHydrated(true)
  }, [])

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang)
      // Update html lang attribute
      document.documentElement.lang = lang
    }
  }, [])

  const translate = React.useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      return t(key, language, params)
    },
    [language]
  )

  // Prevent hydration mismatch by using default until hydrated
  const value = React.useMemo(
    () => ({
      language: isHydrated ? language : (defaultLanguage ?? "en"),
      setLanguage,
      t: translate,
    }),
    [language, setLanguage, translate, isHydrated, defaultLanguage]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to access language context
 */
export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

/**
 * Hook to get translated text (shorthand)
 */
export function useTranslation() {
  const { t, language } = useLanguage()
  return { t, language }
}
