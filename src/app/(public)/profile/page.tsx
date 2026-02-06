"use client"

import { useState } from "react"
import { PageContainer } from "@/components/layout"
import { LanguageToggle } from "@/components/layout/language-toggle"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function ProfilePage() {
  const { t } = useTranslation()
  const [cleared, setCleared] = useState(false)

  const handleClearData = () => {
    if (window.confirm(t("clearDataConfirm"))) {
      localStorage.clear()
      setCleared(true)
      setTimeout(() => setCleared(false), 3000)
    }
  }

  return (
    <PageContainer className="py-6">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("profileTitle")}</h1>

        {/* Settings */}
        <section className="bg-white rounded-lg shadow p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t("settings")}</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{t("language")}</span>
            <LanguageToggle />
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-white rounded-lg shadow p-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{t("quickLinks")}</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://sevasindhu.karnataka.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                {t("officialPortal")}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </li>
            <li>
              <Link href="/schemes" className="text-sm text-blue-600 hover:underline">
                {t("browseSchemes")}
              </Link>
            </li>
            <li>
              <Link href="/debug" className="text-sm text-blue-600 hover:underline">
                {t("checkEligibility")}
              </Link>
            </li>
            <li>
              <Link href="/ask" className="text-sm text-blue-600 hover:underline">
                {t("askQuestion")}
              </Link>
            </li>
          </ul>
        </section>

        {/* Data Management */}
        <section className="bg-white rounded-lg shadow p-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{t("dataManagement")}</h2>
          <p className="text-sm text-gray-600">{t("clearData")}</p>
          <button
            onClick={handleClearData}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            {t("clearData")}
          </button>
          {cleared && (
            <p className="text-sm text-green-600">{t("dataCleared")}</p>
          )}
        </section>

        {/* Sign-in placeholder */}
        <section className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-5 text-center">
          <p className="text-sm text-gray-500">{t("signInComingSoon")}</p>
        </section>
      </div>
    </PageContainer>
  )
}
