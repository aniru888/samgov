"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "@/lib/i18n"
import { CSCResults } from "./csc-results"

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

const CSC_SESSION_KEY = "samgov_csc_session"

interface CSCSession {
  date: string
  citizenCount: number
  schemesFound: number
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function getSession(): CSCSession {
  try {
    const raw = localStorage.getItem(CSC_SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CSCSession
      if (parsed.date === getTodayStr()) {
        return parsed
      }
    }
  } catch {
    // ignore
  }
  return { date: getTodayStr(), citizenCount: 0, schemesFound: 0 }
}

function saveSession(session: CSCSession): void {
  localStorage.setItem(CSC_SESSION_KEY, JSON.stringify(session))
}

function getAgeFromRange(range: string): number {
  switch (range) {
    case "under18": return 15
    case "18to35": return 25
    case "36to60": return 45
    case "over60": return 65
    default: return 30
  }
}

export function CSCOperatorPage() {
  const { t, language } = useTranslation()
  const [step, setStep] = useState<Step>("gender")
  const [profile, setProfile] = useState<CitizenProfile>({})
  const [ageRange, setAgeRange] = useState<string>("")
  const [results, setResults] = useState<ScreenedScheme[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<CSCSession>({ date: getTodayStr(), citizenCount: 0, schemesFound: 0 })

  // Load session on mount
  useEffect(() => {
    const loaded = getSession()
    setSession(loaded)
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

      // Update session counter
      const updated: CSCSession = {
        ...session,
        citizenCount: session.citizenCount + 1,
        schemesFound: session.schemesFound + schemes.length,
      }
      setSession(updated)
      saveSession(updated)
    } catch {
      setError("Failed to find schemes. Please try again.")
      setStep("results")
    } finally {
      setLoading(false)
    }
  }, [session])

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
  }

  const nextCitizen = () => {
    setProfile({})
    setAgeRange("")
    setResults(null)
    setError(null)
    setStep("gender")
    // No localStorage persistence for citizen data — only session counter persists
  }

  const resetSession = () => {
    const reset: CSCSession = { date: getTodayStr(), citizenCount: 0, schemesFound: 0 }
    setSession(reset)
    saveSession(reset)
  }

  const stepNumber = step === "gender" ? 1 : step === "age" ? 2 : step === "situation" ? 3 : step === "category" ? 4 : 4

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 no-print">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("cscTitle")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("cscSubtitle")}</p>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {t("cscOperatorNote")}
          </span>
        </div>

        {/* Session stats */}
        <div className="flex gap-4 mt-4 bg-gray-50 rounded-lg p-3">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-teal-600">{session.citizenCount}</p>
            <p className="text-xs text-gray-500">{t("cscCitizensHelped")}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-blue-600">{session.schemesFound}</p>
            <p className="text-xs text-gray-500">{t("cscSchemesFound")}</p>
          </div>
          <button
            onClick={resetSession}
            className="self-center text-xs text-gray-400 hover:text-gray-600 underline"
          >
            {t("cscResetSession")}
          </button>
        </div>
      </div>

      {/* Results view */}
      {step === "results" && !loading && !error && results && (
        <CSCResults
          results={results}
          profile={profile}
          citizenNumber={session.citizenCount}
          onNextCitizen={nextCitizen}
        />
      )}

      {/* Error state */}
      {step === "results" && error && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={nextCitizen} className="text-sm text-teal-600 hover:underline">
            {t("cscNextCitizen")} &rarr;
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-500">{t("loading")}</p>
        </div>
      )}

      {/* Wizard steps */}
      {step !== "results" && !loading && (
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
      className="flex items-center gap-2 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-teal-400 hover:bg-teal-50 transition-all active:scale-[0.98] min-h-[56px]"
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </button>
  )
}
