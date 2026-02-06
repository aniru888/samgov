"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import type { Scheme } from "@/types/scheme"

interface SchemeDetailClientProps {
  scheme: Scheme
}

export function SchemeDetailClient({ scheme }: SchemeDetailClientProps) {
  const { t, language } = useTranslation()
  const displayName = language === "kn" && scheme.name_kn ? scheme.name_kn : scheme.name_en
  const secondaryName = language === "kn" && scheme.name_kn ? scheme.name_en : scheme.name_kn
  const dateLocale = language === "kn" ? "kn-IN" : "en-IN"

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/schemes" className="text-blue-600 hover:underline">
            {t("schemesBreadcrumb")}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{displayName}</span>
        </nav>

        {/* Header */}
        <header className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {displayName}
              </h1>
              {secondaryName && (
                <p className="text-xl text-gray-600">{secondaryName}</p>
              )}
            </div>
            {scheme.application_url && (
              <a
                href={scheme.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("schemeApply")}
                <svg
                  className="ml-2 h-4 w-4"
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
            )}
          </div>

          {scheme.department && (
            <p className="mt-4 text-gray-500">
              <span className="font-medium">{t("schemeDepartment")}:</span>{" "}
              {scheme.department}
            </p>
          )}
        </header>

        {/* Benefits */}
        {scheme.benefits_summary && (
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {t("schemeBenefits")}
            </h2>
            <p className="text-gray-700">{scheme.benefits_summary}</p>
            {language === "kn" && (
              <p className="text-xs text-gray-400 mt-2">{t("contentEnglishOnly")}</p>
            )}
          </section>
        )}

        {/* Eligibility */}
        {scheme.eligibility_summary && (
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {t("schemeEligibility")}
            </h2>
            <p className="text-gray-700 mb-4">{scheme.eligibility_summary}</p>
            {language === "kn" && (
              <p className="text-xs text-gray-400 mb-4">{t("contentEnglishOnly")}</p>
            )}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                {t("disclaimer")}
              </p>
            </div>
          </section>
        )}

        {/* Helpline */}
        {scheme.helpline && (scheme.helpline.phone?.length || scheme.helpline.email) && (
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Helpline
            </h2>
            {scheme.helpline.phone && scheme.helpline.phone.length > 0 && (
              <div className="mb-2">
                {scheme.helpline.phone.map((num) => (
                  <a
                    key={num}
                    href={`tel:${num}`}
                    className="inline-block mr-4 text-blue-600 hover:underline text-sm"
                  >
                    {num}
                  </a>
                ))}
              </div>
            )}
            {scheme.helpline.email && (
              <a
                href={`mailto:${scheme.helpline.email}`}
                className="text-blue-600 hover:underline text-sm"
              >
                {scheme.helpline.email}
              </a>
            )}
          </section>
        )}

        {/* Debug Eligibility CTA */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            {t("schemeRejected")}
          </h2>
          <p className="text-blue-800 mb-4">
            {t("schemeDebugRejection")}
          </p>
          <Link
            href={`/debug/${scheme.slug}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("checkEligibility")}
          </Link>
        </section>

        {/* Footer Info */}
        <footer className="text-center text-sm text-gray-500 space-y-2">
          {scheme.last_verified_at && (
            <p>
              {t("schemeLastVerified")}{" "}
              {new Date(scheme.last_verified_at).toLocaleDateString(dateLocale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {scheme.official_source_url && (
            <p>
              {t("schemeSource")}:{" "}
              <a
                href={scheme.official_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {t("schemeOfficialWebsite")}
              </a>
            </p>
          )}
        </footer>
      </div>
    </main>
  )
}
