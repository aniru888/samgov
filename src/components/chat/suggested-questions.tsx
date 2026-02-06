"use client";

import { getSuggestedQuestions } from "@/lib/rag";

interface SuggestedQuestionsProps {
  schemeSlug?: string;
  onSelect: (question: string) => void;
  language?: "en" | "kn";
}

export function SuggestedQuestions({
  schemeSlug,
  onSelect,
  language = "en",
}: SuggestedQuestionsProps) {
  const questions = getSuggestedQuestions(schemeSlug, language);

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 font-medium">
        {language === "kn" ? "ಈ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ:" : "Try asking:"}
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="
              px-3 py-2 text-sm text-left
              bg-white border border-gray-200 rounded-lg
              hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
            "
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
