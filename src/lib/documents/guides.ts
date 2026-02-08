import type { DocumentGuide } from "./types"

/**
 * Document preparation guides for common required documents in Karnataka.
 * Maps document name patterns to actionable guidance.
 *
 * NOTE: Information is for guidance only. Processes may change.
 * Last verified: February 2026.
 *
 * Kannada text in this file needs native speaker review before launch.
 */

const guides: Record<string, DocumentGuide> = {
  "aadhaar card": {
    name_en: "Aadhaar Card",
    name_kn: "ಆಧಾರ್ ಕಾರ್ಡ್",
    where_en: "Any Aadhaar Enrollment Center (Post Offices, Banks, Government Offices)",
    where_kn: "ಯಾವುದೇ ಆಧಾರ್ ನೋಂದಣಿ ಕೇಂದ್ರ (ಅಂಚೆ ಕಚೇರಿ, ಬ್ಯಾಂಕ್, ಸರ್ಕಾರಿ ಕಚೇರಿ)",
    how_en: "Visit enrollment center with identity proof (ration card, voter ID, or birth certificate). Biometrics (fingerprints, iris scan, photo) will be captured.",
    how_kn: "ಗುರುತಿನ ದಾಖಲೆಯೊಂದಿಗೆ (ಪಡಿತರ ಚೀಟಿ, ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ) ನೋಂದಣಿ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.",
    timeline_en: "15-30 days for new enrollment; 7-10 days for updates",
    timeline_kn: "ಹೊಸ ನೋಂದಣಿಗೆ 15-30 ದಿನ; ನವೀಕರಣಕ್ಕೆ 7-10 ದಿನ",
    cost_en: "Free (new enrollment); ₹50 for updates",
    cost_kn: "ಉಚಿತ (ಹೊಸ ನೋಂದಣಿ); ₹50 ನವೀಕರಣಕ್ಕೆ",
    online_url: "https://myaadhaar.uidai.gov.in",
    online_portal_en: "myAadhaar Portal (for updates & download)",
    online_portal_kn: "myAadhaar ಪೋರ್ಟಲ್ (ನವೀಕರಣ ಮತ್ತು ಡೌನ್‌ಲೋಡ್)",
    tips_en: "Download e-Aadhaar from the portal — it is equally valid as the physical card for most applications.",
    tips_kn: "e-ಆಧಾರ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ — ಇದು ಭೌತಿಕ ಕಾರ್ಡ್‌ನಷ್ಟೇ ಮಾನ್ಯ.",
  },

  "bank passbook": {
    name_en: "Bank Passbook",
    name_kn: "ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್",
    where_en: "Any nationalized bank branch (SBI, Canara Bank, etc.)",
    where_kn: "ಯಾವುದೇ ರಾಷ್ಟ್ರೀಕೃತ ಬ್ಯಾಂಕ್ ಶಾಖೆ",
    how_en: "Open a savings account with Aadhaar + PAN (or Form 60). Jan Dhan accounts need only Aadhaar. Get passbook updated at the branch.",
    how_kn: "ಆಧಾರ್ + PAN ನೊಂದಿಗೆ ಉಳಿತಾಯ ಖಾತೆ ತೆರೆಯಿರಿ. ಜನ ಧನ ಖಾತೆಗೆ ಆಧಾರ್ ಮಾತ್ರ ಬೇಕು.",
    timeline_en: "Same day (account opening); passbook updated instantly",
    timeline_kn: "ಅದೇ ದಿನ (ಖಾತೆ ತೆರೆಯುವುದು); ಪಾಸ್‌ಬುಕ್ ತಕ್ಷಣ ನವೀಕರಣ",
    cost_en: "Free (Jan Dhan / zero-balance accounts available)",
    cost_kn: "ಉಚಿತ (ಜನ ಧನ / ಶೂನ್ಯ ಬ್ಯಾಲೆನ್ಸ್ ಖಾತೆ ಲಭ್ಯ)",
    tips_en: "For DBT (Direct Benefit Transfer), ensure your Aadhaar is linked to your bank account. Check with bank staff.",
    tips_kn: "DBT (ನೇರ ಲಾಭ ವರ್ಗಾವಣೆ) ಗಾಗಿ, ನಿಮ್ಮ ಆಧಾರ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಲಿಂಕ್ ಆಗಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿ.",
  },

  "income certificate": {
    name_en: "Income Certificate",
    name_kn: "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ",
    where_en: "Tahsildar Office / Nadakacheri / Atalji Janasnehi Kendra",
    where_kn: "ತಹಸೀಲ್ದಾರ್ ಕಚೇರಿ / ನಾಡಕಚೇರಿ / ಅಟಲ್ ಜನಸ್ನೇಹಿ ಕೇಂದ್ರ",
    how_en: "Apply online via Nadakacheri portal or visit Atalji Janasnehi Kendra. Bring Aadhaar, ration card, and self-declaration of income. Revenue inspector may verify.",
    how_kn: "ನಾಡಕಚೇರಿ ಪೋರ್ಟಲ್ ಮೂಲಕ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಅಥವಾ ಅಟಲ್ ಜನಸ್ನೇಹಿ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.",
    timeline_en: "7-15 working days",
    timeline_kn: "7-15 ಕೆಲಸದ ದಿನಗಳು",
    cost_en: "₹25 (government fee)",
    cost_kn: "₹25 (ಸರ್ಕಾರಿ ಶುಲ್ಕ)",
    online_url: "https://nadakacheri.karnataka.gov.in",
    online_portal_en: "Nadakacheri Portal",
    online_portal_kn: "ನಾಡಕಚೇರಿ ಪೋರ್ಟಲ್",
    tips_en: "Income certificate is usually valid for 1 year. Apply early as processing can take time during peak periods.",
    tips_kn: "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಸಾಮಾನ್ಯವಾಗಿ 1 ವರ್ಷ ಮಾನ್ಯ. ಮುಂಚಿತವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
  },

  "caste certificate": {
    name_en: "Caste Certificate (SC/ST/OBC)",
    name_kn: "ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ",
    where_en: "Tahsildar Office / Nadakacheri / Atalji Janasnehi Kendra",
    where_kn: "ತಹಸೀಲ್ದಾರ್ ಕಚೇರಿ / ನಾಡಕಚೇರಿ / ಅಟಲ್ ಜನಸ್ನೇಹಿ ಕೇಂದ್ರ",
    how_en: "Apply online via Nadakacheri portal. Bring Aadhaar, parent's caste certificate (if available), ration card, and school records showing caste.",
    how_kn: "ನಾಡಕಚೇರಿ ಪೋರ್ಟಲ್ ಮೂಲಕ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. ಆಧಾರ್, ಪೋಷಕರ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ತನ್ನಿ.",
    timeline_en: "7-21 working days (may require field verification)",
    timeline_kn: "7-21 ಕೆಲಸದ ದಿನಗಳು (ಕ್ಷೇತ್ರ ಪರಿಶೀಲನೆ ಬೇಕಾಗಬಹುದು)",
    cost_en: "₹25 (government fee)",
    cost_kn: "₹25 (ಸರ್ಕಾರಿ ಶುಲ್ಕ)",
    online_url: "https://nadakacheri.karnataka.gov.in",
    online_portal_en: "Nadakacheri Portal",
    online_portal_kn: "ನಾಡಕಚೇರಿ ಪೋರ್ಟಲ್",
    tips_en: "If your parent has an existing caste certificate, bring the original — it speeds up verification significantly.",
    tips_kn: "ನಿಮ್ಮ ಪೋಷಕರಿಗೆ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಇದ್ದರೆ, ಮೂಲ ತನ್ನಿ — ಇದು ಪರಿಶೀಲನೆ ವೇಗಗೊಳಿಸುತ್ತದೆ.",
  },

  "ration card": {
    name_en: "Ration Card / BPL Card",
    name_kn: "ಪಡಿತರ ಚೀಟಿ / BPL ಕಾರ್ಡ್",
    where_en: "Food & Civil Supplies Department / Taluk Office",
    where_kn: "ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ / ತಾಲ್ಲೂಕು ಕಚೇರಿ",
    how_en: "Apply online via Ahara portal. Need Aadhaar for all family members, income proof, and address proof. BPL status is verified through SECC data.",
    how_kn: "ಆಹಾರ ಪೋರ್ಟಲ್ ಮೂಲಕ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ. ಎಲ್ಲಾ ಕುಟುಂಬ ಸದಸ್ಯರ ಆಧಾರ್, ಆದಾಯ ದಾಖಲೆ ಬೇಕು.",
    timeline_en: "15-30 days",
    timeline_kn: "15-30 ದಿನಗಳು",
    cost_en: "Free",
    cost_kn: "ಉಚಿತ",
    online_url: "https://ahara.kar.nic.in",
    online_portal_en: "Ahara Portal (Karnataka Food Dept)",
    online_portal_kn: "ಆಹಾರ ಪೋರ್ಟಲ್",
    tips_en: "BPL/AAY/PHH categories are determined by socio-economic survey data, not self-declaration. Check your existing status first.",
    tips_kn: "BPL/AAY/PHH ವರ್ಗೀಕರಣ ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಸಮೀಕ್ಷೆ ಆಧಾರದ ಮೇಲೆ ನಿರ್ಧಾರಿತ.",
  },

  "land records": {
    name_en: "Land Records (RTC / Pahani)",
    name_kn: "ಭೂ ದಾಖಲೆ (ಪಹಣಿ / RTC)",
    where_en: "Sub-Registrar Office / Bhoomi Center / Village Accountant",
    where_kn: "ಉಪ-ನೋಂದಣಾಧಿಕಾರಿ ಕಚೇರಿ / ಭೂಮಿ ಕೇಂದ್ರ / ಗ್ರಾಮ ಲೆಕ್ಕಿಗ",
    how_en: "Download RTC (Record of Rights, Tenancy and Crops) online from Bhoomi portal. Enter district, taluk, hobli, and village. Also available at Bhoomi Kiosks.",
    how_kn: "ಭೂಮಿ ಪೋರ್ಟಲ್‌ನಿಂದ RTC ಆನ್‌ಲೈನ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ. ಜಿಲ್ಲೆ, ತಾಲ್ಲೂಕು, ಹೋಬಳಿ, ಗ್ರಾಮ ನಮೂದಿಸಿ.",
    timeline_en: "Instant (online download); 1-3 days (kiosk)",
    timeline_kn: "ತಕ್ಷಣ (ಆನ್‌ಲೈನ್ ಡೌನ್‌ಲೋಡ್); 1-3 ದಿನ (ಕಿಯೋಸ್ಕ್)",
    cost_en: "₹15 per certified copy",
    cost_kn: "₹15 ಪ್ರತಿ ಪ್ರಮಾಣಿತ ಪ್ರತಿ",
    online_url: "https://landrecords.karnataka.gov.in",
    online_portal_en: "Bhoomi Portal (Karnataka Land Records)",
    online_portal_kn: "ಭೂಮಿ ಪೋರ್ಟಲ್",
    tips_en: "Mutation (khata transfer) must be done if land was inherited or purchased. Apply at the Sub-Registrar office.",
    tips_kn: "ಖಾತಾ ವರ್ಗಾವಣೆ (ಮ್ಯುಟೇಶನ್) ಉಪ-ನೋಂದಣಾಧಿಕಾರಿ ಕಚೇರಿಯಲ್ಲಿ ಮಾಡಿ.",
  },

  "passport-size photograph": {
    name_en: "Passport-size Photograph",
    name_kn: "ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಛಾಯಾಚಿತ್ರ",
    where_en: "Any photo studio or use a smartphone with white background",
    where_kn: "ಯಾವುದೇ ಫೋಟೋ ಸ್ಟುಡಿಯೋ ಅಥವಾ ಬಿಳಿ ಹಿನ್ನೆಲೆಯೊಂದಿಗೆ ಮೊಬೈಲ್ ಬಳಸಿ",
    how_en: "Get recent color photos taken on white background. Standard size is 3.5cm x 4.5cm. Most studios provide both print and digital copies.",
    how_kn: "ಬಿಳಿ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಇತ್ತೀಚಿನ ಬಣ್ಣ ಫೋಟೋ ತೆಗೆಸಿ. ಗಾತ್ರ 3.5cm x 4.5cm.",
    timeline_en: "Immediate",
    timeline_kn: "ತಕ್ಷಣ",
    cost_en: "₹20-50 (for 4-8 prints)",
    cost_kn: "₹20-50 (4-8 ಪ್ರಿಂಟ್‌ಗಳಿಗೆ)",
    tips_en: "Keep extra copies. Many schemes require 2-4 photos. Get digital copies too for online applications.",
    tips_kn: "ಹೆಚ್ಚುವರಿ ಪ್ರತಿಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ. ಆನ್‌ಲೈನ್ ಅರ್ಜಿಗಳಿಗೆ ಡಿಜಿಟಲ್ ಪ್ರತಿಗಳನ್ನೂ ಪಡೆಯಿರಿ.",
  },

  "minority community certificate": {
    name_en: "Minority Community Certificate",
    name_kn: "ಅಲ್ಪಸಂಖ್ಯಾತ ಸಮುದಾಯ ಪ್ರಮಾಣಪತ್ರ",
    where_en: "Tahsildar Office / Atalji Janasnehi Kendra",
    where_kn: "ತಹಸೀಲ್ದಾರ್ ಕಚೇರಿ / ಅಟಲ್ ಜನಸ್ನೇಹಿ ಕೇಂದ್ರ",
    how_en: "Apply at Tahsildar office with Aadhaar, school TC (showing religion), and any religious institution certificate.",
    how_kn: "ಆಧಾರ್, ಶಾಲಾ TC (ಧರ್ಮ ತೋರಿಸುವ), ಧಾರ್ಮಿಕ ಸಂಸ್ಥೆ ಪ್ರಮಾಣಪತ್ರದೊಂದಿಗೆ ತಹಸೀಲ್ದಾರ್ ಕಚೇರಿಯಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
    timeline_en: "7-15 working days",
    timeline_kn: "7-15 ಕೆಲಸದ ದಿನಗಳು",
    cost_en: "₹25 (government fee)",
    cost_kn: "₹25 (ಸರ್ಕಾರಿ ಶುಲ್ಕ)",
    online_url: "https://sevasindhu.karnataka.gov.in",
    online_portal_en: "Seva Sindhu Portal",
    online_portal_kn: "ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್",
  },

  "birth certificate": {
    name_en: "Birth Certificate",
    name_kn: "ಜನನ ಪ್ರಮಾಣಪತ್ರ",
    where_en: "Local Municipality / Gram Panchayat / BBMP (in Bengaluru)",
    where_kn: "ಸ್ಥಳೀಯ ನಗರಸಭೆ / ಗ್ರಾಮ ಪಂಚಾಯತ್ / BBMP (ಬೆಂಗಳೂರಿನಲ್ಲಿ)",
    how_en: "Apply at the hospital birth registration desk (within 21 days) or local municipal office. After 21 days, a late registration fee applies.",
    how_kn: "ಆಸ್ಪತ್ರೆ ಜನನ ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ (21 ದಿನಗಳಲ್ಲಿ) ಅಥವಾ ನಗರಸಭೆ ಕಚೇರಿಯಲ್ಲಿ ಅರ್ಜಿ.",
    timeline_en: "7-15 days",
    timeline_kn: "7-15 ದಿನಗಳು",
    cost_en: "Free (within 21 days); ₹5-50 late fee",
    cost_kn: "ಉಚಿತ (21 ದಿನಗಳಲ್ಲಿ); ₹5-50 ತಡ ಶುಲ್ಕ",
    online_url: "https://crsorgi.gov.in",
    online_portal_en: "CRS Portal (Civil Registration System)",
    online_portal_kn: "CRS ಪೋರ್ಟಲ್",
  },

  "driving license": {
    name_en: "Driving License",
    name_kn: "ಚಾಲನಾ ಪರವಾನಗಿ",
    where_en: "Regional Transport Office (RTO)",
    where_kn: "ಪ್ರಾದೇಶಿಕ ಸಾರಿಗೆ ಕಚೇರಿ (RTO)",
    how_en: "Apply online via Parivahan portal. Get Learner's License first, then apply for permanent DL after 30 days with driving test.",
    how_kn: "ಪರಿವಹನ ಪೋರ್ಟಲ್ ಮೂಲಕ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ. ಮೊದಲು ಕಲಿಕೆ ಪರವಾನಗಿ, ನಂತರ 30 ದಿನಗಳ ಬಳಿಕ DL.",
    timeline_en: "Learner's: 7 days; Permanent: 30+ days after learner's",
    timeline_kn: "ಕಲಿಕೆ: 7 ದಿನ; ಶಾಶ್ವತ: ಕಲಿಕೆ ನಂತರ 30+ ದಿನ",
    cost_en: "₹200-500 (varies by vehicle class)",
    cost_kn: "₹200-500 (ವಾಹನ ವರ್ಗಕ್ಕೆ ಅನುಗುಣವಾಗಿ)",
    online_url: "https://parivahan.gov.in",
    online_portal_en: "Parivahan Portal",
    online_portal_kn: "ಪರಿವಹನ ಪೋರ್ಟಲ್",
  },

  "pan card": {
    name_en: "PAN Card",
    name_kn: "PAN ಕಾರ್ಡ್",
    where_en: "NSDL / UTIITSL centers or online",
    where_kn: "NSDL / UTIITSL ಕೇಂದ್ರಗಳು ಅಥವಾ ಆನ್‌ಲೈನ್",
    how_en: "Apply online via Income Tax portal. Need Aadhaar for instant e-PAN (free). Physical PAN card application needs address proof and photo.",
    how_kn: "ಆದಾಯ ತೆರಿಗೆ ಪೋರ್ಟಲ್ ಮೂಲಕ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ. ತಕ್ಷಣ e-PAN ಗೆ ಆಧಾರ್ ಬೇಕು (ಉಚಿತ).",
    timeline_en: "Instant (e-PAN via Aadhaar); 15-20 days (physical card)",
    timeline_kn: "ತಕ್ಷಣ (e-PAN); 15-20 ದಿನ (ಭೌತಿಕ ಕಾರ್ಡ್)",
    cost_en: "Free (e-PAN); ₹107 (physical card)",
    cost_kn: "ಉಚಿತ (e-PAN); ₹107 (ಭೌತಿಕ ಕಾರ್ಡ್)",
    online_url: "https://www.incometax.gov.in",
    online_portal_en: "Income Tax Portal (instant e-PAN)",
    online_portal_kn: "ಆದಾಯ ತೆರಿಗೆ ಪೋರ್ಟಲ್ (ತಕ್ಷಣ e-PAN)",
  },

  "passport": {
    name_en: "Passport",
    name_kn: "ಪಾಸ್‌ಪೋರ್ಟ್",
    where_en: "Passport Seva Kendra (PSK) / Post Office Passport Seva Kendra (POPSK)",
    where_kn: "ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ ಕೇಂದ್ರ (PSK)",
    how_en: "Apply online via Passport Seva portal. Book appointment at PSK/POPSK. Bring Aadhaar, birth certificate, and address proof.",
    how_kn: "ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ ಪೋರ್ಟಲ್ ಮೂಲಕ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ. PSK ನಲ್ಲಿ ಸಮಯ ಕಾಯ್ದಿರಿಸಿ.",
    timeline_en: "Normal: 30-45 days; Tatkal: 1-3 days",
    timeline_kn: "ಸಾಮಾನ್ಯ: 30-45 ದಿನ; ತಾತ್ಕಾಲ್: 1-3 ದಿನ",
    cost_en: "₹1,500 (normal); ₹3,500 (tatkal)",
    cost_kn: "₹1,500 (ಸಾಮಾನ್ಯ); ₹3,500 (ತಾತ್ಕಾಲ್)",
    online_url: "https://www.passportindia.gov.in",
    online_portal_en: "Passport Seva Portal",
    online_portal_kn: "ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ ಪೋರ್ಟಲ್",
  },

  "college admission letter": {
    name_en: "College Admission Letter",
    name_kn: "ಕಾಲೇಜು ಪ್ರವೇಶ ಪತ್ರ",
    where_en: "Your college / university admissions office",
    where_kn: "ನಿಮ್ಮ ಕಾಲೇಜು / ವಿಶ್ವವಿದ್ಯಾಲಯ ಪ್ರವೇಶ ಕಚೇರಿ",
    how_en: "Request from your college after securing admission. Should mention course name, duration, and fee structure.",
    how_kn: "ಪ್ರವೇಶ ಪಡೆದ ನಂತರ ಕಾಲೇಜಿನಿಂದ ಕೋರಿಕೆ. ಕೋರ್ಸ್ ಹೆಸರು, ಅವಧಿ, ಶುಲ್ಕ ರಚನೆ ಒಳಗೊಂಡಿರಬೇಕು.",
    timeline_en: "1-3 days from college",
    timeline_kn: "ಕಾಲೇಜಿನಿಂದ 1-3 ದಿನ",
    cost_en: "Usually free",
    cost_kn: "ಸಾಮಾನ್ಯವಾಗಿ ಉಚಿತ",
  },

  "previous year marks card": {
    name_en: "Previous Year Marks Card / Marksheet",
    name_kn: "ಹಿಂದಿನ ವರ್ಷದ ಅಂಕಪಟ್ಟಿ",
    where_en: "Your school / college / board office",
    where_kn: "ನಿಮ್ಮ ಶಾಲೆ / ಕಾಲೇಜು / ಬೋರ್ಡ್ ಕಚೇರಿ",
    how_en: "Collect from your previous educational institution. For board exams (SSLC, PUC), download from the respective board website.",
    how_kn: "ಹಿಂದಿನ ಶಿಕ್ಷಣ ಸಂಸ್ಥೆಯಿಂದ ಸಂಗ್ರಹಿಸಿ. SSLC, PUC ಗೆ ಬೋರ್ಡ್ ವೆಬ್‌ಸೈಟ್‌ನಿಂದ ಡೌನ್‌ಲೋಡ್.",
    timeline_en: "Immediate if available; 7-15 days for duplicate",
    timeline_kn: "ಲಭ್ಯವಿದ್ದಲ್ಲಿ ತಕ್ಷಣ; ನಕಲಿಗೆ 7-15 ದಿನ",
    cost_en: "Free (original); ₹100-500 (duplicate)",
    cost_kn: "ಉಚಿತ (ಮೂಲ); ₹100-500 (ನಕಲು)",
  },

  "address proof": {
    name_en: "Address Proof",
    name_kn: "ವಿಳಾಸ ಪುರಾವೆ",
    where_en: "Multiple sources (utility bill, bank statement, or Aadhaar)",
    where_kn: "ಹಲವು ಮೂಲಗಳು (ಯುಟಿಲಿಟಿ ಬಿಲ್, ಬ್ಯಾಂಕ್ ಹೇಳಿಕೆ, ಅಥವಾ ಆಧಾರ್)",
    how_en: "Any of these is accepted: Aadhaar card, electricity/water bill, bank statement, rental agreement, or voter ID with current address.",
    how_kn: "ಇವುಗಳಲ್ಲಿ ಯಾವುದಾದರೂ: ಆಧಾರ್, ವಿದ್ಯುತ್/ನೀರಿನ ಬಿಲ್, ಬ್ಯಾಂಕ್ ಹೇಳಿಕೆ, ಬಾಡಿಗೆ ಒಪ್ಪಂದ.",
    timeline_en: "Immediate (if you have any of the above)",
    timeline_kn: "ತಕ್ಷಣ (ಮೇಲಿನವುಗಳಲ್ಲಿ ಯಾವುದಾದರೂ ಇದ್ದರೆ)",
    cost_en: "Free",
    cost_kn: "ಉಚಿತ",
    tips_en: "Aadhaar card is the most widely accepted address proof. Update your address on Aadhaar if it has changed.",
    tips_kn: "ಆಧಾರ್ ಅತ್ಯಂತ ವ್ಯಾಪಕವಾಗಿ ಒಪ್ಪಿಕೊಳ್ಳಲ್ಪಡುವ ವಿಳಾಸ ಪುರಾವೆ.",
  },

  "age proof": {
    name_en: "Age Proof",
    name_kn: "ವಯಸ್ಸಿನ ಪುರಾವೆ",
    where_en: "Multiple sources (birth certificate, school records, or Aadhaar)",
    where_kn: "ಹಲವು ಮೂಲಗಳು (ಜನನ ಪ್ರಮಾಣಪತ್ರ, ಶಾಲಾ ದಾಖಲೆ, ಆಧಾರ್)",
    how_en: "Any of these is accepted: Birth certificate, SSLC marks card, Aadhaar card, or passport. School leaving certificate also works.",
    how_kn: "ಇವುಗಳಲ್ಲಿ ಯಾವುದಾದರೂ: ಜನನ ಪ್ರಮಾಣಪತ್ರ, SSLC ಅಂಕಪಟ್ಟಿ, ಆಧಾರ್, ಪಾಸ್‌ಪೋರ್ಟ್.",
    timeline_en: "Immediate (if you have any of the above)",
    timeline_kn: "ತಕ್ಷಣ (ಮೇಲಿನವುಗಳಲ್ಲಿ ಯಾವುದಾದರೂ ಇದ್ದರೆ)",
    cost_en: "Free",
    cost_kn: "ಉಚಿತ",
  },

  "electricity bill": {
    name_en: "Electricity Bill (BESCOM/HESCOM/GESCOM/MESCOM/CESC)",
    name_kn: "ವಿದ್ಯುತ್ ಬಿಲ್ (BESCOM/HESCOM/GESCOM/MESCOM/CESC)",
    where_en: "Your local ESCOM office or online portal",
    where_kn: "ನಿಮ್ಮ ಸ್ಥಳೀಯ ESCOM ಕಚೇರಿ ಅಥವಾ ಆನ್‌ಲೈನ್ ಪೋರ್ಟಲ್",
    how_en: "Download from your ESCOM's website (BESCOM for Bengaluru). Need your consumer number / RR number.",
    how_kn: "ನಿಮ್ಮ ESCOM ವೆಬ್‌ಸೈಟ್‌ನಿಂದ ಡೌನ್‌ಲೋಡ್. ಗ್ರಾಹಕ ಸಂಖ್ಯೆ / RR ಸಂಖ್ಯೆ ಬೇಕು.",
    timeline_en: "Immediate (online download)",
    timeline_kn: "ತಕ್ಷಣ (ಆನ್‌ಲೈನ್ ಡೌನ್‌ಲೋಡ್)",
    cost_en: "Free",
    cost_kn: "ಉಚಿತ",
    online_url: "https://bescom.karnataka.gov.in",
    online_portal_en: "BESCOM Portal (Bengaluru region)",
    online_portal_kn: "BESCOM ಪೋರ್ಟಲ್ (ಬೆಂಗಳೂರು ಪ್ರದೇಶ)",
  },

  "thayi bhagya card": {
    name_en: "Thayi Bhagya Card (Mother's Card)",
    name_kn: "ತಾಯಿ ಭಾಗ್ಯ ಕಾರ್ಡ್",
    where_en: "Government hospital / Primary Health Centre (PHC) / Anganwadi",
    where_kn: "ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ / ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ / ಅಂಗನವಾಡಿ",
    how_en: "Register at the nearest government hospital or PHC during pregnancy. Bring Aadhaar and BPL ration card.",
    how_kn: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ ಅಥವಾ PHC ಯಲ್ಲಿ ನೋಂದಾಯಿಸಿ.",
    timeline_en: "Same day registration",
    timeline_kn: "ಅದೇ ದಿನ ನೋಂದಣಿ",
    cost_en: "Free",
    cost_kn: "ಉಚಿತ",
    tips_en: "Register as early as possible in pregnancy for full benefits including free delivery and nutrition supplements.",
    tips_kn: "ಪೂರ್ಣ ಪ್ರಯೋಜನಗಳಿಗೆ ಗರ್ಭಾವಸ್ಥೆಯ ಆರಂಭದಲ್ಲಿ ನೋಂದಾಯಿಸಿ.",
  },

  "business project proposal": {
    name_en: "Business / Project Proposal",
    name_kn: "ವ್ಯಾಪಾರ / ಯೋಜನೆ ಪ್ರಸ್ತಾವನೆ",
    where_en: "Prepare yourself or get help from District Industries Centre (DIC)",
    where_kn: "ನೀವೇ ತಯಾರಿಸಿ ಅಥವಾ ಜಿಲ್ಲಾ ಕೈಗಾರಿಕಾ ಕೇಂದ್ರದ (DIC) ಸಹಾಯ ಪಡೆಯಿರಿ",
    how_en: "Prepare a brief project report with: business idea, expected costs, revenue estimates, and your qualifications. DIC or local RSETI can help draft it.",
    how_kn: "ವ್ಯಾಪಾರ ಯೋಜನೆ, ಅಂದಾಜು ವೆಚ್ಚ, ಆದಾಯ ಅಂದಾಜು ಒಳಗೊಂಡ ಸಂಕ್ಷಿಪ್ತ ಯೋಜನಾ ವರದಿ ತಯಾರಿಸಿ.",
    timeline_en: "3-7 days to prepare",
    timeline_kn: "ತಯಾರಿಸಲು 3-7 ದಿನ",
    cost_en: "Free (if self-prepared); ₹500-2000 (if professional help)",
    cost_kn: "ಉಚಿತ (ಸ್ವಯಂ ತಯಾರಿಕೆ); ₹500-2000 (ವೃತ್ತಿಪರ ಸಹಾಯ)",
    tips_en: "Many banks and DIC offices have standard templates. Ask for one before writing from scratch.",
    tips_kn: "ಅನೇಕ ಬ್ಯಾಂಕ್‌ಗಳು ಮತ್ತು DIC ಕಚೇರಿಗಳಲ್ಲಿ ಮಾನಕ ಟೆಂಪ್ಲೇಟ್‌ಗಳಿವೆ.",
  },
}

/**
 * Normalize a document name for lookup.
 * Handles variations like "Caste Certificate (SC/ST)" matching "caste certificate".
 */
function normalizeDocName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, " ") // Remove parenthetical content
    .replace(/[^a-z\s]/g, "") // Remove non-alpha
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim()
}

/**
 * Build a lookup map from normalized patterns to guide keys.
 * Each guide has multiple patterns that can match.
 */
const MATCH_PATTERNS: Array<{ patterns: string[]; guideKey: string }> = [
  { patterns: ["aadhaar", "aadhar"], guideKey: "aadhaar card" },
  { patterns: ["bank passbook", "bank account"], guideKey: "bank passbook" },
  { patterns: ["income certificate"], guideKey: "income certificate" },
  { patterns: ["caste certificate", "sc st certificate", "obc certificate", "backward class"], guideKey: "caste certificate" },
  { patterns: ["ration card", "bpl ration", "bpl card", "aay phh", "aay card", "phh card"], guideKey: "ration card" },
  { patterns: ["land record", "pahani", "land ownership"], guideKey: "land records" },
  { patterns: ["passport size", "passport-size", "photograph"], guideKey: "passport-size photograph" },
  { patterns: ["minority community", "minority certificate"], guideKey: "minority community certificate" },
  { patterns: ["birth certificate"], guideKey: "birth certificate" },
  { patterns: ["driving license", "driving licence"], guideKey: "driving license" },
  { patterns: ["pan card"], guideKey: "pan card" },
  { patterns: ["passport"], guideKey: "passport" },
  { patterns: ["college admission", "admission letter"], guideKey: "college admission letter" },
  { patterns: ["marks card", "marksheet", "marks sheet"], guideKey: "previous year marks card" },
  { patterns: ["address proof"], guideKey: "address proof" },
  { patterns: ["age proof"], guideKey: "age proof" },
  { patterns: ["electricity bill", "bescom", "hescom", "gescom", "mescom", "cesc"], guideKey: "electricity bill" },
  { patterns: ["thayi bhagya"], guideKey: "thayi bhagya card" },
  { patterns: ["business project", "project proposal", "business plan"], guideKey: "business project proposal" },
]

/**
 * Look up a document preparation guide by document name.
 * Returns undefined if no matching guide exists.
 */
export function getDocumentGuide(documentName: string): DocumentGuide | undefined {
  const normalized = normalizeDocName(documentName)

  // Try exact match first
  if (guides[normalized]) return guides[normalized]

  // Try pattern matching
  for (const { patterns, guideKey } of MATCH_PATTERNS) {
    for (const pattern of patterns) {
      if (normalized.includes(pattern) || pattern.includes(normalized)) {
        return guides[guideKey]
      }
    }
  }

  return undefined
}

/**
 * Check if a document has a preparation guide available.
 */
export function hasDocumentGuide(documentName: string): boolean {
  return getDocumentGuide(documentName) !== undefined
}

/**
 * Get all available document guides.
 */
export function getAllGuides(): Record<string, DocumentGuide> {
  return guides
}
