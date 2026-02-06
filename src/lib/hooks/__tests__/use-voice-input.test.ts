import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useVoiceInput } from "../use-voice-input"

// Mock SpeechRecognition
class MockSpeechRecognition {
  continuous = false
  interimResults = false
  maxAlternatives = 1
  lang = ""

  onstart: ((ev: Event) => void) | null = null
  onresult: ((ev: SpeechRecognitionEvent) => void) | null = null
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null = null
  onend: ((ev: Event) => void) | null = null

  start = vi.fn(() => {
    // Simulate async start
    setTimeout(() => {
      this.onstart?.(new Event("start"))
    }, 0)
  })

  stop = vi.fn(() => {
    setTimeout(() => {
      this.onend?.(new Event("end"))
    }, 0)
  })

  abort = vi.fn()
}

// Helper to create a mock SpeechRecognitionEvent
function createResultEvent(transcript: string, isFinal: boolean): SpeechRecognitionEvent {
  const result = {
    isFinal,
    length: 1,
    item: () => ({ transcript, confidence: 0.95 }),
    0: { transcript, confidence: 0.95 },
  }
  return {
    resultIndex: 0,
    results: {
      length: 1,
      item: () => result,
      0: result,
    },
  } as unknown as SpeechRecognitionEvent
}

// Helper to create a mock SpeechRecognitionErrorEvent
function createErrorEvent(
  error: string
): SpeechRecognitionErrorEvent {
  return {
    error,
    message: `Error: ${error}`,
  } as unknown as SpeechRecognitionErrorEvent
}

let mockInstance: MockSpeechRecognition | null = null

describe("useVoiceInput", () => {
  beforeEach(() => {
    mockInstance = null
    // Install mock on window
    Object.defineProperty(window, "SpeechRecognition", {
      value: class extends MockSpeechRecognition {
        constructor() {
          super()
          mockInstance = this
        }
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // Remove mock
    Object.defineProperty(window, "SpeechRecognition", {
      value: undefined,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: undefined,
      writable: true,
      configurable: true,
    })
  })

  it("detects browser support", () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )
    expect(result.current.isSupported).toBe(true)
  })

  it("returns isSupported=false when API is missing", async () => {
    // Remove SpeechRecognition BEFORE rendering hook
    Object.defineProperty(window, "SpeechRecognition", {
      value: undefined,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    // Wait for useEffect to run
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(result.current.isSupported).toBe(false)
  })

  it("starts in idle state", () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )
    expect(result.current.state).toBe("idle")
    expect(result.current.errorMessage).toBeNull()
  })

  it("transitions to listening on start()", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    // Wait for the setTimeout in mock's start()
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(result.current.state).toBe("listening")
    expect(mockInstance).not.toBeNull()
    expect(mockInstance!.lang).toBe("en-IN")
    expect(mockInstance!.continuous).toBe(false)
    expect(mockInstance!.interimResults).toBe(true)
  })

  it("sets kn-IN language for Kannada", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "kn", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(mockInstance!.lang).toBe("kn-IN")
  })

  it("calls onTranscript with interim results", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    // Simulate interim result
    act(() => {
      mockInstance!.onresult?.(createResultEvent("hello wor", false))
    })

    expect(onTranscript).toHaveBeenCalledWith("hello wor", false)
  })

  it("calls onTranscript with final results", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    // Simulate final result
    act(() => {
      mockInstance!.onresult?.(createResultEvent("hello world", true))
    })

    expect(onTranscript).toHaveBeenCalledWith("hello world", true)
  })

  it("transitions to error on not-allowed", async () => {
    const onTranscript = vi.fn()
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript, onError })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    act(() => {
      mockInstance!.onerror?.(createErrorEvent("not-allowed"))
    })

    expect(result.current.state).toBe("error")
    expect(result.current.errorMessage).toBe(
      "Microphone access denied. Allow in browser settings."
    )
    expect(onError).toHaveBeenCalled()
  })

  it("shows Kannada error messages when language is kn", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "kn", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    act(() => {
      mockInstance!.onerror?.(createErrorEvent("no-speech"))
    })

    expect(result.current.state).toBe("error")
    expect(result.current.errorMessage).toBe(
      "ಯಾವುದೇ ಮಾತು ಕಂಡುಬಂದಿಲ್ಲ. ಮೈಕ್ ಒತ್ತಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
    )
  })

  it("handles network error", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    act(() => {
      mockInstance!.onerror?.(createErrorEvent("network"))
    })

    expect(result.current.state).toBe("error")
    expect(result.current.errorMessage).toBe("Voice needs internet connection")
  })

  it("returns to idle on stop()", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(result.current.state).toBe("listening")

    act(() => {
      result.current.stop()
    })

    expect(result.current.state).toBe("idle")
  })

  it("toggle() starts from idle", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.toggle()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(result.current.state).toBe("listening")
  })

  it("toggle() stops from listening", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    act(() => {
      result.current.toggle()
    })

    expect(result.current.state).toBe("idle")
  })

  it("toggle() restarts from error state", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    // Cause an error
    act(() => {
      mockInstance!.onerror?.(createErrorEvent("network"))
    })

    expect(result.current.state).toBe("error")

    // Toggle should restart
    act(() => {
      result.current.toggle()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(result.current.state).toBe("listening")
  })

  it("does not start when isSupported is false", () => {
    Object.defineProperty(window, "SpeechRecognition", {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    // Should remain idle, no crash
    expect(result.current.state).toBe("idle")
  })

  it("treats aborted error as non-error (idle state)", async () => {
    const onTranscript = vi.fn()
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript, onError })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    act(() => {
      mockInstance!.onerror?.(createErrorEvent("aborted"))
    })

    expect(result.current.state).toBe("idle")
    expect(result.current.errorMessage).toBeNull()
    expect(onError).not.toHaveBeenCalled()
  })

  it("returns to idle after recognition ends naturally", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(result.current.state).toBe("listening")

    // Simulate recognition ending naturally (after final result)
    act(() => {
      mockInstance!.onend?.(new Event("end"))
    })

    expect(result.current.state).toBe("idle")
  })

  it("clears error on new start", async () => {
    const onTranscript = vi.fn()
    const { result } = renderHook(() =>
      useVoiceInput({ language: "en", onTranscript })
    )

    // Start and cause an error
    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    act(() => {
      mockInstance!.onerror?.(createErrorEvent("network"))
    })

    expect(result.current.errorMessage).not.toBeNull()

    // Start again — error should clear
    act(() => {
      result.current.start()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(result.current.errorMessage).toBeNull()
    expect(result.current.state).toBe("listening")
  })
})
