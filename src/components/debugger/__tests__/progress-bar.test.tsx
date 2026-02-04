import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ProgressBar } from "../progress-bar"
import { LanguageProvider } from "@/lib/i18n"

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

describe("ProgressBar", () => {
  it("renders current step and total", () => {
    renderWithProvider(
      <ProgressBar currentStep={2} totalSteps={5} percentComplete={40} />
    )

    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument()
    expect(screen.getByText("40%")).toBeInTheDocument()
  })

  it("renders progress bar with correct width", () => {
    renderWithProvider(
      <ProgressBar currentStep={3} totalSteps={4} percentComplete={75} />
    )

    const progressBar = screen.getByRole("progressbar")
    expect(progressBar).toHaveAttribute("aria-valuenow", "75")
    expect(progressBar).toHaveStyle({ width: "75%" })
  })

  it("has correct ARIA attributes", () => {
    renderWithProvider(
      <ProgressBar currentStep={1} totalSteps={3} percentComplete={33} />
    )

    const progressBar = screen.getByRole("progressbar")
    expect(progressBar).toHaveAttribute("aria-valuemin", "0")
    expect(progressBar).toHaveAttribute("aria-valuemax", "100")
  })

  it("shows 100% when complete", () => {
    renderWithProvider(
      <ProgressBar currentStep={5} totalSteps={5} percentComplete={100} />
    )

    expect(screen.getByText("100%")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = renderWithProvider(
      <ProgressBar
        currentStep={1}
        totalSteps={2}
        percentComplete={50}
        className="custom-class"
      />
    )

    expect(container.firstChild).toHaveClass("custom-class")
  })
})
