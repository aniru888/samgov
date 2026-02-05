"use client";

import { useState } from "react";
import type { Citation } from "@/lib/rag";

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs font-medium flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-gray-900 truncate">
            {citation.document_title}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-sm">
          <p className="text-gray-700 mb-2">{citation.excerpt}</p>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {citation.section && (
              <span className="bg-gray-200 px-1.5 py-0.5 rounded">
                Section: {citation.section}
              </span>
            )}
            {citation.page && (
              <span className="bg-gray-200 px-1.5 py-0.5 rounded">
                Page {citation.page}
              </span>
            )}
            {citation.circular_number && (
              <span className="bg-gray-200 px-1.5 py-0.5 rounded">
                {citation.circular_number}
              </span>
            )}
          </div>
          {citation.source_url && (
            <a
              href={citation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-teal-600 hover:text-teal-700"
            >
              View source
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
