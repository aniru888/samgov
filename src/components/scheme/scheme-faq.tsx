"use client"

import * as React from "react"
import { useTranslation } from "@/lib/i18n"
import type { FAQItem } from "@/lib/rules-engine/faq-extractor"

interface SchemeFAQProps {
  faqs: FAQItem[]
  schemeName: string
}

export function SchemeFAQ({ faqs, schemeName }: SchemeFAQProps) {
  const { language } = useTranslation()
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  const headerText = language === "kn"
    ? "ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು"
    : "Frequently Asked Questions"

  return (
    <section className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {headerText}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              className="w-full text-left px-4 py-3 flex justify-between items-start gap-2 hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span className="text-sm font-medium text-gray-900 pr-2">
                {faq.question}
              </span>
              <span className="text-gray-400 flex-shrink-0 mt-0.5">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-3 border-t border-gray-100">
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        {language === "kn"
          ? `${schemeName} ಕುರಿತ FAQ ಗಳು ಅರ್ಹತೆ ನಿಯಮಗಳ ಆಧಾರದ ಮೇಲೆ ರಚಿಸಲಾಗಿದೆ. ಅಧಿಕೃತ ಮೂಲಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.`
          : `FAQs about ${schemeName} are generated from eligibility rules. Always verify with official sources.`}
      </p>
    </section>
  )
}
