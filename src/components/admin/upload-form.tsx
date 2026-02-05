"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileDropZone } from "./file-drop-zone";
import { UploadResult, type UploadResultData } from "./upload-result";

interface QuotaData {
  cohere: { used: number; limit: number; pct: number };
  llamaparse: { used: number; limit: number; pct: number };
  gemini: { used: number; limit: number; pct: number };
}

interface UploadFormProps {
  quota: QuotaData;
  onUploadComplete: () => void;
}

type UploadStage = "idle" | "uploading" | "complete" | "error";

const DOCUMENT_TYPES = [
  { value: "circular", label: "Circular / Government Order" },
  { value: "faq", label: "FAQ Document" },
  { value: "guideline", label: "Guideline" },
  { value: "announcement", label: "Announcement" },
] as const;

export function UploadForm({ quota, onUploadComplete }: UploadFormProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [documentType, setDocumentType] = React.useState("");
  const [sourceUrl, setSourceUrl] = React.useState("");
  const [schemeId, setSchemeId] = React.useState("");
  const [circularNumber, setCircularNumber] = React.useState("");
  const [issueDate, setIssueDate] = React.useState("");

  const [stage, setStage] = React.useState<UploadStage>("idle");
  const [stageMessage, setStageMessage] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<UploadResultData | null>(null);

  const isFormValid = file && title.trim() && documentType && sourceUrl.trim();
  const cohereWarning = quota.cohere.pct >= 80;
  const cohereExhausted = quota.cohere.pct >= 100;

  function resetForm() {
    setFile(null);
    setTitle("");
    setDocumentType("");
    setSourceUrl("");
    setSchemeId("");
    setCircularNumber("");
    setIssueDate("");
    setStage("idle");
    setStageMessage("");
    setError(null);
    setResult(null);
  }

  async function handleUpload() {
    if (!file || !isFormValid) return;

    setStage("uploading");
    setStageMessage("Uploading and processing document...");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("document_type", documentType);
      formData.append("source_url", sourceUrl.trim());
      if (schemeId.trim()) formData.append("scheme_id", schemeId.trim());
      if (circularNumber.trim())
        formData.append("circular_number", circularNumber.trim());
      if (issueDate) formData.append("issue_date", issueDate);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        setStage("error");
        setError(data.error || "Upload failed. Please try again.");
        return;
      }

      setResult(data.data);
      setStage("complete");
      onUploadComplete();
    } catch (err) {
      setStage("error");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the server."
      );
    }
  }

  // Show result after successful upload
  if (stage === "complete" && result) {
    return <UploadResult result={result} onReset={resetForm} />;
  }

  return (
    <div className="space-y-4">
      {/* Cost warning */}
      {cohereExhausted && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
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
            <div>
              <p className="text-sm font-medium text-red-800">
                Embedding Quota Exhausted
              </p>
              <p className="text-sm text-red-600">
                Cohere monthly limit reached ({quota.cohere.used}/
                {quota.cohere.limit}). Uploads will fail until next month.
              </p>
            </div>
          </div>
        </div>
      )}

      {!cohereExhausted && cohereWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
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
            <div>
              <p className="text-sm font-medium text-amber-800">
                API Quota Running Low
              </p>
              <p className="text-sm text-amber-600">
                Cohere embedding calls at {quota.cohere.pct}% (
                {quota.cohere.used}/{quota.cohere.limit}).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File drop zone */}
      <div>
        <Label className="mb-2 block">PDF File *</Label>
        <FileDropZone
          file={file}
          onFileSelect={setFile}
          onFileClear={() => setFile(null)}
        />
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="upload-title" className="mb-2 block">
          Document Title *
        </Label>
        <Input
          id="upload-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Gruha Lakshmi Scheme Guidelines 2025"
          disabled={stage === "uploading"}
        />
      </div>

      {/* Document type */}
      <div>
        <Label htmlFor="upload-type" className="mb-2 block">
          Document Type *
        </Label>
        <select
          id="upload-type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          disabled={stage === "uploading"}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs",
            "transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !documentType && "text-muted-foreground"
          )}
        >
          <option value="" disabled>
            Select type...
          </option>
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Source URL */}
      <div>
        <Label htmlFor="upload-url" className="mb-2 block">
          Source URL *
        </Label>
        <Input
          id="upload-url"
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://sevasindhu.karnataka.gov.in/..."
          disabled={stage === "uploading"}
        />
        <p className="text-xs text-gray-400 mt-1">
          Official URL where this document was obtained
        </p>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="upload-scheme" className="mb-2 block">
            Scheme ID
          </Label>
          <Input
            id="upload-scheme"
            value={schemeId}
            onChange={(e) => setSchemeId(e.target.value)}
            placeholder="Optional UUID"
            disabled={stage === "uploading"}
          />
        </div>
        <div>
          <Label htmlFor="upload-circular" className="mb-2 block">
            Circular Number
          </Label>
          <Input
            id="upload-circular"
            value={circularNumber}
            onChange={(e) => setCircularNumber(e.target.value)}
            placeholder="e.g., GO/2024/WCD/123"
            disabled={stage === "uploading"}
          />
        </div>
      </div>

      <div className="max-w-xs">
        <Label htmlFor="upload-date" className="mb-2 block">
          Issue Date
        </Label>
        <Input
          id="upload-date"
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          disabled={stage === "uploading"}
        />
      </div>

      {/* Error message */}
      {stage === "error" && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Upload button */}
      <Button
        onClick={handleUpload}
        disabled={!isFormValid || stage === "uploading" || cohereExhausted}
        className="w-full h-12"
      >
        {stage === "uploading" ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {stageMessage}
          </span>
        ) : (
          "Upload Document"
        )}
      </Button>
    </div>
  );
}
