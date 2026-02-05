import { describe, it, expect } from "vitest";
import { detectLanguage } from "../document-processor";

describe("document-processor", () => {
  describe("detectLanguage", () => {
    it("detects English text", () => {
      expect(detectLanguage("This is an English sentence about government schemes.")).toBe("en");
    });

    it("detects Kannada text", () => {
      expect(detectLanguage("ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆಯ ಅರ್ಹತಾ ಮಾನದಂಡಗಳು")).toBe("kn");
    });

    it("detects mixed content", () => {
      // Mix of English and Kannada with >10% but <50% Kannada
      expect(
        detectLanguage(
          "The Gruha Lakshmi scheme ಗೃಹ ಲಕ್ಷ್ಮಿ provides benefits to women heads of household."
        )
      ).toBe("mixed");
    });

    it("returns 'en' for empty text", () => {
      expect(detectLanguage("")).toBe("en");
    });

    it("returns 'en' for whitespace-only text", () => {
      expect(detectLanguage("   \n\t  ")).toBe("en");
    });

    it("returns 'en' for numbers and punctuation only", () => {
      expect(detectLanguage("₹2,000 / 12 = ₹166.67")).toBe("en");
    });

    it("correctly identifies predominantly Kannada text with some English", () => {
      const text = "ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆ (Gruha Lakshmi Scheme) ಅರ್ಹತಾ ಮಾನದಂಡಗಳು ಮತ್ತು ಅನುಕೂಲಗಳ ಬಗ್ಗೆ ವಿವರಣೆ";
      expect(detectLanguage(text)).toBe("kn");
    });

    it("detects language with long English text", () => {
      const text =
        "The Karnataka government welfare scheme eligibility criteria require applicants to be " +
        "residents of the state with annual family income below two lakh rupees per annum. " +
        "Valid documentation including Aadhaar card and ration card is mandatory.";
      expect(detectLanguage(text)).toBe("en");
    });

    it("detects language with long Kannada text", () => {
      const text =
        "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಕಲ್ಯಾಣ ಯೋಜನೆಯ ಅರ್ಹತಾ ಮಾನದಂಡಗಳಿಗೆ ಅರ್ಜಿದಾರರು ರಾಜ್ಯದ ನಿವಾಸಿಗಳಾಗಿರಬೇಕು " +
        "ಮತ್ತು ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ಎರಡು ಲಕ್ಷ ರೂಪಾಯಿಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು";
      expect(detectLanguage(text)).toBe("kn");
    });
  });

  // Note: extractText() requires actual PDF files and API calls (pdf-parse, LlamaParse)
  // Those are tested via integration tests, not unit tests.
});
