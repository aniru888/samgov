/**
 * RAG System Prompts
 * Carefully crafted prompts for hallucination prevention and GovTech safety
 */

import { OFFICIAL_PORTAL_URL } from "./types";

/**
 * Main system prompt for RAG Q&A
 * CRITICAL: This prompt enforces safety rules for government advice
 */
export const SYSTEM_PROMPT = `You are an AI assistant helping citizens understand Karnataka government welfare schemes.

## CRITICAL RULES (NEVER VIOLATE)

1. **ONLY USE PROVIDED SOURCES**
   - Answer ONLY from the documents provided below
   - If information is not in the sources, say "I couldn't find this information"
   - NEVER make up facts or extrapolate beyond what sources say

2. **NEVER CLAIM CERTAINTY**
   - ALWAYS say "may be eligible" - NEVER "you are eligible"
   - Use phrases like: "based on the sources", "according to the guidelines"
   - NEVER guarantee eligibility or benefits

3. **ALWAYS CITE SOURCES**
   - Include [Source X] citations for every claim
   - Reference the specific document and section when possible
   - Example: "According to [Source 1], applicants may need..."

4. **ADMIT UNCERTAINTY**
   - If sources don't clearly answer the question, say:
     "I'm not confident about this specific detail. Please verify on the official portal."
   - If sources conflict, acknowledge the uncertainty

5. **INCLUDE DISCLAIMER**
   - ALWAYS end with: "This is guidance only. For official eligibility, please verify at ${OFFICIAL_PORTAL_URL}"

## RESPONSE FORMAT

Structure your response as:
1. Direct answer to the question (citing sources)
2. Relevant details from the documents
3. What documents the user may need (if applicable)
4. Disclaimer and link to official portal

## EXAMPLE RESPONSE

"Based on [Source 1], you may be eligible for Gruha Lakshmi if you are the woman head of household with an active ration card. The scheme provides ₹2,000 per month.

Required documents according to [Source 2]:
- Aadhaar card
- Ration card (BPL/APL)
- Bank account details

This is guidance only. Rules may have changed. For official eligibility determination, please verify at ${OFFICIAL_PORTAL_URL}"`;

/**
 * Kannada language instruction block appended to system prompt
 */
export const KANNADA_LANGUAGE_INSTRUCTION = `

## LANGUAGE INSTRUCTION
Respond ENTIRELY in Kannada (ಕನ್ನಡ). Use Kannada script for all text.
Keep [Source X] citation markers in English. Keep URLs and proper nouns as-is.
End with disclaimer in Kannada: "ಇದು ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ. ಅಧಿಕೃತ ಅರ್ಹತೆಗಾಗಿ, ದಯವಿಟ್ಟು ${OFFICIAL_PORTAL_URL} ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ"`;

/**
 * Prompt for low confidence situations
 */
export const LOW_CONFIDENCE_RESPONSE = `I couldn't find specific information about this in my sources.

For accurate and up-to-date information, please:
1. Visit the official portal: ${OFFICIAL_PORTAL_URL}
2. Call the helpline: 1902
3. Visit your nearest Seva Sindhu center

This ensures you get the most current eligibility criteria and requirements.`;

export const LOW_CONFIDENCE_RESPONSE_KN = `ನನ್ನ ಮೂಲಗಳಲ್ಲಿ ಈ ಬಗ್ಗೆ ನಿರ್ದಿಷ್ಟ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ.

ನಿಖರ ಮತ್ತು ನವೀಕೃತ ಮಾಹಿತಿಗಾಗಿ, ದಯವಿಟ್ಟು:
1. ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ: ${OFFICIAL_PORTAL_URL}
2. ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ: 1902
3. ನಿಮ್ಮ ಹತ್ತಿರದ ಸೇವಾ ಸಿಂಧು ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ

ಇದು ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ. ಅಧಿಕೃತ ಅರ್ಹತೆಗಾಗಿ, ದಯವಿಟ್ಟು ${OFFICIAL_PORTAL_URL} ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ`;

/**
 * Prompt for no results
 */
export const NO_RESULTS_RESPONSE = `I don't have information about this specific query in my database.

This might be because:
- The scheme details are not in my current documents
- The question is about a very specific case
- The information may have been updated

Please check the official Karnataka government portal for the most accurate information: ${OFFICIAL_PORTAL_URL}`;

export const NO_RESULTS_RESPONSE_KN = `ನನ್ನ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಈ ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆಗೆ ಮಾಹಿತಿ ಇಲ್ಲ.

ಇದು ಈ ಕಾರಣಗಳಿಂದ ಇರಬಹುದು:
- ಯೋಜನೆಯ ವಿವರಗಳು ನನ್ನ ಪ್ರಸ್ತುತ ದಾಖಲೆಗಳಲ್ಲಿ ಇಲ್ಲ
- ಪ್ರಶ್ನೆ ಬಹಳ ನಿರ್ದಿಷ್ಟ ಪ್ರಕರಣದ ಬಗ್ಗೆ ಇದೆ
- ಮಾಹಿತಿ ನವೀಕರಿಸಲ್ಪಟ್ಟಿರಬಹುದು

ಅತ್ಯಂತ ನಿಖರ ಮಾಹಿತಿಗಾಗಿ ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ: ${OFFICIAL_PORTAL_URL}`;

/**
 * Get the appropriate low confidence response for the language
 */
export function getLowConfidenceResponse(language: "en" | "kn" = "en"): string {
  return language === "kn" ? LOW_CONFIDENCE_RESPONSE_KN : LOW_CONFIDENCE_RESPONSE;
}

/**
 * Get the appropriate no results response for the language
 */
export function getNoResultsResponse(language: "en" | "kn" = "en"): string {
  return language === "kn" ? NO_RESULTS_RESPONSE_KN : NO_RESULTS_RESPONSE;
}

/**
 * Build the full prompt with context and query
 * @param context - Retrieved document chunks
 * @param query - User's question
 * @param language - Response language
 * @returns Full prompt for Gemini
 */
export function buildPrompt(context: string, query: string, language: "en" | "kn" = "en"): string {
  const langInstruction = language === "kn" ? KANNADA_LANGUAGE_INSTRUCTION : "";

  return `${SYSTEM_PROMPT}${langInstruction}

## SOURCES (Use these to answer the question)

${context}

---

## USER QUESTION

${query}

---

## YOUR RESPONSE (Remember: cite sources, use "may be eligible", include disclaimer)`;
}

/**
 * Format retrieved chunks as numbered sources
 * @param chunks - Array of retrieved chunks with metadata
 * @returns Formatted context string
 */
export function formatChunksAsContext(
  chunks: Array<{
    content: string;
    document_title: string;
    source_url?: string;
    metadata?: {
      section?: string;
      page_number?: number;
      circular_number?: string;
    };
  }>
): string {
  return chunks
    .map((chunk, index) => {
      const sourceNum = index + 1;
      const metadata = chunk.metadata || {};

      let sourceHeader = `[Source ${sourceNum}] ${chunk.document_title}`;
      if (metadata.section) {
        sourceHeader += ` - ${metadata.section}`;
      }
      if (metadata.page_number) {
        sourceHeader += ` (Page ${metadata.page_number})`;
      }
      if (metadata.circular_number) {
        sourceHeader += ` [${metadata.circular_number}]`;
      }

      return `${sourceHeader}\n${chunk.content}`;
    })
    .join("\n\n---\n\n");
}

/**
 * Extract citation numbers from a response
 * @param response - AI response text
 * @returns Array of cited source numbers
 */
export function extractCitations(response: string): number[] {
  const citations: number[] = [];
  const pattern = /\[Source (\d+)\]/g;
  let match;

  while ((match = pattern.exec(response)) !== null) {
    const num = parseInt(match[1], 10);
    if (!citations.includes(num)) {
      citations.push(num);
    }
  }

  return citations.sort((a, b) => a - b);
}

/**
 * Validate that response follows safety rules
 * @param response - AI response to validate
 * @param language - Response language (skip English-pattern checks for Kannada)
 * @returns Validation result with any issues found
 */
export function validateResponse(response: string, language: "en" | "kn" = "en"): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for forbidden certainty language (English patterns only apply to English responses)
  if (language === "en") {
    const certaintyPatterns = [
      /you are eligible/i,
      /you will receive/i,
      /you will get/i,
      /guaranteed/i,
      /definitely/i,
      /certainly eligible/i,
    ];

    for (const pattern of certaintyPatterns) {
      if (pattern.test(response)) {
        issues.push(`Contains forbidden certainty language: ${pattern}`);
      }
    }
  }

  // Check for citations (applies to both languages - [Source X] kept in English)
  if (!response.includes("[Source")) {
    issues.push("Missing source citations");
  }

  // Check for disclaimer (language-aware)
  if (language === "kn") {
    // For Kannada, check for Kannada disclaimer markers or portal URL
    if (
      !response.includes("ಮಾರ್ಗದರ್ಶನ") &&
      !response.includes("ಪರಿಶೀಲಿಸಿ") &&
      !response.includes(OFFICIAL_PORTAL_URL)
    ) {
      issues.push("Missing disclaimer or verification reminder (Kannada)");
    }
  } else {
    if (
      !response.toLowerCase().includes("guidance only") &&
      !response.toLowerCase().includes("verify") &&
      !response.toLowerCase().includes("official portal")
    ) {
      issues.push("Missing disclaimer or verification reminder");
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
