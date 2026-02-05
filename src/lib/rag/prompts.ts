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
 * Prompt for low confidence situations
 */
export const LOW_CONFIDENCE_RESPONSE = `I couldn't find specific information about this in my sources.

For accurate and up-to-date information, please:
1. Visit the official portal: ${OFFICIAL_PORTAL_URL}
2. Call the helpline: 1902
3. Visit your nearest Seva Sindhu center

This ensures you get the most current eligibility criteria and requirements.`;

/**
 * Prompt for no results
 */
export const NO_RESULTS_RESPONSE = `I don't have information about this specific query in my database.

This might be because:
- The scheme details are not in my current documents
- The question is about a very specific case
- The information may have been updated

Please check the official Karnataka government portal for the most accurate information: ${OFFICIAL_PORTAL_URL}`;

/**
 * Build the full prompt with context and query
 * @param context - Retrieved document chunks
 * @param query - User's question
 * @returns Full prompt for Gemini
 */
export function buildPrompt(context: string, query: string): string {
  return `${SYSTEM_PROMPT}

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
 * @returns Validation result with any issues found
 */
export function validateResponse(response: string): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for forbidden certainty language
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

  // Check for citations
  if (!response.includes("[Source")) {
    issues.push("Missing source citations");
  }

  // Check for disclaimer
  if (
    !response.toLowerCase().includes("guidance only") &&
    !response.toLowerCase().includes("verify") &&
    !response.toLowerCase().includes("official portal")
  ) {
    issues.push("Missing disclaimer or verification reminder");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
