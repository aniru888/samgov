import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ResultStep } from "../result-step"
import { LanguageProvider } from "@/lib/i18n"
import type { ResultNode } from "@/lib/rules-engine"

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, "localStorage", { value: localStorageMock })

function renderWithProvider(ui: React.ReactElement) {
  return render(<LanguageProvider defaultLanguage="en">{ui}</LanguageProvider>)
}

const eligibleResult: ResultNode = {
  type: "result",
  status: "eligible",
  reason_en: "You may be eligible for this scheme.",
  reason_kn: "ನೀವು ಈ ಯೋಜನೆಗೆ ಅರ್ಹರಾಗಬಹುದು.",
  next_steps_en: "Apply on the official portal.",
  documents: ["Aadhaar Card", "Ration Card"],
}

const ineligibleResult: ResultNode = {
  type: "result",
  status: "ineligible",
  reason_en: "You do not meet the residency requirement.",
  fix_en: "This scheme is only for Karnataka residents.",
}

const needsReviewResult: ResultNode = {
  type: "result",
  status: "needs_review",
  reason_en: "Some documents need verification.",
  fix_en: "Please visit your local office with required documents.",
}

describe("ResultStep", () => {
  const mockOnReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it("renders eligible result with correct styling", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    expect(screen.getByText("You may meet basic eligibility criteria")).toBeInTheDocument()
    expect(screen.getByText("You may be eligible for this scheme.")).toBeInTheDocument()
  })

  it("renders ineligible result", () => {
    renderWithProvider(
      <ResultStep
        result={ineligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    expect(screen.getByText("There may be an eligibility issue")).toBeInTheDocument()
    expect(screen.getByText("You do not meet the residency requirement.")).toBeInTheDocument()
  })

  it("renders needs_review result", () => {
    renderWithProvider(
      <ResultStep
        result={needsReviewResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    expect(screen.getByText("Some criteria need verification")).toBeInTheDocument()
  })

  it("displays required documents when provided", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    expect(screen.getByText("Documents You Will Need")).toBeInTheDocument()
    expect(screen.getByText("Aadhaar Card")).toBeInTheDocument()
    expect(screen.getByText("Ration Card")).toBeInTheDocument()
  })

  it("displays fix text when provided", () => {
    renderWithProvider(
      <ResultStep
        result={ineligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    expect(screen.getByText("How to Fix")).toBeInTheDocument()
    expect(screen.getByText("This scheme is only for Karnataka residents.")).toBeInTheDocument()
  })

  it("shows disclaimer warning - CRITICAL", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    expect(screen.getByText("Important")).toBeInTheDocument()
    expect(screen.getByText(/NOT a government website/i)).toBeInTheDocument()
  })

  it("has link to official portal", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    const portalLink = screen.getByRole("link", { name: /check official portal/i })
    expect(portalLink).toHaveAttribute("href", "https://sevasindhu.karnataka.gov.in")
    expect(portalLink).toHaveAttribute("target", "_blank")
  })

  it("calls onReset when Start Over clicked", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    const resetButton = screen.getByRole("button", { name: /start over/i })
    fireEvent.click(resetButton)

    expect(mockOnReset).toHaveBeenCalled()
  })

  it("shows Apply Now button when schemeApplicationUrl is provided", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        schemeApplicationUrl="https://sevasindhu.karnataka.gov.in/gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    const applyLink = screen.getByRole("link", { name: /apply now/i })
    expect(applyLink).toHaveAttribute("href", "https://sevasindhu.karnataka.gov.in/gruha-lakshmi")
    expect(applyLink).toHaveAttribute("target", "_blank")
  })

  it("shows scheme DB documents as fallback when tree has none", () => {
    const resultWithoutDocs: ResultNode = {
      type: "result",
      status: "eligible",
      reason_en: "You may be eligible.",
    }

    renderWithProvider(
      <ResultStep
        result={resultWithoutDocs}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        schemeRequiredDocuments={["Income Certificate", "Caste Certificate"]}
        onReset={mockOnReset}
      />
    )

    expect(screen.getByText("Documents You Will Need")).toBeInTheDocument()
    expect(screen.getByText("Income Certificate")).toBeInTheDocument()
    expect(screen.getByText("Caste Certificate")).toBeInTheDocument()
  })

  it("has link to scheme details", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    const detailsLink = screen.getByRole("link", { name: /scheme details/i })
    expect(detailsLink).toHaveAttribute("href", "/schemes/gruha-lakshmi")
  })

  it("has WhatsApp share button with correct link", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        onReset={mockOnReset}
      />
    )

    const shareLink = screen.getByRole("link", { name: /share via whatsapp/i })
    expect(shareLink).toHaveAttribute("target", "_blank")
    const href = shareLink.getAttribute("href") || ""
    expect(href).toContain("https://wa.me/?text=")
    expect(href).toContain("Gruha%20Lakshmi")
    expect(href).toContain("Not%20a%20government%20website")
  })

  it("includes application URL in WhatsApp share when available", () => {
    renderWithProvider(
      <ResultStep
        result={eligibleResult}
        schemeName="Gruha Lakshmi"
        schemeSlug="gruha-lakshmi"
        schemeApplicationUrl="https://example.gov.in/apply"
        onReset={mockOnReset}
      />
    )

    const shareLink = screen.getByRole("link", { name: /share via whatsapp/i })
    const href = shareLink.getAttribute("href") || ""
    expect(href).toContain("https%3A%2F%2Fexample.gov.in%2Fapply")
  })
})
