/**
 * Document Processor
 * Tiered PDF text extraction: pdf-parse (digital) → LlamaParse (scanned/Kannada)
 *
 * Tier 1: pdf-parse - instant, free, for digitally-created PDFs with embedded text
 * Tier 2: LlamaParse - for scanned PDFs or when pdf-parse returns insufficient text
 */

import { PDFParse } from "pdf-parse";
import { parseWithLlamaParse } from "./llamaparse-client";
import type { ExtractionResult } from "../types";

/** Minimum characters to consider pdf-parse extraction successful */
const MIN_TEXT_THRESHOLD = 100;

/** Kannada Unicode block range (U+0C80 to U+0CFF) - global flag for counting all matches */
const KANNADA_REGEX = /[\u0C80-\u0CFF]/g;

/**
 * Extended extraction result with language info
 */
export interface DocumentExtractionResult extends ExtractionResult {
  language: "en" | "kn" | "mixed";
  is_markdown: boolean;
  credits_used: number;
}

/**
 * Detect the primary language of text based on Kannada Unicode presence
 */
export function detectLanguage(text: string): "en" | "kn" | "mixed" {
  const kannadaChars = (text.match(/[\u0C80-\u0CFF]/g) || []).length;
  const totalChars = text.replace(/\s/g, "").length;

  if (totalChars === 0) return "en";

  const kannadaRatio = kannadaChars / totalChars;

  if (kannadaRatio > 0.5) return "kn";
  if (kannadaRatio > 0.1) return "mixed";
  return "en";
}

/**
 * Extract text from a PDF using the tiered approach:
 * 1. Try pdf-parse (fast, free, digital PDFs)
 * 2. Fall back to LlamaParse (scanned PDFs, Kannada OCR)
 *
 * @param pdfBuffer - PDF file as Buffer
 * @param filename - Original filename
 * @returns Extracted text with metadata
 */
export async function extractText(
  pdfBuffer: Buffer,
  filename: string
): Promise<DocumentExtractionResult> {
  // Tier 1: Try pdf-parse for digital PDFs
  try {
    const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) });
    const textResult = await parser.getText();
    const infoResult = await parser.getInfo();
    const pageCount = infoResult.pages?.length ?? 0;

    if (textResult.text && textResult.text.trim().length >= MIN_TEXT_THRESHOLD) {
      const language = detectLanguage(textResult.text);

      await parser.destroy();
      return {
        text: textResult.text,
        extraction_method: "native",
        confidence: 1.0,
        page_count: pageCount,
        language,
        is_markdown: false,
        credits_used: 0,
      };
    }
    await parser.destroy();
  } catch (error) {
    // pdf-parse failed (corrupted PDF, encrypted, etc.) - fall through to LlamaParse
    console.warn(
      `pdf-parse failed for ${filename}, falling back to LlamaParse:`,
      error instanceof Error ? error.message : error
    );
  }

  // Tier 2: Use LlamaParse for scanned/image PDFs
  try {
    const result = await parseWithLlamaParse(pdfBuffer, filename);
    const language = detectLanguage(result.markdown);

    return {
      text: result.markdown,
      extraction_method: "ocr",
      confidence: 0.85, // LlamaParse Cost Effective tier confidence estimate
      page_count: result.pages,
      language,
      is_markdown: true,
      credits_used: result.credits_used,
    };
  } catch (error) {
    // Both tiers failed
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(
      `Document extraction failed for ${filename}. ` +
        `pdf-parse returned insufficient text, and LlamaParse failed: ${message}`
    );
  }
}
