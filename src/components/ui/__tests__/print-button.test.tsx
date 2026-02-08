import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { PrintButton } from "../print-button"
import { LanguageProvider } from "@/lib/i18n"

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

describe("PrintButton", () => {
  it("renders with English text", () => {
    renderWithProvider(<PrintButton />)
    expect(screen.getByText("Print")).toBeInTheDocument()
  })

  it("renders with Kannada text when language is kn", () => {
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
      if (key === "samgov-language") return "kn"
      return null
    })
    renderWithProvider(<PrintButton />, "kn")
    expect(screen.getByText("ಮುದ್ರಿಸಿ")).toBeInTheDocument()
  })

  it("calls window.print when clicked", () => {
    const printSpy = vi.fn()
    window.print = printSpy

    renderWithProvider(<PrintButton />)
    fireEvent.click(screen.getByText("Print"))

    expect(printSpy).toHaveBeenCalledOnce()
  })

  it("has no-print class (hidden when printing)", () => {
    renderWithProvider(<PrintButton />)
    const button = screen.getByText("Print").closest("button")
    expect(button?.className).toContain("no-print")
  })

  it("applies custom className", () => {
    renderWithProvider(<PrintButton className="flex-1" />)
    const button = screen.getByText("Print").closest("button")
    expect(button?.className).toContain("flex-1")
  })
})
