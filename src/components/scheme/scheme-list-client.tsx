"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import type { Scheme } from "@/types/scheme"

interface SchemeListClientProps {
  schemes: Scheme[]
}

export function SchemeListClient({ schemes }: SchemeListClientProps) {
  const { t, language } = useTranslation()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("schemesTitle")}
          </h1>
          <p className="text-gray-600">
            {t("schemesSubtitle")}
          </p>
        </header>

        {schemes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">{t("noResults")}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} language={language} t={t} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function SchemeCard({
  scheme,
  language,
  t,
}: {
  scheme: Scheme
  language: string
  t: (key: keyof import("@/lib/i18n/types").TranslationKeys, params?: Record<string, string | number>) => string
}) {
  const displayName = language === "kn" && scheme.name_kn ? scheme.name_kn : scheme.name_en
  const secondaryName = language === "kn" && scheme.name_kn ? scheme.name_en : scheme.name_kn

  return (
    <Link
      href={`/schemes/${scheme.slug}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            {displayName}
          </h2>
          {secondaryName && (
            <span className="text-sm text-gray-500 ml-2">{secondaryName}</span>
          )}
        </div>

        {scheme.department && (
          <p className="text-sm text-gray-500 mb-3">{scheme.department}</p>
        )}

        {scheme.benefits_summary && (
          <div className="mb-4">
            <p className="text-gray-700 line-clamp-2">
              {scheme.benefits_summary}
            </p>
            {language === "kn" && (
              <p className="text-xs text-gray-400 mt-1">{t("contentEnglishOnly")}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-blue-600 text-sm font-medium">
            {t("viewDetails")} &rarr;
          </span>
          {scheme.last_verified_at && (
            <span className="text-xs text-gray-400">
              {t("schemeLastVerified")}{" "}
              {new Date(scheme.last_verified_at).toLocaleDateString(
                language === "kn" ? "kn-IN" : "en-IN"
              )}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
