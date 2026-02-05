"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileDropZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  accept?: string;
  maxSizeBytes?: number;
  error?: string | null;
}

const MAX_SIZE_DEFAULT = 20 * 1024 * 1024; // 20MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDropZone({
  file,
  onFileSelect,
  onFileClear,
  accept = "application/pdf",
  maxSizeBytes = MAX_SIZE_DEFAULT,
  error,
}: FileDropZoneProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(
    null
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const displayError = error || validationError;

  function validateAndSetFile(selectedFile: File | undefined) {
    setValidationError(null);

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.endsWith(".pdf")
    ) {
      setValidationError("Only PDF files are accepted.");
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      setValidationError(
        `File too large. Maximum size is ${formatFileSize(maxSizeBytes)}.`
      );
      return;
    }

    onFileSelect(selectedFile);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    validateAndSetFile(e.target.files?.[0]);
    // Reset input value so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  // File selected state
  if (file) {
    return (
      <div
        className={cn(
          "border-2 border-solid border-teal-300 bg-teal-50 rounded-xl p-4",
          "flex items-center gap-3"
        )}
      >
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            onFileClear();
            setValidationError(null);
          }}
          aria-label="Remove file"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    );
  }

  // Empty / drag state
  return (
    <div>
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8",
          "flex flex-col items-center justify-center",
          "cursor-pointer transition-colors",
          dragActive
            ? "border-teal-500 bg-teal-50"
            : displayError
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white hover:border-teal-400 hover:bg-gray-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="Upload PDF file"
      >
        <svg
          className={cn(
            "w-10 h-10 mb-3",
            dragActive ? "text-teal-500" : "text-gray-400"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="text-sm font-medium text-gray-700 mb-1">
          {dragActive ? "Drop PDF here" : "Click or drag PDF here"}
        </p>
        <p className="text-xs text-gray-400">
          PDF only, max {formatFileSize(maxSizeBytes)}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {displayError && (
        <p className="text-sm text-red-600 mt-2">{displayError}</p>
      )}
    </div>
  );
}
