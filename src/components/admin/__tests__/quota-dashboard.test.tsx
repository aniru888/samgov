import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuotaDashboard } from "../quota-dashboard";

const defaultQuota = {
  cohere: { used: 200, limit: 1000, pct: 20 },
  llamaparse: { used: 500, limit: 10000, pct: 5 },
  gemini: { used: 100, limit: 600, pct: 17 },
};

describe("QuotaDashboard", () => {
  it("renders all three service bars", () => {
    render(<QuotaDashboard quota={defaultQuota} />);

    expect(screen.getByText("Cohere Embeddings")).toBeInTheDocument();
    expect(screen.getByText("LlamaParse OCR")).toBeInTheDocument();
    expect(screen.getByText("Gemini Q&A")).toBeInTheDocument();
  });

  it("displays usage numbers and percentages", () => {
    render(<QuotaDashboard quota={defaultQuota} />);

    expect(screen.getByText(/200 \/ 1,000/)).toBeInTheDocument();
    expect(screen.getByText(/20%/)).toBeInTheDocument();
    expect(screen.getByText(/500 \/ 10,000/)).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });

  it("renders progress bars with correct aria attributes", () => {
    render(<QuotaDashboard quota={defaultQuota} />);

    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(3);
    expect(bars[0]).toHaveAttribute("aria-valuenow", "20");
    expect(bars[0]).toHaveAttribute("aria-label", "Cohere Embeddings usage");
  });

  it("applies amber color when usage exceeds 80%", () => {
    const warningQuota = {
      ...defaultQuota,
      cohere: { used: 850, limit: 1000, pct: 85 },
    };

    render(<QuotaDashboard quota={warningQuota} />);

    const bars = screen.getAllByRole("progressbar");
    expect(bars[0]).toHaveClass("bg-amber-500");
  });

  it("applies red color when usage reaches 100%", () => {
    const exhaustedQuota = {
      ...defaultQuota,
      cohere: { used: 1000, limit: 1000, pct: 100 },
    };

    render(<QuotaDashboard quota={exhaustedQuota} />);

    const bars = screen.getAllByRole("progressbar");
    expect(bars[0]).toHaveClass("bg-red-500");
  });

  it("applies teal color for normal usage", () => {
    render(<QuotaDashboard quota={defaultQuota} />);

    const bars = screen.getAllByRole("progressbar");
    expect(bars[0]).toHaveClass("bg-teal-500");
  });

  it("displays section title", () => {
    render(<QuotaDashboard quota={defaultQuota} />);

    expect(screen.getByText("API Usage This Month")).toBeInTheDocument();
  });
});
