-- SamGov Seed Data
-- Initial Karnataka welfare schemes with decision trees
-- Last verified: 2026-02-04

-- Clear existing data (for dev reseeding)
TRUNCATE schemes CASCADE;

-- Insert initial schemes
INSERT INTO schemes (slug, name_en, name_kn, department, eligibility_summary, benefits_summary, application_url, official_source_url, last_verified_at) VALUES

-- Gruha Lakshmi - Women household heads
('gruha-lakshmi',
 'Gruha Lakshmi',
 'ಗೃಹ ಲಕ್ಷ್ಮಿ',
 'Women and Child Development',
 'Women who are the head of household (HoH) in BPL/APL families. Must have valid ration card. One woman per household.',
 '₹2,000 per month transferred directly to woman head of household bank account.',
 'https://sevasindhu.karnataka.gov.in/Ede/Department.html',
 'https://sevasindhu.karnataka.gov.in',
 '2026-02-04'),

-- Anna Bhagya - Food security
('anna-bhagya',
 'Anna Bhagya',
 'ಅನ್ನ ಭಾಗ್ಯ',
 'Food and Civil Supplies',
 'BPL families with valid ration card (Antyodaya, BPL Priority, BPL). Must be Karnataka resident.',
 '10 kg rice per person per month at ₹1/kg (up to household limit).',
 'https://ahara.kar.nic.in/',
 'https://ahara.kar.nic.in/',
 '2026-02-04'),

-- Shakti - Free bus travel for women
('shakti',
 'Shakti',
 'ಶಕ್ತಿ',
 'Transport',
 'All women in Karnataka. Must apply for Shakti Smart Card.',
 'Free travel on KSRTC and BMTC buses within Karnataka.',
 'https://shakti.ksrtc.in/',
 'https://shakti.ksrtc.in/',
 '2026-02-04'),

-- Yuva Nidhi - Youth unemployment allowance
('yuva-nidhi',
 'Yuva Nidhi',
 'ಯುವ ನಿಧಿ',
 'Higher Education',
 'Unemployed graduates (degree/diploma) aged 18-25. Family income < ₹6 lakh/year. Must be actively seeking employment.',
 '₹3,000/month for graduates, ₹1,500/month for diploma holders. Max 2 years.',
 'https://sevasindhu.karnataka.gov.in/',
 'https://sevasindhu.karnataka.gov.in/',
 '2026-02-04'),

-- Sandhya Suraksha - Elderly pension
('sandhya-suraksha',
 'Sandhya Suraksha',
 'ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ',
 'Social Welfare',
 'Karnataka residents aged 65+ (60+ for women). BPL status. No government pension.',
 '₹600/month pension for elderly citizens.',
 'https://sevasindhu.karnataka.gov.in/',
 'https://sevasindhu.karnataka.gov.in/',
 '2026-02-04');

-- Insert sample decision tree for Gruha Lakshmi
WITH scheme AS (
  SELECT id FROM schemes WHERE slug = 'gruha-lakshmi'
)
INSERT INTO decision_trees (scheme_id, version, is_active, tree)
SELECT
  scheme.id,
  1,
  true,
  '{
    "start": "q_resident",
    "nodes": {
      "q_resident": {
        "type": "question",
        "text_en": "Are you a resident of Karnataka?",
        "text_kn": "ನೀವು ಕರ್ನಾಟಕದ ನಿವಾಸಿಯೇ?",
        "options": [
          {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_gender"},
          {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_resident"}
        ]
      },
      "q_gender": {
        "type": "question",
        "text_en": "Are you a woman?",
        "text_kn": "ನೀವು ಮಹಿಳೆಯೇ?",
        "options": [
          {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_head_of_household"},
          {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_woman"}
        ]
      },
      "q_head_of_household": {
        "type": "question",
        "text_en": "Are you the head of your household?",
        "text_kn": "ನೀವು ನಿಮ್ಮ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥೆಯೇ?",
        "options": [
          {"label": "Yes", "label_kn": "ಹೌದು", "next": "q_ration_card"},
          {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_not_hoh"}
        ]
      },
      "q_ration_card": {
        "type": "question",
        "text_en": "Do you have a valid ration card (BPL or APL)?",
        "text_kn": "ನಿಮ್ಮ ಬಳಿ ಮಾನ್ಯ ಪಡಿತರ ಚೀಟಿ (BPL ಅಥವಾ APL) ಇದೆಯೇ?",
        "options": [
          {"label": "Yes - BPL", "label_kn": "ಹೌದು - BPL", "next": "q_bank_account"},
          {"label": "Yes - APL", "label_kn": "ಹೌದು - APL", "next": "q_bank_account"},
          {"label": "No", "label_kn": "ಇಲ್ಲ", "next": "r_no_ration_card"}
        ]
      },
      "q_bank_account": {
        "type": "question",
        "text_en": "Do you have a bank account in your name?",
        "text_kn": "ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯೇ?",
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
        "next_steps_en": "Apply on Seva Sindhu portal with ration card, Aadhaar, and bank details.",
        "next_steps_kn": "ಪಡಿತರ ಚೀಟಿ, ಆಧಾರ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳೊಂದಿಗೆ ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
        "documents": ["Ration Card", "Aadhaar Card", "Bank Passbook", "Passport Photo"]
      },
      "r_not_resident": {
        "type": "result",
        "status": "ineligible",
        "reason_en": "Gruha Lakshmi is only available for Karnataka residents.",
        "reason_kn": "ಗೃಹ ಲಕ್ಷ್ಮಿ ಕೇವಲ ಕರ್ನಾಟಕ ನಿವಾಸಿಗಳಿಗೆ ಲಭ್ಯವಿದೆ.",
        "fix_en": "This scheme requires Karnataka residency. Check if your state has similar schemes."
      },
      "r_not_woman": {
        "type": "result",
        "status": "ineligible",
        "reason_en": "Gruha Lakshmi is specifically for women who are heads of household.",
        "reason_kn": "ಗೃಹ ಲಕ್ಷ್ಮಿ ನಿರ್ದಿಷ್ಟವಾಗಿ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥೆಯಾದ ಮಹಿಳೆಯರಿಗೆ ಮಾತ್ರ.",
        "fix_en": "The woman head of your household may be eligible to apply."
      },
      "r_not_hoh": {
        "type": "result",
        "status": "needs_review",
        "reason_en": "You need to be designated as head of household on your ration card.",
        "reason_kn": "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ನೀವು ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರಾಗಿ ನಿಯೋಜಿತರಾಗಬೇಕು.",
        "fix_en": "Visit your local food office to update the head of household on your ration card.",
        "fix_kn": "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರನ್ನು ನವೀಕರಿಸಲು ನಿಮ್ಮ ಸ್ಥಳೀಯ ಆಹಾರ ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡಿ."
      },
      "r_no_ration_card": {
        "type": "result",
        "status": "ineligible",
        "reason_en": "A valid ration card is required for this scheme.",
        "reason_kn": "ಈ ಯೋಜನೆಗೆ ಮಾನ್ಯ ಪಡಿತರ ಚೀಟಿ ಅಗತ್ಯವಿದೆ.",
        "fix_en": "Apply for a ration card at your local food office or through Seva Sindhu."
      },
      "r_no_bank": {
        "type": "result",
        "status": "needs_review",
        "reason_en": "You need a bank account to receive the monthly payment.",
        "reason_kn": "ಮಾಸಿಕ ಪಾವತಿ ಪಡೆಯಲು ನಿಮಗೆ ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಗತ್ಯವಿದೆ.",
        "fix_en": "Open a bank account at any nationalized bank with Aadhaar. Many banks offer zero-balance accounts for women.",
        "fix_kn": "ಆಧಾರ್ ಜೊತೆಗೆ ಯಾವುದೇ ರಾಷ್ಟ್ರೀಕೃತ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ತೆರೆಯಿರಿ."
      },
      "r_duplicate": {
        "type": "result",
        "status": "ineligible",
        "reason_en": "Only one woman per household can receive Gruha Lakshmi.",
        "reason_kn": "ಪ್ರತಿ ಕುಟುಂಬದಿಂದ ಒಬ್ಬ ಮಹಿಳೆ ಮಾತ್ರ ಗೃಹ ಲಕ್ಷ್ಮಿ ಪಡೆಯಬಹುದು.",
        "fix_en": "Only one woman per ration card can receive this benefit. If the current recipient is no longer eligible, contact your local food office."
      }
    }
  }'::jsonb
FROM scheme;
