"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

interface CitizenProfile {
  gender?: "male" | "female" | "other"
  age?: number
  category?: "general" | "obc" | "sc" | "st" | "minority"
  occupation?: "farmer" | "student" | "worker" | "entrepreneur" | "unemployed" | "other"
}

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

type Step = "gender" | "age" | "situation" | "category" | "results"

const STORAGE_KEY = "samgov_screener_profile"

function getAgeFromRange(range: string): number {
  switch (range) {
    case "under18": return 15
    case "18to35": return 25
    case "36to60": return 45
    case "over60": return 65
    default: return 30
  }
}

export function ProfileWizard() {
  const { t, language } = useTranslation()
  const [step, setStep] = useState<Step>("gender")
  const [profile, setProfile] = useState<CitizenProfile>({})
  const [ageRange, setAgeRange] = useState<string>("")
  const [results, setResults] = useState<ScreenedScheme[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Restore saved profile
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.profile && parsed.results) {
          setProfile(parsed.profile)
          setAgeRange(parsed.ageRange || "")
          setResults(parsed.results)
          setStep("results")
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  const fetchResults = useCallback(async (p: CitizenProfile) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: p }),
      })
      if (!res.ok) throw new Error("Failed to fetch schemes")
      const data = await res.json()
      const schemes: ScreenedScheme[] = data.data?.schemes || []
      setResults(schemes)
      setStep("results")
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: p, ageRange, results: schemes }))
    } catch {
      setError("Failed to find schemes. Please try again.")
      setStep("results")
    } finally {
      setLoading(false)
    }
  }, [ageRange])

  const selectGender = (g: "male" | "female" | "other") => {
    setProfile(prev => ({ ...prev, gender: g }))
    setStep("age")
  }

  const selectAge = (range: string) => {
    setAgeRange(range)
    const age = getAgeFromRange(range)
    setProfile(prev => ({ ...prev, age }))
    setStep("situation")
  }

  const selectSituation = (occ: CitizenProfile["occupation"]) => {
    setProfile(prev => ({ ...prev, occupation: occ }))
    setStep("category")
  }

  const selectCategory = (cat: CitizenProfile["category"]) => {
    const updated = { ...profile, category: cat }
    setProfile(updated)
    fetchResults(updated)
  }

  const goBack = () => {
    if (step === "age") setStep("gender")
    else if (step === "situation") setStep("age")
    else if (step === "category") setStep("situation")
    else if (step === "results") setStep("category")
  }

  const startOver = () => {
    setProfile({})
    setAgeRange("")
    setResults(null)
    setStep("gender")
    localStorage.removeItem(STORAGE_KEY)
  }

  const stepNumber = step === "gender" ? 1 : step === "age" ? 2 : step === "situation" ? 3 : step === "category" ? 4 : 4

  if (step === "results") {
    return (
      <ScreenerResults
        results={results || []}
        loading={loading}
        error={error}
        onStartOver={startOver}
      />
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= stepNumber ? "bg-teal-500" : "bg-gray-200"
              }`}
            />
          </div>
        ))}
        <span className="text-xs text-gray-500 ml-1 shrink-0">{stepNumber}/4</span>
      </div>

      {/* Back button */}
      {step !== "gender" && (
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("back")}
        </button>
      )}

      {/* Gender step */}
      {step === "gender" && (
        <StepContainer question={t("screenerGenderQuestion")}>
          <OptionButton onClick={() => selectGender("female")} label={t("screenerGenderFemale")} icon="👩" />
          <OptionButton onClick={() => selectGender("male")} label={t("screenerGenderMale")} icon="👨" />
          <OptionButton onClick={() => selectGender("other")} label={t("screenerGenderOther")} icon="🧑" />
        </StepContainer>
      )}

      {/* Age step */}
      {step === "age" && (
        <StepContainer question={t("screenerAgeQuestion")}>
          <OptionButton onClick={() => selectAge("under18")} label={t("screenerAgeUnder18")} />
          <OptionButton onClick={() => selectAge("18to35")} label={t("screenerAge18to35")} />
          <OptionButton onClick={() => selectAge("36to60")} label={t("screenerAge36to60")} />
          <OptionButton onClick={() => selectAge("over60")} label={t("screenerAgeOver60")} />
        </StepContainer>
      )}

      {/* Situation step */}
      {step === "situation" && (
        <StepContainer question={t("screenerSituationQuestion")}>
          <OptionButton onClick={() => selectSituation("farmer")} label={t("screenerSituationFarmer")} icon="🌾" />
          <OptionButton onClick={() => selectSituation("student")} label={t("screenerSituationStudent")} icon="🎓" />
          <OptionButton onClick={() => selectSituation("worker")} label={t("screenerSituationWorker")} icon="🔨" />
          <OptionButton onClick={() => selectSituation("entrepreneur")} label={t("screenerSituationEntrepreneur")} icon="💼" />
          <OptionButton onClick={() => selectSituation("unemployed")} label={t("screenerSituationUnemployed")} icon="🔍" />
          <OptionButton onClick={() => selectSituation("other")} label={t("screenerSituationOther")} />
        </StepContainer>
      )}

      {/* Category step */}
      {step === "category" && (
        <StepContainer question={t("screenerCategoryQuestion")}>
          <OptionButton onClick={() => selectCategory("general")} label={t("screenerCategoryGeneral")} />
          <OptionButton onClick={() => selectCategory("obc")} label={t("screenerCategoryOBC")} />
          <OptionButton onClick={() => selectCategory("sc")} label={t("screenerCategorySC")} />
          <OptionButton onClick={() => selectCategory("st")} label={t("screenerCategoryST")} />
          <OptionButton onClick={() => selectCategory("minority")} label={t("screenerCategoryMinority")} />
        </StepContainer>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-500">{t("loading")}</p>
        </div>
      )}
    </div>
  )
}

function StepContainer({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{question}</h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

function OptionButton({ onClick, label, icon }: { onClick: () => void; label: string; icon?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-teal-400 hover:bg-teal-50 transition-all active:scale-[0.98] min-h-[48px]"
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </button>
  )
}

function MatchBadge({ level, t }: { level: "likely" | "possible" | "check"; t: (key: keyof import("@/lib/i18n/types").TranslationKeys) => string }) {
  if (level === "likely") {
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">{t("screenerLikely")}</span>
  }
  if (level === "possible") {
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">{t("screenerPossible")}</span>
  }
  return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{t("screenerCheck")}</span>
}

function ScreenerResults({
  results,
  loading,
  error,
  onStartOver,
}: {
  results: ScreenedScheme[]
  loading: boolean
  error: string | null
  onStartOver: () => void
}) {
  const { t, language } = useTranslation()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500">{t("loading")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={onStartOver} className="text-sm text-teal-600 hover:underline">
          {t("screenerStartOver")}
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t("screenerResultsTitle")}</h3>
          <p className="text-sm text-gray-500">
            {t("screenerSchemesWith", { count: String(results.length) })}
          </p>
        </div>
        <button
          onClick={onStartOver}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          {t("screenerStartOver")}
        </button>
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
              <div key={scheme.slug} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
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
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
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
                  {scheme.application_url && (
                    <a
                      href={scheme.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 ml-auto"
                    >
                      {t("schemeApply")} &nearr;
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-4">
        {t("exploreDisclaimer")}
      </p>

      {/* Also try explore */}
      <div className="text-center mt-4">
        <Link href="/explore" className="text-sm text-teal-600 hover:underline">
          {t("exploreTitle")} &rarr;
        </Link>
      </div>
    </div>
  )
}
