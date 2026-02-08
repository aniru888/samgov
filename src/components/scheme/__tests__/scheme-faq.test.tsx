import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SchemeFAQ } from "../scheme-faq"
import { LanguageProvider } from "@/lib/i18n"
import type { FAQItem } from "@/lib/rules-engine/faq-extractor"

beforeEach(() => {
  vi.restoreAllMocks()
  vi.mocked(localStorage.getItem).mockReturnValue(null)
  vi.mocked(localStorage.setItem).mockImplementation(() => {})
})

function renderWithProvider(ui: React.ReactElement, lang: "en" | "kn" = "en") {
  return render(
    <LanguageProvider defaultLanguage={lang}>{ui}</LanguageProvider>
  )
}

const testFAQs: FAQItem[] = [
  {
    question: "Can I get Gruha Lakshmi if I'm not a Karnataka resident?",
    answer: "This scheme is only for Karnataka residents. Note: This is for guidance only.",
  },
  {
    question: "What are the income requirements for Gruha Lakshmi?",
    answer: "Your household income must be below Rs 2 lakh per year. Note: This is for guidance only.",
  },
]

describe("SchemeFAQ", () => {
  it("renders FAQ header", () => {
    renderWithProvider(
      <SchemeFAQ faqs={testFAQs} schemeName="Gruha Lakshmi" />
    )
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument()
  })

  it("renders all FAQ questions", () => {
    renderWithProvider(
      <SchemeFAQ faqs={testFAQs} schemeName="Gruha Lakshmi" />
    )
    expect(screen.getByText(/Karnataka resident/)).toBeInTheDocument()
    expect(screen.getByText(/income requirements/)).toBeInTheDocument()
  })

  it("expands answer when question is clicked", () => {
    renderWithProvider(
      <SchemeFAQ faqs={testFAQs} schemeName="Gruha Lakshmi" />
    )

    // Answer not visible initially
    expect(screen.queryByText(/only for Karnataka residents/)).not.toBeInTheDocument()

    // Click question
    fireEvent.click(screen.getByText(/Karnataka resident/))

    // Answer now visible
    expect(screen.getByText(/only for Karnataka residents/)).toBeInTheDocument()
  })

  it("collapses answer when clicked again", () => {
    renderWithProvider(
      <SchemeFAQ faqs={testFAQs} schemeName="Gruha Lakshmi" />
    )

    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[0])
    expect(screen.getByText(/only for Karnataka residents/)).toBeInTheDocument()

    fireEvent.click(buttons[0])
    expect(screen.queryByText(/only for Karnataka residents/)).not.toBeInTheDocument()
  })

  it("only opens one FAQ at a time", () => {
    renderWithProvider(
      <SchemeFAQ faqs={testFAQs} schemeName="Gruha Lakshmi" />
    )

    // Open first FAQ
    fireEvent.click(screen.getByText(/Karnataka resident/))
    expect(screen.getByText(/only for Karnataka residents/)).toBeInTheDocument()

    // Open second FAQ - first should close
    fireEvent.click(screen.getByText(/income requirements/))
    expect(screen.queryByText(/only for Karnataka residents/)).not.toBeInTheDocument()
    expect(screen.getByText(/below Rs 2 lakh/)).toBeInTheDocument()
  })

  it("returns null for empty FAQ list", () => {
    const { container } = renderWithProvider(
      <SchemeFAQ faqs={[]} schemeName="Test" />
    )
    expect(container.innerHTML).toBe("")
  })

  it("shows Kannada header when language is kn", () => {
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === "samgov-language") return "kn"
      return null
    })
    renderWithProvider(
      <SchemeFAQ faqs={testFAQs} schemeName="ಗೃಹ ಲಕ್ಷ್ಮಿ" />,
      "kn"
    )
    expect(screen.getByText("ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು")).toBeInTheDocument()
  })

  it("shows source disclaimer", () => {
    renderWithProvider(
      <SchemeFAQ faqs={testFAQs} schemeName="Gruha Lakshmi" />
    )
    expect(screen.getByText(/generated from eligibility rules/)).toBeInTheDocument()
  })

  it("has proper aria-expanded attributes", () => {
    renderWithProvider(
      <SchemeFAQ faqs={testFAQs} schemeName="Gruha Lakshmi" />
    )

    const buttons = screen.getAllByRole("button")
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false")

    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
  })
})
