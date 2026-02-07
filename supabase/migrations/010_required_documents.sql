-- Migration 010: Add required_documents column to schemes
-- Stores an array of document names citizens need to gather before applying

ALTER TABLE schemes
ADD COLUMN IF NOT EXISTS required_documents TEXT[];

-- === KARNATAKA STATE SCHEMES ===

-- 5 Guarantee Schemes
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'BPL/APL Ration Card', 'Bank Passbook (in woman''s name)', 'Passport-size Photograph'] WHERE slug = 'gruha-lakshmi';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Degree/Diploma Certificate', 'College ID Card', 'Bank Passbook', 'Income Certificate', 'Passport-size Photograph'] WHERE slug = 'yuva-nidhi';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Electricity Bill (BESCOM/HESCOM/GESCOM/MESCOM/CESC)', 'Ration Card'] WHERE slug = 'gruha-jyothi';
UPDATE schemes SET required_documents = ARRAY['BPL Ration Card (AAY/PHH)', 'Aadhaar Card'] WHERE slug = 'anna-bhagya';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Shakti Smart Card (issued at bus depot)'] WHERE slug = 'shakti-free-bus';

-- Women & Children
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card (parent)', 'BPL Ration Card', 'Birth Certificate (girl child)', 'Income Certificate (below Rs. 1 lakh)', 'Bank Passbook', 'Hospital Discharge Summary'] WHERE slug = 'bhagyalakshmi';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'BPL Ration Card', 'Thayi Bhagya Card', 'Hospital Registration'] WHERE slug = 'thayi-bhagya';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Thayi Bhagya Card', 'Hospital Admission Record'] WHERE slug = 'madilu-kit';

-- Agriculture
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Bank Loan Account Details', 'Land Records (RTC)', 'Ration Card'] WHERE slug = 'farm-loan-waiver';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST)', 'Land Records (RTC, minimum 1 acre dry / 0.5 acre irrigated)', 'Income Certificate', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'ganga-kalyana';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Land Records (RTC, minimum 0.5 acres)', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'krushi-aranya-protsaha';

-- Education
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST)', 'Income Certificate (below Rs. 2.5 lakh)', 'College Admission Letter', 'Previous Year Marks Card', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'vidyasiri';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Minority Community Certificate', 'Income Certificate (below Rs. 2.5 lakh)', 'College Admission Letter', 'Previous Year Marks Card', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'arivu-education-loan';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Minority Community Certificate', 'Income Certificate (below Rs. 2.5 lakh)', 'Foreign University Admission Letter', 'Passport', 'Previous Degree Certificate', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'overseas-education-loan';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST)', 'Foreign University Admission Letter', 'Passport', 'Academic Records', 'Income Certificate', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'prabhuddha-overseas-scholarship';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'BPL Ration Card or Income Certificate', 'College ID Card', 'Previous Year Marks Card', 'Passport-size Photograph'] WHERE slug = 'free-laptop-scheme';

-- Self-Employment & Livelihood
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST/OBC) or Minority Certificate', 'Income Certificate (below Rs. 1.5-2 lakh)', 'Business Project Proposal', 'Bank Passbook', 'Passport-size Photograph', 'Age Proof'] WHERE slug = 'udyogini';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST)', 'Income Certificate (below Rs. 1 lakh)', 'Business/Project Proposal', 'Bank Passbook', 'Passport-size Photograph', 'Age Proof'] WHERE slug = 'self-employment-scheme';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Income Certificate (below Rs. 1.5 lakh)', 'Business/Project Proposal', 'Bank Passbook', 'Passport-size Photograph', 'Age Proof'] WHERE slug = 'shrama-shakthi-loan';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (Backward Classes)', 'Income Certificate (below Rs. 1 lakh)', 'Driving License', 'Bank Passbook', 'Passport-size Photograph', 'Age Proof'] WHERE slug = 'swavalambi-sarathi';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Minority Community Certificate', 'Income Certificate (below Rs. 2 lakh)', 'Business Project Proposal', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'direct-loan-business';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Income Certificate (below Rs. 1.5 lakh)', 'Business/Project Proposal', 'Bank Passbook', 'Passport-size Photograph', 'Age Proof'] WHERE slug = 'vrutti-protsaha-loan';

-- Social Welfare
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC)', 'Income Certificate (below Rs. 1 lakh)', 'Marriage Invitation/Certificate', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'sc-marriage-assistance';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST)', 'FIR Copy (under SC/ST POA Act)', 'Medical Report (if applicable)', 'Bank Passbook'] WHERE slug = 'santwana-scheme';

-- Health
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card'] WHERE slug = 'gruha-arogya-yojana';
UPDATE schemes SET required_documents = ARRAY['KSRTC Employee ID Card', 'Aadhaar Card'] WHERE slug = 'ksrtc-arogya';

-- Housing
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST)', 'Income Certificate (below Rs. 32,000 rural / Rs. 42,000 urban)', 'Land Ownership Document or No-House Certificate', 'BPL Ration Card', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'ambedkar-housing';

-- Skill Development
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', '8th Class Pass Certificate', 'Age Proof (18-35 years)', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'community-based-training';

-- Sericulture
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Reeling Unit Registration', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'sericulture-incentive';

-- Minority SHG
UPDATE schemes SET required_documents = ARRAY['SHG Registration Certificate', 'Minority Community Certificates (majority members)', 'Bank Passbook (SHG account)', 'Activity/Project Proposal', 'Meeting Minutes'] WHERE slug = 'minority-shg-subsidy';

-- Legal Stipend
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST)', 'LLB Degree Certificate', 'Bar Council Registration', 'Apprenticeship Certificate from Senior Advocate', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'law-graduate-stipend';

-- Labour
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'BPL Ration Card', 'Labour Department Registration Card', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'ambedkar-karmika-sahaya';

-- === CENTRAL SCHEMES ===

UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Land Records (Khatian/RTC)', 'Bank Passbook', 'Declaration Form'] WHERE slug = 'pm-kisan';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Income Certificate (EWS/LIG/MIG)', 'Property Documents or Allotment Letter', 'Bank Passbook', 'Passport-size Photograph', 'Affidavit (no pucca house owned)'] WHERE slug = 'pmay-urban';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'SECC 2011 Inclusion (verified by Gram Sabha)', 'Bank Passbook', 'Land Document or No-House Certificate', 'Passport-size Photograph'] WHERE slug = 'pmay-gramin';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Ration Card', 'SECC 2011 Data / Ayushman Card'] WHERE slug = 'ayushman-bharat';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Bank Passbook (savings account)', 'Mobile Number linked to Aadhaar'] WHERE slug = 'atal-pension-yojana';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Business Plan/Proposal', 'Identity Proof', 'Address Proof', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'pm-mudra-yojana';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card or any valid ID', 'Address Proof', 'Passport-size Photograph'] WHERE slug = 'pmjdy';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card (parent/guardian)', 'Birth Certificate (girl child)', 'Address Proof', 'Passport-size Photograph'] WHERE slug = 'sukanya-samriddhi';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'BPL Ration Card', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'pm-ujjwala';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Age Proof', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'pm-kaushal-vikas';
UPDATE schemes SET required_documents = ARRAY['Ration Card (AAY/PHH)', 'Aadhaar Card'] WHERE slug = 'nfsa-ration';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Bank Passbook', 'MCP Card (Mother and Child Protection)', 'Pregnancy Registration at Anganwadi'] WHERE slug = 'pm-matru-vandana';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Certificate of Vending / Letter of Recommendation from ULB', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'pm-svanidhi';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'PAN Card', 'Bank Passbook', 'Passport-size Photograph'] WHERE slug = 'national-pension-scheme';
UPDATE schemes SET required_documents = ARRAY['Aadhaar Card', 'Caste Certificate (SC/ST) or Gender Proof (for women)', 'Business Plan/Proposal', 'Bank Passbook', 'Address Proof', 'Passport-size Photograph'] WHERE slug = 'standup-india';
