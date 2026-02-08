/**
 * Validation tests for 6 new decision trees (Phase 3 Week 2)
 * Trees: gruha-jyothi, pm-kisan, ayushman-bharat, pmay-urban, pmay-gramin, pm-ujjwala
 *
 * Tests use validateDecisionTree() from validator.ts — pure JSON validation, no DB needed.
 */

import { describe, it, expect } from "vitest"
import { validateDecisionTree } from "../validator"

// ============================================================
// Tree 1: Gruha Jyothi (Free Electricity)
// ============================================================
const gruhaJyothiTree = {
  start: "q_resident",
  nodes: {
    q_resident: {
      type: "question",
      text_en: "Are you a permanent resident of Karnataka?",
      options: [
        { label: "Yes", next: "q_connection" },
        { label: "No", next: "r_not_resident" },
      ],
    },
    q_connection: {
      type: "question",
      text_en: "Do you have a domestic electricity connection (not commercial/industrial)?",
      options: [
        { label: "Yes, domestic connection", next: "q_units" },
        { label: "No / Commercial connection", next: "r_no_connection" },
      ],
    },
    q_units: {
      type: "question",
      text_en: "Is your average monthly electricity consumption 200 units or less?",
      options: [
        { label: "Yes, 200 units or less", next: "q_bills" },
        { label: "No, more than 200 units", next: "r_over_200" },
      ],
    },
    q_bills: {
      type: "question",
      text_en: "Do you have any outstanding electricity bills?",
      options: [
        { label: "No, bills are cleared", next: "q_registered" },
        { label: "Yes, pending bills", next: "r_pending_bills" },
      ],
    },
    q_registered: {
      type: "question",
      text_en: "Have you already registered for the Gruha Jyothi scheme?",
      options: [
        { label: "Not yet registered", next: "r_eligible" },
        { label: "Already registered", next: "r_already_registered" },
      ],
    },
    r_eligible: {
      type: "result",
      status: "eligible",
      reason_en: "Based on your answers, you may meet the basic eligibility criteria for Gruha Jyothi (free electricity up to 200 units/month).",
      next_steps_en: "Register via the Seva Sindhu portal or visit your nearest Bangalore One / Grama One centre. Carry your Aadhaar, electricity bill, and ration card.",
      documents: ["Aadhaar Card", "Latest Electricity Bill", "Ration Card", "Proof of Residence"],
    },
    r_not_resident: {
      type: "result",
      status: "ineligible",
      reason_en: "Gruha Jyothi is available only for permanent residents of Karnataka.",
      fix_en: "Check if your state has a similar free electricity or subsidized power scheme.",
    },
    r_no_connection: {
      type: "result",
      status: "ineligible",
      reason_en: "This scheme covers only domestic electricity connections, not commercial or industrial ones.",
      fix_en: "If you need a domestic connection, apply at your local ESCOM office (BESCOM, HESCOM, GESCOM, MESCOM, or CESC).",
    },
    r_over_200: {
      type: "result",
      status: "ineligible",
      reason_en: "Your average monthly consumption exceeds the 200-unit limit for this scheme.",
      fix_en: "To qualify, your average consumption over the past 12 months must be 200 units or less. Consider reducing usage to meet the threshold.",
    },
    r_pending_bills: {
      type: "result",
      status: "needs_review",
      reason_en: "Outstanding electricity bills must be cleared before you can register for Gruha Jyothi.",
      fix_en: "Pay all pending electricity bills at your ESCOM office or online, then apply for the scheme.",
    },
    r_already_registered: {
      type: "result",
      status: "ineligible",
      reason_en: "You are already registered for Gruha Jyothi. Only one registration per household is allowed.",
      fix_en: "Check your benefit status on the Seva Sindhu portal. If you are not receiving the benefit, contact your ESCOM office.",
    },
  },
}

// ============================================================
// Tree 2: PM-KISAN
// ============================================================
const pmKisanTree = {
  start: "q_citizen",
  nodes: {
    q_citizen: {
      type: "question",
      text_en: "Are you an Indian citizen?",
      options: [
        { label: "Yes", next: "q_farmer" },
        { label: "No", next: "r_not_citizen" },
      ],
    },
    q_farmer: {
      type: "question",
      text_en: "Does your family own cultivable agricultural land?",
      options: [
        { label: "Yes, we own farmland", next: "q_taxpayer" },
        { label: "No cultivable land", next: "r_not_farmer" },
      ],
    },
    q_taxpayer: {
      type: "question",
      text_en: "Are you or any family member an income tax payer or professional tax payer?",
      options: [
        { label: "No, not a taxpayer", next: "q_govt" },
        { label: "Yes, income/professional tax payer", next: "r_taxpayer" },
      ],
    },
    q_govt: {
      type: "question",
      text_en: "Are you or any family member a current/retired government employee, constitutional post holder, or professional (doctor, engineer, lawyer, CA)?",
      options: [
        { label: "No, none of the above", next: "q_institutional" },
        { label: "Yes", next: "r_govt" },
      ],
    },
    q_institutional: {
      type: "question",
      text_en: "Is the land held by an institution (trust, cooperative society, etc.) rather than your family?",
      options: [
        { label: "No, family-owned land", next: "q_aadhaar" },
        { label: "Yes, institutional land", next: "r_institutional" },
      ],
    },
    q_aadhaar: {
      type: "question",
      text_en: "Do you have an Aadhaar card linked to your bank account and mobile number?",
      options: [
        { label: "Yes, Aadhaar linked", next: "r_eligible" },
        { label: "No, not linked yet", next: "r_link_aadhaar" },
      ],
    },
    r_eligible: {
      type: "result",
      status: "eligible",
      reason_en: "Based on your answers, you may meet the basic eligibility criteria for PM-KISAN (Rs 6,000/year income support for farmer families).",
      next_steps_en: "Register at pmkisan.gov.in or visit your local Common Service Centre. Complete e-KYC with your Aadhaar.",
      documents: ["Aadhaar Card (linked to bank and mobile)", "Land Ownership Records", "Bank Passbook (Aadhaar-linked account)", "Mobile Number"],
    },
    r_not_citizen: {
      type: "result",
      status: "ineligible",
      reason_en: "PM-KISAN is available only for Indian citizens.",
      fix_en: "This scheme requires Indian citizenship. Non-citizens are not eligible.",
    },
    r_not_farmer: {
      type: "result",
      status: "ineligible",
      reason_en: "PM-KISAN requires the family to own cultivable agricultural land.",
      fix_en: "If you have land but it is not in your records, update your land records at your local Bhoomi portal / land revenue office.",
    },
    r_taxpayer: {
      type: "result",
      status: "ineligible",
      reason_en: "Families where any member is an income tax or professional tax payer are excluded from PM-KISAN.",
      fix_en: "This is a firm exclusion. PM-KISAN is targeted at small and marginal farmer families.",
    },
    r_govt: {
      type: "result",
      status: "ineligible",
      reason_en: "Current or retired government employees, constitutional post holders, and registered professionals (doctors, engineers, lawyers, CAs) are excluded.",
      fix_en: "If the government employee in your family is not the landowner, contact your district agriculture office for clarification.",
    },
    r_institutional: {
      type: "result",
      status: "ineligible",
      reason_en: "Land held by institutions (trusts, cooperatives, etc.) does not qualify for PM-KISAN.",
      fix_en: "Only individual/family-owned cultivable land is eligible.",
    },
    r_link_aadhaar: {
      type: "result",
      status: "needs_review",
      reason_en: "Aadhaar must be linked to your bank account for PM-KISAN payment. e-KYC is mandatory.",
      fix_en: "Visit your bank branch with Aadhaar to complete Aadhaar-bank linking. Then complete e-KYC at pmkisan.gov.in or a Common Service Centre.",
    },
  },
}

// ============================================================
// Tree 3: Ayushman Bharat PM-JAY
// ============================================================
const ayushmanBharatTree = {
  start: "q_citizen",
  nodes: {
    q_citizen: {
      type: "question",
      text_en: "Are you an Indian citizen?",
      options: [
        { label: "Yes", next: "q_existing_insurance" },
        { label: "No", next: "r_not_citizen" },
      ],
    },
    q_existing_insurance: {
      type: "question",
      text_en: "Does your family already have government health insurance coverage of Rs 5 lakh or more?",
      options: [
        { label: "No / Less than Rs 5 lakh", next: "q_secc" },
        { label: "Yes, Rs 5 lakh+ coverage", next: "r_has_insurance" },
      ],
    },
    q_secc: {
      type: "question",
      text_en: "Is your family listed in the SECC 2011 (Socio-Economic Caste Census) database?",
      options: [
        { label: "Yes, we are in SECC 2011", next: "r_eligible_secc" },
        { label: "Don''t know", next: "r_check_secc" },
        { label: "No, not in SECC 2011", next: "q_deprivation" },
      ],
    },
    q_deprivation: {
      type: "question",
      text_en: "Does your household fall in any of these categories: houseless, manual scavenger, primitive tribal group, bonded labour, or destitute/living on alms?",
      options: [
        { label: "Yes, one of the above", next: "r_eligible_auto" },
        { label: "No, none of the above", next: "q_occupation" },
      ],
    },
    q_occupation: {
      type: "question",
      text_en: "Is your primary occupation one of these: ragpicker, street vendor, domestic worker, construction worker, sanitation worker, transport worker, or similar manual labour?",
      options: [
        { label: "Yes", next: "r_eligible_occupation" },
        { label: "No / Different occupation", next: "q_ration_card" },
      ],
    },
    q_ration_card: {
      type: "question",
      text_en: "Do you hold an Antyodaya (AAY) or BPL ration card?",
      options: [
        { label: "Yes, AAY or BPL card", next: "r_eligible_ration" },
        { label: "No", next: "r_not_covered" },
      ],
    },
    r_eligible_secc: {
      type: "result",
      status: "eligible",
      reason_en: "Families listed in the SECC 2011 database may be eligible for Ayushman Bharat PM-JAY (Rs 5 lakh health insurance).",
      next_steps_en: "Verify your eligibility at mera.pmjay.gov.in or call 14555. Visit an empanelled hospital with your Aadhaar and ration card.",
      documents: ["Aadhaar Card", "Ration Card or SECC Letter", "Mobile Number (linked to Aadhaar)"],
    },
    r_eligible_auto: {
      type: "result",
      status: "eligible",
      reason_en: "Families in auto-inclusion categories (houseless, manual scavenger, primitive tribal, bonded labour, destitute) may be eligible for PM-JAY.",
      next_steps_en: "Verify at mera.pmjay.gov.in or visit an Ayushman Mitra at any empanelled hospital. Carry your Aadhaar and category certificate.",
      documents: ["Aadhaar Card", "Category Certificate", "Proof of Identity"],
    },
    r_eligible_occupation: {
      type: "result",
      status: "eligible",
      reason_en: "Workers in specified occupations (ragpicker, vendor, domestic worker, construction, sanitation, transport) may be eligible for PM-JAY.",
      next_steps_en: "Check your eligibility at mera.pmjay.gov.in. Visit an Ayushman Mitra at an empanelled hospital with your Aadhaar and occupation proof.",
      documents: ["Aadhaar Card", "Income or Occupation Proof", "Ration Card (if available)"],
    },
    r_eligible_ration: {
      type: "result",
      status: "eligible",
      reason_en: "AAY and BPL ration card holders may be eligible for PM-JAY in states that have expanded coverage.",
      next_steps_en: "Check your eligibility at mera.pmjay.gov.in or call 14555. Carry your ration card and Aadhaar to an empanelled hospital.",
      documents: ["Aadhaar Card", "Ration Card (AAY/BPL)", "Mobile Number"],
    },
    r_not_citizen: {
      type: "result",
      status: "ineligible",
      reason_en: "PM-JAY is available only for Indian citizens.",
      fix_en: "This scheme requires Indian citizenship.",
    },
    r_has_insurance: {
      type: "result",
      status: "needs_review",
      reason_en: "If your family already has government health coverage of Rs 5 lakh or more, you may not need PM-JAY. However, you may still be eligible.",
      fix_en: "Check mera.pmjay.gov.in to verify if your family is listed. PM-JAY can be used alongside other coverage at empanelled hospitals.",
    },
    r_check_secc: {
      type: "result",
      status: "needs_review",
      reason_en: "You can check if your family is in the SECC 2011 database, which is the primary eligibility criterion for PM-JAY.",
      fix_en: "Visit mera.pmjay.gov.in and enter your mobile number or ration card number to check. You can also call the helpline 14555 or visit a nearby empanelled hospital.",
    },
    r_not_covered: {
      type: "result",
      status: "ineligible",
      reason_en: "Based on your answers, you may not currently meet PM-JAY eligibility criteria.",
      fix_en: "Check mera.pmjay.gov.in to verify — some states have expanded eligibility beyond SECC 2011. Also check state-specific health insurance schemes.",
    },
  },
}

// ============================================================
// Tree 4: PMAY-Urban
// ============================================================
const pmayUrbanTree = {
  start: "q_area",
  nodes: {
    q_area: {
      type: "question",
      text_en: "Do you live in an urban area (city, town, or urban local body)?",
      options: [
        { label: "Yes, urban area", next: "q_pucca" },
        { label: "No, rural area", next: "r_check_gramin" },
      ],
    },
    q_pucca: {
      type: "question",
      text_en: "Do you or any family member own a pucca (permanent/concrete) house anywhere in India?",
      options: [
        { label: "No, we do not own a pucca house", next: "q_income" },
        { label: "Yes, we own a pucca house", next: "r_has_house" },
      ],
    },
    q_income: {
      type: "question",
      text_en: "What is your annual household income?",
      options: [
        { label: "Up to Rs 3 lakh (EWS)", next: "q_previous_benefit" },
        { label: "Rs 3-6 lakh (LIG)", next: "q_previous_benefit" },
        { label: "Rs 6-12 lakh (MIG)", next: "r_eligible_mig" },
        { label: "Above Rs 12 lakh", next: "r_income_high" },
      ],
    },
    q_previous_benefit: {
      type: "question",
      text_en: "Has your family received a housing benefit from any government scheme before?",
      options: [
        { label: "No, first-time applicant", next: "r_eligible_ews_lig" },
        { label: "Yes, received before", next: "r_already_benefited" },
      ],
    },
    r_eligible_ews_lig: {
      type: "result",
      status: "eligible",
      reason_en: "Based on your answers, you may meet basic eligibility for PMAY-Urban (EWS/LIG category). You could receive financial assistance for affordable housing.",
      next_steps_en: "Apply through your Urban Local Body / Municipal Corporation or visit pmaymis.gov.in. You will need an income certificate from a competent authority.",
      documents: ["Aadhaar Card", "Income Certificate", "Affidavit (no pucca house owned)", "Bank Account Details", "Address Proof"],
    },
    r_eligible_mig: {
      type: "result",
      status: "eligible",
      reason_en: "Based on your answers, you may be eligible for PMAY-Urban under MIG category (interest subsidy on home loan).",
      next_steps_en: "Apply through a primary lending institution (bank/HFC) for CLSS benefit. The subsidy is credited directly to your loan account.",
      documents: ["Aadhaar Card", "Income Certificate or IT Returns", "Affidavit (no pucca house owned)", "Bank Loan Documents", "Property Documents"],
    },
    r_check_gramin: {
      type: "result",
      status: "needs_review",
      reason_en: "PMAY-Urban is for urban areas. If you are in a rural area, you may qualify for PMAY-Gramin instead.",
      fix_en: "Check PMAY-Gramin eligibility at pmayg.nic.in or contact your Gram Panchayat office.",
    },
    r_has_house: {
      type: "result",
      status: "ineligible",
      reason_en: "Families that already own a pucca house anywhere in India are not eligible for PMAY-Urban.",
      fix_en: "This is a core eligibility requirement. PMAY-Urban is for families without a pucca house.",
    },
    r_income_high: {
      type: "result",
      status: "ineligible",
      reason_en: "Annual household income above Rs 12 lakh exceeds the maximum threshold for PMAY-Urban.",
      fix_en: "PMAY-Urban covers EWS (up to Rs 3L), LIG (Rs 3-6L), and MIG (Rs 6-12L) categories only.",
    },
    r_already_benefited: {
      type: "result",
      status: "ineligible",
      reason_en: "Families that have already received housing benefits from a government scheme are generally not eligible for another PMAY-Urban benefit.",
      fix_en: "Contact your Urban Local Body to check if any exceptions apply to your situation.",
    },
  },
}

// ============================================================
// Tree 5: PMAY-Gramin
// ============================================================
const pmayGraminTree = {
  start: "q_area",
  nodes: {
    q_area: {
      type: "question",
      text_en: "Do you live in a rural area?",
      options: [
        { label: "Yes, rural area", next: "q_housing" },
        { label: "No, urban area", next: "r_check_urban" },
      ],
    },
    q_housing: {
      type: "question",
      text_en: "What is your current housing situation?",
      options: [
        { label: "Houseless / No shelter", next: "q_secc" },
        { label: "Kutcha or dilapidated house", next: "q_secc" },
        { label: "Pucca house (permanent/concrete)", next: "r_has_house" },
      ],
    },
    q_secc: {
      type: "question",
      text_en: "Is your family listed in the SECC 2011 (Socio-Economic Caste Census) database?",
      options: [
        { label: "Yes", next: "q_exclusion" },
        { label: "Don''t know", next: "r_check_secc" },
        { label: "No", next: "r_not_secc" },
      ],
    },
    q_exclusion: {
      type: "question",
      text_en: "Are you a government employee earning more than Rs 10,000/month, or an income tax payer, or do you hold a Kisan Credit Card with limit Rs 50,000 or more?",
      options: [
        { label: "No, none of the above", next: "q_gram_sabha" },
        { label: "Yes, one or more applies", next: "r_excluded" },
      ],
    },
    q_gram_sabha: {
      type: "question",
      text_en: "Has your name been verified and approved by the Gram Sabha (village assembly)?",
      options: [
        { label: "Yes, Gram Sabha verified", next: "r_eligible" },
        { label: "Not yet verified", next: "r_pending" },
      ],
    },
    r_eligible: {
      type: "result",
      status: "eligible",
      reason_en: "Based on your answers, you may meet basic eligibility for PMAY-Gramin (Rs 1.2-1.3 lakh financial assistance for rural housing).",
      next_steps_en: "Contact your Gram Panchayat or Block Development Officer. Individual applicants cannot apply directly online — the Gram Panchayat enters beneficiary data after field verification.",
      documents: ["Aadhaar Card", "SECC 2011 Documentation", "MGNREGA Job Card", "Bank Passbook", "Affidavit (no pucca house)"],
    },
    r_check_urban: {
      type: "result",
      status: "needs_review",
      reason_en: "PMAY-Gramin is for rural areas. If you are in an urban area, check PMAY-Urban instead.",
      fix_en: "Apply for PMAY-Urban through your Urban Local Body or visit pmaymis.gov.in.",
    },
    r_has_house: {
      type: "result",
      status: "ineligible",
      reason_en: "Families that already own a pucca house are not eligible for PMAY-Gramin.",
      fix_en: "This scheme is for houseless families and those living in kutcha or dilapidated houses.",
    },
    r_check_secc: {
      type: "result",
      status: "needs_review",
      reason_en: "SECC 2011 listing is the primary criterion for PMAY-Gramin. You should check your status.",
      fix_en: "Visit your Block Development Office or Gram Panchayat to check if your family is in the SECC 2011 list. You can also check at pmayg.nic.in.",
    },
    r_not_secc: {
      type: "result",
      status: "ineligible",
      reason_en: "Families not listed in the SECC 2011 database generally do not qualify for PMAY-Gramin.",
      fix_en: "Check with your Gram Panchayat — some states have expanded eligibility. You may also qualify under state-level housing schemes.",
    },
    r_excluded: {
      type: "result",
      status: "ineligible",
      reason_en: "Government employees earning above Rs 10,000/month, income tax payers, and those with KCC limits of Rs 50,000+ are excluded from PMAY-Gramin.",
      fix_en: "These exclusion criteria are applied during Gram Sabha verification. If you believe this is an error, raise the issue at the next Gram Sabha meeting.",
    },
    r_pending: {
      type: "result",
      status: "needs_review",
      reason_en: "Gram Sabha verification is a mandatory step in the PMAY-Gramin process.",
      fix_en: "Attend the next Gram Sabha meeting in your village to get your name verified. Contact your Gram Panchayat for the meeting schedule.",
    },
  },
}

// ============================================================
// Tree 6: PM Ujjwala
// ============================================================
const pmUjjwalaTree = {
  start: "q_citizen",
  nodes: {
    q_citizen: {
      type: "question",
      text_en: "Are you an Indian citizen?",
      options: [
        { label: "Yes", next: "q_gender_category" },
        { label: "No", next: "r_not_citizen" },
      ],
    },
    q_gender_category: {
      type: "question",
      text_en: "Are you a woman from a BPL, SC/ST, AAY, SECC 2011, PMAY beneficiary, forest dweller, or island/tea garden worker household?",
      options: [
        { label: "Yes, woman from eligible category", next: "q_age" },
        { label: "No, none of the above", next: "r_not_eligible" },
      ],
    },
    q_age: {
      type: "question",
      text_en: "Are you 18 years of age or above?",
      options: [
        { label: "Yes, 18 or above", next: "q_existing_lpg" },
        { label: "No, under 18", next: "r_underage" },
      ],
    },
    q_existing_lpg: {
      type: "question",
      text_en: "Does anyone in your household already have an LPG connection from any company (Indane, HP Gas, Bharat Gas)?",
      options: [
        { label: "No, no existing LPG", next: "r_eligible" },
        { label: "Yes, someone has LPG", next: "r_has_lpg" },
      ],
    },
    r_eligible: {
      type: "result",
      status: "eligible",
      reason_en: "Based on your answers, you may meet the basic eligibility criteria for PM Ujjwala Yojana (free LPG connection, first refill, and stove).",
      next_steps_en: "Visit your nearest LPG distributor (Indane, HP Gas, or Bharat Gas) with your documents. Migrants can self-declare family composition if no ration card is available.",
      documents: ["Aadhaar Card", "BPL / Category Certificate", "Bank Passbook", "Passport-size Photo", "Ration Card (or self-declaration for migrants)"],
    },
    r_not_citizen: {
      type: "result",
      status: "ineligible",
      reason_en: "PM Ujjwala Yojana is available only for Indian citizens.",
      fix_en: "This scheme requires Indian citizenship.",
    },
    r_not_eligible: {
      type: "result",
      status: "ineligible",
      reason_en: "PM Ujjwala Yojana is for adult women from BPL, SC/ST, AAY, SECC 2011, PMAY, forest dweller, or tea garden worker households.",
      fix_en: "Check if your state has alternative LPG subsidy schemes. You may also check your SECC 2011 status at mera.pmjay.gov.in.",
    },
    r_underage: {
      type: "result",
      status: "ineligible",
      reason_en: "The applicant must be 18 years of age or above.",
      fix_en: "An adult woman in your household (mother, sister, or other female family member aged 18+) can apply instead.",
    },
    r_has_lpg: {
      type: "result",
      status: "ineligible",
      reason_en: "Only one LPG connection per household is allowed under PM Ujjwala. If any family member already has a connection, the household is not eligible.",
      fix_en: "If the existing connection is in a separated family member''s name, contact your LPG distributor to get the old connection deactivated, then reapply.",
    },
  },
}

// ============================================================
// All trees for iteration
// ============================================================
const allTrees = [
  { name: "Gruha Jyothi", slug: "gruha-jyothi", tree: gruhaJyothiTree, minNodes: 8, maxNodes: 14 },
  { name: "PM-KISAN", slug: "pm-kisan", tree: pmKisanTree, minNodes: 10, maxNodes: 16 },
  { name: "Ayushman Bharat PM-JAY", slug: "ayushman-bharat", tree: ayushmanBharatTree, minNodes: 11, maxNodes: 17 },
  { name: "PMAY-Urban", slug: "pmay-urban", tree: pmayUrbanTree, minNodes: 8, maxNodes: 14 },
  { name: "PMAY-Gramin", slug: "pmay-gramin", tree: pmayGraminTree, minNodes: 8, maxNodes: 14 },
  { name: "PM Ujjwala", slug: "pm-ujjwala", tree: pmUjjwalaTree, minNodes: 6, maxNodes: 10 },
]

// Export trees for use in migration generation
export { gruhaJyothiTree, pmKisanTree, ayushmanBharatTree, pmayUrbanTree, pmayGraminTree, pmUjjwalaTree }

// ============================================================
// Tests
// ============================================================

describe("New Decision Trees Validation", () => {
  for (const { name, tree, minNodes, maxNodes } of allTrees) {
    describe(name, () => {
      it("passes validateDecisionTree() — valid: true", () => {
        const result = validateDecisionTree(tree)
        if (!result.valid) {
          // Show detailed errors for debugging
          console.error(`Validation errors for ${name}:`, JSON.stringify(result.errors, null, 2))
        }
        expect(result.valid).toBe(true)
      })

      it("start node exists and is a question", () => {
        const nodes = tree.nodes as Record<string, Record<string, unknown>>
        const startNode = nodes[tree.start]
        expect(startNode).toBeDefined()
        expect(startNode.type).toBe("question")
      })

      it("all paths terminate (allPathsTerminate === true)", () => {
        const result = validateDecisionTree(tree)
        expect(result.stats.allPathsTerminate).toBe(true)
      })

      it("has at least 1 eligible result", () => {
        const nodes = Object.values(tree.nodes) as Record<string, unknown>[]
        const eligibleNodes = nodes.filter(
          (n) => n.type === "result" && n.status === "eligible"
        )
        expect(eligibleNodes.length).toBeGreaterThanOrEqual(1)
      })

      it("has at least 1 ineligible result", () => {
        const nodes = Object.values(tree.nodes) as Record<string, unknown>[]
        const ineligibleNodes = nodes.filter(
          (n) => n.type === "result" && n.status === "ineligible"
        )
        expect(ineligibleNodes.length).toBeGreaterThanOrEqual(1)
      })

      it("all ineligible results have fix_en", () => {
        const entries = Object.entries(tree.nodes) as [string, Record<string, unknown>][]
        const ineligibleNodes = entries.filter(
          ([, n]) => n.type === "result" && n.status === "ineligible"
        )
        for (const [nodeId, node] of ineligibleNodes) {
          expect(node.fix_en, `Node ${nodeId} missing fix_en`).toBeTruthy()
        }
      })

      it(`node count within expected range (${minNodes}-${maxNodes})`, () => {
        const nodeCount = Object.keys(tree.nodes).length
        expect(nodeCount).toBeGreaterThanOrEqual(minNodes)
        expect(nodeCount).toBeLessThanOrEqual(maxNodes)
      })
    })
  }
})
