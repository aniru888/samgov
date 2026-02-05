import { describe, it, expect } from "vitest";
import { chunkText, type TextChunk } from "../chunker";

/**
 * Helper: Generate realistic government scheme text of approximately N tokens.
 * Uses ~3.5 chars/token ratio (matching CHARS_PER_TOKEN in chunker.ts)
 */
function schemeText(approxTokens: number): string {
  const sentence =
    "The Gruha Lakshmi scheme provides monthly financial assistance of two thousand rupees to eligible women who are heads of households in Karnataka state. ";
  const tokensPerSentence = Math.ceil(sentence.length / 3.5); // ~43 tokens
  const repeats = Math.ceil(approxTokens / tokensPerSentence);
  return sentence.repeat(repeats).trim();
}

describe("chunker", () => {
  describe("chunkText - plain text (from pdf-parse)", () => {
    it("handles short text as single chunk", () => {
      // ~80 tokens, above MIN_CHUNK_TOKENS (50) but below TARGET_CHUNK_TOKENS (450)
      const text = schemeText(80);
      const chunks = chunkText(text, false, 1, "en");

      expect(chunks.length).toBe(1);
      expect(chunks[0].content).toBe(text);
      expect(chunks[0].metadata.extraction_method).toBe("native");
      expect(chunks[0].token_count).toBeGreaterThan(0);
    });

    it("splits long text into multiple chunks", () => {
      // ~1000 tokens, should produce 2-3 chunks of ~450 each
      const text = schemeText(1000);
      const chunks = chunkText(text, false, 5, "en");

      expect(chunks.length).toBeGreaterThan(1);
      for (const chunk of chunks) {
        expect(chunk.token_count).toBeLessThanOrEqual(500);
        expect(chunk.token_count).toBeGreaterThanOrEqual(50);
      }
    });

    it("merges small paragraphs into reasonably-sized chunks", () => {
      // Three paragraphs, each ~80 tokens. Combined ~240 tokens < 450, should merge into 1 chunk.
      const para = schemeText(80);
      const text = [para, "", para, "", para].join("\n");

      const chunks = chunkText(text, false, 3, "en");

      // All paragraphs should merge into a single chunk since combined < TARGET
      expect(chunks.length).toBe(1);
      expect(chunks[0].content).toContain("Gruha Lakshmi");
    });

    it("filters out chunks below minimum token threshold", () => {
      // One tiny fragment + one proper paragraph
      const text =
        "Hi.\n\n" +
        "The eligibility criteria for the Gruha Lakshmi scheme requires that the applicant must be a woman who is the head of a household with a family income below two lakh rupees per annum. " +
        "The applicant must be a resident of Karnataka state and must possess a valid ration card. The scheme provides monthly financial assistance of two thousand rupees directly to the bank account of the beneficiary.";

      const chunks = chunkText(text, false, 1, "en");

      // Tiny "Hi." should be merged or filtered (below 50 tokens on its own)
      for (const chunk of chunks) {
        expect(chunk.token_count).toBeGreaterThanOrEqual(50);
      }
    });

    it("assigns page numbers proportionally", () => {
      // ~1500 tokens across 10 pages → 3-4 chunks
      const text = schemeText(1500);
      const chunks = chunkText(text, false, 10, "en");

      expect(chunks.length).toBeGreaterThan(1);
      // First chunk should have a lower page number than last
      expect(chunks[0].metadata.page_number).toBeLessThanOrEqual(
        chunks[chunks.length - 1].metadata.page_number!
      );
      // Last chunk shouldn't exceed total pages
      expect(chunks[chunks.length - 1].metadata.page_number).toBeLessThanOrEqual(10);
    });
  });

  describe("chunkText - markdown (from LlamaParse)", () => {
    it("splits by heading boundaries", () => {
      // Each section has ~80 tokens (well above MIN_CHUNK_TOKENS)
      const sectionBody = schemeText(80);
      const markdown = [
        "## Eligibility Criteria",
        sectionBody,
        "",
        "## Required Documents",
        sectionBody,
        "",
        "## Application Process",
        sectionBody,
      ].join("\n");

      const chunks = chunkText(markdown, true, 3, "en");

      expect(chunks.length).toBe(3);
      expect(chunks[0].metadata.section).toBe("Eligibility Criteria");
      expect(chunks[1].metadata.section).toBe("Required Documents");
      expect(chunks[2].metadata.section).toBe("Application Process");
    });

    it("splits large markdown sections further", () => {
      // One section with ~1000 tokens → should split into 2-3 sub-chunks
      const longContent = schemeText(1000);
      const longSection = "## Very Long Section\n" + longContent;

      const chunks = chunkText(longSection, true, 5, "en");

      expect(chunks.length).toBeGreaterThan(1);
      for (const chunk of chunks) {
        expect(chunk.token_count).toBeLessThanOrEqual(500);
        expect(chunk.metadata.section).toBe("Very Long Section");
      }
    });

    it("handles nested headings", () => {
      const body = schemeText(80);
      const markdown = [
        "## Main Section",
        body,
        "",
        "### Subsection A",
        body,
        "",
        "### Subsection B",
        body,
      ].join("\n");

      const chunks = chunkText(markdown, true, 4, "en");

      // Should produce 3 chunks (one per heading)
      expect(chunks.length).toBe(3);
    });

    it("sets extraction_method to ocr for markdown chunks", () => {
      const body = schemeText(80);
      const markdown = "## Section\n" + body;
      const chunks = chunkText(markdown, true, 1, "en");

      for (const chunk of chunks) {
        expect(chunk.metadata.extraction_method).toBe("ocr");
      }
    });
  });

  describe("language handling", () => {
    it("adds language tag for Kannada content", () => {
      // Kannada text that's long enough (>175 chars)
      const text =
        "ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆಯ ಅರ್ಹತಾ ಮಾನದಂಡಗಳು ಮತ್ತು ಅನುಕೂಲಗಳ ಬಗ್ಗೆ ವಿವರಣೆ. " +
        "ಅರ್ಜಿದಾರರು ಕರ್ನಾಟಕ ರಾಜ್ಯದ ನಿವಾಸಿಗಳಾಗಿರಬೇಕು ಮತ್ತು ಮಾನ್ಯ ಪಡಿತರ ಚೀಟಿಯನ್ನು ಹೊಂದಿರಬೇಕು. " +
        "ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ಎರಡು ಲಕ್ಷ ರೂಪಾಯಿಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು. " +
        "ಫಲಾನುಭವಿಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ತಿಂಗಳಿಗೆ ಎರಡು ಸಾವಿರ ರೂಪಾಯಿ ಹಣಕಾಸಿನ ಸಹಾಯ ಒದಗಿಸಲಾಗುತ್ತದೆ.";

      const chunks = chunkText(text, false, 1, "kn");

      expect(chunks.length).toBeGreaterThanOrEqual(1);
      expect(chunks[0].metadata.section).toContain("[kn]");
    });

    it("does not add language tag for English content", () => {
      const text = schemeText(80);
      const chunks = chunkText(text, false, 1, "en");

      expect(chunks.length).toBeGreaterThanOrEqual(1);
      const section = chunks[0].metadata.section || "";
      expect(section).not.toContain("[en]");
    });

    it("adds language tag for mixed content", () => {
      const text =
        "The Gruha Lakshmi scheme provides two thousand rupees per month to eligible women who are heads of households. " +
        "ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆ ಅರ್ಹ ಮಹಿಳೆಯರಿಗೆ ತಿಂಗಳಿಗೆ ಎರಡು ಸಾವಿರ ರೂಪಾಯಿ ಒದಗಿಸುತ್ತದೆ. " +
        "The applicant must be a resident of Karnataka state and must possess a valid ration card issued by the government.";

      const chunks = chunkText(text, false, 1, "mixed");

      expect(chunks.length).toBeGreaterThanOrEqual(1);
      expect(chunks[0].metadata.section).toContain("[mixed]");
    });
  });

  describe("edge cases", () => {
    it("returns empty array for empty text", () => {
      const chunks = chunkText("", false, 0, "en");
      expect(chunks).toEqual([]);
    });

    it("returns empty array for whitespace-only text", () => {
      const chunks = chunkText("   \n\n   ", false, 0, "en");
      expect(chunks).toEqual([]);
    });

    it("handles text with no paragraph breaks", () => {
      // ~600 tokens in a single run-on block (no paragraph breaks)
      const text = schemeText(600);
      const chunks = chunkText(text, false, 1, "en");

      expect(chunks.length).toBeGreaterThan(0);
      for (const chunk of chunks) {
        expect(chunk.token_count).toBeLessThanOrEqual(500);
      }
    });

    it("handles markdown with no headings", () => {
      // Markdown mode but no headings - should still produce valid chunk
      const text = schemeText(80);
      const chunks = chunkText(text, true, 1, "en");

      expect(chunks.length).toBeGreaterThanOrEqual(1);
      expect(chunks[0].metadata.section).toBeUndefined();
    });
  });
});
