import type { DecisionTree, QuestionNode, ResultNode } from "./types"

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Extracts FAQ Q&A pairs from a decision tree by walking all paths
 * to result nodes. Each result node generates a FAQ entry with
 * the question path as context and the result reason as the answer.
 *
 * Only extracts from result nodes that have substantive content.
 */
export function extractFAQFromTree(
  tree: DecisionTree,
  schemeName: string
): FAQItem[] {
  if (!tree || !tree.nodes || !tree.start) return []

  const faqs: FAQItem[] = []
  const visited = new Set<string>()

  function walk(nodeId: string, questionPath: string[]) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)

    const node = tree.nodes[nodeId]
    if (!node) return

    if (node.type === "result") {
      const resultNode = node as ResultNode
      const faq = buildFAQFromResult(resultNode, questionPath, schemeName)
      if (faq) faqs.push(faq)
      return
    }

    const questionNode = node as QuestionNode
    questionPath.push(questionNode.text_en)

    for (const option of questionNode.options) {
      walk(option.next, [...questionPath])
    }
  }

  walk(tree.start, [])
  return faqs
}

function buildFAQFromResult(
  result: ResultNode,
  questionPath: string[],
  schemeName: string
): FAQItem | null {
  if (!result.reason_en || result.reason_en.length < 10) return null

  // Build a natural question from the result context
  let question: string

  if (result.status === "eligible") {
    if (questionPath.length > 0) {
      const lastQuestion = questionPath[questionPath.length - 1]
      question = `What happens if I meet all the criteria for ${schemeName}?`
      if (lastQuestion.toLowerCase().includes("income")) {
        question = `Am I eligible for ${schemeName} based on income criteria?`
      } else if (lastQuestion.toLowerCase().includes("age")) {
        question = `What are the age requirements for ${schemeName}?`
      } else if (lastQuestion.toLowerCase().includes("resid")) {
        question = `Do I need to be a Karnataka resident for ${schemeName}?`
      }
    } else {
      question = `How do I know if I'm eligible for ${schemeName}?`
    }
  } else if (result.status === "ineligible") {
    question = buildIneligibleQuestion(result, questionPath, schemeName)
  } else {
    question = `What if my ${schemeName} eligibility needs further verification?`
  }

  // Build the answer
  const answerParts: string[] = [result.reason_en]

  if (result.fix_en) {
    answerParts.push(`How to fix: ${result.fix_en}`)
  }
  if (result.next_steps_en) {
    answerParts.push(`Next steps: ${result.next_steps_en}`)
  }
  if (result.documents && result.documents.length > 0) {
    answerParts.push(`Documents needed: ${result.documents.join(", ")}`)
  }

  // Add disclaimer
  answerParts.push(
    "Note: This is for guidance only. Always verify on the official government portal."
  )

  return {
    question,
    answer: answerParts.join(" "),
  }
}

function buildIneligibleQuestion(
  result: ResultNode,
  questionPath: string[],
  schemeName: string
): string {
  const reason = result.reason_en.toLowerCase()

  if (reason.includes("residen") || reason.includes("karnataka")) {
    return `Can I get ${schemeName} if I'm not a Karnataka resident?`
  }
  if (reason.includes("income") || reason.includes("bpl") || reason.includes("poverty")) {
    return `What are the income requirements for ${schemeName}?`
  }
  if (reason.includes("age")) {
    return `What if I don't meet the age criteria for ${schemeName}?`
  }
  if (reason.includes("gender") || reason.includes("woman") || reason.includes("female")) {
    return `Who is eligible for ${schemeName} based on gender?`
  }
  if (reason.includes("caste") || reason.includes("category") || reason.includes("sc") || reason.includes("st")) {
    return `What category requirements does ${schemeName} have?`
  }
  if (reason.includes("land") || reason.includes("farmer")) {
    return `What are the land ownership requirements for ${schemeName}?`
  }
  if (reason.includes("document") || reason.includes("certificate")) {
    return `What documents are required for ${schemeName}?`
  }
  if (reason.includes("reject")) {
    return `Why might my ${schemeName} application be rejected?`
  }

  // Generic fallback using the last question in the path
  if (questionPath.length > 0) {
    const lastQ = questionPath[questionPath.length - 1]
    return `What if I answered "no" to "${lastQ}" for ${schemeName}?`
  }

  return `Why might I not be eligible for ${schemeName}?`
}

/**
 * Generates JSON-LD FAQPage structured data for Google rich results.
 */
export function generateFAQJsonLd(faqs: FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
