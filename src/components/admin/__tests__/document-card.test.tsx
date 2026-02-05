import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DocumentCard, type DocumentItem } from "../document-card";

function makeDocument(overrides: Partial<DocumentItem> = {}): DocumentItem {
  return {
    id: "doc-1",
    scheme_id: null,
    document_type: "circular",
    title: "Gruha Lakshmi Scheme Guidelines",
    filename: "gruha-lakshmi.pdf",
    source_url: "https://example.gov.in/doc.pdf",
    circular_number: "GO/2024/WCD/123",
    issue_date: "2024-06-15",
    extraction_method: "native",
    extraction_confidence: 0.95,
    is_active: true,
    created_at: "2024-06-15T10:00:00Z",
    updated_at: "2024-06-15T10:00:00Z",
    chunk_count: 12,
    ...overrides,
  };
}

describe("DocumentCard", () => {
  it("renders document title", () => {
    render(<DocumentCard document={makeDocument()} onSelect={vi.fn()} />);
    expect(
      screen.getByText("Gruha Lakshmi Scheme Guidelines")
    ).toBeInTheDocument();
  });

  it("renders type badge", () => {
    render(<DocumentCard document={makeDocument()} onSelect={vi.fn()} />);
    expect(screen.getByText("circular")).toBeInTheDocument();
  });

  it("renders chunk count", () => {
    render(<DocumentCard document={makeDocument()} onSelect={vi.fn()} />);
    expect(screen.getByText("12 chunks")).toBeInTheDocument();
  });

  it("renders extraction method", () => {
    render(<DocumentCard document={makeDocument()} onSelect={vi.fn()} />);
    expect(screen.getByText("Native extraction")).toBeInTheDocument();
  });

  it("renders OCR label for ocr extraction", () => {
    render(
      <DocumentCard
        document={makeDocument({ extraction_method: "ocr" })}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText("OCR extraction")).toBeInTheDocument();
  });

  it("shows Archived badge when inactive", () => {
    render(
      <DocumentCard
        document={makeDocument({ is_active: false })}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("does not show Archived badge when active", () => {
    render(<DocumentCard document={makeDocument()} onSelect={vi.fn()} />);
    expect(screen.queryByText("Archived")).not.toBeInTheDocument();
  });

  it("renders circular number when present", () => {
    render(<DocumentCard document={makeDocument()} onSelect={vi.fn()} />);
    expect(screen.getByText("GO/2024/WCD/123")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(<DocumentCard document={makeDocument()} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("calls onSelect on Enter key", () => {
    const onSelect = vi.fn();
    render(<DocumentCard document={makeDocument()} onSelect={onSelect} />);

    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("has reduced opacity when archived", () => {
    const { container } = render(
      <DocumentCard
        document={makeDocument({ is_active: false })}
        onSelect={vi.fn()}
      />
    );

    // The Card wrapper gets opacity-60 class
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("opacity-60");
  });
});
