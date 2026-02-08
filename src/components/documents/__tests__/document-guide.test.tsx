import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { LanguageProvider } from "@/lib/i18n"
import { DocumentWithGuide, DocumentList } from "../document-guide"

function renderWithProvider(ui: React.ReactElement, lang: "en" | "kn" = "en") {
  return render(
    <LanguageProvider defaultLanguage={lang}>{ui}</LanguageProvider>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.mocked(localStorage.getItem).mockReturnValue(null)
  vi.mocked(localStorage.setItem).mockImplementation(() => {})
})

describe("DocumentWithGuide", () => {
  it("renders document name with checkmark", () => {
    renderWithProvider(<DocumentWithGuide name="Aadhaar Card" />)
    expect(screen.getByText("Aadhaar Card")).toBeInTheDocument()
    expect(screen.getByText("✓")).toBeInTheDocument()
  })

  it("shows 'How to get' button for known documents", () => {
    renderWithProvider(<DocumentWithGuide name="Aadhaar Card" />)
    expect(screen.getByText("How to get")).toBeInTheDocument()
  })

  it("does not show guide button for unknown documents", () => {
    renderWithProvider(<DocumentWithGuide name="KSRTC Employee ID Card" />)
    expect(screen.getByText("KSRTC Employee ID Card")).toBeInTheDocument()
    expect(screen.queryByText("How to get")).not.toBeInTheDocument()
  })

  it("expands guide details when clicked", () => {
    renderWithProvider(<DocumentWithGuide name="Income Certificate" />)

    // Guide not visible initially
    expect(screen.queryByText("Tahsildar Office / Nadakacheri / Atalji Janasnehi Kendra")).not.toBeInTheDocument()

    // Click to expand
    fireEvent.click(screen.getByText("How to get"))

    // Guide details now visible
    expect(screen.getByText(/Tahsildar Office/)).toBeInTheDocument()
    expect(screen.getByText(/7-15 working days/)).toBeInTheDocument()
    expect(screen.getByText(/₹25/)).toBeInTheDocument()
  })

  it("shows online portal link when available", () => {
    renderWithProvider(<DocumentWithGuide name="Income Certificate" />)
    fireEvent.click(screen.getByText("How to get"))

    const link = screen.getByText(/Nadakacheri Portal/)
    expect(link).toHaveAttribute("href", "https://nadakacheri.karnataka.gov.in")
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("collapses guide when clicked again", () => {
    renderWithProvider(<DocumentWithGuide name="Aadhaar Card" />)

    fireEvent.click(screen.getByText("How to get"))
    expect(screen.getByText(/myAadhaar Portal/)).toBeInTheDocument()

    fireEvent.click(screen.getByText("Hide guide"))
    expect(screen.queryByText(/myAadhaar Portal/)).not.toBeInTheDocument()
  })

  it("shows tip section when available", () => {
    renderWithProvider(<DocumentWithGuide name="Aadhaar Card" />)
    fireEvent.click(screen.getByText("How to get"))

    expect(screen.getByText(/e-Aadhaar/)).toBeInTheDocument()
  })
})

describe("DocumentList", () => {
  it("renders all documents", () => {
    renderWithProvider(
      <DocumentList documents={["Aadhaar Card", "Bank Passbook", "Unknown Doc"]} />
    )

    expect(screen.getByText("Aadhaar Card")).toBeInTheDocument()
    expect(screen.getByText("Bank Passbook")).toBeInTheDocument()
    expect(screen.getByText("Unknown Doc")).toBeInTheDocument()
  })

  it("shows guides available count", () => {
    renderWithProvider(
      <DocumentList documents={["Aadhaar Card", "Bank Passbook", "Unknown Doc"]} />
    )

    // 2 of 3 documents have guides
    expect(screen.getByText("2 guides available")).toBeInTheDocument()
  })

  it("shows header text", () => {
    renderWithProvider(
      <DocumentList documents={["Aadhaar Card"]} />
    )

    expect(screen.getByText("Documents You Will Need")).toBeInTheDocument()
  })

  it("returns null for empty document list", () => {
    const { container } = renderWithProvider(<DocumentList documents={[]} />)
    expect(container.innerHTML).toBe("")
  })

  it("shows Kannada guide labels when language is kn", () => {
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === "samgov-language") return "kn"
      return null
    })

    renderWithProvider(
      <DocumentList documents={["Aadhaar Card"]} />,
      "kn"
    )

    expect(screen.getByText("ನಿಮಗೆ ಬೇಕಾದ ದಾಖಲೆಗಳು")).toBeInTheDocument()
    expect(screen.getByText("ಪಡೆಯುವ ವಿಧಾನ")).toBeInTheDocument()
  })
})
