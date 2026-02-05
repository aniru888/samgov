import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DocumentsManager } from "../documents-manager";

// Mock next/navigation
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/admin/documents",
}));

const mockDocuments = [
  {
    id: "doc-1",
    scheme_id: null,
    document_type: "circular",
    title: "Test Circular",
    filename: "circular.pdf",
    source_url: "https://example.gov.in/circular.pdf",
    circular_number: null,
    issue_date: null,
    extraction_method: "native",
    extraction_confidence: 0.95,
    is_active: true,
    created_at: "2024-06-15T10:00:00Z",
    updated_at: "2024-06-15T10:00:00Z",
    chunk_count: 5,
  },
];

const mockApiResponse = {
  success: true,
  data: {
    documents: mockDocuments,
    quota: {
      cohere: { used: 200, limit: 1000, pct: 20 },
      llamaparse: { used: 100, limit: 10000, pct: 1 },
      gemini: { used: 50, limit: 600, pct: 8 },
    },
  },
};

describe("DocumentsManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner initially", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {})); // Never resolves

    render(<DocumentsManager />);
    expect(screen.getByText("Loading documents...")).toBeInTheDocument();
  });

  it("renders documents after successful fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockApiResponse),
    });

    render(<DocumentsManager />);

    await waitFor(() => {
      expect(screen.getByText("Test Circular")).toBeInTheDocument();
    });
  });

  it("shows error state on fetch failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    render(<DocumentsManager />);

    await waitFor(() => {
      expect(screen.getByText("Failed to Load")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("shows error when API returns failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: false,
          error: "Database unavailable",
        }),
    });

    render(<DocumentsManager />);

    await waitFor(() => {
      expect(screen.getByText("Database unavailable")).toBeInTheDocument();
    });
  });

  it("renders quota dashboard after load", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockApiResponse),
    });

    render(<DocumentsManager />);

    await waitFor(() => {
      expect(screen.getByText("API Usage This Month")).toBeInTheDocument();
    });
  });

  it("renders tabs for Documents and Upload", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockApiResponse),
    });

    render(<DocumentsManager />);

    await waitFor(() => {
      expect(screen.getByText(/Documents \(1\)/)).toBeInTheDocument();
      expect(screen.getByText("Upload")).toBeInTheDocument();
    });
  });

  it("retries fetch on Try Again button click", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockApiResponse),
      });

    render(<DocumentsManager />);

    await waitFor(() => {
      expect(screen.getByText("Failed to Load")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByText("Test Circular")).toBeInTheDocument();
    });
  });

  it("has a refresh button", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockApiResponse),
    });

    render(<DocumentsManager />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /refresh/i })
      ).toBeInTheDocument();
    });
  });

  it("navigates to detail page on document select", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockApiResponse),
    });

    render(<DocumentsManager />);

    await waitFor(() => {
      expect(screen.getByText("Test Circular")).toBeInTheDocument();
    });

    // Click the document card (it's a button role)
    fireEvent.click(screen.getByText("Test Circular"));

    expect(mockPush).toHaveBeenCalledWith("/admin/documents/doc-1");
  });
});
