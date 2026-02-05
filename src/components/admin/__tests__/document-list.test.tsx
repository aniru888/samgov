import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DocumentList } from "../document-list";
import type { DocumentItem } from "../document-card";

function makeDocument(
  id: string,
  overrides: Partial<DocumentItem> = {}
): DocumentItem {
  return {
    id,
    scheme_id: null,
    document_type: "circular",
    title: `Document ${id}`,
    filename: `doc-${id}.pdf`,
    source_url: "https://example.gov.in/doc.pdf",
    circular_number: null,
    issue_date: null,
    extraction_method: "native",
    extraction_confidence: 0.9,
    is_active: true,
    created_at: "2024-06-15T10:00:00Z",
    updated_at: "2024-06-15T10:00:00Z",
    chunk_count: 5,
    ...overrides,
  };
}

describe("DocumentList", () => {
  it("shows empty state when no documents", () => {
    render(<DocumentList documents={[]} onSelectDocument={vi.fn()} />);

    expect(screen.getByText("No documents yet")).toBeInTheDocument();
    expect(
      screen.getByText(/Upload PDF documents to build/)
    ).toBeInTheDocument();
  });

  it("renders correct number of cards", () => {
    const docs = [makeDocument("1"), makeDocument("2"), makeDocument("3")];
    render(<DocumentList documents={docs} onSelectDocument={vi.fn()} />);

    expect(screen.getByText("Document 1")).toBeInTheDocument();
    expect(screen.getByText("Document 2")).toBeInTheDocument();
    expect(screen.getByText("Document 3")).toBeInTheDocument();
  });

  it("renders mix of active and archived documents", () => {
    const docs = [
      makeDocument("1", { is_active: true }),
      makeDocument("2", { is_active: false }),
    ];
    render(<DocumentList documents={docs} onSelectDocument={vi.fn()} />);

    expect(screen.getByText("Document 1")).toBeInTheDocument();
    expect(screen.getByText("Document 2")).toBeInTheDocument();
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("renders single document", () => {
    render(
      <DocumentList
        documents={[makeDocument("1")]}
        onSelectDocument={vi.fn()}
      />
    );

    expect(screen.getByText("Document 1")).toBeInTheDocument();
    expect(screen.queryByText("No documents yet")).not.toBeInTheDocument();
  });
});
