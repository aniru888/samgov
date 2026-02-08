import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LanguageProvider } from "@/lib/i18n"
import { ProfileWizard } from "../profile-wizard"

function renderWizard(lang: "en" | "kn" = "en") {
  return render(
    <LanguageProvider defaultLanguage={lang}>
      <ProfileWizard />
    </LanguageProvider>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  // localStorage is globally mocked (vi.fn) in setup.ts — vi.restoreAllMocks
  // may not fully clear mockImplementation, so reset explicitly
  vi.mocked(localStorage.getItem).mockReturnValue(null)
  vi.mocked(localStorage.setItem).mockImplementation(() => {})
  vi.mocked(localStorage.removeItem).mockImplementation(() => {})
})

describe("ProfileWizard", () => {
  it("renders gender question as first step", () => {
    renderWizard()
    expect(screen.getByText("What is your gender?")).toBeInTheDocument()
    expect(screen.getByText("Female")).toBeInTheDocument()
    expect(screen.getByText("Male")).toBeInTheDocument()
    expect(screen.getByText("Other")).toBeInTheDocument()
  })

  it("renders in Kannada when language is kn", async () => {
    // localStorage is globally mocked (vi.fn) in setup.ts — must mock getItem
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === "samgov-language") return "kn"
      return null
    })
    renderWizard("kn")
    await waitFor(() => {
      expect(screen.getByText("ನಿಮ್ಮ ಲಿಂಗ ಯಾವುದು?")).toBeInTheDocument()
    })
    expect(screen.getByText("ಮಹಿಳೆ")).toBeInTheDocument()
    expect(screen.getByText("ಪುರುಷ")).toBeInTheDocument()
  })

  it("shows progress bar at step 1/4", () => {
    renderWizard()
    expect(screen.getByText("1/4")).toBeInTheDocument()
  })

  it("advances to age step when gender is selected", () => {
    renderWizard()
    fireEvent.click(screen.getByText("Female"))
    expect(screen.getByText("What is your age?")).toBeInTheDocument()
    expect(screen.getByText("2/4")).toBeInTheDocument()
  })

  it("advances to situation step after age", () => {
    renderWizard()
    fireEvent.click(screen.getByText("Female"))
    fireEvent.click(screen.getByText("18 - 35"))
    expect(screen.getByText("What is your situation?")).toBeInTheDocument()
    expect(screen.getByText("3/4")).toBeInTheDocument()
  })

  it("advances to category step after situation", () => {
    renderWizard()
    fireEvent.click(screen.getByText("Female"))
    fireEvent.click(screen.getByText("18 - 35"))
    fireEvent.click(screen.getByText("Farmer"))
    expect(screen.getByText("What is your social category?")).toBeInTheDocument()
    expect(screen.getByText("4/4")).toBeInTheDocument()
  })

  it("shows back button from step 2 onwards", () => {
    renderWizard()
    // No back on step 1
    expect(screen.queryByText("Back")).not.toBeInTheDocument()
    // Select gender
    fireEvent.click(screen.getByText("Male"))
    // Back button should appear
    expect(screen.getByText("Back")).toBeInTheDocument()
  })

  it("navigates back to previous step", () => {
    renderWizard()
    fireEvent.click(screen.getByText("Male"))
    expect(screen.getByText("What is your age?")).toBeInTheDocument()
    fireEvent.click(screen.getByText("Back"))
    expect(screen.getByText("What is your gender?")).toBeInTheDocument()
  })

  it("calls /api/screen on category selection and shows results", async () => {
    const mockResponse = {
      data: {
        schemes: [
          {
            slug: "test-scheme",
            name_en: "Test Scheme",
            name_kn: null,
            category: "agriculture",
            target_group: "Farmers",
            benefits_summary: "Test benefit",
            application_url: "https://example.com",
            required_documents: ["Aadhaar"],
            match_level: "likely",
            match_reasons: ["Targets farmers"],
            has_decision_tree: true,
          },
        ],
        total: 1,
      },
    }

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    renderWizard()
    fireEvent.click(screen.getByText("Female"))
    fireEvent.click(screen.getByText("18 - 35"))
    fireEvent.click(screen.getByText("Farmer"))
    fireEvent.click(screen.getByText("General"))

    await waitFor(() => {
      expect(screen.getByText("Test Scheme")).toBeInTheDocument()
    })

    expect(screen.getByText("Likely Match")).toBeInTheDocument()
    expect(screen.getByText("Targets farmers")).toBeInTheDocument()
    expect(screen.getByText(/1 schemes found/)).toBeInTheDocument()
  })

  it("shows API call with correct profile", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { schemes: [], total: 0 } }),
    })

    renderWizard()
    fireEvent.click(screen.getByText("Male"))
    fireEvent.click(screen.getByText("36 - 60"))
    fireEvent.click(screen.getByText("Student"))
    fireEvent.click(screen.getByText("SC"))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            gender: "male",
            age: 45,
            occupation: "student",
            category: "sc",
          },
        }),
      })
    })
  })

  it("shows no results message when no schemes match", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { schemes: [], total: 0 } }),
    })

    renderWizard()
    fireEvent.click(screen.getByText("Male"))
    fireEvent.click(screen.getByText("Over 60"))
    fireEvent.click(screen.getByText("Other"))
    fireEvent.click(screen.getByText("General"))

    await waitFor(() => {
      expect(screen.getByText(/No matching schemes found/i)).toBeInTheDocument()
    })
  })

  it("shows change answers button on results screen", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { schemes: [], total: 0 } }),
    })

    renderWizard()
    fireEvent.click(screen.getByText("Female"))
    fireEvent.click(screen.getByText("18 - 35"))
    fireEvent.click(screen.getByText("Worker / Labourer"))
    fireEvent.click(screen.getByText("OBC"))

    await waitFor(() => {
      expect(screen.getByText("Change Answers")).toBeInTheDocument()
    })
  })

  it("resets wizard when change answers is clicked", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { schemes: [], total: 0 } }),
    })

    renderWizard()
    fireEvent.click(screen.getByText("Female"))
    fireEvent.click(screen.getByText("18 - 35"))
    fireEvent.click(screen.getByText("Unemployed"))
    fireEvent.click(screen.getByText("Minority"))

    await waitFor(() => {
      expect(screen.getByText("Change Answers")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("Change Answers"))
    expect(screen.getByText("What is your gender?")).toBeInTheDocument()
  })

  it("shows error state on API failure", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"))

    renderWizard()
    fireEvent.click(screen.getByText("Male"))
    fireEvent.click(screen.getByText("18 - 35"))
    fireEvent.click(screen.getByText("Farmer"))
    fireEvent.click(screen.getByText("General"))

    await waitFor(() => {
      expect(screen.getByText(/Failed to find schemes/i)).toBeInTheDocument()
    })
  })

  it("restores from localStorage if previous results exist", async () => {
    const savedData = {
      profile: { gender: "female", age: 25, occupation: "student", category: "sc" },
      ageRange: "18to35",
      results: [
        {
          slug: "saved-scheme",
          name_en: "Saved Scheme",
          name_kn: null,
          category: null,
          target_group: null,
          benefits_summary: "Saved benefit",
          application_url: null,
          required_documents: null,
          match_level: "possible",
          match_reasons: ["Test"],
          has_decision_tree: false,
        },
      ],
    }
    // localStorage is globally mocked (vi.fn) in setup.ts — must mock getItem
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === "samgov_screener_profile") return JSON.stringify(savedData)
      return null
    })

    renderWizard()
    await waitFor(() => {
      expect(screen.getByText("Saved Scheme")).toBeInTheDocument()
    })
  })

  it("shows all situation options", () => {
    renderWizard()
    fireEvent.click(screen.getByText("Female"))
    fireEvent.click(screen.getByText("18 - 35"))

    expect(screen.getByText("Farmer")).toBeInTheDocument()
    expect(screen.getByText("Student")).toBeInTheDocument()
    expect(screen.getByText("Worker / Labourer")).toBeInTheDocument()
    expect(screen.getByText("Entrepreneur / Self-employed")).toBeInTheDocument()
    expect(screen.getByText("Unemployed")).toBeInTheDocument()
    expect(screen.getByText("Other")).toBeInTheDocument()
  })

  it("shows all category options", () => {
    renderWizard()
    fireEvent.click(screen.getByText("Male"))
    fireEvent.click(screen.getByText("18 - 35"))
    fireEvent.click(screen.getByText("Farmer"))

    expect(screen.getByText("General")).toBeInTheDocument()
    expect(screen.getByText("OBC")).toBeInTheDocument()
    expect(screen.getByText("SC")).toBeInTheDocument()
    expect(screen.getByText("ST")).toBeInTheDocument()
    expect(screen.getByText("Minority")).toBeInTheDocument()
  })
})
