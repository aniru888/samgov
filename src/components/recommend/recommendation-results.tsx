"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import type { RecommendationResult } from "@/lib/recommend";
import { RecommendationCard } from "./recommendation-card";
import { useTextToSpeech } from "@/lib/hooks/use-text-to-speech";

interface RecommendationResultsProps {
  results: RecommendationResult[];
  isLoading: boolean;
  hasSearched: boolean;
  decisionTreeSlugs: Set<string>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="h-5 bg-gray-200 rounded-full w-20" />
          </div>
          <div className="h-3 bg-gray-100 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
          <div className="flex gap-1">
            <div className="h-4 bg-gray-100 rounded w-12" />
            <div className="h-4 bg-gray-100 rounded w-16" />
            <div className="h-4 bg-gray-100 rounded w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecommendationResults({
  results,
  isLoading,
  hasSearched,
  decisionTreeSlugs,
}: RecommendationResultsProps) {
  const { t, language } = useTranslation();
  const { isSupported: ttsSupported, hasKannadaVoice, isSpeaking, speak, stop } =
    useTextToSpeech({ language: language as "en" | "kn" });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!hasSearched) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600 font-medium mb-1">{t("exploreNoResults")}</p>
        <p className="text-sm text-gray-500 mb-4">{t("exploreNoResultsHint")}</p>
        <Link
          href="/schemes"
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          {t("exploreBrowseAll")} &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Count */}
      <p className="text-sm text-gray-600">
        {t("exploreFound", { count: String(results.length) })}
      </p>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <p className="text-xs text-amber-800">{t("exploreDisclaimer")}</p>
      </div>

      {/* Read all aloud */}
      {ttsSupported && (language !== "kn" || hasKannadaVoice) && results.length > 0 && (
        <button
          onClick={() => {
            if (isSpeaking) {
              stop();
            } else {
              const allText = results
                .map((r) => {
                  const name =
                    language === "kn" && r.scheme.name_kn
                      ? r.scheme.name_kn
                      : r.scheme.name_en;
                  return `${name}. ${r.scheme.benefits_summary || ""}`;
                })
                .join(". ");
              speak(allText);
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label={isSpeaking ? t("stopReading") : t("readAllResults")}
        >
          <span>{isSpeaking ? "⏹" : "🔊"}</span>
          <span>{isSpeaking ? t("stopReading") : t("readAllResults")}</span>
        </button>
      )}

      {/* Results */}
      {results.map((result) => (
        <RecommendationCard
          key={result.scheme.id}
          result={result}
          hasDecisionTree={decisionTreeSlugs.has(result.scheme.slug)}
        />
      ))}
    </div>
  );
}
