import { describe, it, expect } from "vitest"
import { getDocumentGuide, hasDocumentGuide, getAllGuides } from "../guides"

describe("getDocumentGuide", () => {
  it("returns guide for exact match (Aadhaar Card)", () => {
    const guide = getDocumentGuide("Aadhaar Card")
    expect(guide).toBeDefined()
    expect(guide!.name_en).toBe("Aadhaar Card")
    expect(guide!.name_kn).toBe("ಆಧಾರ್ ಕಾರ್ಡ್")
    expect(guide!.online_url).toBe("https://myaadhaar.uidai.gov.in")
  })

  it("returns guide for case-insensitive match", () => {
    const guide = getDocumentGuide("aadhaar card")
    expect(guide).toBeDefined()
    expect(guide!.name_en).toBe("Aadhaar Card")
  })

  it("matches Income Certificate", () => {
    const guide = getDocumentGuide("Income Certificate")
    expect(guide).toBeDefined()
    expect(guide!.where_en).toContain("Tahsildar")
    expect(guide!.online_url).toBe("https://nadakacheri.karnataka.gov.in")
  })

  it("matches Caste Certificate with parenthetical variations", () => {
    expect(getDocumentGuide("Caste Certificate (SC/ST)")).toBeDefined()
    expect(getDocumentGuide("Caste Certificate (Backward Classes)")).toBeDefined()
    expect(getDocumentGuide("Caste Certificate")).toBeDefined()
  })

  it("matches BPL Ration Card", () => {
    const guide = getDocumentGuide("BPL Ration Card")
    expect(guide).toBeDefined()
    expect(guide!.name_en).toContain("Ration Card")
  })

  it("matches Ration Card (AAY/PHH)", () => {
    const guide = getDocumentGuide("Ration Card (AAY/PHH)")
    expect(guide).toBeDefined()
  })

  it("matches Land Records (RTC)", () => {
    const guide = getDocumentGuide("Land Records (RTC)")
    expect(guide).toBeDefined()
    expect(guide!.online_url).toBe("https://landrecords.karnataka.gov.in")
  })

  it("matches Bank Passbook", () => {
    const guide = getDocumentGuide("Bank Passbook")
    expect(guide).toBeDefined()
    expect(guide!.cost_en).toContain("Free")
  })

  it("matches Passport-size Photograph", () => {
    const guide = getDocumentGuide("Passport-size Photograph")
    expect(guide).toBeDefined()
    expect(guide!.cost_en).toContain("20-50")
  })

  it("matches Electricity Bill with ESCOM names", () => {
    expect(getDocumentGuide("Electricity Bill (BESCOM/HESCOM/GESCOM/MESCOM/CESC)")).toBeDefined()
  })

  it("matches Thayi Bhagya Card", () => {
    const guide = getDocumentGuide("Thayi Bhagya Card")
    expect(guide).toBeDefined()
    expect(guide!.where_en).toContain("PHC")
  })

  it("matches Business Project Proposal", () => {
    const guide = getDocumentGuide("Business Project Proposal")
    expect(guide).toBeDefined()
  })

  it("matches Minority Community Certificate", () => {
    const guide = getDocumentGuide("Minority Community Certificate")
    expect(guide).toBeDefined()
  })

  it("matches PAN Card", () => {
    const guide = getDocumentGuide("PAN Card")
    expect(guide).toBeDefined()
    expect(guide!.online_url).toContain("incometax")
  })

  it("matches Driving License", () => {
    const guide = getDocumentGuide("Driving License")
    expect(guide).toBeDefined()
    expect(guide!.online_url).toContain("parivahan")
  })

  it("matches Birth Certificate (girl child)", () => {
    const guide = getDocumentGuide("Birth Certificate (girl child)")
    expect(guide).toBeDefined()
    expect(guide!.name_en).toBe("Birth Certificate")
  })

  it("matches College Admission Letter", () => {
    const guide = getDocumentGuide("College Admission Letter")
    expect(guide).toBeDefined()
  })

  it("matches Previous Year Marks Card", () => {
    const guide = getDocumentGuide("Previous Year Marks Card")
    expect(guide).toBeDefined()
  })

  it("matches Address Proof", () => {
    const guide = getDocumentGuide("Address Proof")
    expect(guide).toBeDefined()
  })

  it("matches Age Proof", () => {
    const guide = getDocumentGuide("Age Proof")
    expect(guide).toBeDefined()
  })

  it("returns undefined for unknown document", () => {
    expect(getDocumentGuide("Random Unknown Document")).toBeUndefined()
  })

  it("returns undefined for very specialized documents", () => {
    expect(getDocumentGuide("KSRTC Employee ID Card")).toBeUndefined()
    expect(getDocumentGuide("Reeling Unit Registration")).toBeUndefined()
  })

  it("includes Kannada translations for all guides", () => {
    const allGuides = getAllGuides()
    for (const [key, guide] of Object.entries(allGuides)) {
      expect(guide.name_kn, `${key} missing name_kn`).toBeTruthy()
      expect(guide.where_kn, `${key} missing where_kn`).toBeTruthy()
      expect(guide.how_kn, `${key} missing how_kn`).toBeTruthy()
      expect(guide.timeline_kn, `${key} missing timeline_kn`).toBeTruthy()
      expect(guide.cost_kn, `${key} missing cost_kn`).toBeTruthy()
    }
  })
})

describe("hasDocumentGuide", () => {
  it("returns true for known documents", () => {
    expect(hasDocumentGuide("Aadhaar Card")).toBe(true)
    expect(hasDocumentGuide("Income Certificate")).toBe(true)
    expect(hasDocumentGuide("Bank Passbook")).toBe(true)
  })

  it("returns false for unknown documents", () => {
    expect(hasDocumentGuide("Unknown Document Type")).toBe(false)
  })
})

describe("getAllGuides", () => {
  it("returns all available guides", () => {
    const guides = getAllGuides()
    expect(Object.keys(guides).length).toBeGreaterThanOrEqual(15)
  })

  it("every guide has required fields", () => {
    const guides = getAllGuides()
    for (const [key, guide] of Object.entries(guides)) {
      expect(guide.name_en, `${key} missing name_en`).toBeTruthy()
      expect(guide.where_en, `${key} missing where_en`).toBeTruthy()
      expect(guide.how_en, `${key} missing how_en`).toBeTruthy()
      expect(guide.timeline_en, `${key} missing timeline_en`).toBeTruthy()
      expect(guide.cost_en, `${key} missing cost_en`).toBeTruthy()
    }
  })
})
