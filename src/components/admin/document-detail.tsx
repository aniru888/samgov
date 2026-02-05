"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentData {
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
  language_detected: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  chunk_count: number;
}

interface DocumentDetailProps {
  documentId: string;
}

type Stage = "loading" | "loaded" | "error" | "archiving" | "confirm-archive";

const typeBadgeColors: Record<string, string> = {
  circular: "bg-teal-100 text-teal-700",
  faq: "bg-blue-100 text-blue-700",
  guideline: "bg-purple-100 text-purple-700",
  announcement: "bg-orange-100 text-orange-700",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DocumentDetail({ documentId }: DocumentDetailProps) {
  const router = useRouter();
  const [document, setDocument] = React.useState<DocumentData | null>(null);
  const [stage, setStage] = React.useState<Stage>("loading");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchDocument() {
      setStage("loading");
      setError(null);

      try {
        const response = await fetch(`/api/documents/${documentId}`);
        const result = await response.json();

        if (!result.success) {
          setStage("error");
          setError(result.error || "Document not found.");
          return;
        }

        setDocument(result.data);
        setStage("loaded");
      } catch (err) {
        setStage("error");
        setError(
          err instanceof Error
            ? err.message
            : "Failed to connect to the server."
        );
      }
    }

    fetchDocument();
  }, [documentId]);

  async function handleArchive() {
    setStage("archiving");

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        setStage("loaded");
        setError(result.error || "Failed to archive document.");
        return;
      }

      router.push("/admin/documents");
    } catch (err) {
      setStage("loaded");
      setError(
        err instanceof Error ? err.message : "Failed to connect to the server."
      );
    }
  }

  // Loading state
  if (stage === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  // Error state (no document loaded)
  if (stage === "error" && !document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Document Not Found
        </h2>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          {error}
        </p>
        <Button onClick={() => router.push("/admin/documents")}>
          Back to Documents
        </Button>
      </div>
    );
  }

  if (!document) return null;

  const badgeColor =
    typeBadgeColors[document.document_type] || "bg-gray-100 text-gray-700";

  return (
    <div className="space-y-4">
      {/* Back link */}
      <button
        onClick={() => router.push("/admin/documents")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Documents
      </button>

      {/* Title section */}
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">
          {document.title}
        </h1>
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

      {/* Metadata card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Filename</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {document.filename}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p
                className={cn(
                  "text-sm font-medium",
                  document.is_active ? "text-green-700" : "text-gray-500"
                )}
              >
                {document.is_active ? "Active" : "Archived"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Extraction</p>
              <p className="text-sm font-medium text-gray-900">
                {document.extraction_method === "ocr"
                  ? "OCR (LlamaParse)"
                  : "Native (pdf-parse)"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Chunks</p>
              <p className="text-sm font-medium text-gray-900">
                {document.chunk_count}
              </p>
            </div>
            {document.extraction_confidence != null && (
              <div>
                <p className="text-xs text-gray-500">Confidence</p>
                <p className="text-sm font-medium text-gray-900">
                  {Math.round(document.extraction_confidence * 100)}%
                </p>
              </div>
            )}
            {document.language_detected && (
              <div>
                <p className="text-xs text-gray-500">Language</p>
                <p className="text-sm font-medium text-gray-900">
                  {document.language_detected === "kn"
                    ? "Kannada"
                    : document.language_detected === "mixed"
                      ? "Mixed (EN/KN)"
                      : "English"}
                </p>
              </div>
            )}
          </div>

          {/* Source URL */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Source URL</p>
            <a
              href={document.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-600 hover:underline break-all"
            >
              {document.source_url}
            </a>
          </div>

          {/* Optional fields */}
          {document.circular_number && (
            <div>
              <p className="text-xs text-gray-500">Circular Number</p>
              <p className="text-sm font-medium text-gray-900">
                {document.circular_number}
              </p>
            </div>
          )}
          {document.issue_date && (
            <div>
              <p className="text-xs text-gray-500">Issue Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(document.issue_date)}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm text-gray-600">
                {formatDateTime(document.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Updated</p>
              <p className="text-sm text-gray-600">
                {formatDateTime(document.updated_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inline error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Archive confirmation */}
      {stage === "confirm-archive" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-amber-800 mb-2">
              Archive this document?
            </p>
            <p className="text-sm text-amber-700 mb-4">
              This will hide the document from search results. Chunks are
              preserved for audit trail.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStage("loaded")}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleArchive}
              >
                Confirm Archive
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archiving spinner */}
      {stage === "archiving" && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          Archiving document...
        </div>
      )}

      {/* Actions */}
      {document.is_active &&
        stage !== "confirm-archive" &&
        stage !== "archiving" && (
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setStage("confirm-archive")}
          >
            Archive Document
          </Button>
        )}
    </div>
  );
}
