import type { TranslationKeys } from "./types"

export const translations: Record<"en" | "kn", TranslationKeys> = {
  en: {
    // Common
    appName: "SamGov",
    disclaimer: "This is NOT a government website. Information is for guidance only.",
    disclaimerFull: "This is NOT an official government website. SamGov is an independent informational service. Always verify eligibility on official Karnataka government portals before applying.",
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try again",
    close: "Close",
    back: "Back",
    next: "Next",
    cancel: "Cancel",
    save: "Save",
    search: "Search",

    // Navigation
    navHome: "Home",
    navSchemes: "Schemes",
    navCheck: "Check",
    navAsk: "Ask",
    navProfile: "Profile",

    // Home
    heroTitle: "Find welfare schemes you may qualify for",
    heroSubtitle: "Simple tools to understand Karnataka government schemes and check your eligibility",
    quickActions: "Quick Actions",
    browseSchemes: "Browse Schemes",
    checkEligibility: "Check Eligibility",
    askQuestion: "Ask a Question",

    // Schemes
    schemesTitle: "Welfare Schemes",
    searchPlaceholder: "Search schemes...",
    noResults: "No schemes found",
    viewDetails: "View Details",

    // Debugger
    debuggerTitle: "Eligibility Check",
    stepOf: "Step {current} of {total}",
    checkMyEligibility: "Check My Eligibility",
    mayBeEligible: "You may meet basic eligibility criteria",
    needsReview: "Some criteria need verification",
    likelyIssue: "There may be an eligibility issue",
    officialPortal: "Check Official Portal",

    // Chat
    askTitle: "Ask a Question",
    askPlaceholder: "Type your question...",
    suggestedQuestions: "Suggested Questions",
    sourceLabel: "Source",

    // Profile
    profileTitle: "My Profile",
    history: "History",
    savedSchemes: "Saved Schemes",
    settings: "Settings",
    language: "Language",
    clearData: "Clear Data",

    // Voice
    startVoice: "Start voice input",
    stopVoice: "Stop listening",
    processingVoice: "Processing speech",
    voiceError: "Voice input error, tap to retry",
  },
  kn: {
    // Common - Kannada translations (verified placeholders, need native review)
    appName: "SamGov",
    disclaimer: "ಇದು ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಅಲ್ಲ. ಮಾಹಿತಿಯು ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ.",
    disclaimerFull: "ಇದು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಅಲ್ಲ. SamGov ಸ್ವತಂತ್ರ ಮಾಹಿತಿ ಸೇವೆಯಾಗಿದೆ. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಯಾವಾಗಲೂ ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪೋರ್ಟಲ್‌ಗಳಲ್ಲಿ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    error: "ಏನೋ ತಪ್ಪಾಗಿದೆ",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    close: "ಮುಚ್ಚಿ",
    back: "ಹಿಂದೆ",
    next: "ಮುಂದೆ",
    cancel: "ರದ್ದು ಮಾಡಿ",
    save: "ಉಳಿಸಿ",
    search: "ಹುಡುಕಿ",

    // Navigation
    navHome: "ಮುಖಪುಟ",
    navSchemes: "ಯೋಜನೆಗಳು",
    navCheck: "ಪರಿಶೀಲಿಸಿ",
    navAsk: "ಕೇಳಿ",
    navProfile: "ಪ್ರೊಫೈಲ್",

    // Home
    heroTitle: "ನೀವು ಅರ್ಹರಾಗಬಹುದಾದ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    heroSubtitle: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಯೋಜನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಸರಳ ಸಾಧನಗಳು",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    browseSchemes: "ಯೋಜನೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
    checkEligibility: "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
    askQuestion: "ಪ್ರಶ್ನೆ ಕೇಳಿ",

    // Schemes
    schemesTitle: "ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು",
    searchPlaceholder: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ...",
    noResults: "ಯಾವುದೇ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",

    // Debugger
    debuggerTitle: "ಅರ್ಹತೆ ಪರಿಶೀಲನೆ",
    stepOf: "ಹಂತ {current} / {total}",
    checkMyEligibility: "ನನ್ನ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
    mayBeEligible: "ನೀವು ಮೂಲಭೂತ ಅರ್ಹತೆಯ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸಬಹುದು",
    needsReview: "ಕೆಲವು ಮಾನದಂಡಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕು",
    likelyIssue: "ಅರ್ಹತೆಯ ಸಮಸ್ಯೆ ಇರಬಹುದು",
    officialPortal: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ",

    // Chat
    askTitle: "ಪ್ರಶ್ನೆ ಕೇಳಿ",
    askPlaceholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ...",
    suggestedQuestions: "ಸೂಚಿಸಿದ ಪ್ರಶ್ನೆಗಳು",
    sourceLabel: "ಮೂಲ",

    // Profile
    profileTitle: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    history: "ಇತಿಹಾಸ",
    savedSchemes: "ಉಳಿಸಿದ ಯೋಜನೆಗಳು",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    language: "ಭಾಷೆ",
    clearData: "ಡೇಟಾ ತೆರವುಗೊಳಿಸಿ",

    // Voice
    startVoice: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಸಿ",
    stopVoice: "ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
    processingVoice: "ಭಾಷಣ ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ",
    voiceError: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ದೋಷ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
  },
}

/**
 * Get translation for a key in the specified language
 */
export function t(key: keyof TranslationKeys, lang: "en" | "kn", params?: Record<string, string | number>): string {
  let text = translations[lang][key]

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, String(value))
    })
  }

  return text
}
