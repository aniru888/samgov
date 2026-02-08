import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Wizard } from "../wizard"
import { LanguageProvider } from "@/lib/i18n"
import type { DecisionTree } from "@/lib/rules-engine"

// Mock fetch globally
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

beforeEach(() => {
  vi.restoreAllMocks()
  mockFetch.mockReset()
  mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })))
  vi.mocked(localStorage.getItem).mockReturnValue(null)
  vi.mocked(localStorage.setItem).mockImplementation(() => {})
  vi.mocked(localStorage.removeItem).mockImplementation(() => {})
  sessionStorageMock.getItem.mockReturnValue(null)
  sessionStorageMock.setItem.mockImplementation(() => {})
  sessionStorageMock.removeItem.mockImplementation(() => {})
})

// Simple decision tree: 1 question → 2 results
const testTree: DecisionTree = {
  start: "q1",
  nodes: {
    q1: {
      type: "question",
      text_en: "Are you a Karnataka resident?",
      text_kn: "ನೀವು ಕರ್ನಾಟಕ ನಿವಾಸಿಯೇ?",
      options: [
        { label: "Yes", label_kn: "ಹೌದು", next: "result_eligible" },
        { label: "No", label_kn: "ಇಲ್ಲ", next: "result_ineligible" },
      ],
    },
    result_eligible: {
      type: "result",
      status: "eligible",
      reason_en: "You may be eligible.",
      reason_kn: "ನೀವು ಅರ್ಹರಾಗಬಹುದು.",
    },
    result_ineligible: {
      type: "result",
      status: "ineligible",
      reason_en: "Not a Karnataka resident.",
      reason_kn: "ಕರ್ನಾಟಕ ನಿವಾಸಿ ಅಲ್ಲ.",
    },
  },
}

const testSchemeId = "scheme-uuid-123"
const testTreeId = "tree-uuid-456"

// Mock useDecisionTree
vi.mock("@/lib/hooks/use-decision-tree", () => ({
  useDecisionTree: () => ({
    tree: testTree,
    treeId: testTreeId,
    schemeId: testSchemeId,
    schemeApplicationUrl: null,
    schemeRequiredDocuments: null,
    loading: false,
    error: null,
  }),
}))

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn().mockReturnValue(null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock })

function renderWizard(lang: "en" | "kn" = "en") {
  return render(
    <LanguageProvider defaultLanguage={lang}>
      <Wizard schemeSlug="test-scheme" schemeName="Test Scheme" />
    </LanguageProvider>
  )
}

/** Select an option then click Next to submit the answer */
async function answerQuestion(optionText: string, nextText: string = "Next") {
  fireEvent.click(screen.getByText(optionText))
  fireEvent.click(screen.getByText(nextText))
}

describe("Wizard analytics tracking", () => {
  it("sends completion data when wizard reaches eligible result", async () => {
    renderWizard()

    await waitFor(() => {
      expect(screen.getByText("Are you a Karnataka resident?")).toBeInTheDocument()
    })

    // Select "Yes" and click Next
    await answerQuestion("Yes", "Next")

    // Wait for completion POST
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/completions",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      )
    })

    // Verify the payload
    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body.schemeId).toBe(testSchemeId)
    expect(body.treeId).toBe(testTreeId)
    expect(body.resultStatus).toBe("eligible")
    expect(body.terminalNodeId).toBe("result_eligible")
    expect(body.answerPath).toEqual([{ nodeId: "q1", optionLabel: "Yes" }])
    expect(body.answerCount).toBe(1)
    expect(body.language).toBe("en")
  })

  it("sends ineligible status when result is ineligible", async () => {
    renderWizard()

    await waitFor(() => {
      expect(screen.getByText("Are you a Karnataka resident?")).toBeInTheDocument()
    })

    // Select "No" and click Next
    await answerQuestion("No", "Next")

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body.resultStatus).toBe("ineligible")
    expect(body.terminalNodeId).toBe("result_ineligible")
    expect(body.answerPath).toEqual([{ nodeId: "q1", optionLabel: "No" }])
  })

  it("does not break UX when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"))

    renderWizard()

    await waitFor(() => {
      expect(screen.getByText("Are you a Karnataka resident?")).toBeInTheDocument()
    })

    await answerQuestion("Yes", "Next")

    // Should still show the result (analytics failure is silent)
    await waitFor(() => {
      expect(screen.getByText("You may be eligible.")).toBeInTheDocument()
    })
  })

  it("sends language=kn when wizard is in Kannada", async () => {
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === "samgov-language") return "kn"
      return null
    })

    renderWizard("kn")

    await waitFor(() => {
      expect(screen.getByText("ನೀವು ಕರ್ನಾಟಕ ನಿವಾಸಿಯೇ?")).toBeInTheDocument()
    })

    // Select Kannada "Yes" option and click Kannada "Next"
    await answerQuestion("ಹೌದು", "ಮುಂದೆ")

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body.language).toBe("kn")
  })

  it("does not send analytics when wizard is not complete", async () => {
    renderWizard()

    await waitFor(() => {
      expect(screen.getByText("Are you a Karnataka resident?")).toBeInTheDocument()
    })

    // Don't answer - wizard is still in progress
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
