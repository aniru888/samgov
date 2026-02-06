"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import type { RecommendationResult } from "@/lib/recommend";
import { getCategoryLabel } from "@/lib/recommend/categories";
import { useTextToSpeech } from "@/lib/hooks/use-text-to-speech";

interface RecommendationCardProps {
  result: RecommendationResult;
  hasDecisionTree?: boolean;
}

function RelevanceBadge({
  score,
  language,
  t,
}: {
  score: number;
  language: string;
  t: (key: keyof import("@/lib/i18n/types").TranslationKeys) => string;
}) {
  if (score >= 0.75) {
    return (
      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
        {t("exploreHighlyRelevant")}
      </span>
    );
  }
  if (score >= 0.65) {
    return (
      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
        {t("exploreRelevant")}
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
      {t("exploreMayBeRelevant")}
    </span>
  );
}

export function RecommendationCard({ result, hasDecisionTree }: RecommendationCardProps) {
  const { t, language } = useTranslation();
  const { scheme, similarity_score, match_reason } = result;
  const { isSupported: ttsSupported, hasKannadaVoice, isSpeaking, speak, stop } =
    useTextToSpeech({ language: language as "en" | "kn" });

  const displayName =
    language === "kn" && scheme.name_kn ? scheme.name_kn : scheme.name_en;
  const secondaryName =
    language === "kn" && scheme.name_kn ? scheme.name_en : scheme.name_kn;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header: Name + Relevance */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 leading-snug">
            {displayName}
          </h3>
          {secondaryName && (
            <p className="text-sm text-gray-500 mt-0.5">{secondaryName}</p>
          )}
        </div>
        <RelevanceBadge score={similarity_score} language={language} t={t} />
      </div>

      {/* Department + Category */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {scheme.department && (
          <span className="text-xs text-gray-500">{scheme.department}</span>
        )}
        {scheme.category && (
          <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
            {getCategoryLabel(scheme.category, language as "en" | "kn")}
          </span>
        )}
        {scheme.scheme_level && (
          <span className="px-1.5 py-0.5 text-xs bg-purple-50 text-purple-600 rounded">
            {scheme.scheme_level === "state" ? "State" : "Central"}
          </span>
        )}
      </div>

      {/* Benefits summary */}
      {scheme.benefits_summary && (
        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
          {scheme.benefits_summary}
        </p>
      )}

      {/* Match reason */}
      <p className="text-xs text-teal-600 mb-3">{match_reason}</p>

      {/* Tags */}
      {scheme.tags && scheme.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {scheme.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-xs bg-gray-50 text-gray-500 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <Link
          href={`/schemes/${scheme.slug}`}
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          {t("viewDetails")} &rarr;
        </Link>
        {hasDecisionTree && (
          <Link
            href={`/debug/${scheme.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {t("exploreCheckEligibility")}
          </Link>
        )}
        {ttsSupported && (language !== "kn" || hasKannadaVoice) && (
          <button
            onClick={() => {
              if (isSpeaking) {
                stop();
              } else {
                const readText = `${displayName}. ${scheme.benefits_summary || ""}`;
                speak(readText);
              }
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={isSpeaking ? t("stopReading") : t("readAloud")}
            title={isSpeaking ? t("stopReading") : t("readAloud")}
          >
            {isSpeaking ? "⏹" : "🔊"}
          </button>
        )}
        {language === "kn" && ttsSupported && !hasKannadaVoice && (
          <span className="text-xs text-amber-600" title={t("voiceNoKannadaTTS")}>
            {t("voiceNoKannadaTTS")}
          </span>
        )}
        {scheme.data_source === "manual" && (
          <span className="ml-auto text-xs text-green-600">
            {t("exploreVerified")}
          </span>
        )}
      </div>
    </div>
  );
}
