import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { QRCodeDisplay } from "../qr-code"

// Mock qrcode library
const mockToCanvas = vi.fn()
vi.mock("qrcode", () => ({
  default: {
    toCanvas: (...args: unknown[]) => mockToCanvas(...args),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockToCanvas.mockResolvedValue(undefined)
})

describe("QRCodeDisplay", () => {
  it("renders a canvas element", () => {
    const { container } = render(<QRCodeDisplay url="https://example.com" />)
    const canvas = container.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })

  it("calls QRCode.toCanvas with correct URL", async () => {
    render(<QRCodeDisplay url="https://example.com/apply" />)

    await waitFor(() => {
      expect(mockToCanvas).toHaveBeenCalledWith(
        expect.any(HTMLCanvasElement),
        "https://example.com/apply",
        expect.objectContaining({
          width: 128,
          margin: 1,
        })
      )
    })
  })

  it("uses custom size", async () => {
    render(<QRCodeDisplay url="https://example.com" size={96} />)

    await waitFor(() => {
      expect(mockToCanvas).toHaveBeenCalledWith(
        expect.any(HTMLCanvasElement),
        "https://example.com",
        expect.objectContaining({ width: 96 })
      )
    })
  })

  it("has accessible aria-label", () => {
    const { container } = render(<QRCodeDisplay url="https://example.com" />)
    const canvas = container.querySelector("canvas")
    expect(canvas).toHaveAttribute("aria-label", "QR code for https://example.com")
    expect(canvas).toHaveAttribute("role", "img")
  })

  it("applies custom className", () => {
    const { container } = render(
      <QRCodeDisplay url="https://example.com" className="my-class" />
    )
    const canvas = container.querySelector("canvas")
    expect(canvas?.className).toContain("my-class")
  })

  it("renders nothing when QR generation fails", async () => {
    mockToCanvas.mockRejectedValue(new Error("QR generation failed"))

    const { container } = render(<QRCodeDisplay url="https://example.com" />)

    await waitFor(() => {
      expect(mockToCanvas).toHaveBeenCalled()
    })

    // Wait for error state to propagate
    await waitFor(() => {
      const canvas = container.querySelector("canvas")
      expect(canvas).not.toBeInTheDocument()
    })
  })
})
