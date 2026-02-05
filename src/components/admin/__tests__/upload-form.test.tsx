import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadForm } from "../upload-form";

const defaultQuota = {
  cohere: { used: 200, limit: 1000, pct: 20 },
  llamaparse: { used: 500, limit: 10000, pct: 5 },
  gemini: { used: 100, limit: 600, pct: 17 },
};

describe("UploadForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all required form fields", () => {
    render(<UploadForm quota={defaultQuota} onUploadComplete={vi.fn()} />);

    expect(screen.getByText("PDF File *")).toBeInTheDocument();
    expect(screen.getByText("Document Title *")).toBeInTheDocument();
    expect(screen.getByText("Document Type *")).toBeInTheDocument();
    expect(screen.getByText("Source URL *")).toBeInTheDocument();
  });

  it("renders optional fields", () => {
    render(<UploadForm quota={defaultQuota} onUploadComplete={vi.fn()} />);

    expect(screen.getByText("Scheme ID")).toBeInTheDocument();
    expect(screen.getByText("Circular Number")).toBeInTheDocument();
    expect(screen.getByText("Issue Date")).toBeInTheDocument();
  });

  it("disables submit button when required fields are empty", () => {
    render(<UploadForm quota={defaultQuota} onUploadComplete={vi.fn()} />);

    const button = screen.getByRole("button", { name: /upload document/i });
    expect(button).toBeDisabled();
  });

  it("shows amber warning when Cohere usage exceeds 80%", () => {
    const warningQuota = {
      ...defaultQuota,
      cohere: { used: 850, limit: 1000, pct: 85 },
    };

    render(<UploadForm quota={warningQuota} onUploadComplete={vi.fn()} />);
    expect(screen.getByText("API Quota Running Low")).toBeInTheDocument();
  });

  it("shows red warning when Cohere is exhausted", () => {
    const exhaustedQuota = {
      ...defaultQuota,
      cohere: { used: 1000, limit: 1000, pct: 100 },
    };

    render(<UploadForm quota={exhaustedQuota} onUploadComplete={vi.fn()} />);
    expect(screen.getByText("Embedding Quota Exhausted")).toBeInTheDocument();
  });

  it("disables submit button when Cohere is exhausted", () => {
    const exhaustedQuota = {
      ...defaultQuota,
      cohere: { used: 1000, limit: 1000, pct: 100 },
    };

    render(<UploadForm quota={exhaustedQuota} onUploadComplete={vi.fn()} />);
    const button = screen.getByRole("button", { name: /upload document/i });
    expect(button).toBeDisabled();
  });

  it("submits form data and shows success", async () => {
    const onUploadComplete = vi.fn();
    const mockResponse = {
      success: true,
      data: {
        document_id: "doc-123",
        chunk_count: 8,
        skipped_duplicates: 0,
        extraction_method: "native",
        language: "en",
        credits_used: 0,
        cohere_calls_used: 1,
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    render(
      <UploadForm quota={defaultQuota} onUploadComplete={onUploadComplete} />
    );

    // Fill required fields (except file - we need to set it differently)
    fireEvent.change(screen.getByPlaceholderText(/Gruha Lakshmi/), {
      target: { value: "Test Document" },
    });
    fireEvent.change(screen.getByLabelText("Document Type *"), {
      target: { value: "circular" },
    });
    fireEvent.change(screen.getByPlaceholderText(/sevasindhu/), {
      target: { value: "https://example.gov.in/doc.pdf" },
    });

    // File needs the FileDropZone's hidden input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const pdfFile = new File(["test"], "doc.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    // Now submit
    const submitButton = screen.getByRole("button", {
      name: /upload document/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Document Uploaded Successfully")).toBeInTheDocument();
    });

    expect(onUploadComplete).toHaveBeenCalledOnce();
  });

  it("shows error on upload failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: false,
          error: "Cohere quota exceeded",
        }),
    });

    render(<UploadForm quota={defaultQuota} onUploadComplete={vi.fn()} />);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Gruha Lakshmi/), {
      target: { value: "Test Document" },
    });
    fireEvent.change(screen.getByLabelText("Document Type *"), {
      target: { value: "circular" },
    });
    fireEvent.change(screen.getByPlaceholderText(/sevasindhu/), {
      target: { value: "https://example.gov.in/doc.pdf" },
    });

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const pdfFile = new File(["test"], "doc.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    fireEvent.click(
      screen.getByRole("button", { name: /upload document/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Cohere quota exceeded")).toBeInTheDocument();
    });
  });

  it("shows network error message", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    render(<UploadForm quota={defaultQuota} onUploadComplete={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/Gruha Lakshmi/), {
      target: { value: "Test Document" },
    });
    fireEvent.change(screen.getByLabelText("Document Type *"), {
      target: { value: "circular" },
    });
    fireEvent.change(screen.getByPlaceholderText(/sevasindhu/), {
      target: { value: "https://example.gov.in/doc.pdf" },
    });

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const pdfFile = new File(["test"], "doc.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    fireEvent.click(
      screen.getByRole("button", { name: /upload document/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });
});
