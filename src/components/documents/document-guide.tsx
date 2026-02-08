"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/i18n"
import type { TranslationKey } from "@/lib/i18n"
import { getDocumentGuide, hasDocumentGuide } from "@/lib/documents/guides"
import type { DocumentGuide } from "@/lib/documents/types"

/**
 * Renders a single document name with an expandable preparation guide.
 * Shows a "How to get" toggle when a guide is available.
 */
export function DocumentWithGuide({ name }: { name: string }) {
  const [expanded, setExpanded] = useState(false)
  const { t, language } = useTranslation()
  const guide = getDocumentGuide(name)

  return (
    <li className="text-sm">
      <div className="flex items-start gap-2">
        <span className="text-teal-500 mt-0.5 shrink-0">✓</span>
        <div className="flex-1">
          <span className="text-gray-700">{name}</span>
          {guide && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-2 text-xs text-teal-600 hover:text-teal-700 font-medium"
              aria-expanded={expanded}
            >
              {expanded ? t("docGuideHide") : t("docGuideHowToGet")}
              <span className="ml-0.5">{expanded ? "▲" : "▼"}</span>
            </button>
          )}
        </div>
      </div>

      {expanded && guide && (
        <GuideDetails guide={guide} language={language} t={t} />
      )}
    </li>
  )
}

/**
 * Renders a list of documents with expandable preparation guides.
 */
export function DocumentList({ documents }: { documents: string[] }) {
  const { t } = useTranslation()

  if (documents.length === 0) return null

  const guidedCount = documents.filter(d => hasDocumentGuide(d)).length

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-semibold text-gray-900">
          {t("docGuideDocumentsNeeded")}
        </h4>
        {guidedCount > 0 && (
          <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
            {t("docGuideGuidesAvailable", { count: String(guidedCount) })}
          </span>
        )}
      </div>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <DocumentWithGuide key={doc} name={doc} />
        ))}
      </ul>
    </div>
  )
}

function GuideDetails({
  guide,
  language,
  t,
}: {
  guide: DocumentGuide
  language: "en" | "kn"
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}) {
  const isKn = language === "kn"

  return (
    <div className="mt-2 ml-5 p-3 bg-teal-50 rounded-lg border border-teal-100 text-xs space-y-2">
      <div>
        <span className="font-semibold text-gray-700">{t("docGuideWhere")}:</span>{" "}
        <span className="text-gray-600">{isKn ? guide.where_kn : guide.where_en}</span>
      </div>

      <div>
        <span className="font-semibold text-gray-700">{t("docGuideHow")}:</span>{" "}
        <span className="text-gray-600">{isKn ? guide.how_kn : guide.how_en}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <div>
          <span className="font-semibold text-gray-700">{t("docGuideTime")}:</span>{" "}
          <span className="text-gray-600">{isKn ? guide.timeline_kn : guide.timeline_en}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">{t("docGuideCost")}:</span>{" "}
          <span className="text-gray-600">{isKn ? guide.cost_kn : guide.cost_en}</span>
        </div>
      </div>

      {guide.online_url && (
        <div>
          <span className="font-semibold text-gray-700">{t("docGuideOnline")}:</span>{" "}
          <a
            href={guide.online_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-700 underline"
          >
            {isKn ? guide.online_portal_kn : guide.online_portal_en} ↗
          </a>
        </div>
      )}

      {(guide.tips_en || guide.tips_kn) && (
        <div className="pt-1 border-t border-teal-100">
          <span className="font-semibold text-amber-700">💡 {t("docGuideTip")}:</span>{" "}
          <span className="text-gray-600">{isKn ? guide.tips_kn : guide.tips_en}</span>
        </div>
      )}
    </div>
  )
}
