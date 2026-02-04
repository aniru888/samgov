-- SamGov Seed Data
-- Karnataka welfare schemes with verified decision trees
-- Sources verified: 2026-02-04
--
-- IMPORTANT: All eligibility criteria sourced from:
-- - Official Karnataka government portals
-- - Seva Sindhu portal documentation
-- - Department websites (DWCD, Food & Civil Supplies, Transport, Skill Dev)
--
-- This data is for GUIDANCE ONLY. Always verify on official portals.

-- Clear existing data (for dev reseeding)
TRUNCATE schemes CASCADE;
TRUNCATE decision_trees CASCADE;

-- ============================================================================
-- SCHEMES TABLE
-- ============================================================================

INSERT INTO schemes (slug, name_en, name_kn, department, eligibility_summary, benefits_summary, application_url, official_source_url, last_verified_at) VALUES

-- 1. Gruha Lakshmi - Women household heads
-- Source: https://dwcd.karnataka.gov.in/info-2/GRUHALAKSHMI+SCHEME/en
('gruha-lakshmi',
 'Gruha Lakshmi',
 'ಗೃಹ ಲಕ್ಷ್ಮಿ',
 'Women and Child Development',
 'Women who are the head of household listed on BPL/APL/Antyodaya ration card. Family income < ₹2 lakh/year. Neither applicant nor husband should be taxpayer/GST filer. Government employees not eligible.',
 '₹2,000 per month transferred directly to woman head of household bank account via DBT.',
 'https://sevasindhu.karnataka.gov.in/',
 'https://dwcd.karnataka.gov.in/info-2/GRUHALAKSHMI+SCHEME/en',
 '2026-02-04'),

-- 2. Anna Bhagya - Food security
-- Source: https://ahara.kar.nic.in/
('anna-bhagya',
 'Anna Bhagya',
 'ಅನ್ನ ಭಾಗ್ಯ',
 'Food and Civil Supplies',
 'BPL families with valid Antyodaya or PHH (Priority Household) ration card. Must be Karnataka resident. Family income < ₹2 lakh/year. No separate application needed - automatic via ration card.',
 '10 kg rice per person per month at subsidized rates OR equivalent cash (₹34/kg) transferred to bank account.',
 'https://ahara.kar.nic.in/',
 'https://ahara.kar.nic.in/',
 '2026-02-04'),

-- 3. Shakti - Free bus travel for women
-- Source: https://shakti.ksrtc.in/
('shakti',
 'Shakti',
 'ಶಕ್ತಿ',
 'Transport',
 'All women and transgender persons who are permanent Karnataka residents. Age 6+. Valid ID proof required (Aadhaar/Voter ID/DL/Passport). RTC employees not eligible. Only non-AC buses covered.',
 'Free travel on KSRTC, BMTC, NWKRTC, KKRTC non-AC buses within Karnataka. Show original Aadhaar to conductor.',
 'https://sevasindhu.karnataka.gov.in/',
 'https://shakti.ksrtc.in/',
 '2026-02-04'),

-- 4. Yuva Nidhi - Youth unemployment allowance
-- Source: https://kaushalya.karnataka.gov.in/21/yuvanidhi-scheme/en
('yuva-nidhi',
 'Yuva Nidhi',
 'ಯುವ ನಿಧಿ',
 'Skill Development, Entrepreneurship and Livelihood',
 'Unemployed degree/diploma holders who graduated in 2022-23 or 2023-24. Must have studied 6+ years in Karnataka. Unemployed for 6+ months. Not pursuing higher education. Not receiving ESI/PF/NPS or other govt benefits.',
 '₹3,000/month for degree holders, ₹1,500/month for diploma holders. Maximum 2 years or until employment. Free skill training under Kaushalkar.',
 'https://sevasindhugs.karnataka.gov.in/',
 'https://kaushalya.karnataka.gov.in/21/yuvanidhi-scheme/en',
 '2026-02-04'),

-- 5. Sandhya Suraksha - Elderly pension
-- Source: https://karunadu.karnataka.gov.in/welfareofdisabled/Pages/Senior-Citizen-Schemes.aspx
('sandhya-suraksha',
 'Sandhya Suraksha',
 'ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ',
 'Social Welfare',
 'Karnataka residents aged 65+. Annual income of applicant + spouse < ₹20,000. Bank balance < ₹10,000. Must be from unorganized sector (weavers, farmers, fishermen, etc.). No other pension from any source.',
 '₹1,000/month pension. Discounted KSRTC bus passes. Access to govt-supported old age day care facilities.',
 'https://sevasindhuservices.karnataka.gov.in/',
 'https://karunadu.karnataka.gov.in/welfareofdisabled/Pages/Senior-Citizen-Schemes.aspx',
 '2026-02-04'),

-- 6. Bhagya Lakshmi - Girl child welfare
-- Source: https://blakshmi.kar.nic.in/
('bhagya-lakshmi',
 'Bhagya Lakshmi',
 'ಭಾಗ್ಯಲಕ್ಷ್ಮಿ',
 'Women and Child Development',
 'For BPL families with girl child born after March 31, 2006. Registration within 1 year of birth. Max 2 girls per family eligible. Girl must complete education up to 8th grade and not marry before 18.',
 '₹10,000 bond at birth (matures to ₹34,751 at age 18). Health insurance up to ₹25,000/year. Annual scholarship ₹300-₹1,000 for class 1-10.',
 'https://blakshmi.kar.nic.in/',
 'https://blakshmi.kar.nic.in/',
 '2026-02-04'),

-- 7. Vidyasiri Scholarship - Higher education for backward classes
-- Source: https://bcwd.karnataka.gov.in/info-2/Scholarships/Vidyasiri/en
('vidyasiri',
 'Vidyasiri Scholarship',
 'ವಿದ್ಯಾಸಿರಿ ಸ್ಕಾಲರ್‌ಶಿಪ್',
 'Backward Classes Welfare',
 'For SC/ST/OBC/Minority students pursuing post-matric courses. Family income ₹1-2.5 lakh/year. Must reside 5+ km from college. 75% attendance required. Max 2 male students per family (no limit for females).',
 '₹1,500/month for 10 months (₹15,000/year) for food and accommodation support.',
 'https://ssp.postmatric.karnataka.gov.in/',
 'https://bcwd.karnataka.gov.in/info-2/Scholarships/Vidyasiri/en',
 '2026-02-04'),

-- 8. Raitha Shakti - Farmer diesel subsidy
-- Source: https://fruits.karnataka.gov.in/
('raitha-shakti',
 'Raitha Shakti',
 'ರೈತ ಶಕ್ತಿ',
 'Agriculture',
 'Karnataka farmers registered on FRUITS portal. Land holding up to 5 acres maximum. Must have land ownership documents.',
 '₹250 per acre diesel subsidy via DBT. Maximum for 5 acres (₹1,250 total).',
 'https://fruits.karnataka.gov.in/',
 'https://fruits.karnataka.gov.in/',
 '2026-02-04');


-- ============================================================================
-- SCHEME SOURCES & HELPLINES
-- Each source includes: type (official/secondary), url, title, used_for, last_accessed
-- ============================================================================

-- Gruha Lakshmi sources
UPDATE schemes SET
  sources = '[
    {"type": "official", "url": "https://dwcd.karnataka.gov.in/info-2/GRUHALAKSHMI+SCHEME/en", "title": "WCD Karnataka Official Page", "used_for": "primary_eligibility"},
    {"type": "official", "url": "https://dwcd.karnataka.gov.in/41/gruhalakshmi-scheme/en", "title": "Scheme Guidelines", "used_for": "detailed_guidelines"},
    {"type": "official", "url": "https://sevasindhuservices.karnataka.gov.in/", "title": "Seva Sindhu Portal", "used_for": "application"},
    {"type": "secondary", "url": "https://cleartax.in/s/gruha-lakshmi-scheme-karnataka", "title": "ClearTax Guide", "used_for": "eligibility_details,documents,exclusions"}
  ]'::jsonb,
  helpline = '{"phone": ["1902", "08147500500", "08277000555"], "method": "SMS ration card number"}'::jsonb
WHERE slug = 'gruha-lakshmi';

-- Anna Bhagya sources
UPDATE schemes SET
  sources = '[
    {"type": "official", "url": "https://ahara.kar.nic.in/", "title": "Karnataka Ahara Portal", "used_for": "primary_source"},
    {"type": "secondary", "url": "https://cleartax.in/s/anna-bhagya-scheme", "title": "ClearTax Guide", "used_for": "eligibility,benefits"},
    {"type": "secondary", "url": "https://www.govtschemes.in/karnataka-anna-bhagya-scheme", "title": "GovtSchemes.in", "used_for": "ration_card_types"}
  ]'::jsonb,
  helpline = '{"phone": ["1967", "18004259339"], "email": "foodcom-ka@nic.in"}'::jsonb
WHERE slug = 'anna-bhagya';

-- Shakti sources
UPDATE schemes SET
  sources = '[
    {"type": "official", "url": "https://yuvakanaja.karnataka.gov.in/591/shakti-yojana/en", "title": "Yuva Kanaja Official", "used_for": "primary_eligibility"},
    {"type": "official", "url": "https://shakti.ksrtc.in/", "title": "KSRTC Shakti Portal", "used_for": "bus_service_details"},
    {"type": "official", "url": "https://sevasindhuservices.karnataka.gov.in/", "title": "Seva Sindhu Smart Card", "used_for": "application"},
    {"type": "secondary", "url": "https://www.govtschemes.in/karnataka-shakti-scheme", "title": "GovtSchemes.in", "used_for": "age_limits,bus_types,exclusions"},
    {"type": "secondary", "url": "https://www.scribd.com/document/684347950/Karnataka-Shakti-Scheme-Guidelines", "title": "Guidelines PDF", "used_for": "official_guidelines"}
  ]'::jsonb,
  helpline = '{"phone": ["1902", "080-4959-6666"], "email": "sevasindhu@karnataka.gov.in"}'::jsonb
WHERE slug = 'shakti';

-- Yuva Nidhi sources
UPDATE schemes SET
  sources = '[
    {"type": "official", "url": "https://kaushalya.karnataka.gov.in/21/yuvanidhi-scheme/en", "title": "Kaushalya Karnataka Official", "used_for": "primary_eligibility"},
    {"type": "official", "url": "https://ceg.karnataka.gov.in/Blog/public/details/YuvaNidhi/en", "title": "CEG Eligibility Checker", "used_for": "self_check"},
    {"type": "official", "url": "https://sevasindhuservices.karnataka.gov.in/directApply.do?serviceId=2079", "title": "Direct Application Link", "used_for": "application"},
    {"type": "official", "url": "https://kaushalya.karnataka.gov.in/uploads/media_to_upload1654077894.pdf", "title": "RTI 4(1)A Document", "used_for": "department_structure"},
    {"type": "secondary", "url": "https://en.wikipedia.org/wiki/Yuva_Nidhi", "title": "Wikipedia", "used_for": "launch_date,overview"},
    {"type": "secondary", "url": "https://cleartax.in/s/yuva-nidhi-scheme-karnataka", "title": "ClearTax Guide", "used_for": "detailed_exclusions"}
  ]'::jsonb,
  helpline = '{"phone": ["1800-599-9918", "1902"]}'::jsonb
WHERE slug = 'yuva-nidhi';

-- Sandhya Suraksha sources
UPDATE schemes SET
  sources = '[
    {"type": "official", "url": "https://karunadu.karnataka.gov.in/welfareofdisabled/Pages/Senior-Citizen-Schemes.aspx", "title": "Karnataka Social Welfare", "used_for": "primary_source"},
    {"type": "official", "url": "https://sevasindhuservices.karnataka.gov.in/", "title": "Seva Sindhu Portal", "used_for": "application"},
    {"type": "secondary", "url": "https://www.indiafilings.com/learn/sandhya-surksha-pension-scheme/", "title": "IndiaFilings Guide", "used_for": "eligibility,income_limits"},
    {"type": "secondary", "url": "https://schemesandentitlements.org/public/books/making-entitlements-work/page/scheme-4-sandhya-suraksha-yojana", "title": "Schemes & Entitlements", "used_for": "unorganized_sector_details"}
  ]'::jsonb,
  helpline = '{}'::jsonb
WHERE slug = 'sandhya-suraksha';

-- Bhagya Lakshmi sources
UPDATE schemes SET
  sources = '[
    {"type": "official", "url": "https://blakshmi.kar.nic.in/", "title": "Bhagya Lakshmi Official Portal", "used_for": "primary_source,application"},
    {"type": "official", "url": "https://www.myscheme.gov.in/schemes/bys", "title": "myScheme.gov.in", "used_for": "government_verification"},
    {"type": "secondary", "url": "https://cleartax.in/s/bhagyalakshmi-scheme-karnataka", "title": "ClearTax Guide", "used_for": "eligibility,benefits"},
    {"type": "secondary", "url": "https://socialwelfare.vikaspedia.in/viewcontent/social-welfare/women-and-child-development/child-development-1/girl-child-welfare/state-wise-schemes-for-girl-child-welfare/bhagyalaxmi-scheme-of-karnataka?lgn=en", "title": "Vikaspedia", "used_for": "bond_details"}
  ]'::jsonb,
  helpline = '{}'::jsonb
WHERE slug = 'bhagya-lakshmi';

-- Vidyasiri sources
UPDATE schemes SET
  sources = '[
    {"type": "official", "url": "https://bcwd.karnataka.gov.in/44/vidyasiri/en", "title": "BCWD Karnataka Official", "used_for": "primary_eligibility"},
    {"type": "official", "url": "https://bcwd.karnataka.gov.in/info-2/Scholarships/Vidyasiri/en", "title": "Vidyasiri Scholarship Info", "used_for": "detailed_info"},
    {"type": "official", "url": "https://ssp.postmatric.karnataka.gov.in/", "title": "SSP Portal", "used_for": "application"},
    {"type": "secondary", "url": "https://www.collegesearch.in/articles/vidyasiri-scholarship", "title": "CollegeSearch Guide", "used_for": "application_process,deadlines"}
  ]'::jsonb,
  helpline = '{"phone": ["8050770005"], "email": "bcdbng@kar.nic.in", "address": "No.16/D, 3rd Floor, Devraj Urs Bhavan, Millers Tank Bed Road, Vasanth Nagar, Bangalore – 560052"}'::jsonb
WHERE slug = 'vidyasiri';

-- Raitha Shakti sources
UPDATE schemes SET
  sources = '[
    {"type": "official", "url": "https://fruits.karnataka.gov.in/", "title": "FRUITS Portal", "used_for": "farmer_registration,eligibility"},
    {"type": "secondary", "url": "https://sarkariyojana.com/raitha-shakti-yojana-karnataka/", "title": "SarkariYojana Guide", "used_for": "eligibility,subsidy_amount"},
    {"type": "secondary", "url": "https://pmmodiyojana.in/karnataka-raitha-shakti-scheme/", "title": "PMModiYojana Guide", "used_for": "application_process"}
  ]'::jsonb,
  helpline = '{}'::jsonb
WHERE slug = 'raitha-shakti';


-- ============================================================================
-- DECISION TREES
-- ============================================================================

-- 1. GRUHA LAKSHMI Decision Tree
-- Based on: https://dwcd.karnataka.gov.in, https://cleartax.in/s/gruha-lakshmi-scheme-karnataka
WITH scheme AS (SELECT id FROM schemes WHERE slug = 'gruha-lakshmi')
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT scheme.id, 1, true, '{
  "start": "q_resident",
  "nodes": {
    "q_resident": {
      "type": "question",
      "text_en": "Are you a permanent resident of Karnataka?",
      "text_kn": "ನೀವು ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_gender"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
      ]
    },
    "q_gender": {
      "type": "question",
      "text_en": "Are you a woman or transgender person?",
      "text_kn": "ನೀವು ಮಹಿಳೆ ಅಥವಾ ತೃತೀಯ ಲಿಂಗಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_head_of_household"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_woman"}
      ]
    },
    "q_head_of_household": {
      "type": "question",
      "text_en": "Are you listed as the head of household on your ration card?",
      "text_kn": "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ನೀವು ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರಾಗಿ ನಮೂದಾಗಿದ್ದೀರಾ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_ration_card"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_hoh"}
      ]
    },
    "q_ration_card": {
      "type": "question",
      "text_en": "What type of ration card do you have?",
      "text_kn": "ನಿಮ್ಮ ಬಳಿ ಯಾವ ರೀತಿಯ ಪಡಿತರ ಚೀಟಿ ಇದೆ?",
      "options": [
        {"label": "Antyodaya (AAY)", "label_kn": "ಅಂತ್ಯೋದಯ (AAY)", "next": "q_income"},
        {"label": "BPL / PHH", "label_kn": "BPL / PHH", "next": "q_income"},
        {"label": "APL", "label_kn": "APL", "next": "q_income"},
        {"label": "No ration card", "label_kn": "ಪಡಿತರ ಚೀಟಿ ಇಲ್ಲ", "next": "r_no_ration_card"}
      ]
    },
    "q_income": {
      "type": "question",
      "text_en": "Is your family''s annual income less than ₹2 lakh?",
      "text_kn": "ನಿಮ್ಮ ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ₹2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_taxpayer"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_income_high"}
      ]
    },
    "q_taxpayer": {
      "type": "question",
      "text_en": "Are you or your husband an income tax payer or GST filer?",
      "text_kn": "ನೀವು ಅಥವಾ ನಿಮ್ಮ ಪತಿ ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿದಾರರೇ ಅಥವಾ GST ಫೈಲರ್ ಆಗಿದ್ದೀರಾ?",
      "options": [
        {"label": "No, neither of us", "label_kn": "ಇಲ್ಲ, ನಮ್ಮಲ್ಲಿ ಯಾರೂ ಅಲ್ಲ", "next": "q_govt_employee"},
        {"label": "Yes, one or both", "label_kn": "ಹೌದು, ಒಬ್ಬರು ಅಥವಾ ಇಬ್ಬರೂ", "next": "r_taxpayer"}
      ]
    },
    "q_govt_employee": {
      "type": "question",
      "text_en": "Are you a government employee?",
      "text_kn": "ನೀವು ಸರ್ಕಾರಿ ನೌಕರರೇ?",
      "options": [
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "q_bank_account"},
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "r_govt_employee"}
      ]
    },
    "q_bank_account": {
      "type": "question",
      "text_en": "Do you have a bank account linked to Aadhaar in your name?",
      "text_kn": "ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡಿದ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_existing_benefit"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_no_bank"}
      ]
    },
    "q_existing_benefit": {
      "type": "question",
      "text_en": "Is anyone else in your household already receiving Gruha Lakshmi?",
      "text_kn": "ನಿಮ್ಮ ಕುಟುಂಬದಲ್ಲಿ ಇನ್ನೊಬ್ಬರು ಈಗಾಗಲೇ ಗೃಹ ಲಕ್ಷ್ಮಿ ಪಡೆಯುತ್ತಿದ್ದಾರೆಯೇ?",
      "options": [
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_eligible"},
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "r_duplicate"}
      ]
    },
    "r_eligible": {
      "type": "result",
      "status": "eligible",
      "reason_en": "Based on your answers, you may meet the basic eligibility criteria for Gruha Lakshmi.",
      "reason_kn": "ನಿಮ್ಮ ಉತ್ತರಗಳ ಪ್ರಕಾರ, ನೀವು ಗೃಹ ಲಕ್ಷ್ಮಿಗೆ ಮೂಲಭೂತ ಅರ್ಹತಾ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸಬಹುದು.",
      "next_steps_en": "Apply online via Seva Sindhu portal or visit Grama One / Bangalore One / Bapuji Seva Kendra.",
      "next_steps_kn": "ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್ ಮೂಲಕ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಅಥವಾ ಗ್ರಾಮ ಒನ್ / ಬೆಂಗಳೂರು ಒನ್ / ಬಾಪೂಜಿ ಸೇವಾ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.",
      "documents": ["Aadhaar Card (linked to mobile)", "Ration Card (showing you as HoH)", "Bank Passbook (Aadhaar linked)", "Passport Photo", "Husband''s Aadhaar Card"]
    },
    "r_not_resident": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Gruha Lakshmi is only available for permanent Karnataka residents.",
      "reason_kn": "ಗೃಹ ಲಕ್ಷ್ಮಿ ಕೇವಲ ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಗಳಿಗೆ ಮಾತ್ರ ಲಭ್ಯವಿದೆ.",
      "fix_en": "This scheme requires Karnataka residency. Check if your state has similar women welfare schemes."
    },
    "r_not_woman": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Gruha Lakshmi is specifically for women and transgender persons who are heads of household.",
      "reason_kn": "ಗೃಹ ಲಕ್ಷ್ಮಿ ನಿರ್ದಿಷ್ಟವಾಗಿ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥೆಯಾದ ಮಹಿಳೆಯರು ಮತ್ತು ತೃತೀಯ ಲಿಂಗಿಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "The woman or transgender head of your household may be eligible to apply."
    },
    "r_not_hoh": {
      "type": "result",
      "status": "needs_review",
      "reason_en": "You need to be listed as head of household on your ration card.",
      "reason_kn": "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ನೀವು ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರಾಗಿ ನಮೂದಾಗಬೇಕು.",
      "fix_en": "Visit your local Food & Civil Supplies office to update head of household on your ration card. Bring Aadhaar and existing ration card.",
      "fix_kn": "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರನ್ನು ನವೀಕರಿಸಲು ಸ್ಥಳೀಯ ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡಿ."
    },
    "r_no_ration_card": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "A valid ration card (Antyodaya, BPL, or APL) is mandatory for this scheme.",
      "reason_kn": "ಈ ಯೋಜನೆಗೆ ಮಾನ್ಯ ಪಡಿತರ ಚೀಟಿ (ಅಂತ್ಯೋದಯ, BPL, ಅಥವಾ APL) ಕಡ್ಡಾಯವಾಗಿದೆ.",
      "fix_en": "Apply for a new ration card at your local Food & Civil Supplies office or via Seva Sindhu portal (ahara.kar.nic.in)."
    },
    "r_income_high": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Family income must be less than ₹2 lakh per year to qualify.",
      "reason_kn": "ಅರ್ಹತೆ ಪಡೆಯಲು ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ₹2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
      "fix_en": "This scheme is targeted at lower income families. You may check other state welfare schemes."
    },
    "r_taxpayer": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Households where the applicant or husband is an income tax payer or GST filer are not eligible.",
      "reason_kn": "ಅರ್ಜಿದಾರರು ಅಥವಾ ಪತಿ ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿದಾರರು ಅಥವಾ GST ಫೈಲರ್ ಆಗಿರುವ ಕುಟುಂಬಗಳು ಅರ್ಹವಾಗಿಲ್ಲ.",
      "fix_en": "Note: If OTHER family members are taxpayers (not you or your husband), you may still be eligible."
    },
    "r_govt_employee": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Government employees are not eligible for Gruha Lakshmi.",
      "reason_kn": "ಸರ್ಕಾರಿ ನೌಕರರು ಗೃಹ ಲಕ್ಷ್ಮಿಗೆ ಅರ್ಹರಲ್ಲ.",
      "fix_en": "This scheme is for women not employed by the government."
    },
    "r_no_bank": {
      "type": "result",
      "status": "needs_review",
      "reason_en": "An Aadhaar-linked bank account is required to receive DBT payments.",
      "reason_kn": "DBT ಪಾವತಿಗಳನ್ನು ಪಡೆಯಲು ಆಧಾರ್-ಲಿಂಕ್ ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಗತ್ಯವಿದೆ.",
      "fix_en": "Open a zero-balance Jan Dhan account at any nationalized bank with your Aadhaar. Link your mobile number to Aadhaar for DBT.",
      "fix_kn": "ನಿಮ್ಮ ಆಧಾರ್ ಜೊತೆಗೆ ಯಾವುದೇ ರಾಷ್ಟ್ರೀಕೃತ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಜೀರೋ-ಬ್ಯಾಲೆನ್ಸ್ ಜನ್ ಧನ್ ಖಾತೆ ತೆರೆಯಿರಿ."
    },
    "r_duplicate": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Only one woman per household (per ration card) can receive Gruha Lakshmi.",
      "reason_kn": "ಪ್ರತಿ ಕುಟುಂಬದಿಂದ (ಪ್ರತಿ ಪಡಿತರ ಚೀಟಿಗೆ) ಒಬ್ಬ ಮಹಿಳೆ ಮಾತ್ರ ಗೃಹ ಲಕ್ಷ್ಮಿ ಪಡೆಯಬಹುದು.",
      "fix_en": "If the current recipient is no longer eligible or has passed away, contact your local food office to transfer the benefit."
    }
  }
}'::jsonb
FROM scheme;


-- 2. ANNA BHAGYA Decision Tree
-- Based on: https://ahara.kar.nic.in/, https://cleartax.in/s/anna-bhagya-scheme
WITH scheme AS (SELECT id FROM schemes WHERE slug = 'anna-bhagya')
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT scheme.id, 1, true, '{
  "start": "q_resident",
  "nodes": {
    "q_resident": {
      "type": "question",
      "text_en": "Are you a resident of Karnataka?",
      "text_kn": "ನೀವು ಕರ್ನಾಟಕದ ನಿವಾಸಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_ration_card"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
      ]
    },
    "q_ration_card": {
      "type": "question",
      "text_en": "What type of ration card do you have?",
      "text_kn": "ನಿಮ್ಮ ಬಳಿ ಯಾವ ರೀತಿಯ ಪಡಿತರ ಚೀಟಿ ಇದೆ?",
      "options": [
        {"label": "Antyodaya Anna Yojana (AAY)", "label_kn": "ಅಂತ್ಯೋದಯ ಅನ್ನ ಯೋಜನೆ (AAY)", "next": "q_income"},
        {"label": "BPL / Priority Household (PHH)", "label_kn": "BPL / ಆದ್ಯತಾ ಕುಟುಂಬ (PHH)", "next": "q_income"},
        {"label": "APL", "label_kn": "APL", "next": "r_apl_not_eligible"},
        {"label": "No ration card", "label_kn": "ಪಡಿತರ ಚೀಟಿ ಇಲ್ಲ", "next": "r_no_ration_card"}
      ]
    },
    "q_income": {
      "type": "question",
      "text_en": "Is your family''s annual income less than ₹2 lakh?",
      "text_kn": "ನಿಮ್ಮ ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ₹2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_govt_employee"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_income_high"}
      ]
    },
    "q_govt_employee": {
      "type": "question",
      "text_en": "Is any family member a government employee?",
      "text_kn": "ಕುಟುಂಬದ ಯಾವುದೇ ಸದಸ್ಯರು ಸರ್ಕಾರಿ ನೌಕರರೇ?",
      "options": [
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_eligible"},
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "r_govt_employee"}
      ]
    },
    "r_eligible": {
      "type": "result",
      "status": "eligible",
      "reason_en": "Based on your answers, you may be eligible for Anna Bhagya benefits.",
      "reason_kn": "ನಿಮ್ಮ ಉತ್ತರಗಳ ಪ್ರಕಾರ, ನೀವು ಅನ್ನ ಭಾಗ್ಯ ಸೌಲಭ್ಯಗಳಿಗೆ ಅರ್ಹರಾಗಬಹುದು.",
      "next_steps_en": "No separate application needed. Visit your nearest ration shop with your ration card. Complete biometric authentication (fingerprint) to receive rice or cash equivalent.",
      "next_steps_kn": "ಪ್ರತ್ಯೇಕ ಅರ್ಜಿ ಅಗತ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯೊಂದಿಗೆ ಹತ್ತಿರದ ಪಡಿತರ ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡಿ. ಅಕ್ಕಿ ಅಥವಾ ನಗದು ಸಮಾನ ಪಡೆಯಲು ಬಯೋಮೆಟ್ರಿಕ್ ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಳಿಸಿ.",
      "documents": ["Ration Card (Antyodaya or BPL/PHH)", "Aadhaar Card (for biometric)"]
    },
    "r_not_resident": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Anna Bhagya is only for Karnataka residents with valid Karnataka ration cards.",
      "reason_kn": "ಅನ್ನ ಭಾಗ್ಯ ಕೇವಲ ಮಾನ್ಯ ಕರ್ನಾಟಕ ಪಡಿತರ ಚೀಟಿ ಹೊಂದಿರುವ ಕರ್ನಾಟಕ ನಿವಾಸಿಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Check your state''s public distribution system for similar food security schemes."
    },
    "r_apl_not_eligible": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Anna Bhagya is only for Antyodaya and BPL/PHH ration card holders. APL cards are not eligible.",
      "reason_kn": "ಅನ್ನ ಭಾಗ್ಯ ಕೇವಲ ಅಂತ್ಯೋದಯ ಮತ್ತು BPL/PHH ಪಡಿತರ ಚೀಟಿ ಹೊಂದಿರುವವರಿಗೆ ಮಾತ್ರ. APL ಕಾರ್ಡ್‌ಗಳು ಅರ್ಹವಾಗಿಲ್ಲ.",
      "fix_en": "If your family income has reduced, you may apply to convert your APL card to BPL at your local Food & Civil Supplies office."
    },
    "r_no_ration_card": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "A valid Antyodaya or BPL ration card is required for Anna Bhagya.",
      "reason_kn": "ಅನ್ನ ಭಾಗ್ಯಕ್ಕಾಗಿ ಮಾನ್ಯ ಅಂತ್ಯೋದಯ ಅಥವಾ BPL ಪಡಿತರ ಚೀಟಿ ಅಗತ್ಯವಿದೆ.",
      "fix_en": "Apply for a new BPL ration card at ahara.kar.nic.in or your local Food & Civil Supplies office.",
      "fix_kn": "ahara.kar.nic.in ನಲ್ಲಿ ಅಥವಾ ಸ್ಥಳೀಯ ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಕಚೇರಿಯಲ್ಲಿ ಹೊಸ BPL ಪಡಿತರ ಚೀಟಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."
    },
    "r_income_high": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Family income must be less than ₹2 lakh per year for BPL benefits.",
      "reason_kn": "BPL ಸೌಲಭ್ಯಗಳಿಗೆ ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ₹2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
      "fix_en": "This scheme targets economically weaker families. APL families receive standard PDS rations but not Anna Bhagya benefits."
    },
    "r_govt_employee": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Families with government employees are not eligible for Anna Bhagya.",
      "reason_kn": "ಸರ್ಕಾರಿ ನೌಕರರಿರುವ ಕುಟುಂಬಗಳು ಅನ್ನ ಭಾಗ್ಯಕ್ಕೆ ಅರ್ಹವಾಗಿಲ್ಲ.",
      "fix_en": "Government employees receive separate benefits. You may still get standard PDS rations."
    }
  }
}'::jsonb
FROM scheme;


-- 3. SHAKTI Decision Tree
-- Based on: https://shakti.ksrtc.in/, https://www.govtschemes.in/karnataka-shakti-scheme
WITH scheme AS (SELECT id FROM schemes WHERE slug = 'shakti')
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT scheme.id, 1, true, '{
  "start": "q_resident",
  "nodes": {
    "q_resident": {
      "type": "question",
      "text_en": "Are you a permanent resident of Karnataka?",
      "text_kn": "ನೀವು ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_gender"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
      ]
    },
    "q_gender": {
      "type": "question",
      "text_en": "Are you a woman or transgender person?",
      "text_kn": "ನೀವು ಮಹಿಳೆ ಅಥವಾ ತೃತೀಯ ಲಿಂಗಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_age"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_eligible_gender"}
      ]
    },
    "q_age": {
      "type": "question",
      "text_en": "Are you 6 years of age or older?",
      "text_kn": "ನಿಮಗೆ 6 ವರ್ಷ ಅಥವಾ ಅದಕ್ಕಿಂತ ಹೆಚ್ಚು ವಯಸ್ಸಾಗಿದೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_id_proof"},
        {"label": "No (below 6)", "label_kn": "ಇಲ್ಲ (6 ಕ್ಕಿಂತ ಕಡಿಮೆ)", "next": "r_too_young"}
      ]
    },
    "q_id_proof": {
      "type": "question",
      "text_en": "Do you have a valid photo ID (Aadhaar, Voter ID, Driving License, or Passport)?",
      "text_kn": "ನಿಮ್ಮ ಬಳಿ ಮಾನ್ಯ ಫೋಟೋ ಐಡಿ (ಆಧಾರ್, ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ, ಡ್ರೈವಿಂಗ್ ಲೈಸನ್ಸ್, ಅಥವಾ ಪಾಸ್‌ಪೋರ್ಟ್) ಇದೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_rtc_employee"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_no_id"}
      ]
    },
    "q_rtc_employee": {
      "type": "question",
      "text_en": "Are you an employee of KSRTC, BMTC, or any other state RTC?",
      "text_kn": "ನೀವು KSRTC, BMTC, ಅಥವಾ ಯಾವುದೇ ರಾಜ್ಯ RTC ನೌಕರರೇ?",
      "options": [
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_eligible"},
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "r_rtc_employee"}
      ]
    },
    "r_eligible": {
      "type": "result",
      "status": "eligible",
      "reason_en": "Based on your answers, you may avail free bus travel under Shakti scheme.",
      "reason_kn": "ನಿಮ್ಮ ಉತ್ತರಗಳ ಪ್ರಕಾರ, ನೀವು ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಉಚಿತ ಬಸ್ ಪ್ರಯಾಣ ಪಡೆಯಬಹುದು.",
      "next_steps_en": "Show your original Aadhaar card to the bus conductor. Free travel is available on KSRTC, BMTC, NWKRTC, KKRTC non-AC buses only (Ordinary, Express, Urban Transport). NOT valid on AC/Sleeper/Volvo buses.",
      "next_steps_kn": "ಬಸ್ ಕಂಡಕ್ಟರ್‌ಗೆ ನಿಮ್ಮ ಮೂಲ ಆಧಾರ್ ಕಾರ್ಡ್ ತೋರಿಸಿ. KSRTC, BMTC, NWKRTC, KKRTC ನಾನ್-AC ಬಸ್‌ಗಳಲ್ಲಿ ಮಾತ್ರ ಉಚಿತ ಪ್ರಯಾಣ ಲಭ್ಯವಿದೆ.",
      "documents": ["Aadhaar Card (original, to show conductor)", "OR Voter ID / Driving License / Passport"]
    },
    "r_not_resident": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Shakti scheme is only for permanent Karnataka residents.",
      "reason_kn": "ಶಕ್ತಿ ಯೋಜನೆ ಕೇವಲ ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Regular bus fares apply for non-residents."
    },
    "r_not_eligible_gender": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Shakti scheme is exclusively for women and transgender persons.",
      "reason_kn": "ಶಕ್ತಿ ಯೋಜನೆ ಮಹಿಳೆಯರು ಮತ್ತು ತೃತೀಯ ಲಿಂಗಿಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Regular bus fares apply. Check for other transport subsidies for students or seniors."
    },
    "r_too_young": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Children below 6 years already travel free on government buses as per standard rules.",
      "reason_kn": "6 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ವಯಸ್ಸಿನ ಮಕ್ಕಳು ಸ್ಟ್ಯಾಂಡರ್ಡ್ ನಿಯಮಗಳ ಪ್ರಕಾರ ಸರ್ಕಾರಿ ಬಸ್‌ಗಳಲ್ಲಿ ಈಗಾಗಲೇ ಉಚಿತವಾಗಿ ಪ್ರಯಾಣಿಸುತ್ತಾರೆ.",
      "fix_en": "No action needed - children under 6 travel free by default."
    },
    "r_no_id": {
      "type": "result",
      "status": "needs_review",
      "reason_en": "A valid government photo ID is required to avail Shakti benefits.",
      "reason_kn": "ಶಕ್ತಿ ಸೌಲಭ್ಯಗಳನ್ನು ಪಡೆಯಲು ಮಾನ್ಯ ಸರ್ಕಾರಿ ಫೋಟೋ ಐಡಿ ಅಗತ್ಯವಿದೆ.",
      "fix_en": "Get an Aadhaar card from your nearest Aadhaar enrollment center (free of cost). Alternatively, get a Voter ID from your local election office.",
      "fix_kn": "ನಿಮ್ಮ ಹತ್ತಿರದ ಆಧಾರ್ ನೋಂದಣಿ ಕೇಂದ್ರದಿಂದ ಆಧಾರ್ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ (ಉಚಿತ)."
    },
    "r_rtc_employee": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Employees of Karnataka State Road Transport corporations are not eligible for Shakti.",
      "reason_kn": "ಕರ್ನಾಟಕ ರಾಜ್ಯ ರಸ್ತೆ ಸಾರಿಗೆ ನಿಗಮಗಳ ನೌಕರರು ಶಕ್ತಿಗೆ ಅರ್ಹರಲ್ಲ.",
      "fix_en": "RTC employees have separate travel benefits through their employment."
    }
  }
}'::jsonb
FROM scheme;


-- 4. YUVA NIDHI Decision Tree
-- Based on: https://kaushalya.karnataka.gov.in/21/yuvanidhi-scheme/en
WITH scheme AS (SELECT id FROM schemes WHERE slug = 'yuva-nidhi')
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT scheme.id, 1, true, '{
  "start": "q_resident",
  "nodes": {
    "q_resident": {
      "type": "question",
      "text_en": "Are you a domicile of Karnataka with at least 6 years of education in Karnataka?",
      "text_kn": "ನೀವು ಕರ್ನಾಟಕದ ನಿವಾಸಿಯೇ ಮತ್ತು ಕರ್ನಾಟಕದಲ್ಲಿ ಕನಿಷ್ಠ 6 ವರ್ಷಗಳ ಶಿಕ್ಷಣ ಪಡೆದಿದ್ದೀರಾ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_education"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
      ]
    },
    "q_education": {
      "type": "question",
      "text_en": "What is your educational qualification?",
      "text_kn": "ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಅರ್ಹತೆ ಏನು?",
      "options": [
        {"label": "Degree (Graduate/Post-Graduate)", "label_kn": "ಪದವಿ (ಪದವೀಧರ/ಸ್ನಾತಕೋತ್ತರ)", "next": "q_graduation_year"},
        {"label": "Diploma", "label_kn": "ಡಿಪ್ಲೊಮಾ", "next": "q_graduation_year"},
        {"label": "Other / Below Diploma", "label_kn": "ಇತರೆ / ಡಿಪ್ಲೊಮಾಗಿಂತ ಕಡಿಮೆ", "next": "r_education_not_eligible"}
      ]
    },
    "q_graduation_year": {
      "type": "question",
      "text_en": "When did you complete your degree/diploma?",
      "text_kn": "ನಿಮ್ಮ ಪದವಿ/ಡಿಪ್ಲೊಮಾ ಯಾವಾಗ ಪೂರ್ಣಗೊಂಡಿತು?",
      "options": [
        {"label": "2022-23 or 2023-24", "label_kn": "2022-23 ಅಥವಾ 2023-24", "next": "q_employment_status"},
        {"label": "Before 2022-23", "label_kn": "2022-23 ಕ್ಕಿಂತ ಮೊದಲು", "next": "r_graduation_old"},
        {"label": "After 2023-24 (still studying)", "label_kn": "2023-24 ನಂತರ (ಇನ್ನೂ ಓದುತ್ತಿದ್ದೇನೆ)", "next": "r_still_studying"}
      ]
    },
    "q_employment_status": {
      "type": "question",
      "text_en": "What is your current employment status?",
      "text_kn": "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಉದ್ಯೋಗ ಸ್ಥಿತಿ ಏನು?",
      "options": [
        {"label": "Unemployed for 6+ months", "label_kn": "6+ ತಿಂಗಳು ನಿರುದ್ಯೋಗಿ", "next": "q_higher_education"},
        {"label": "Currently employed (govt/private)", "label_kn": "ಪ್ರಸ್ತುತ ಉದ್ಯೋಗದಲ್ಲಿ", "next": "r_employed"},
        {"label": "Self-employed / Business", "label_kn": "ಸ್ವಯಂ ಉದ್ಯೋಗಿ / ವ್ಯವಹಾರ", "next": "r_self_employed"}
      ]
    },
    "q_higher_education": {
      "type": "question",
      "text_en": "Are you currently pursuing higher education (Masters, PhD, etc.)?",
      "text_kn": "ನೀವು ಪ್ರಸ್ತುತ ಉನ್ನತ ಶಿಕ್ಷಣ ಮುಂದುವರಿಸುತ್ತಿದ್ದೀರಾ (ಸ್ನಾತಕೋತ್ತರ, ಪಿಎಚ್‌ಡಿ, ಇತ್ಯಾದಿ)?",
      "options": [
        {"label": "No, not pursuing further studies", "label_kn": "ಇಲ್ಲ, ಮುಂದಿನ ಅಧ್ಯಯನ ಮುಂದುವರಿಸುತ್ತಿಲ್ಲ", "next": "q_other_benefits"},
        {"label": "Yes, currently studying", "label_kn": "ಹೌದು, ಪ್ರಸ್ತುತ ಅಧ್ಯಯನ ಮಾಡುತ್ತಿದ್ದೇನೆ", "next": "r_pursuing_studies"}
      ]
    },
    "q_other_benefits": {
      "type": "question",
      "text_en": "Are you receiving ESI, PF, NPS, or benefits from any similar state/central scheme?",
      "text_kn": "ನೀವು ESI, PF, NPS, ಅಥವಾ ಯಾವುದೇ ರಾಜ್ಯ/ಕೇಂದ್ರ ಯೋಜನೆಯ ಸೌಲಭ್ಯಗಳನ್ನು ಪಡೆಯುತ್ತಿದ್ದೀರಾ?",
      "options": [
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_eligible"},
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "r_other_benefits"}
      ]
    },
    "r_eligible": {
      "type": "result",
      "status": "eligible",
      "reason_en": "Based on your answers, you may be eligible for Yuva Nidhi unemployment allowance.",
      "reason_kn": "ನಿಮ್ಮ ಉತ್ತರಗಳ ಪ್ರಕಾರ, ನೀವು ಯುವ ನಿಧಿ ನಿರುದ್ಯೋಗ ಭತ್ಯೆಗೆ ಅರ್ಹರಾಗಬಹುದು.",
      "next_steps_en": "Apply online at sevasindhugs.karnataka.gov.in OR visit Grama One / Bangalore One / Bapuji Seva Kendra. Benefits: ₹3,000/month (degree) or ₹1,500/month (diploma) for up to 2 years. Free skill training also provided.",
      "next_steps_kn": "sevasindhugs.karnataka.gov.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಅಥವಾ ಗ್ರಾಮ ಒನ್ / ಬೆಂಗಳೂರು ಒನ್ ಗೆ ಭೇಟಿ ನೀಡಿ.",
      "documents": ["Aadhaar Card", "Degree/Diploma Certificate", "Bank Account Details", "Domicile Certificate", "Income Certificate (if required)"]
    },
    "r_not_resident": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Yuva Nidhi requires Karnataka domicile and at least 6 years of education in Karnataka.",
      "reason_kn": "ಯುವ ನಿಧಿಗೆ ಕರ್ನಾಟಕ ನಿವಾಸ ಮತ್ತು ಕರ್ನಾಟಕದಲ್ಲಿ ಕನಿಷ್ಠ 6 ವರ್ಷಗಳ ಶಿಕ್ಷಣ ಅಗತ್ಯವಿದೆ.",
      "fix_en": "Check unemployment schemes in your home state."
    },
    "r_education_not_eligible": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Yuva Nidhi is only for degree holders and diploma holders.",
      "reason_kn": "ಯುವ ನಿಧಿ ಕೇವಲ ಪದವೀಧರರು ಮತ್ತು ಡಿಪ್ಲೊಮಾ ಹೊಂದಿರುವವರಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Complete a diploma or degree program to become eligible. Check skill training schemes like PMKVY for skill development."
    },
    "r_graduation_old": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Only graduates from academic years 2022-23 or 2023-24 are currently eligible.",
      "reason_kn": "ಕೇವಲ 2022-23 ಅಥವಾ 2023-24 ಶೈಕ್ಷಣಿಕ ವರ್ಷದ ಪದವೀಧರರು ಪ್ರಸ್ತುತ ಅರ್ಹರಾಗಿದ್ದಾರೆ.",
      "fix_en": "This scheme is for recent graduates only. Check employment exchange registration and other job schemes."
    },
    "r_still_studying": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "You must have completed your degree/diploma to apply for Yuva Nidhi.",
      "reason_kn": "ಯುವ ನಿಧಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ನಿಮ್ಮ ಪದವಿ/ಡಿಪ್ಲೊಮಾ ಪೂರ್ಣಗೊಂಡಿರಬೇಕು.",
      "fix_en": "Apply after completing your studies. Note: The graduation year eligibility criteria may be updated by then."
    },
    "r_employed": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Yuva Nidhi is only for unemployed youth. Currently employed persons are not eligible.",
      "reason_kn": "ಯುವ ನಿಧಿ ಕೇವಲ ನಿರುದ್ಯೋಗಿ ಯುವಕರಿಗೆ ಮಾತ್ರ. ಪ್ರಸ್ತುತ ಉದ್ಯೋಗದಲ್ಲಿರುವವರು ಅರ್ಹರಲ್ಲ.",
      "fix_en": "If you lose your job, you may apply within the scheme timeline."
    },
    "r_self_employed": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Self-employed persons or those running a business are not eligible for Yuva Nidhi.",
      "reason_kn": "ಸ್ವಯಂ ಉದ್ಯೋಗಿಗಳು ಅಥವಾ ವ್ಯವಹಾರ ನಡೆಸುತ್ತಿರುವವರು ಯುವ ನಿಧಿಗೆ ಅರ್ಹರಲ್ಲ.",
      "fix_en": "Check PMEGP, CMEGP, or other self-employment schemes for business support."
    },
    "r_pursuing_studies": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Those pursuing higher education after graduation are not eligible for Yuva Nidhi.",
      "reason_kn": "ಪದವಿಯ ನಂತರ ಉನ್ನತ ಶಿಕ್ಷಣ ಮುಂದುವರಿಸುತ್ತಿರುವವರು ಯುವ ನಿಧಿಗೆ ಅರ್ಹರಲ್ಲ.",
      "fix_en": "Complete your current course first. Consider scholarships for your ongoing studies."
    },
    "r_other_benefits": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Those receiving ESI, PF, NPS, or similar government benefits are not eligible.",
      "reason_kn": "ESI, PF, NPS, ಅಥವಾ ಇದೇ ರೀತಿಯ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳನ್ನು ಪಡೆಯುತ್ತಿರುವವರು ಅರ್ಹರಲ್ಲ.",
      "fix_en": "If you''re receiving apprenticeship stipend or similar, you cannot receive Yuva Nidhi simultaneously."
    }
  }
}'::jsonb
FROM scheme;


-- 5. SANDHYA SURAKSHA Decision Tree
-- Based on: https://karunadu.karnataka.gov.in/welfareofdisabled/Pages/Senior-Citizen-Schemes.aspx
WITH scheme AS (SELECT id FROM schemes WHERE slug = 'sandhya-suraksha')
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT scheme.id, 1, true, '{
  "start": "q_resident",
  "nodes": {
    "q_resident": {
      "type": "question",
      "text_en": "Are you a permanent resident of Karnataka?",
      "text_kn": "ನೀವು ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_age"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
      ]
    },
    "q_age": {
      "type": "question",
      "text_en": "How old are you?",
      "text_kn": "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?",
      "options": [
        {"label": "65 years or older", "label_kn": "65 ವರ್ಷ ಅಥವಾ ಅದಕ್ಕಿಂತ ಹೆಚ್ಚು", "next": "q_occupation"},
        {"label": "Below 65 years", "label_kn": "65 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ", "next": "r_too_young"}
      ]
    },
    "q_occupation": {
      "type": "question",
      "text_en": "What is/was your occupation?",
      "text_kn": "ನಿಮ್ಮ ವೃತ್ತಿ ಏನು/ಏನಾಗಿತ್ತು?",
      "options": [
        {"label": "Unorganized sector (farmer, weaver, fisherman, laborer, etc.)", "label_kn": "ಅಸಂಘಟಿತ ವಲಯ (ರೈತ, ನೇಕಾರ, ಮೀನುಗಾರ, ಕೂಲಿ, ಇತ್ಯಾದಿ)", "next": "q_income"},
        {"label": "Government/Public sector (current or retired)", "label_kn": "ಸರ್ಕಾರಿ/ಸಾರ್ವಜನಿಕ ವಲಯ (ಪ್ರಸ್ತುತ ಅಥವಾ ನಿವೃತ್ತ)", "next": "r_govt_sector"},
        {"label": "Private sector with pension", "label_kn": "ಪಿಂಚಣಿ ಹೊಂದಿರುವ ಖಾಸಗಿ ವಲಯ", "next": "r_has_pension"}
      ]
    },
    "q_income": {
      "type": "question",
      "text_en": "Is the combined annual income of you and your spouse less than ₹20,000?",
      "text_kn": "ನಿಮ್ಮ ಮತ್ತು ನಿಮ್ಮ ಸಂಗಾತಿಯ ಒಟ್ಟು ವಾರ್ಷಿಕ ಆದಾಯ ₹20,000 ಕ್ಕಿಂತ ಕಡಿಮೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_bank_balance"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_income_high"}
      ]
    },
    "q_bank_balance": {
      "type": "question",
      "text_en": "Is the combined bank balance of you and your spouse less than ₹10,000?",
      "text_kn": "ನಿಮ್ಮ ಮತ್ತು ನಿಮ್ಮ ಸಂಗಾತಿಯ ಒಟ್ಟು ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ₹10,000 ಕ್ಕಿಂತ ಕಡಿಮೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_other_pension"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_bank_balance_high"}
      ]
    },
    "q_other_pension": {
      "type": "question",
      "text_en": "Are you receiving any pension from government, employer, or any other source?",
      "text_kn": "ನೀವು ಸರ್ಕಾರ, ಉದ್ಯೋಗದಾತ, ಅಥವಾ ಯಾವುದೇ ಮೂಲದಿಂದ ಪಿಂಚಣಿ ಪಡೆಯುತ್ತಿದ್ದೀರಾ?",
      "options": [
        {"label": "No pension from any source", "label_kn": "ಯಾವುದೇ ಮೂಲದಿಂದ ಪಿಂಚಣಿ ಇಲ್ಲ", "next": "r_eligible"},
        {"label": "Yes, receiving pension", "label_kn": "ಹೌದು, ಪಿಂಚಣಿ ಪಡೆಯುತ್ತಿದ್ದೇನೆ", "next": "r_has_pension"}
      ]
    },
    "r_eligible": {
      "type": "result",
      "status": "eligible",
      "reason_en": "Based on your answers, you may be eligible for Sandhya Suraksha pension.",
      "reason_kn": "ನಿಮ್ಮ ಉತ್ತರಗಳ ಪ್ರಕಾರ, ನೀವು ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ ಪಿಂಚಣಿಗೆ ಅರ್ಹರಾಗಬಹುದು.",
      "next_steps_en": "Apply online at sevasindhuservices.karnataka.gov.in OR submit application at Gram Panchayat office (rural) / Municipality office (urban). Benefits: ₹1,000/month pension + discounted KSRTC bus passes + access to old age day care facilities.",
      "next_steps_kn": "sevasindhuservices.karnataka.gov.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಅಥವಾ ಗ್ರಾಮ ಪಂಚಾಯತ್ / ನಗರಸಭೆ ಕಚೇರಿಯಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
      "documents": ["Age Proof (SSLC marks card, passport, ration card, DL, or voter ID)", "Occupation Certificate from Tahsildar", "Income Certificate from local revenue officer", "Bank Account Details", "Aadhaar Card", "Passport Photo"]
    },
    "r_not_resident": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Sandhya Suraksha is only for permanent Karnataka residents.",
      "reason_kn": "ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ ಕೇವಲ ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Check old age pension schemes in your home state."
    },
    "r_too_young": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Sandhya Suraksha requires applicants to be 65 years or older.",
      "reason_kn": "ಸಂಧ್ಯಾ ಸುರಕ್ಷಾಗೆ ಅರ್ಜಿದಾರರು 65 ವರ್ಷ ಅಥವಾ ಅದಕ್ಕಿಂತ ಹೆಚ್ಚು ವಯಸ್ಸಿನವರಾಗಿರಬೇಕು.",
      "fix_en": "You may apply once you turn 65. Check other welfare schemes like widow pension (if applicable) in the meantime."
    },
    "r_govt_sector": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Government/public sector employees (current or retired) are not eligible as they receive separate pension benefits.",
      "reason_kn": "ಸರ್ಕಾರಿ/ಸಾರ್ವಜನಿಕ ವಲಯ ನೌಕರರು (ಪ್ರಸ್ತುತ ಅಥವಾ ನಿವೃತ್ತ) ಪ್ರತ್ಯೇಕ ಪಿಂಚಣಿ ಸೌಲಭ್ಯಗಳನ್ನು ಪಡೆಯುವುದರಿಂದ ಅರ್ಹರಲ್ಲ.",
      "fix_en": "Sandhya Suraksha is specifically for unorganized sector workers without pension coverage."
    },
    "r_has_pension": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Those already receiving any pension (old age, widow, disability, employer pension, etc.) are not eligible.",
      "reason_kn": "ಈಗಾಗಲೇ ಯಾವುದೇ ಪಿಂಚಣಿ ಪಡೆಯುತ್ತಿರುವವರು (ವೃದ್ಧಾಪ್ಯ, ವಿಧವೆ, ಅಂಗವಿಕಲತೆ, ಉದ್ಯೋಗದಾತ ಪಿಂಚಣಿ, ಇತ್ಯಾದಿ) ಅರ್ಹರಲ್ಲ.",
      "fix_en": "Sandhya Suraksha is for elderly without any pension coverage."
    },
    "r_income_high": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Combined annual income of applicant and spouse must be less than ₹20,000.",
      "reason_kn": "ಅರ್ಜಿದಾರರು ಮತ್ತು ಸಂಗಾತಿಯ ಒಟ್ಟು ವಾರ್ಷಿಕ ಆದಾಯ ₹20,000 ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
      "fix_en": "Note: Income of adult children is NOT counted - only your and your spouse''s income matters. Re-check if your personal income is actually below the limit."
    },
    "r_bank_balance_high": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Combined bank balance of applicant and spouse must be less than ₹10,000.",
      "reason_kn": "ಅರ್ಜಿದಾರರು ಮತ್ತು ಸಂಗಾತಿಯ ಒಟ್ಟು ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ₹10,000 ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
      "fix_en": "This scheme is for the most economically vulnerable elderly. You may check other senior citizen welfare schemes."
    }
  }
}'::jsonb
FROM scheme;


-- 6. BHAGYA LAKSHMI Decision Tree
-- Based on: https://blakshmi.kar.nic.in/, https://cleartax.in/s/bhagyalakshmi-scheme-karnataka
WITH scheme AS (SELECT id FROM schemes WHERE slug = 'bhagya-lakshmi')
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT scheme.id, 1, true, '{
  "start": "q_resident",
  "nodes": {
    "q_resident": {
      "type": "question",
      "text_en": "Is the family a resident of Karnataka?",
      "text_kn": "ಕುಟುಂಬವು ಕರ್ನಾಟಕದ ನಿವಾಸಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_bpl_status"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
      ]
    },
    "q_bpl_status": {
      "type": "question",
      "text_en": "Does the family belong to Below Poverty Line (BPL) category?",
      "text_kn": "ಕುಟುಂಬವು ಬಡತನ ರೇಖೆಗಿಂತ ಕೆಳಗಿನ (BPL) ವರ್ಗಕ್ಕೆ ಸೇರಿದೆಯೇ?",
      "options": [
        {"label": "Yes, BPL family", "label_kn": "ಹೌದು, BPL ಕುಟುಂಬ", "next": "q_girl_birth_date"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_bpl"}
      ]
    },
    "q_girl_birth_date": {
      "type": "question",
      "text_en": "Was the girl child born after March 31, 2006?",
      "text_kn": "ಹೆಣ್ಣು ಮಗು ಮಾರ್ಚ್ 31, 2006 ನಂತರ ಜನಿಸಿದ್ದಾಳೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_registration_time"},
        {"label": "No (born before April 2006)", "label_kn": "ಇಲ್ಲ (ಏಪ್ರಿಲ್ 2006 ಕ್ಕಿಂತ ಮೊದಲು ಜನಿಸಿದ್ದಾಳೆ)", "next": "r_birth_date_old"}
      ]
    },
    "q_registration_time": {
      "type": "question",
      "text_en": "Can you register the girl child within 1 year of her birth?",
      "text_kn": "ಹೆಣ್ಣು ಮಗುವನ್ನು ಜನನದ 1 ವರ್ಷದೊಳಗೆ ನೋಂದಾಯಿಸಬಹುದೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_sibling_count"},
        {"label": "No (already over 1 year old)", "label_kn": "ಇಲ್ಲ (ಈಗಾಗಲೇ 1 ವರ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು ವಯಸ್ಸು)", "next": "r_registration_late"}
      ]
    },
    "q_sibling_count": {
      "type": "question",
      "text_en": "How many girls from this family are already enrolled in Bhagya Lakshmi?",
      "text_kn": "ಈ ಕುಟುಂಬದಿಂದ ಈಗಾಗಲೇ ಎಷ್ಟು ಹೆಣ್ಣು ಮಕ್ಕಳು ಭಾಗ್ಯಲಕ್ಷ್ಮಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ?",
      "options": [
        {"label": "None or 1", "label_kn": "ಯಾರೂ ಇಲ್ಲ ಅಥವಾ 1", "next": "r_eligible"},
        {"label": "2 or more already enrolled", "label_kn": "2 ಅಥವಾ ಹೆಚ್ಚು ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆ", "next": "r_sibling_limit"}
      ]
    },
    "r_eligible": {
      "type": "result",
      "status": "eligible",
      "reason_en": "Based on your answers, the girl child may be eligible for Bhagya Lakshmi scheme.",
      "reason_kn": "ನಿಮ್ಮ ಉತ್ತರಗಳ ಪ್ರಕಾರ, ಹೆಣ್ಣು ಮಗು ಭಾಗ್ಯಲಕ್ಷ್ಮಿ ಯೋಜನೆಗೆ ಅರ್ಹವಾಗಬಹುದು.",
      "next_steps_en": "Apply online at blakshmi.kar.nic.in within 1 year of birth. Benefits: ₹10,000 bond (matures to ₹34,751 at 18), health insurance up to ₹25,000/year, annual scholarship ₹300-₹1,000. Note: Girl must complete education up to 8th grade and not marry before 18 to receive maturity amount.",
      "next_steps_kn": "ಜನನದ 1 ವರ್ಷದೊಳಗೆ blakshmi.kar.nic.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
      "documents": ["Birth Certificate", "BPL Card / Ration Card", "Parent Aadhaar Cards", "Hospital Discharge Summary", "Bank Account Details"]
    },
    "r_not_resident": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Bhagya Lakshmi is only for Karnataka resident families.",
      "reason_kn": "ಭಾಗ್ಯಲಕ್ಷ್ಮಿ ಕೇವಲ ಕರ್ನಾಟಕ ನಿವಾಸಿ ಕುಟುಂಬಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Check similar girl child welfare schemes in your home state."
    },
    "r_not_bpl": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Bhagya Lakshmi is only for Below Poverty Line (BPL) families.",
      "reason_kn": "ಭಾಗ್ಯಲಕ್ಷ್ಮಿ ಕೇವಲ ಬಡತನ ರೇಖೆಗಿಂತ ಕೆಳಗಿನ (BPL) ಕುಟುಂಬಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "This scheme targets economically weaker families. Check other education and child welfare schemes."
    },
    "r_birth_date_old": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Bhagya Lakshmi only covers girls born after March 31, 2006.",
      "reason_kn": "ಭಾಗ್ಯಲಕ್ಷ್ಮಿ ಮಾರ್ಚ್ 31, 2006 ನಂತರ ಜನಿಸಿದ ಹೆಣ್ಣು ಮಕ್ಕಳನ್ನು ಮಾತ್ರ ಒಳಗೊಳ್ಳುತ್ತದೆ.",
      "fix_en": "Check other education scholarships and welfare schemes for the girl child."
    },
    "r_registration_late": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Registration must be done within 1 year of the girl child''s birth.",
      "reason_kn": "ಹೆಣ್ಣು ಮಗುವಿನ ಜನನದ 1 ವರ್ಷದೊಳಗೆ ನೋಂದಣಿ ಮಾಡಬೇಕು.",
      "fix_en": "Unfortunately, the registration window has passed. Check other education scholarships like Vidyasiri for older children."
    },
    "r_sibling_limit": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Maximum 2 girl children per family can be enrolled in Bhagya Lakshmi.",
      "reason_kn": "ಪ್ರತಿ ಕುಟುಂಬದಿಂದ ಗರಿಷ್ಠ 2 ಹೆಣ್ಣು ಮಕ್ಕಳನ್ನು ಭಾಗ್ಯಲಕ್ಷ್ಮಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಬಹುದು.",
      "fix_en": "Two girls from the family are already enrolled. Check other scholarships and education schemes for additional children."
    }
  }
}'::jsonb
FROM scheme;


-- 7. VIDYASIRI SCHOLARSHIP Decision Tree
-- Based on: https://bcwd.karnataka.gov.in/info-2/Scholarships/Vidyasiri/en
WITH scheme AS (SELECT id FROM schemes WHERE slug = 'vidyasiri')
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT scheme.id, 1, true, '{
  "start": "q_resident",
  "nodes": {
    "q_resident": {
      "type": "question",
      "text_en": "Are you a permanent resident of Karnataka?",
      "text_kn": "ನೀವು ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_category"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
      ]
    },
    "q_category": {
      "type": "question",
      "text_en": "Which category do you belong to?",
      "text_kn": "ನೀವು ಯಾವ ವರ್ಗಕ್ಕೆ ಸೇರಿದವರು?",
      "options": [
        {"label": "SC/ST", "label_kn": "SC/ST", "next": "q_course"},
        {"label": "OBC / Backward Class", "label_kn": "OBC / ಹಿಂದುಳಿದ ವರ್ಗ", "next": "q_course"},
        {"label": "Minority", "label_kn": "ಅಲ್ಪಸಂಖ್ಯಾತ", "next": "q_course"},
        {"label": "General (unreserved)", "label_kn": "ಸಾಮಾನ್ಯ (ಮೀಸಲಿಲ್ಲದ)", "next": "r_not_eligible_category"}
      ]
    },
    "q_course": {
      "type": "question",
      "text_en": "What course are you pursuing?",
      "text_kn": "ನೀವು ಯಾವ ಕೋರ್ಸ್ ಮಾಡುತ್ತಿದ್ದೀರಿ?",
      "options": [
        {"label": "Post-matric (after 10th) - Degree/Diploma/PG", "label_kn": "ಮ್ಯಾಟ್ರಿಕ್ ನಂತರ (10ನೇ ನಂತರ) - ಪದವಿ/ಡಿಪ್ಲೊಮಾ/PG", "next": "q_income"},
        {"label": "Pre-matric (up to 10th)", "label_kn": "ಮ್ಯಾಟ್ರಿಕ್ ಪೂರ್ವ (10ನೇ ವರೆಗೆ)", "next": "r_pre_matric"}
      ]
    },
    "q_income": {
      "type": "question",
      "text_en": "What is your family''s annual income?",
      "text_kn": "ನಿಮ್ಮ ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ಎಷ್ಟು?",
      "options": [
        {"label": "₹1 lakh to ₹2.5 lakh", "label_kn": "₹1 ಲಕ್ಷ ರಿಂದ ₹2.5 ಲಕ್ಷ", "next": "q_distance"},
        {"label": "Below ₹1 lakh", "label_kn": "₹1 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ", "next": "r_income_low"},
        {"label": "Above ₹2.5 lakh", "label_kn": "₹2.5 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು", "next": "r_income_high"}
      ]
    },
    "q_distance": {
      "type": "question",
      "text_en": "How far is your residence from your college?",
      "text_kn": "ನಿಮ್ಮ ವಾಸಸ್ಥಳ ಕಾಲೇಜಿನಿಂದ ಎಷ್ಟು ದೂರದಲ್ಲಿದೆ?",
      "options": [
        {"label": "5 km or more", "label_kn": "5 ಕಿ.ಮೀ ಅಥವಾ ಹೆಚ್ಚು", "next": "q_hostel"},
        {"label": "In different city/town", "label_kn": "ಬೇರೆ ನಗರ/ಪಟ್ಟಣದಲ್ಲಿ", "next": "q_hostel"},
        {"label": "Less than 5 km (same area)", "label_kn": "5 ಕಿ.ಮೀ ಗಿಂತ ಕಡಿಮೆ (ಅದೇ ಪ್ರದೇಶ)", "next": "r_distance_short"}
      ]
    },
    "q_hostel": {
      "type": "question",
      "text_en": "Are you staying in a government or department hostel?",
      "text_kn": "ನೀವು ಸರ್ಕಾರಿ ಅಥವಾ ಇಲಾಖೆ ಹಾಸ್ಟೆಲ್‌ನಲ್ಲಿ ಇದ್ದೀರಾ?",
      "options": [
        {"label": "No, private accommodation", "label_kn": "ಇಲ್ಲ, ಖಾಸಗಿ ವಸತಿ", "next": "q_gender"},
        {"label": "Yes, government hostel", "label_kn": "ಹೌದು, ಸರ್ಕಾರಿ ಹಾಸ್ಟೆಲ್", "next": "r_govt_hostel"}
      ]
    },
    "q_gender": {
      "type": "question",
      "text_en": "What is your gender?",
      "text_kn": "ನಿಮ್ಮ ಲಿಂಗ ಯಾವುದು?",
      "options": [
        {"label": "Female", "label_kn": "ಮಹಿಳೆ", "next": "r_eligible"},
        {"label": "Male", "label_kn": "ಪುರುಷ", "next": "q_male_sibling"}
      ]
    },
    "q_male_sibling": {
      "type": "question",
      "text_en": "How many male students from your family are receiving Vidyasiri?",
      "text_kn": "ನಿಮ್ಮ ಕುಟುಂಬದಿಂದ ಎಷ್ಟು ಗಂಡು ವಿದ್ಯಾರ್ಥಿಗಳು ವಿದ್ಯಾಸಿರಿ ಪಡೆಯುತ್ತಿದ್ದಾರೆ?",
      "options": [
        {"label": "None or 1", "label_kn": "ಯಾರೂ ಇಲ್ಲ ಅಥವಾ 1", "next": "r_eligible"},
        {"label": "2 or more", "label_kn": "2 ಅಥವಾ ಹೆಚ್ಚು", "next": "r_male_limit"}
      ]
    },
    "r_eligible": {
      "type": "result",
      "status": "eligible",
      "reason_en": "Based on your answers, you may be eligible for Vidyasiri Scholarship.",
      "reason_kn": "ನಿಮ್ಮ ಉತ್ತರಗಳ ಪ್ರಕಾರ, ನೀವು ವಿದ್ಯಾಸಿರಿ ಸ್ಕಾಲರ್‌ಶಿಪ್‌ಗೆ ಅರ್ಹರಾಗಬಹುದು.",
      "next_steps_en": "Apply online at ssp.postmatric.karnataka.gov.in. Submit application to your college. Benefits: ₹1,500/month for 10 months (₹15,000/year). Maintain 75% attendance. Pass annual exams.",
      "next_steps_kn": "ssp.postmatric.karnataka.gov.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. ನಿಮ್ಮ ಕಾಲೇಜಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
      "documents": ["SSLC Marks Card", "Caste Certificate", "Income Certificate", "Aadhaar Card", "Ration Card", "College Admission Receipt", "Bank Account Details", "Passport Photo"]
    },
    "r_not_resident": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Vidyasiri is only for permanent Karnataka residents.",
      "reason_kn": "ವಿದ್ಯಾಸಿರಿ ಕೇವಲ ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Check post-matric scholarships from your home state''s backward classes department."
    },
    "r_not_eligible_category": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Vidyasiri is only for SC/ST/OBC/Minority category students.",
      "reason_kn": "ವಿದ್ಯಾಸಿರಿ ಕೇವಲ SC/ST/OBC/ಅಲ್ಪಸಂಖ್ಯಾತ ವರ್ಗದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Check other merit-based scholarships from the education department."
    },
    "r_pre_matric": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Vidyasiri is a post-matric scholarship for students after 10th standard.",
      "reason_kn": "ವಿದ್ಯಾಸಿರಿ 10ನೇ ತರಗತಿಯ ನಂತರದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮ್ಯಾಟ್ರಿಕ್ ನಂತರದ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಆಗಿದೆ.",
      "fix_en": "Check pre-matric scholarships from the same department for students up to 10th standard."
    },
    "r_income_low": {
      "type": "result",
      "status": "needs_review",
      "reason_en": "Your income seems below the minimum threshold. You may qualify for different scholarships.",
      "reason_kn": "ನಿಮ್ಮ ಆದಾಯ ಕನಿಷ್ಠ ಮಿತಿಗಿಂತ ಕಡಿಮೆಯಾಗಿದೆ. ನೀವು ಬೇರೆ ಸ್ಕಾಲರ್‌ಶಿಪ್‌ಗಳಿಗೆ ಅರ್ಹರಾಗಬಹುದು.",
      "fix_en": "Check Ambedkar Scholarship or other schemes for lower income families, which may offer higher benefits."
    },
    "r_income_high": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Family income must be between ₹1 lakh and ₹2.5 lakh for Vidyasiri.",
      "reason_kn": "ವಿದ್ಯಾಸಿರಿಗೆ ಕುಟುಂಬದ ಆದಾಯ ₹1 ಲಕ್ಷ ಮತ್ತು ₹2.5 ಲಕ್ಷದ ನಡುವೆ ಇರಬೇಕು.",
      "fix_en": "Your family income exceeds the limit. Check merit-based scholarships or education loans."
    },
    "r_distance_short": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "You must reside at least 5 km from your college OR in a different city to qualify for this food/accommodation scholarship.",
      "reason_kn": "ಈ ಆಹಾರ/ವಸತಿ ಸ್ಕಾಲರ್‌ಶಿಪ್‌ಗೆ ಅರ್ಹತೆ ಪಡೆಯಲು ನಿಮ್ಮ ಕಾಲೇಜಿನಿಂದ ಕನಿಷ್ಠ 5 ಕಿ.ಮೀ ದೂರದಲ್ಲಿ ಅಥವಾ ಬೇರೆ ನಗರದಲ್ಲಿ ವಾಸಿಸಬೇಕು.",
      "fix_en": "Since you live close to college, check other non-hostel scholarships."
    },
    "r_govt_hostel": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Students in government/departmental hostels already receive accommodation, so they cannot avail Vidyasiri.",
      "reason_kn": "ಸರ್ಕಾರಿ/ಇಲಾಖೆ ಹಾಸ್ಟೆಲ್‌ಗಳಲ್ಲಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳು ಈಗಾಗಲೇ ವಸತಿ ಪಡೆಯುತ್ತಿದ್ದಾರೆ, ಆದ್ದರಿಂದ ವಿದ್ಯಾಸಿರಿ ಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ.",
      "fix_en": "You are already receiving government accommodation benefits."
    },
    "r_male_limit": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Maximum 2 male students per family can receive Vidyasiri. This limit does not apply to female students.",
      "reason_kn": "ಪ್ರತಿ ಕುಟುಂಬದಿಂದ ಗರಿಷ್ಠ 2 ಗಂಡು ವಿದ್ಯಾರ್ಥಿಗಳು ವಿದ್ಯಾಸಿರಿ ಪಡೆಯಬಹುದು. ಈ ಮಿತಿ ಹೆಣ್ಣು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಅನ್ವಯಿಸುವುದಿಲ್ಲ.",
      "fix_en": "Two male members of your family are already receiving this scholarship. Check other education schemes."
    }
  }
}'::jsonb
FROM scheme;


-- 8. RAITHA SHAKTI Decision Tree
-- Based on: https://fruits.karnataka.gov.in/
WITH scheme AS (SELECT id FROM schemes WHERE slug = 'raitha-shakti')
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT scheme.id, 1, true, '{
  "start": "q_resident",
  "nodes": {
    "q_resident": {
      "type": "question",
      "text_en": "Are you a permanent resident of Karnataka?",
      "text_kn": "ನೀವು ಕರ್ನಾಟಕದ ಖಾಯಂ ನಿವಾಸಿಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_farmer"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
      ]
    },
    "q_farmer": {
      "type": "question",
      "text_en": "Are you a farmer with agricultural land?",
      "text_kn": "ನೀವು ಕೃಷಿ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತರೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_land_size"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_farmer"}
      ]
    },
    "q_land_size": {
      "type": "question",
      "text_en": "How much agricultural land do you own?",
      "text_kn": "ನಿಮ್ಮ ಬಳಿ ಎಷ್ಟು ಕೃಷಿ ಭೂಮಿ ಇದೆ?",
      "options": [
        {"label": "Up to 5 acres (8 bigha)", "label_kn": "5 ಎಕರೆ (8 ಬಿಘಾ) ವರೆಗೆ", "next": "q_fruits_registered"},
        {"label": "More than 5 acres", "label_kn": "5 ಎಕರೆಗಿಂತ ಹೆಚ್ಚು", "next": "r_land_over_limit"}
      ]
    },
    "q_fruits_registered": {
      "type": "question",
      "text_en": "Are you registered on the FRUITS (Farmer Registration and Unified Beneficiary Information System) portal?",
      "text_kn": "ನೀವು FRUITS (ರೈತ ನೋಂದಣಿ ಮತ್ತು ಏಕೀಕೃತ ಫಲಾನುಭವಿ ಮಾಹಿತಿ ವ್ಯವಸ್ಥೆ) ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?",
      "options": [
        {"label": "Yes, registered", "label_kn": "ಹೌದು, ನೋಂದಾಯಿಸಲಾಗಿದೆ", "next": "q_land_documents"},
        {"label": "No, not registered", "label_kn": "ಇಲ್ಲ, ನೋಂದಾಯಿಸಿಲ್ಲ", "next": "r_not_registered"}
      ]
    },
    "q_land_documents": {
      "type": "question",
      "text_en": "Do you have land ownership documents (RTC, land records)?",
      "text_kn": "ನಿಮ್ಮ ಬಳಿ ಭೂಮಿ ಮಾಲೀಕತ್ವ ದಾಖಲೆಗಳು (RTC, ಭೂದಾಖಲೆಗಳು) ಇವೆಯೇ?",
      "options": [
        {"label": "Yes", "label_kn": "ಹೌದು", "next": "r_eligible"},
        {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_no_documents"}
      ]
    },
    "r_eligible": {
      "type": "result",
      "status": "eligible",
      "reason_en": "Based on your answers, you may be eligible for Raitha Shakti diesel subsidy.",
      "reason_kn": "ನಿಮ್ಮ ಉತ್ತರಗಳ ಪ್ರಕಾರ, ನೀವು ರೈತ ಶಕ್ತಿ ಡೀಸೆಲ್ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಹರಾಗಬಹುದು.",
      "next_steps_en": "Ensure your FRUITS registration is complete at fruits.karnataka.gov.in. Upload land documents. Benefits: ₹250 per acre (max 5 acres = ₹1,250) diesel subsidy via DBT to your bank account.",
      "next_steps_kn": "fruits.karnataka.gov.in ನಲ್ಲಿ ನಿಮ್ಮ FRUITS ನೋಂದಣಿ ಪೂರ್ಣವಾಗಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ. ಭೂದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      "documents": ["Aadhaar Card", "Land Records (RTC)", "Bank Account Details", "FRUITS Registration ID"]
    },
    "r_not_resident": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Raitha Shakti is only for Karnataka resident farmers.",
      "reason_kn": "ರೈತ ಶಕ್ತಿ ಕೇವಲ ಕರ್ನಾಟಕ ನಿವಾಸಿ ರೈತರಿಗೆ ಮಾತ್ರ.",
      "fix_en": "Check farmer welfare schemes in your home state."
    },
    "r_not_farmer": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Raitha Shakti is only for farmers with agricultural land.",
      "reason_kn": "ರೈತ ಶಕ್ತಿ ಕೇವಲ ಕೃಷಿ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತರಿಗೆ ಮಾತ್ರ.",
      "fix_en": "This scheme is for farmers. Check other welfare schemes you may qualify for."
    },
    "r_land_over_limit": {
      "type": "result",
      "status": "needs_review",
      "reason_en": "Diesel subsidy is calculated only for up to 5 acres of land.",
      "reason_kn": "ಡೀಸೆಲ್ ಸಬ್ಸಿಡಿಯನ್ನು 5 ಎಕರೆ ಭೂಮಿಗೆ ಮಾತ್ರ ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗುತ್ತದೆ.",
      "fix_en": "You can still receive the subsidy, but only for 5 acres (₹1,250 maximum). Register on FRUITS portal.",
      "fix_kn": "ನೀವು ಇನ್ನೂ ಸಬ್ಸಿಡಿ ಪಡೆಯಬಹುದು, ಆದರೆ ಕೇವಲ 5 ಎಕರೆಗೆ (ಗರಿಷ್ಠ ₹1,250). FRUITS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ."
    },
    "r_not_registered": {
      "type": "result",
      "status": "needs_review",
      "reason_en": "You must be registered on the FRUITS portal to receive Raitha Shakti benefits.",
      "reason_kn": "ರೈತ ಶಕ್ತಿ ಸೌಲಭ್ಯಗಳನ್ನು ಪಡೆಯಲು ನೀವು FRUITS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಬೇಕು.",
      "fix_en": "Register on fruits.karnataka.gov.in with your Aadhaar, land records, and bank details. Registration is free.",
      "fix_kn": "fruits.karnataka.gov.in ನಲ್ಲಿ ನಿಮ್ಮ ಆಧಾರ್, ಭೂದಾಖಲೆಗಳು ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳೊಂದಿಗೆ ನೋಂದಾಯಿಸಿ. ನೋಂದಣಿ ಉಚಿತ."
    },
    "r_no_documents": {
      "type": "result",
      "status": "needs_review",
      "reason_en": "Land ownership documents are required to verify your eligibility.",
      "reason_kn": "ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಭೂಮಿ ಮಾಲೀಕತ್ವ ದಾಖಲೆಗಳು ಅಗತ್ಯವಿದೆ.",
      "fix_en": "Obtain RTC (Record of Rights, Tenancy and Crops) from your local Tahsildar office or bhoomi.karnataka.gov.in portal."
    }
  }
}'::jsonb
FROM scheme;


-- ============================================================================
-- VERIFICATION QUERY (run to check data integrity)
-- ============================================================================
-- SELECT
--   s.slug,
--   s.name_en,
--   dt.is_active,
--   dt.version,
--   jsonb_array_length(dt.tree->'nodes') as node_count
-- FROM schemes s
-- LEFT JOIN decision_trees dt ON s.id = dt.scheme_id
-- ORDER BY s.slug;
