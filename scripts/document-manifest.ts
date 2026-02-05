/**
 * Document Manifest
 * Curated list of government documents per scheme for RAG ingestion.
 *
 * Each entry specifies:
 * - scheme_slug: Which scheme this document belongs to
 * - title: Human-readable document title
 * - source_url: Official government URL
 * - document_type: circular | faq | guideline | announcement
 * - content_strategy: How to obtain the content
 *   - "scrape": Download the web page and extract text
 *   - "pdf_link": Direct PDF download URL
 *   - "manual_text": Manually curated text content (for sites that block scraping)
 */

export interface DocumentEntry {
  scheme_slug: string;
  title: string;
  source_url: string;
  document_type: "circular" | "faq" | "guideline" | "announcement";
  content_strategy: "scrape" | "pdf_link" | "manual_text";
  manual_text?: string;
}

/**
 * Curated document manifest for all 8 Karnataka schemes.
 *
 * Strategy: Since most government sites serve HTML pages (not PDFs),
 * we scrape the text content and create synthetic PDFs for upload.
 * For sites that block scraping, we include manually curated text
 * from the official eligibility criteria.
 */
export const DOCUMENT_MANIFEST: DocumentEntry[] = [
  // ==========================================
  // GRUHA LAKSHMI
  // ==========================================
  {
    scheme_slug: "gruha-lakshmi",
    title: "Gruha Lakshmi Scheme Guidelines",
    source_url:
      "https://dwcd.karnataka.gov.in/info-2/GRUHALAKSHMI+SCHEME/en",
    document_type: "guideline",
    content_strategy: "manual_text",
    manual_text: `# Gruha Lakshmi Scheme - Karnataka

## Overview
Gruha Lakshmi is a welfare scheme by the Government of Karnataka under the Women and Child Development Department. It provides monthly financial assistance to women heads of household.

## Eligibility Criteria
1. Must be a permanent resident of Karnataka
2. Must be a woman or transgender person
3. Must be listed as head of household on ration card (BPL/APL/Antyodaya)
4. Family annual income must be less than ₹2,00,000 (two lakh rupees)
5. Neither the applicant nor her husband should be an income tax payer or GST filer
6. Must not be a government employee
7. Must have an Aadhaar-linked bank account in her name
8. Only one woman per household (per ration card) can receive the benefit

## Benefits
- ₹2,000 per month transferred directly to the woman's bank account via DBT (Direct Benefit Transfer)

## Required Documents
1. Aadhaar Card (linked to mobile number)
2. Ration Card (showing applicant as Head of Household)
3. Bank Passbook (Aadhaar linked)
4. Passport-size Photo
5. Husband's Aadhaar Card

## How to Apply
- Online: Via Seva Sindhu portal (sevasindhu.karnataka.gov.in)
- Offline: Visit Grama One / Bangalore One / Bapuji Seva Kendra

## Exclusions
- Government employees
- Income tax payers or GST filers (applicant or husband)
- Families with income above ₹2 lakh/year
- Those without a valid ration card
- Men (unless transgender)

## Helpline
- Phone: 1902, 08147500500, 08277000555
- SMS your ration card number for status

## Important Notes
- This is for GUIDANCE only. Rules may change. Always verify on the official portal.
- Source: dwcd.karnataka.gov.in
- Last verified: February 2026`,
  },

  // ==========================================
  // ANNA BHAGYA
  // ==========================================
  {
    scheme_slug: "anna-bhagya",
    title: "Anna Bhagya Scheme - Food Security",
    source_url: "https://ahara.kar.nic.in/",
    document_type: "guideline",
    content_strategy: "manual_text",
    manual_text: `# Anna Bhagya Scheme - Karnataka Food Security

## Overview
Anna Bhagya is Karnataka's food security scheme providing subsidized rice to BPL families through the Public Distribution System (PDS).

## Eligibility Criteria
1. Must be a resident of Karnataka
2. Must have a valid Antyodaya Anna Yojana (AAY) or BPL/Priority Household (PHH) ration card
3. Family annual income must be less than ₹2,00,000
4. No family member should be a government employee
5. APL (Above Poverty Line) card holders are NOT eligible

## Benefits
- 10 kg rice per person per month at subsidized rates
- OR equivalent cash transfer (₹34/kg) to bank account
- No separate application needed - automatic via ration card

## How to Avail
1. No separate application required
2. Visit your nearest ration shop (Fair Price Shop)
3. Carry your ration card
4. Complete biometric authentication (fingerprint)
5. Receive rice or cash equivalent

## Required Documents
1. Ration Card (Antyodaya or BPL/PHH)
2. Aadhaar Card (for biometric verification)

## Important Information
- Ration card types eligible: Antyodaya (AAY) and BPL/PHH
- APL cards are NOT eligible for Anna Bhagya
- Government employee families are excluded
- Benefits are automatic - no separate application needed

## Helpline
- Phone: 1967, 1800-425-9339 (toll-free)
- Email: foodcom-ka@nic.in

## Source
- Karnataka Ahara Portal: ahara.kar.nic.in
- Last verified: February 2026`,
  },

  // ==========================================
  // SHAKTI
  // ==========================================
  {
    scheme_slug: "shakti",
    title: "Shakti Scheme - Free Bus Travel for Women",
    source_url: "https://shakti.ksrtc.in/",
    document_type: "guideline",
    content_strategy: "manual_text",
    manual_text: `# Shakti Scheme - Free Bus Travel for Women

## Overview
Shakti is Karnataka's free bus travel scheme for women and transgender persons on state-run non-AC buses.

## Eligibility Criteria
1. Must be a permanent resident of Karnataka
2. Must be a woman or transgender person
3. Must be 6 years of age or older (children below 6 already travel free)
4. Must have a valid government photo ID (Aadhaar, Voter ID, Driving License, or Passport)
5. Must NOT be an employee of KSRTC, BMTC, NWKRTC, or any state RTC

## Benefits
- Free travel on all non-AC buses within Karnataka:
  - KSRTC (Karnataka State Road Transport Corporation)
  - BMTC (Bangalore Metropolitan Transport Corporation)
  - NWKRTC (North Western Karnataka Road Transport Corporation)
  - KKRTC (Kalyana Karnataka Road Transport Corporation)
- Covers: Ordinary, Express, and Urban Transport buses
- NOT valid on: AC buses, Sleeper buses, Volvo/Airavat buses

## How to Use
1. Board any eligible non-AC government bus
2. Show your original Aadhaar card (or other valid ID) to the conductor
3. No ticket needed - free travel
4. Optional: Get a Shakti Smart Card from Seva Sindhu for faster boarding

## Required Documents (to show conductor)
- Original Aadhaar Card
- OR Voter ID / Driving License / Passport

## Exclusions
- Men (unless transgender)
- Children below 6 (already travel free by default)
- RTC employees
- AC, Sleeper, and Volvo buses are NOT covered
- Inter-state travel is NOT covered

## Helpline
- Phone: 1902, 080-4959-6666
- Email: sevasindhu@karnataka.gov.in

## Source
- KSRTC Shakti Portal: shakti.ksrtc.in
- Yuva Kanaja: yuvakanaja.karnataka.gov.in
- Last verified: February 2026`,
  },

  // ==========================================
  // YUVA NIDHI
  // ==========================================
  {
    scheme_slug: "yuva-nidhi",
    title: "Yuva Nidhi - Unemployment Allowance",
    source_url:
      "https://kaushalya.karnataka.gov.in/21/yuvanidhi-scheme/en",
    document_type: "guideline",
    content_strategy: "manual_text",
    manual_text: `# Yuva Nidhi Scheme - Karnataka Youth Unemployment Allowance

## Overview
Yuva Nidhi provides monthly financial assistance to unemployed graduates and diploma holders in Karnataka, along with free skill training.

## Eligibility Criteria
1. Must be a domicile of Karnataka with at least 6 years of education in Karnataka
2. Must be a degree holder (graduate/post-graduate) or diploma holder
3. Must have graduated in academic year 2022-23 or 2023-24
4. Must be unemployed for 6+ months
5. Must NOT be currently pursuing higher education (Masters, PhD, etc.)
6. Must NOT be receiving ESI, PF, NPS, or benefits from any similar state/central scheme
7. Must NOT be currently employed (government or private)
8. Must NOT be self-employed or running a business

## Benefits
- Degree holders: ₹3,000 per month
- Diploma holders: ₹1,500 per month
- Duration: Maximum 2 years or until employment (whichever comes first)
- Free skill training under Kaushalkar program

## How to Apply
- Online: sevasindhugs.karnataka.gov.in
- Offline: Visit Grama One / Bangalore One / Bapuji Seva Kendra

## Required Documents
1. Aadhaar Card
2. Degree/Diploma Certificate
3. Bank Account Details
4. Domicile Certificate
5. Income Certificate (if required)

## Exclusions
- Those who graduated before 2022-23 or after 2023-24
- Currently employed persons (any sector)
- Self-employed or business owners
- Those pursuing higher studies
- Those receiving ESI/PF/NPS or other government scheme benefits
- Non-Karnataka domiciles or those with less than 6 years education in Karnataka

## Helpline
- Phone: 1800-599-9918, 1902

## Source
- Kaushalya Karnataka: kaushalya.karnataka.gov.in
- Last verified: February 2026`,
  },

  // ==========================================
  // SANDHYA SURAKSHA
  // ==========================================
  {
    scheme_slug: "sandhya-suraksha",
    title: "Sandhya Suraksha - Elderly Pension Scheme",
    source_url:
      "https://karunadu.karnataka.gov.in/welfareofdisabled/Pages/Senior-Citizen-Schemes.aspx",
    document_type: "guideline",
    content_strategy: "manual_text",
    manual_text: `# Sandhya Suraksha Yojana - Karnataka Elderly Pension

## Overview
Sandhya Suraksha is Karnataka's pension scheme for elderly citizens from the unorganized sector who have no other pension coverage.

## Eligibility Criteria
1. Must be a permanent resident of Karnataka
2. Must be 65 years of age or older
3. Must be from the unorganized sector (farmer, weaver, fisherman, laborer, etc.)
4. Combined annual income of applicant and spouse must be less than ₹20,000
5. Combined bank balance of applicant and spouse must be less than ₹10,000
6. Must NOT be receiving any pension from government, employer, or any other source
7. Government/public sector employees (current or retired) are NOT eligible
8. Those with private sector pension are NOT eligible

## Benefits
- ₹1,000 per month pension
- Discounted KSRTC bus passes
- Access to government-supported old age day care facilities

## How to Apply
- Online: sevasindhuservices.karnataka.gov.in
- Offline: Gram Panchayat office (rural) or Municipality office (urban)

## Required Documents
1. Age Proof (SSLC marks card, passport, ration card, DL, or voter ID)
2. Occupation Certificate from Tahsildar
3. Income Certificate from local revenue officer
4. Bank Account Details
5. Aadhaar Card
6. Passport-size Photo

## Important Notes
- Income of adult children is NOT counted - only applicant and spouse income
- Only for unorganized sector workers
- No pension from any source allowed

## Source
- Karnataka Social Welfare Department
- Last verified: February 2026`,
  },

  // ==========================================
  // BHAGYA LAKSHMI
  // ==========================================
  {
    scheme_slug: "bhagya-lakshmi",
    title: "Bhagya Lakshmi - Girl Child Welfare",
    source_url: "https://blakshmi.kar.nic.in/",
    document_type: "guideline",
    content_strategy: "manual_text",
    manual_text: `# Bhagya Lakshmi Scheme - Karnataka Girl Child Welfare

## Overview
Bhagya Lakshmi is Karnataka's scheme for the welfare of girl children from BPL families, providing a savings bond, health insurance, and education scholarship.

## Eligibility Criteria
1. Family must be a resident of Karnataka
2. Family must belong to Below Poverty Line (BPL) category
3. Girl child must be born after March 31, 2006
4. Registration must be done within 1 year of the girl child's birth
5. Maximum 2 girls per family can be enrolled

## Benefits
- ₹10,000 savings bond at birth (matures to ₹34,751 at age 18)
- Health insurance coverage up to ₹25,000 per year
- Annual education scholarship:
  - Class 1-3: ₹300/year
  - Class 4: ₹500/year
  - Class 5-7: ₹700/year
  - Class 8-10: ₹1,000/year

## Conditions for Maturity Amount
- Girl must complete education up to 8th grade
- Girl must not marry before 18 years of age
- If conditions are met, the bond matures to ₹34,751 at age 18

## How to Apply
- Online: blakshmi.kar.nic.in
- Must apply within 1 year of the girl child's birth

## Required Documents
1. Birth Certificate
2. BPL Card / Ration Card
3. Parent Aadhaar Cards
4. Hospital Discharge Summary
5. Bank Account Details

## Exclusions
- Non-BPL families
- Girls born before April 1, 2006
- Registration after 1 year of birth
- Third or subsequent girl children in the same family

## Source
- Bhagya Lakshmi Portal: blakshmi.kar.nic.in
- Last verified: February 2026`,
  },

  // ==========================================
  // VIDYASIRI
  // ==========================================
  {
    scheme_slug: "vidyasiri",
    title: "Vidyasiri Scholarship - Post-Matric",
    source_url:
      "https://bcwd.karnataka.gov.in/info-2/Scholarships/Vidyasiri/en",
    document_type: "guideline",
    content_strategy: "manual_text",
    manual_text: `# Vidyasiri Scholarship - Karnataka Post-Matric Scholarship

## Overview
Vidyasiri is Karnataka's post-matric scholarship for SC/ST/OBC/Minority students, providing monthly food and accommodation allowance.

## Eligibility Criteria
1. Must be a permanent resident of Karnataka
2. Must belong to SC/ST, OBC/Backward Class, or Minority category
3. Must be pursuing a post-matric course (after 10th standard) - Degree/Diploma/PG
4. Family annual income must be between ₹1,00,000 and ₹2,50,000
5. Must reside at least 5 km from the college OR in a different city/town
6. Must NOT be staying in a government or departmental hostel
7. Must maintain 75% attendance
8. Must pass annual exams
9. Maximum 2 male students per family can receive this scholarship (no limit for females)

## Benefits
- ₹1,500 per month for 10 months = ₹15,000 per year
- For food and accommodation support

## How to Apply
- Online: ssp.postmatric.karnataka.gov.in
- Submit application to your college

## Required Documents
1. SSLC Marks Card
2. Caste Certificate
3. Income Certificate
4. Aadhaar Card
5. Ration Card
6. College Admission Receipt
7. Bank Account Details
8. Passport-size Photo

## Exclusions
- General (unreserved) category students
- Pre-matric students (up to 10th)
- Income below ₹1 lakh (may qualify for different, higher-value scholarships like Ambedkar)
- Income above ₹2.5 lakh
- Students living within 5 km of their college
- Students in government hostels
- Third or subsequent male students from same family

## Helpline
- Phone: 8050770005
- Email: bcdbng@kar.nic.in
- Address: No.16/D, 3rd Floor, Devraj Urs Bhavan, Millers Tank Bed Road, Vasanth Nagar, Bangalore – 560052

## Source
- BCWD Karnataka: bcwd.karnataka.gov.in
- SSP Portal: ssp.postmatric.karnataka.gov.in
- Last verified: February 2026`,
  },

  // ==========================================
  // RAITHA SHAKTI
  // ==========================================
  {
    scheme_slug: "raitha-shakti",
    title: "Raitha Shakti - Farmer Diesel Subsidy",
    source_url: "https://fruits.karnataka.gov.in/",
    document_type: "guideline",
    content_strategy: "manual_text",
    manual_text: `# Raitha Shakti Scheme - Karnataka Farmer Diesel Subsidy

## Overview
Raitha Shakti provides diesel subsidy to small and marginal farmers in Karnataka, delivered directly to their bank accounts via DBT.

## Eligibility Criteria
1. Must be a permanent resident of Karnataka
2. Must be a farmer with agricultural land
3. Land holding must be up to 5 acres (8 bigha) maximum
4. Must be registered on the FRUITS portal (Farmer Registration and Unified Beneficiary Information System)
5. Must have valid land ownership documents (RTC, land records)

## Benefits
- ₹250 per acre diesel subsidy
- Maximum for 5 acres = ₹1,250 total
- Transferred via DBT to bank account

## Important Notes on Land Size
- Farmers with more than 5 acres can still receive the subsidy, but only for 5 acres (₹1,250 maximum)
- Land ownership must be verified through RTC records

## How to Apply
1. Register on FRUITS portal: fruits.karnataka.gov.in
2. Upload land documents (RTC records)
3. Link Aadhaar and bank account
4. Subsidy is automatically calculated and transferred

## Required Documents
1. Aadhaar Card
2. Land Records (RTC - Record of Rights, Tenancy and Crops)
3. Bank Account Details
4. FRUITS Registration ID

## Getting FRUITS Registration
- Visit: fruits.karnataka.gov.in
- Required: Aadhaar, land records, and bank details
- Registration is free
- Can also register at local Raitha Samparka Kendra

## Getting RTC Records
- Visit: bhoomi.karnataka.gov.in
- OR visit local Tahsildar office
- RTC is the primary land ownership document in Karnataka

## Source
- FRUITS Portal: fruits.karnataka.gov.in
- Last verified: February 2026`,
  },
];
