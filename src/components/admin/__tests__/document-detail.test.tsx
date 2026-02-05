import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DocumentDetail } from "../document-detail";

// Mock next/navigation
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/admin/documents/doc-1",
}));

const mockDocument = {
  id: "doc-1",
  scheme_id: null,
  document_type: "circular",
  title: "Gruha Lakshmi Guidelines 2025",
  filename: "gruha-lakshmi.pdf",
  source_url: "https://sevasindhu.karnataka.gov.in/doc.pdf",
  circular_number: "GO/2024/WCD/123",
  issue_date: "2024-06-15",
  extraction_method: "native",
  extraction_confidence: 0.95,
  language_detected: "en",
  is_active: true,
  created_at: "2024-06-15T10:00:00Z",
  updated_at: "2024-06-15T10:00:00Z",
  chunk_count: 12,
};

describe("DocumentDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

    render(<DocumentDetail documentId="doc-1" />);
    expect(screen.getByText("Loading document...")).toBeInTheDocument();
  });

  it("renders document details after successful fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: true, data: mockDocument }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(
        screen.getByText("Gruha Lakshmi Guidelines 2025")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("gruha-lakshmi.pdf")).toBeInTheDocument();
    expect(screen.getByText("circular")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Native (pdf-parse)")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("GO/2024/WCD/123")).toBeInTheDocument();
  });

  it("shows error state when document not found", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: false,
          error: "Document not found",
        }),
    });

    render(<DocumentDetail documentId="bad-id" />);

    await waitFor(() => {
      expect(screen.getByText("Document Not Found")).toBeInTheDocument();
    });
  });

  it("shows network error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Connection lost"));

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(screen.getByText("Connection lost")).toBeInTheDocument();
    });
  });

  it("navigates back to documents on back button click", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: true, data: mockDocument }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(
        screen.getByText("Gruha Lakshmi Guidelines 2025")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Back to Documents"));
    expect(mockPush).toHaveBeenCalledWith("/admin/documents");
  });

  it("shows archive button for active documents", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: true, data: mockDocument }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /archive document/i })
      ).toBeInTheDocument();
    });
  });

  it("does not show archive button for archived documents", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockDocument, is_active: false },
        }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      // "Archived" appears in both the badge and the status field
      expect(screen.getAllByText("Archived")).toHaveLength(2);
    });

    expect(
      screen.queryByRole("button", { name: /archive document/i })
    ).not.toBeInTheDocument();
  });

  it("shows inline confirmation on archive click", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: true, data: mockDocument }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /archive document/i })
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /archive document/i })
    );

    expect(screen.getByText("Archive this document?")).toBeInTheDocument();
    expect(
      screen.getByText(/will hide the document from search results/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancel/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm archive/i })
    ).toBeInTheDocument();
  });

  it("cancels archive confirmation", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: true, data: mockDocument }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /archive document/i })
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /archive document/i })
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(
      screen.queryByText("Archive this document?")
    ).not.toBeInTheDocument();
  });

  it("archives document and navigates back", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({ success: true, data: mockDocument }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            data: { id: "doc-1", title: "Gruha Lakshmi Guidelines 2025" },
          }),
      });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /archive document/i })
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /archive document/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /confirm archive/i })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/documents");
    });

    // Verify DELETE was called
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/documents/doc-1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("renders source URL as link", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: true, data: mockDocument }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      const link = screen.getByText(
        "https://sevasindhu.karnataka.gov.in/doc.pdf"
      );
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute(
        "href",
        "https://sevasindhu.karnataka.gov.in/doc.pdf"
      );
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("displays Kannada language label", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockDocument, language_detected: "kn" },
        }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(screen.getByText("Kannada")).toBeInTheDocument();
    });
  });

  it("displays OCR extraction label", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockDocument, extraction_method: "ocr" },
        }),
    });

    render(<DocumentDetail documentId="doc-1" />);

    await waitFor(() => {
      expect(screen.getByText("OCR (LlamaParse)")).toBeInTheDocument();
    });
  });
});
