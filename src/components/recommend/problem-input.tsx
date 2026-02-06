"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import { useVoiceInput } from "@/lib/hooks/use-voice-input";
import { VoiceButton } from "@/components/ui/voice-button";

interface ProblemInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUERIES_EN = [
  "I am a woman head of household with low income and need financial help",
  "I'm a farmer looking for crop loan or irrigation support",
  "I need a scholarship for my daughter's education",
  "I lost my job and need unemployment support",
];

const EXAMPLE_QUERIES_KN = [
  "ನಾನು ಕಡಿಮೆ ಆದಾಯವಿರುವ ಮಹಿಳಾ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥೆ, ಆರ್ಥಿಕ ನೆರವು ಬೇಕು",
  "ನಾನು ರೈತ, ಬೆಳೆ ಸಾಲ ಅಥವಾ ನೀರಾವರಿ ಬೆಂಬಲ ಬೇಕು",
  "ನನ್ನ ಮಗಳ ಶಿಕ್ಷಣಕ್ಕೆ ವಿದ್ಯಾರ್ಥಿವೇತನ ಬೇಕು",
  "ನನಗೆ ಕೆಲಸ ಕಳೆದುಕೊಂಡಿದ್ದೇನೆ, ನಿರುದ್ಯೋಗ ಬೆಂಬಲ ಬೇಕು",
];

export function ProblemInput({ onSubmit, isLoading }: ProblemInputProps) {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState("");
  const maxLength = 500;

  const examples = language === "kn" ? EXAMPLE_QUERIES_KN : EXAMPLE_QUERIES_EN;

  const handleTranscript = useCallback(
    (text: string, isFinal: boolean) => {
      setQuery(text);
      if (isFinal && text.trim()) {
        onSubmit(text.trim());
      }
    },
    [onSubmit]
  );

  const { isSupported: voiceSupported, state: voiceState, errorMessage: voiceError, toggle: toggleVoice } =
    useVoiceInput({
      language,
      onTranscript: handleTranscript,
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onSubmit(example);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("explorePlaceholder")}
            maxLength={maxLength}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
            disabled={isLoading}
          />
          <span className="absolute bottom-2 right-3 text-xs text-gray-400">
            {query.length}/{maxLength}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          {voiceSupported && (
            <VoiceButton
              state={voiceState}
              onClick={toggleVoice}
              disabled={isLoading}
              aria-label={t("speakYourQuery")}
            />
          )}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {isLoading ? t("loading") : t("exploreSearch")}
          </button>
        </div>
        {voiceError && (
          <p className="mt-1 text-xs text-red-600">{voiceError}</p>
        )}
        {voiceState === "listening" && (
          <p className="mt-1 text-xs text-teal-600 animate-pulse">{t("voiceListening")}</p>
        )}
      </form>

      {/* Example queries */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">
          {language === "kn" ? "ಉದಾಹರಣೆಗಳು:" : "Try these examples:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs text-left bg-white border border-gray-200 rounded-full hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors disabled:opacity-50"
            >
              {example.length > 60 ? example.substring(0, 57) + "..." : example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
