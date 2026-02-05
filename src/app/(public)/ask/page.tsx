/**
 * AI Q&A Page
 * Chat interface for asking questions about Karnataka welfare schemes
 */

import { Metadata } from "next";
import { ChatInterface } from "@/components/chat/chat-interface";
import { OFFICIAL_PORTAL_URL } from "@/lib/rag";

export const metadata: Metadata = {
  title: "Ask About Schemes | SamGov Karnataka",
  description:
    "Get AI-powered answers about Karnataka welfare scheme eligibility, documents, and application process. Information for guidance only - verify on official portal.",
};

export default function AskPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Ask About Schemes
            </h1>
            <p className="text-sm text-gray-500">
              AI-powered guidance for Karnataka welfare schemes
            </p>
          </div>
          <a
            href={OFFICIAL_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            Official Portal
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 max-w-3xl mx-auto w-full overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
