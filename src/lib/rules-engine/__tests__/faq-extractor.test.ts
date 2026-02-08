import { describe, it, expect } from "vitest"
import { extractFAQFromTree, generateFAQJsonLd } from "../faq-extractor"
import type { DecisionTree } from "../types"

const simpleTree: DecisionTree = {
  start: "q1",
  nodes: {
    q1: {
      type: "question",
      text_en: "Are you a Karnataka resident?",
      options: [
        { label: "Yes", next: "q2" },
        { label: "No", next: "result_not_resident" },
      ],
    },
    q2: {
      type: "question",
      text_en: "Is your annual household income below Rs 2 lakh?",
      options: [
        { label: "Yes", next: "result_eligible" },
        { label: "No", next: "result_income_high" },
      ],
    },
    result_eligible: {
      type: "result",
      status: "eligible",
      reason_en: "Based on your answers, you may meet the basic eligibility criteria for Gruha Lakshmi.",
      next_steps_en: "Apply through Seva Sindhu portal with required documents.",
      documents: ["Aadhaar Card", "Ration Card"],
    },
    result_not_resident: {
      type: "result",
      status: "ineligible",
      reason_en: "This scheme is only for Karnataka residents. You need to be a permanent resident of Karnataka.",
      fix_en: "If you have recently moved to Karnataka, apply for a Karnataka domicile certificate first.",
    },
    result_income_high: {
      type: "result",
      status: "ineligible",
      reason_en: "Your household income exceeds the maximum limit for this scheme.",
      fix_en: "Check if you qualify under a different income category.",
    },
  },
}

describe("extractFAQFromTree", () => {
  it("extracts FAQ items from all result nodes", () => {
    const faqs = extractFAQFromTree(simpleTree, "Gruha Lakshmi")
    expect(faqs.length).toBeGreaterThanOrEqual(3)
  })

  it("includes eligibility-related questions", () => {
    const faqs = extractFAQFromTree(simpleTree, "Gruha Lakshmi")
    const questions = faqs.map(f => f.question)

    // Should have questions about residency and income
    const hasResidencyQ = questions.some(q =>
      q.toLowerCase().includes("karnataka") || q.toLowerCase().includes("resident")
    )
    expect(hasResidencyQ).toBe(true)
  })

  it("includes reason text in answers", () => {
    const faqs = extractFAQFromTree(simpleTree, "Gruha Lakshmi")

    const residentFaq = faqs.find(f =>
      f.answer.includes("Karnataka residents")
    )
    expect(residentFaq).toBeDefined()
  })

  it("includes fix text in answers when available", () => {
    const faqs = extractFAQFromTree(simpleTree, "Gruha Lakshmi")

    const fixFaq = faqs.find(f =>
      f.answer.includes("domicile certificate")
    )
    expect(fixFaq).toBeDefined()
  })

  it("includes documents in eligible answers", () => {
    const faqs = extractFAQFromTree(simpleTree, "Gruha Lakshmi")

    const eligibleFaq = faqs.find(f =>
      f.answer.includes("Aadhaar Card")
    )
    expect(eligibleFaq).toBeDefined()
  })

  it("includes disclaimer in all answers", () => {
    const faqs = extractFAQFromTree(simpleTree, "Gruha Lakshmi")

    for (const faq of faqs) {
      expect(faq.answer).toContain("guidance only")
    }
  })

  it("returns empty array for null tree", () => {
    expect(extractFAQFromTree(null as unknown as DecisionTree, "Test")).toEqual([])
  })

  it("returns empty array for tree without nodes", () => {
    expect(extractFAQFromTree({ start: "q1", nodes: {} }, "Test")).toEqual([])
  })

  it("handles single-node result tree", () => {
    const singleNode: DecisionTree = {
      start: "result",
      nodes: {
        result: {
          type: "result",
          status: "eligible",
          reason_en: "Everyone is eligible for this basic scheme.",
        },
      },
    }
    const faqs = extractFAQFromTree(singleNode, "Basic Scheme")
    expect(faqs.length).toBe(1)
    expect(faqs[0].answer).toContain("Everyone is eligible")
  })

  it("skips result nodes with short/empty reasons", () => {
    const tree: DecisionTree = {
      start: "r1",
      nodes: {
        r1: {
          type: "result",
          status: "ineligible",
          reason_en: "No.",
        },
      },
    }
    const faqs = extractFAQFromTree(tree, "Test")
    expect(faqs).toEqual([])
  })
})

describe("generateFAQJsonLd", () => {
  it("generates valid JSON-LD structure", () => {
    const faqs = [
      { question: "Am I eligible?", answer: "You may be eligible." },
      { question: "What documents?", answer: "Aadhaar and Ration Card." },
    ]
    const jsonLd = generateFAQJsonLd(faqs) as Record<string, unknown>

    expect(jsonLd["@context"]).toBe("https://schema.org")
    expect(jsonLd["@type"]).toBe("FAQPage")

    const entities = jsonLd.mainEntity as Array<Record<string, unknown>>
    expect(entities).toHaveLength(2)
    expect(entities[0]["@type"]).toBe("Question")
    expect(entities[0].name).toBe("Am I eligible?")

    const answer = entities[0].acceptedAnswer as Record<string, unknown>
    expect(answer["@type"]).toBe("Answer")
    expect(answer.text).toBe("You may be eligible.")
  })

  it("handles empty FAQ list", () => {
    const jsonLd = generateFAQJsonLd([]) as Record<string, unknown>
    const entities = jsonLd.mainEntity as unknown[]
    expect(entities).toEqual([])
  })
})
