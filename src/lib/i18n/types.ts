"use client"

export type Language = "en" | "kn"

export interface TranslationKeys {
  // Common
  appName: string
  disclaimer: string
  disclaimerFull: string
  loading: string
  error: string
  retry: string
  close: string
  back: string
  next: string
  cancel: string
  save: string
  search: string

  // Navigation
  navHome: string
  navSchemes: string
  navCheck: string
  navAsk: string
  navProfile: string

  // Home
  heroTitle: string
  heroSubtitle: string
  quickActions: string
  browseSchemes: string
  checkEligibility: string
  askQuestion: string

  // Schemes
  schemesTitle: string
  searchPlaceholder: string
  noResults: string
  viewDetails: string

  // Debugger
  debuggerTitle: string
  stepOf: string
  checkMyEligibility: string
  mayBeEligible: string
  needsReview: string
  likelyIssue: string
  officialPortal: string

  // Chat
  askTitle: string
  askPlaceholder: string
  suggestedQuestions: string
  sourceLabel: string

  // Profile
  profileTitle: string
  history: string
  savedSchemes: string
  settings: string
  language: string
  clearData: string

  // Voice
  startVoice: string
  stopVoice: string
  processingVoice: string
  voiceError: string
}

export type TranslationKey = keyof TranslationKeys
