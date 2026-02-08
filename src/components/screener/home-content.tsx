"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { ProfileWizard } from "./profile-wizard"

export function HomeContent() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors text-sm"
            >
              {t("exploreTitle")}
            </Link>
            <Link
              href="/schemes"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              {t("browseSchemes")}
            </Link>
            <Link
              href="/ask"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              {t("askQuestion")}
            </Link>
          </div>
        </div>
      </section>

      {/* Profile Wizard Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("screenerTitle")}
          </h2>
          <p className="text-gray-600">
            {t("screenerSubtitle")}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <ProfileWizard />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
            {t("quickActions")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title={t("browseSchemes")}
              description={t("schemesSubtitle")}
              href="/schemes"
            />
            <FeatureCard
              icon={
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
              }
              title={t("checkEligibility")}
              description={t("debuggerPickSchemeSubtitle")}
              href="/debug"
            />
            <FeatureCard
              icon={
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              title={t("askQuestion")}
              description={t("chatAIGuidance")}
              href="/ask"
            />
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <h2 className="text-base font-semibold text-amber-800 mb-1">
            {t("chatImportantNotice")}
          </h2>
          <p className="text-sm text-amber-700">
            {t("disclaimerFull")}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {t("appName")} - {t("heroTitle")}
            </p>
            <nav className="flex gap-6 text-sm">
              <Link href="/schemes" className="text-gray-600 hover:text-gray-900">{t("navSchemes")}</Link>
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">{t("navExplore")}</Link>
              <Link href="/ask" className="text-gray-600 hover:text-gray-900">{t("navAsk")}</Link>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="block bg-gray-50 rounded-lg p-5 text-center hover:bg-gray-100 transition-colors group">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 text-teal-600 mb-3 group-hover:bg-teal-200 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}
