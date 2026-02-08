"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { QRCodeDisplay } from "@/components/ui/qr-code"

interface ScreenedScheme {
  slug: string
  name_en: string
  name_kn: string | null
  category: string | null
  target_group: string | null
  benefits_summary: string | null
  application_url: string | null
  required_documents: string[] | null
  match_level: "likely" | "possible" | "check"
  match_reasons: string[]
  has_decision_tree: boolean
}

interface CitizenProfile {
  gender?: "male" | "female" | "other"
  age?: number
  category?: "general" | "obc" | "sc" | "st" | "minority"
  occupation?: "farmer" | "student" | "worker" | "entrepreneur" | "unemployed" | "other"
}

interface CSCResultsProps {
  results: ScreenedScheme[]
  profile: CitizenProfile
  citizenNumber: number
  onNextCitizen: () => void
}

function MatchBadge({ level, t }: { level: "likely" | "possible" | "check"; t: (key: import("@/lib/i18n/types").TranslationKey) => string }) {
  if (level === "likely") {
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">{t("screenerLikely")}</span>
  }
  if (level === "possible") {
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">{t("screenerPossible")}</span>
  }
  return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{t("screenerCheck")}</span>
}

function formatProfile(profile: CitizenProfile): string {
  const parts: string[] = []
  if (profile.gender) parts.push(profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1))
  if (profile.age) parts.push(`Age ${profile.age}`)
  if (profile.occupation) parts.push(profile.occupation.charAt(0).toUpperCase() + profile.occupation.slice(1))
  if (profile.category) parts.push(profile.category.toUpperCase())
  return parts.join(", ")
}

export function CSCResults({ results, profile, citizenNumber, onNextCitizen }: CSCResultsProps) {
  const { t, language } = useTranslation()

  return (
    <div className="w-full">
      {/* Profile summary bar */}
      <div className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-gray-500">{t("cscProfileSummary")}:</span>
          <span className="ml-2 text-sm font-semibold text-gray-800">{formatProfile(profile)}</span>
        </div>
        <span className="text-xs text-gray-500">#{citizenNumber}</span>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t("cscResultsFor")} #{citizenNumber}</h3>
          <p className="text-sm text-gray-500">{t("screenerSchemesWith", { count: String(results.length) })}</p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">{t("screenerNoResults")}</p>
          <Link href="/schemes" className="text-teal-600 hover:underline text-sm font-medium">
            {t("exploreBrowseAll")} &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(scheme => {
            const name = language === "kn" && scheme.name_kn ? scheme.name_kn : scheme.name_en
            return (
              <div key={scheme.slug} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm leading-snug">{name}</h4>
                  <MatchBadge level={scheme.match_level} t={t} />
                </div>
                {scheme.benefits_summary && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{scheme.benefits_summary}</p>
                )}
                {scheme.match_reasons.length > 0 && (
                  <p className="text-xs text-teal-600 mb-2">{scheme.match_reasons.join(" · ")}</p>
                )}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 no-print">
                  <Link
                    href={`/schemes/${scheme.slug}`}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    {t("viewDetails")} &rarr;
                  </Link>
                  {scheme.has_decision_tree && (
                    <Link
                      href={`/debug/${scheme.slug}`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      {t("exploreCheckEligibility")}
                    </Link>
                  )}
                </div>

                {/* Print-only: QR code for application URL */}
                {scheme.application_url && (
                  <div className="print-qr-section hidden">
                    <QRCodeDisplay url={scheme.application_url} size={80} />
                    <div className="text-xs">
                      <p className="font-medium">Apply online:</p>
                      <p className="break-all text-gray-600">{scheme.application_url}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-4">
        {t("exploreDisclaimer")}
      </p>

      {/* Print-only: stamp area */}
      <div className="print-csc-stamp hidden">
        <p className="text-sm text-gray-600 mb-8">{t("cscPrintFooterStamp")}:</p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Date: _______________</span>
          <span>Signature: _______________</span>
        </div>
      </div>

      {/* Print-only: footer */}
      <div className="print-footer hidden">
        <p>SamGov — {t("disclaimer")}</p>
        <p>Printed: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-6 no-print">
        <button
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-teal-400 hover:bg-teal-50 transition-all min-h-[56px]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          {t("cscPrintAll")}
        </button>
        <button
          onClick={onNextCitizen}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all min-h-[56px]"
        >
          {t("cscNextCitizen")} &rarr;
        </button>
      </div>
    </div>
  )
}
