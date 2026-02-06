"use client";

import type { Citation, ConfidenceLevel } from "@/lib/rag";
import { ConfidenceIndicator } from "./confidence-indicator";
import { CitationCard } from "./citation-card";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  confidence?: ConfidenceLevel;
  cached?: boolean;
  timestamp?: Date;
  language?: "en" | "kn";
}

export function MessageBubble({
  role,
  content,
  citations,
  confidence,
  cached,
  timestamp,
  language = "en",
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`
          max-w-[85%] sm:max-w-[75%]
          ${isUser
            ? "bg-teal-600 text-white rounded-2xl rounded-br-md"
            : "bg-white border border-gray-200 rounded-2xl rounded-bl-md"
          }
        `}
      >
        {/* Message content */}
        <div className="px-4 py-3">
          <p
            className={`text-sm sm:text-base whitespace-pre-wrap ${
              isUser ? "text-white" : "text-gray-900"
            }`}
          >
            {content}
          </p>
        </div>

        {/* Assistant-specific metadata */}
        {!isUser && (confidence || citations?.length) && (
          <div className="px-4 pb-3 space-y-3">
            {/* Confidence indicator + Kannada badge */}
            {confidence && (
              <div className="flex items-center gap-2 flex-wrap">
                <ConfidenceIndicator confidence={confidence} />
                {cached && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    Cached
                  </span>
                )}
                {language === "kn" && (
                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    AI ಕನ್ನಡ
                  </span>
                )}
              </div>
            )}

            {/* Citations */}
            {citations && citations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">
                  {language === "kn" ? "ಮೂಲಗಳು:" : "Sources:"}
                </p>
                <div className="space-y-1">
                  {citations.map((citation, index) => (
                    <CitationCard
                      key={citation.chunk_id || index}
                      citation={citation}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <div
            className={`
              px-4 pb-2 text-xs
              ${isUser ? "text-teal-200" : "text-gray-400"}
            `}
          >
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
