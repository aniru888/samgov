import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTextToSpeech } from "../use-text-to-speech"

// Mock voices
const mockKannadaVoice = {
  lang: "kn-IN",
  name: "Google Kannada",
  default: false,
  localService: true,
  voiceURI: "kn-IN",
} as SpeechSynthesisVoice

const mockEnglishINVoice = {
  lang: "en-IN",
  name: "Google English India",
  default: false,
  localService: true,
  voiceURI: "en-IN",
} as SpeechSynthesisVoice

const mockEnglishUSVoice = {
  lang: "en-US",
  name: "Google English US",
  default: true,
  localService: true,
  voiceURI: "en-US",
} as SpeechSynthesisVoice

// Mock SpeechSynthesis
let mockVoices: SpeechSynthesisVoice[] = []
let mockSpeaking = false
let voicesChangedListeners: (() => void)[] = []
let lastUtterance: SpeechSynthesisUtterance | null = null

const mockSpeechSynthesis = {
  getVoices: vi.fn(() => mockVoices),
  speak: vi.fn((utterance: SpeechSynthesisUtterance) => {
    lastUtterance = utterance
    mockSpeaking = true
  }),
  cancel: vi.fn(() => {
    mockSpeaking = false
  }),
  get speaking() {
    return mockSpeaking
  },
  addEventListener: vi.fn((event: string, listener: () => void) => {
    if (event === "voiceschanged") {
      voicesChangedListeners.push(listener)
    }
  }),
  removeEventListener: vi.fn((event: string, listener: () => void) => {
    if (event === "voiceschanged") {
      voicesChangedListeners = voicesChangedListeners.filter((l) => l !== listener)
    }
  }),
}

// Mock SpeechSynthesisUtterance (not available in JSDOM)
class MockSpeechSynthesisUtterance {
  text: string
  lang = ""
  voice: SpeechSynthesisVoice | null = null
  rate = 1
  pitch = 1
  volume = 1
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null

  constructor(text: string) {
    this.text = text
    lastUtterance = this as unknown as SpeechSynthesisUtterance
  }
}

describe("useTextToSpeech", () => {
  beforeEach(() => {
    mockVoices = [mockEnglishINVoice, mockEnglishUSVoice]
    mockSpeaking = false
    voicesChangedListeners = []
    lastUtterance = null
    vi.clearAllMocks()

    Object.defineProperty(window, "speechSynthesis", {
      value: mockSpeechSynthesis,
      writable: true,
      configurable: true,
    })

    // Install SpeechSynthesisUtterance mock
    Object.defineProperty(globalThis, "SpeechSynthesisUtterance", {
      value: MockSpeechSynthesisUtterance,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("detects SpeechSynthesis support", () => {
    const { result } = renderHook(() => useTextToSpeech({ language: "en" }))
    expect(result.current.isSupported).toBe(true)
  })

  it("returns isSupported=false when API missing", () => {
    Object.defineProperty(window, "speechSynthesis", {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useTextToSpeech({ language: "en" }))
    expect(result.current.isSupported).toBe(false)
  })

  it("detects hasKannadaVoice=false when no Kannada voice", () => {
    mockVoices = [mockEnglishINVoice]
    const { result } = renderHook(() => useTextToSpeech({ language: "kn" }))
    expect(result.current.hasKannadaVoice).toBe(false)
  })

  it("detects hasKannadaVoice=true when Kannada voice present", () => {
    mockVoices = [mockEnglishINVoice, mockKannadaVoice]
    const { result } = renderHook(() => useTextToSpeech({ language: "kn" }))
    expect(result.current.hasKannadaVoice).toBe(true)
  })

  it("updates voices on voiceschanged event", () => {
    mockVoices = [mockEnglishINVoice] // Initially no Kannada
    const { result } = renderHook(() => useTextToSpeech({ language: "kn" }))
    expect(result.current.hasKannadaVoice).toBe(false)

    // Simulate Chrome async voice loading
    mockVoices = [mockEnglishINVoice, mockKannadaVoice]
    act(() => {
      voicesChangedListeners.forEach((l) => l())
    })

    expect(result.current.hasKannadaVoice).toBe(true)
  })

  it("speaks text with speak()", () => {
    const { result } = renderHook(() => useTextToSpeech({ language: "en" }))

    act(() => {
      result.current.speak("Hello world")
    })

    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled() // Cancels first
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled()
    expect(lastUtterance).not.toBeNull()
  })

  it("uses en-IN voice for English", () => {
    mockVoices = [mockEnglishUSVoice, mockEnglishINVoice]
    const { result } = renderHook(() => useTextToSpeech({ language: "en" }))

    act(() => {
      result.current.speak("Hello")
    })

    expect(lastUtterance?.voice).toBe(mockEnglishINVoice)
  })

  it("falls back to any en voice when en-IN unavailable", () => {
    mockVoices = [mockEnglishUSVoice]
    const { result } = renderHook(() => useTextToSpeech({ language: "en" }))

    act(() => {
      result.current.speak("Hello")
    })

    expect(lastUtterance?.voice).toBe(mockEnglishUSVoice)
  })

  it("uses Kannada voice when available", () => {
    mockVoices = [mockEnglishINVoice, mockKannadaVoice]
    const { result } = renderHook(() => useTextToSpeech({ language: "kn" }))

    act(() => {
      result.current.speak("ನಮಸ್ಕಾರ")
    })

    expect(lastUtterance?.voice).toBe(mockKannadaVoice)
  })

  it("sets lang to kn-IN even without Kannada voice", () => {
    mockVoices = [mockEnglishINVoice] // No Kannada voice
    const { result } = renderHook(() => useTextToSpeech({ language: "kn" }))

    act(() => {
      result.current.speak("ನಮಸ್ಕಾರ")
    })

    expect(lastUtterance?.lang).toBe("kn-IN")
    // Voice is null — no silent fallback to English
    expect(lastUtterance?.voice).toBeNull()
  })

  it("stops all speech with stop()", () => {
    const { result } = renderHook(() => useTextToSpeech({ language: "en" }))

    act(() => {
      result.current.speak("Hello")
    })

    act(() => {
      result.current.stop()
    })

    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled()
    expect(result.current.isSpeaking).toBe(false)
  })

  it("does not speak empty text", () => {
    const { result } = renderHook(() => useTextToSpeech({ language: "en" }))

    act(() => {
      result.current.speak("   ")
    })

    expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled()
  })

  it("sets speech rate to 0.9 for clarity", () => {
    const { result } = renderHook(() => useTextToSpeech({ language: "en" }))

    act(() => {
      result.current.speak("Hello")
    })

    expect(lastUtterance?.rate).toBe(0.9)
  })
})
