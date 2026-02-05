"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageBubble } from "./message-bubble";
import { SuggestedQuestions } from "./suggested-questions";
import { Button } from "@/components/ui/button";
import type { RAGResponse, RAGError, Citation, ConfidenceLevel } from "@/lib/rag";
import { OFFICIAL_PORTAL_URL } from "@/lib/rag";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  confidence?: ConfidenceLevel;
  cached?: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  schemeSlug?: string;
}

export function ChatInterface({ schemeSlug }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitWait, setRateLimitWait] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Rate limit countdown
  useEffect(() => {
    if (rateLimitWait <= 0) return;
    const timer = setInterval(() => {
      setRateLimitWait((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitWait]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim() || isLoading || rateLimitWait > 0) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const result = await response.json();

      if (!result.success) {
        const ragError = result.error as RAGError;

        // Handle rate limiting
        if (ragError.type === "rate_limit" || ragError.type === "daily_limit") {
          setRateLimitWait(ragError.retry_after_ms || 6000);
          setError(ragError.message);
          return;
        }

        // Other errors
        setError(ragError.message);

        // Add error message from assistant
        const errorMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `${ragError.message}\n\nPlease check the official portal: ${ragError.fallback_url || OFFICIAL_PORTAL_URL}`,
          confidence: "low",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      // Success - add assistant response
      const data = result.data as RAGResponse;
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        citations: data.citations,
        confidence: data.confidence,
        cached: data.cached,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, rateLimitWait]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isDisabled = isLoading || rateLimitWait > 0;
  const remainingChars = 500 - input.length;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ask about Karnataka schemes
              </h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Get answers about eligibility, documents, application process,
                and more for Karnataka welfare schemes.
              </p>
            </div>

            <SuggestedQuestions
              schemeSlug={schemeSlug}
              onSelect={sendMessage}
            />

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <p className="font-medium mb-1">Important Notice</p>
              <p>
                This is an AI assistant for guidance only. Always verify information
                on the{" "}
                <a
                  href={OFFICIAL_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  official Seva Sindhu portal
                </a>
                .
              </p>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <MessageBubble key={message.id} {...message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 pb-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Rate limit warning */}
      {rateLimitWait > 0 && (
        <div className="px-4 pb-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Please wait {Math.ceil(rateLimitWait / 1000)} seconds before sending another message.
            </span>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about eligibility, documents, application process..."
              disabled={isDisabled}
              rows={1}
              className={`
                w-full resize-none rounded-xl border border-gray-300 px-4 py-3
                text-sm placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed
              `}
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
            {/* Character count */}
            <div className={`absolute bottom-1 right-2 text-xs ${remainingChars < 50 ? "text-amber-600" : "text-gray-400"}`}>
              {remainingChars < 100 && `${remainingChars}`}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isDisabled || !input.trim() || remainingChars < 0}
            className="h-12 w-12 p-0 rounded-xl"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
