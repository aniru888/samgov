"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DocumentItem {
  id: string;
  scheme_id: string | null;
  document_type: string;
  title: string;
  filename: string;
  source_url: string;
  circular_number: string | null;
  issue_date: string | null;
  extraction_method: string | null;
  extraction_confidence: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  chunk_count: number;
}

interface DocumentCardProps {
  document: DocumentItem;
  onSelect: () => void;
}

const typeBadgeColors: Record<string, string> = {
  circular: "bg-teal-100 text-teal-700",
  faq: "bg-blue-100 text-blue-700",
  guideline: "bg-purple-100 text-purple-700",
  announcement: "bg-orange-100 text-orange-700",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DocumentCard({ document, onSelect }: DocumentCardProps) {
  const badgeColor =
    typeBadgeColors[document.document_type] || "bg-gray-100 text-gray-700";

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        !document.is_active && "opacity-60"
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <CardContent className="p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-medium text-gray-900 line-clamp-2">
            {document.title}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!document.is_active && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                Archived
              </span>
            )}
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                badgeColor
              )}
            >
              {document.document_type}
            </span>
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{document.chunk_count} chunks</span>
          <span className="text-gray-300">|</span>
          <span>
            {document.extraction_method === "ocr" ? "OCR" : "Native"} extraction
          </span>
          <span className="text-gray-300">|</span>
          <span>{formatDate(document.created_at)}</span>
        </div>

        {/* Circular number if present */}
        {document.circular_number && (
          <p className="text-xs text-gray-400 mt-1">
            {document.circular_number}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
