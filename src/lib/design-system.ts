/**
 * SamGov Design System Constants
 * Type-safe access to design tokens
 *
 * Based on docs/plans/2026-02-04-samgov-design.md
 */

export const colors = {
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },
  semantic: {
    success: '#16a34a',
    successLight: '#dcfce7',
    warning: '#d97706',
    warningLight: '#fef3c7',
    error: '#dc2626',
    errorLight: '#fee2e2',
    info: '#0284c7',
    infoLight: '#e0f2fe',
  },
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
} as const

export const typography = {
  fontFamily: {
    sans: '"Inter", "Noto Sans Kannada", system-ui, -apple-system, sans-serif',
    display: '"Inter", "Noto Sans Kannada", system-ui, -apple-system, sans-serif',
  },
  fontSize: {
    xs: '0.875rem',    // 14px
    sm: '1rem',        // 16px
    base: '1.125rem',  // 18px
    lg: '1.25rem',     // 20px
    xl: '1.5rem',      // 24px
    '2xl': '1.875rem', // 30px
    '3xl': '2.25rem',  // 36px
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
} as const

export const radii = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  max: 999,
} as const

export const componentSizes = {
  headerHeight: '56px',
  bottomNavHeight: '64px',
  maxContentWidth: '1280px',
  inputHeight: '56px',
  buttonHeight: '48px',
  touchTargetMin: '48px',
  touchTargetComfortable: '56px',
} as const

/**
 * Result status colors and icons for the debugger wizard
 */
export const resultStatus = {
  mayBeEligible: {
    color: colors.semantic.success,
    bgColor: colors.semantic.successLight,
    label: 'You MAY meet basic eligibility criteria',
    labelKn: 'ನೀವು ಮೂಲಭೂತ ಅರ್ಹತೆಯ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸಬಹುದು',
  },
  needsReview: {
    color: colors.semantic.warning,
    bgColor: colors.semantic.warningLight,
    label: 'Some criteria need verification',
    labelKn: 'ಕೆಲವು ಮಾನದಂಡಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕು',
  },
  likelyIssue: {
    color: colors.semantic.error,
    bgColor: colors.semantic.errorLight,
    label: 'There may be an eligibility issue',
    labelKn: 'ಅರ್ಹತೆಯ ಸಮಸ್ಯೆ ಇರಬಹುದು',
  },
} as const

/**
 * Disclaimer text - CRITICAL: Must appear on every page
 */
export const disclaimer = {
  short: 'This is NOT a government website. Information is for guidance only.',
  shortKn: 'ಇದು ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಅಲ್ಲ. ಮಾಹಿತಿಯು ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ.',
  full: 'This is NOT an official government website. SamGov is an independent informational service. Always verify eligibility on official Karnataka government portals before applying.',
  fullKn: 'ಇದು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಅಲ್ಲ. SamGov ಸ್ವತಂತ್ರ ಮಾಹಿತಿ ಸೇವೆಯಾಗಿದೆ. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಯಾವಾಗಲೂ ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪೋರ್ಟಲ್‌ಗಳಲ್ಲಿ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
  officialPortalUrl: 'https://sevasindhu.karnataka.gov.in',
} as const
