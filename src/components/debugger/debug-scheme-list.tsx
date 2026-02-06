"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

interface DebugScheme {
  id: string
  slug: string
  name_en: string
  name_kn: string | null
  department: string | null
}

interface DebugSchemeListProps {
  schemes: DebugScheme[]
}

export function DebugSchemeList({ schemes }: DebugSchemeListProps) {
  const { t, language } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("debuggerPickScheme")}
        </h1>
        <p className="text-gray-600 text-sm">
          {t("debuggerPickSchemeSubtitle")}
        </p>
      </div>

      {schemes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">{t("noResults")}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {schemes.map((scheme) => (
            <Link
              key={scheme.id}
              href={`/debug/${scheme.slug}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {language === "kn" && scheme.name_kn ? scheme.name_kn : scheme.name_en}
              </h2>
              {language === "kn" && scheme.name_kn && (
                <p className="text-sm text-gray-500 mt-1">{scheme.name_en}</p>
              )}
              {language === "en" && scheme.name_kn && (
                <p className="text-sm text-gray-500 mt-1">{scheme.name_kn}</p>
              )}
              {scheme.department && (
                <p className="text-sm text-gray-400 mt-2">{scheme.department}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
