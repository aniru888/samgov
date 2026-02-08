import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LanguageProvider } from "@/lib/i18n"
import { CSCOperatorPage } from "../csc-operator-page"

const mockSchemes = [
  {
    slug: "test-scheme",
    name_en: "Test Scheme",
    name_kn: "ಟೆಸ್ಟ್ ಯೋಜನೆ",
    category: "agriculture",
    target_group: "Farmers",
    benefits_summary: "Test benefit",
    application_url: "https://example.com/apply",
    required_documents: ["Aadhaar"],
    match_level: "likely" as const,
    match_reasons: ["Targets farmers"],
    has_decision_tree: true,
  },
  {
    slug: "second-scheme",
    name_en: "Second Scheme",
    name_kn: null,
    category: "housing",
    target_group: "All Citizens",
    benefits_summary: "Housing benefit",
    application_url: null,
    required_documents: null,
    match_level: "possible" as const,
    match_reasons: ["Universal scheme"],
    has_decision_tree: false,
  },
]

function renderCSC(lang: "en" | "kn" = "en") {
  return render(
    <LanguageProvider defaultLanguage={lang}>
      <CSCOperatorPage />
    </LanguageProvider>
  )
}

function mockFetchSuccess(schemes = mockSchemes) {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data: { schemes, total: schemes.length } }),
  })
}

function completeWizard() {
  fireEvent.click(screen.getByText("Female"))
  fireEvent.click(screen.getByText("18 - 35"))
  fireEvent.click(screen.getByText("Farmer"))
  fireEvent.click(screen.getByText("SC"))
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.mocked(localStorage.getItem).mockReturnValue(null)
  vi.mocked(localStorage.setItem).mockImplementation(() => {})
  vi.mocked(localStorage.removeItem).mockImplementation(() => {})
  // Reset fetch between tests
  if (global.fetch && typeof (global.fetch as ReturnType<typeof vi.fn>).mockReset === "function") {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockReset()
  }
})

describe("CSCOperatorPage", () => {
  it("renders CSC title and operator note", () => {
    renderCSC()
    expect(screen.getByText("CSC Operator Mode")).toBeInTheDocument()
    expect(screen.getByText("For CSC operators only")).toBeInTheDocument()
  })

  it("shows gender question as first step", () => {
    renderCSC()
    expect(screen.getByText("What is your gender?")).toBeInTheDocument()
    expect(screen.getByText("Female")).toBeInTheDocument()
    expect(screen.getByText("Male")).toBeInTheDocument()
  })

  it("completes 4-step wizard flow", async () => {
    mockFetchSuccess()
    renderCSC()

    // Step 1: Gender
    fireEvent.click(screen.getByText("Female"))
    expect(screen.getByText("What is your age?")).toBeInTheDocument()

    // Step 2: Age
    fireEvent.click(screen.getByText("18 - 35"))
    expect(screen.getByText("What is your situation?")).toBeInTheDocument()

    // Step 3: Situation
    fireEvent.click(screen.getByText("Farmer"))
    expect(screen.getByText("What is your social category?")).toBeInTheDocument()

    // Step 4: Category triggers API call
    fireEvent.click(screen.getByText("SC"))

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })
  })

  it("calls /api/screen with correct profile payload", async () => {
    mockFetchSuccess([])
    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            gender: "female",
            age: 25,
            occupation: "farmer",
            category: "sc",
          },
        }),
      })
    })
  })

  it("shows results with match badges after API response", async () => {
    mockFetchSuccess()
    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })
    expect(screen.getByText("Likely Match")).toBeInTheDocument()
    expect(screen.getByText("Second Scheme")).toBeInTheDocument()
    expect(screen.getByText("Possible Match")).toBeInTheDocument()
  })

  it("shows profile summary bar on results", async () => {
    mockFetchSuccess()
    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })
    // Profile summary shows formatted profile
    expect(screen.getByText(/Female, Age 25, Farmer, SC/)).toBeInTheDocument()
  })

  it("Next Citizen resets wizard to step 1", async () => {
    mockFetchSuccess()
    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Next Citizen/))
    expect(screen.getByText("What is your gender?")).toBeInTheDocument()
  })

  it("Next Citizen increments citizen counter", async () => {
    mockFetchSuccess()
    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })

    // After first citizen, counter should be 1
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("session counter persists in localStorage", async () => {
    mockFetchSuccess()
    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })

    // Verify localStorage.setItem was called with session data
    const setCalls = vi.mocked(localStorage.setItem).mock.calls
    const sessionCall = setCalls.find(([key]) => key === "samgov_csc_session")
    expect(sessionCall).toBeTruthy()
    if (sessionCall) {
      const parsed = JSON.parse(sessionCall[1])
      expect(parsed.citizenCount).toBe(1)
      expect(parsed.schemesFound).toBe(2)
    }
  })

  it("daily reset: counter resets when date changes", () => {
    // Simulate yesterday's session stored
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === "samgov_csc_session") {
        return JSON.stringify({ date: "2020-01-01", citizenCount: 50, schemesFound: 200 })
      }
      return null
    })

    renderCSC()
    // Counter should show 0, not yesterday's 50
    const stats = screen.getAllByText("0")
    expect(stats.length).toBeGreaterThanOrEqual(2) // citizens + schemes
  })

  it("Print All Results calls window.print()", async () => {
    mockFetchSuccess()
    const printSpy = vi.fn()
    window.print = printSpy

    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("Print All Results"))
    expect(printSpy).toHaveBeenCalled()
  })

  it("shows Reset Today's Count and it clears counter", async () => {
    mockFetchSuccess()
    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })

    // There should be a reset button
    fireEvent.click(screen.getByText("Reset Today's Count"))

    // Counter should be reset to 0
    const stats = screen.getAllByText("0")
    expect(stats.length).toBeGreaterThanOrEqual(2)
  })

  it("renders in Kannada when language is kn", async () => {
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === "samgov-language") return "kn"
      return null
    })

    renderCSC("kn")
    await waitFor(() => {
      expect(screen.getByText("CSC ಆಪರೇಟರ್ ಮೋಡ್")).toBeInTheDocument()
    })
    expect(screen.getByText("CSC ಆಪರೇಟರ್‌ಗಳಿಗೆ ಮಾತ್ರ")).toBeInTheDocument()
  })

  it("shows error state on API failure", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"))

    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText(/Failed to find schemes/i)).toBeInTheDocument()
    })
  })

  it("does not save citizen profile to localStorage", async () => {
    mockFetchSuccess()
    renderCSC()
    completeWizard()

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })

    // Only CSC session should be saved, not screener profile
    const setCalls = vi.mocked(localStorage.setItem).mock.calls
    const profileCall = setCalls.find(([key]) => key === "samgov_screener_profile")
    expect(profileCall).toBeUndefined()
  })
})
