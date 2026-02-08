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
  chatThinking: string
  chatAskAbout: string
  chatImportantNotice: string
  chatAIGuidance: string
  chatEnterToSend: string
  chatMachineTranslated: string
  chatTryAsking: string
  chatSourcesLabel: string
  chatRateLimitWait: string
  chatSendError: string

  // Profile
  profileTitle: string
  history: string
  savedSchemes: string
  settings: string
  language: string
  clearData: string
  quickLinks: string
  dataManagement: string
  clearDataConfirm: string
  dataCleared: string
  signInComingSoon: string

  // Schemes detail
  schemeBenefits: string
  schemeEligibility: string
  schemeDepartment: string
  schemeRejected: string
  schemeDebugRejection: string
  schemeApply: string
  schemeLastVerified: string
  schemeSource: string
  schemeOfficialWebsite: string
  contentEnglishOnly: string
  schemesSubtitle: string
  schemesBreadcrumb: string

  // Debugger picker
  debuggerPickScheme: string
  debuggerPickSchemeSubtitle: string

  // Voice
  startVoice: string
  stopVoice: string
  processingVoice: string
  voiceError: string
  voiceNotSupported: string
  voiceMicDenied: string
  voiceListening: string
  voiceNoSpeech: string
  voiceNoKannadaTTS: string
  voiceNetworkError: string
  readAloud: string
  stopReading: string
  readAllResults: string
  speakYourQuery: string

  // Explore / Recommendations
  navExplore: string
  exploreTitle: string
  exploreSubtitle: string
  explorePlaceholder: string
  exploreSearch: string
  exploreNoResults: string
  exploreNoResultsHint: string
  exploreHighlyRelevant: string
  exploreRelevant: string
  exploreMayBeRelevant: string
  exploreDisclaimer: string
  exploreBrowseAll: string
  exploreFound: string
  exploreAllCategories: string
  exploreVerified: string
  exploreAutoImported: string
  exploreCheckEligibility: string

  // Screener / Profile Wizard
  screenerTitle: string
  screenerSubtitle: string
  screenerFindSchemes: string
  screenerGenderQuestion: string
  screenerGenderMale: string
  screenerGenderFemale: string
  screenerGenderOther: string
  screenerAgeQuestion: string
  screenerAgeUnder18: string
  screenerAge18to35: string
  screenerAge36to60: string
  screenerAgeOver60: string
  screenerSituationQuestion: string
  screenerSituationFarmer: string
  screenerSituationStudent: string
  screenerSituationWorker: string
  screenerSituationEntrepreneur: string
  screenerSituationUnemployed: string
  screenerSituationOther: string
  screenerCategoryQuestion: string
  screenerCategoryGeneral: string
  screenerCategoryOBC: string
  screenerCategorySC: string
  screenerCategoryST: string
  screenerCategoryMinority: string
  screenerResultsTitle: string
  screenerLikely: string
  screenerPossible: string
  screenerCheck: string
  screenerNoResults: string
  screenerStartOver: string
  screenerSchemesWith: string

  // Document Preparation Guides
  docGuideHowToGet: string
  docGuideHide: string
  docGuideDocumentsNeeded: string
  docGuideGuidesAvailable: string
  docGuideWhere: string
  docGuideHow: string
  docGuideTime: string
  docGuideCost: string
  docGuideOnline: string
  docGuideTip: string

  // CSC Operator Mode
  cscTitle: string
  cscSubtitle: string
  cscNextCitizen: string
  cscCitizensHelped: string
  cscSchemesFound: string
  cscPrintAll: string
  cscResetSession: string
  cscProfileSummary: string
  cscNewSession: string
  cscOperatorNote: string
  cscPrintFooterStamp: string
  cscResultsFor: string
}

export type TranslationKey = keyof TranslationKeys
