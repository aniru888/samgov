import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { QuestionStep } from "../question-step"
import { LanguageProvider } from "@/lib/i18n"
import type { QuestionNode } from "@/lib/rules-engine"

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

const mockQuestion: QuestionNode = {
  type: "question",
  text_en: "Are you a resident of Karnataka?",
  text_kn: "ನೀವು ಕರ್ನಾಟಕದ ನಿವಾಸಿಯೇ?",
  options: [
    { label: "Yes", label_kn: "ಹೌದು", next: "q2" },
    { label: "No", label_kn: "ಇಲ್ಲ", next: "r_no" },
  ],
}

describe("QuestionStep", () => {
  const mockOnAnswer = vi.fn()
  const mockOnBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it("renders question text", () => {
    renderWithProvider(
      <QuestionStep
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        onBack={mockOnBack}
        canGoBack={false}
      />
    )

    expect(screen.getByText("Are you a resident of Karnataka?")).toBeInTheDocument()
  })

  it("renders all options", () => {
    renderWithProvider(
      <QuestionStep
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        onBack={mockOnBack}
        canGoBack={false}
      />
    )

    expect(screen.getByText("Yes")).toBeInTheDocument()
    expect(screen.getByText("No")).toBeInTheDocument()
  })

  it("allows selecting an option", () => {
    renderWithProvider(
      <QuestionStep
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        onBack={mockOnBack}
        canGoBack={false}
      />
    )

    const yesButton = screen.getByText("Yes").closest("button")!
    fireEvent.click(yesButton)

    expect(yesButton).toHaveAttribute("aria-pressed", "true")
  })

  it("next button is disabled until option selected", () => {
    renderWithProvider(
      <QuestionStep
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        onBack={mockOnBack}
        canGoBack={false}
      />
    )

    const nextButton = screen.getByRole("button", { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it("calls onAnswer with correct index when submitting", () => {
    renderWithProvider(
      <QuestionStep
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        onBack={mockOnBack}
        canGoBack={false}
      />
    )

    // Select "No" option (index 1)
    const noButton = screen.getByText("No").closest("button")!
    fireEvent.click(noButton)

    // Click next
    const nextButton = screen.getByRole("button", { name: /next/i })
    fireEvent.click(nextButton)

    expect(mockOnAnswer).toHaveBeenCalledWith(1)
  })

  it("shows back button when canGoBack is true", () => {
    renderWithProvider(
      <QuestionStep
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        onBack={mockOnBack}
        canGoBack={true}
      />
    )

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument()
  })

  it("hides back button when canGoBack is false", () => {
    renderWithProvider(
      <QuestionStep
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        onBack={mockOnBack}
        canGoBack={false}
      />
    )

    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument()
  })

  it("calls onBack when back button clicked", () => {
    renderWithProvider(
      <QuestionStep
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        onBack={mockOnBack}
        canGoBack={true}
      />
    )

    const backButton = screen.getByRole("button", { name: /back/i })
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalled()
  })
})
