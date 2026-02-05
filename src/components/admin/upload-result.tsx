"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface UploadResultData {
  document_id: string;
  chunk_count: number;
  skipped_duplicates: number;
  extraction_method: string;
  language: string;
  credits_used: number;
  cohere_calls_used: number;
}

interface UploadResultProps {
  result: UploadResultData;
  onReset: () => void;
}

export function UploadResult({ result, onReset }: UploadResultProps) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-6">
        {/* Success icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-green-800">
              Document Uploaded Successfully
            </h3>
            <p className="text-sm text-green-600">
              {result.chunk_count} chunks created
              {result.skipped_duplicates > 0 &&
                `, ${result.skipped_duplicates} duplicates skipped`}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500">Extraction</p>
            <p className="text-sm font-medium text-gray-900">
              {result.extraction_method === "ocr" ? "OCR (LlamaParse)" : "Native (pdf-parse)"}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500">Language</p>
            <p className="text-sm font-medium text-gray-900">
              {result.language === "kn"
                ? "Kannada"
                : result.language === "mixed"
                  ? "Mixed (EN/KN)"
                  : "English"}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500">LlamaParse Credits</p>
            <p className="text-sm font-medium text-gray-900">
              {result.credits_used}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500">Cohere Calls</p>
            <p className="text-sm font-medium text-gray-900">
              {result.cohere_calls_used}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onReset} className="flex-1 h-12">
            Upload Another
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
