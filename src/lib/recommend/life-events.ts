/**
 * Life-event based navigation for scheme discovery
 * Inspired by LifeSG pattern: organize by situations, not departments
 */

export interface LifeEvent {
  id: string;
  icon: string;
  label_en: string;
  label_kn: string;
  query_en: string;
  query_kn: string;
  scheme_slugs: string[];
}

export const LIFE_EVENTS: LifeEvent[] = [
  {
    id: "pregnant",
    icon: "🤰",
    label_en: "I'm pregnant",
    label_kn: "ನಾನು ಗರ್ಭಿಣಿ",
    query_en: "I am pregnant and need maternal health support and delivery assistance",
    query_kn: "ನಾನು ಗರ್ಭಿಣಿ ಮತ್ತು ತಾಯಿ ಆರೋಗ್ಯ ಬೆಂಬಲ ಮತ್ತು ಹೆರಿಗೆ ಸಹಾಯ ಬೇಕು",
    scheme_slugs: ["thayi-bhagya", "madilu-kit", "pm-matru-vandana"],
  },
  {
    id: "new-baby",
    icon: "👶",
    label_en: "I just had a baby girl",
    label_kn: "ನನಗೆ ಹೆಣ್ಣು ಮಗು ಹುಟ್ಟಿದೆ",
    query_en: "I have a newborn girl child and need financial support for her education and future",
    query_kn: "ನನಗೆ ಹೊಸ ಹೆಣ್ಣು ಮಗು ಇದೆ ಮತ್ತು ಶಿಕ್ಷಣ ಮತ್ತು ಭವಿಷ್ಯಕ್ಕೆ ಆರ್ಥಿಕ ಬೆಂಬಲ ಬೇಕು",
    scheme_slugs: ["bhagyalakshmi", "sukanya-samriddhi", "pm-matru-vandana"],
  },
  {
    id: "education",
    icon: "📚",
    label_en: "My child needs education help",
    label_kn: "ನನ್ನ ಮಗುವಿಗೆ ಶಿಕ್ಷಣ ಸಹಾಯ ಬೇಕು",
    query_en: "I need scholarship or education loan for my child studying in college",
    query_kn: "ನನ್ನ ಮಗುವಿಗೆ ಕಾಲೇಜು ಶಿಕ್ಷಣಕ್ಕೆ ವಿದ್ಯಾರ್ಥಿವೇತನ ಅಥವಾ ಶಿಕ್ಷಣ ಸಾಲ ಬೇಕು",
    scheme_slugs: ["vidyasiri", "arivu-education-loan", "free-laptop-scheme"],
  },
  {
    id: "unemployed",
    icon: "💼",
    label_en: "I lost my job / need work",
    label_kn: "ನನಗೆ ಕೆಲಸ ಹೋಯಿತು / ಉದ್ಯೋಗ ಬೇಕು",
    query_en: "I am unemployed and looking for job training or financial support while finding work",
    query_kn: "ನಾನು ನಿರುದ್ಯೋಗಿ ಮತ್ತು ಉದ್ಯೋಗ ತರಬೇತಿ ಅಥವಾ ಆರ್ಥಿಕ ಬೆಂಬಲ ಹುಡುಕುತ್ತಿದ್ದೇನೆ",
    scheme_slugs: ["yuva-nidhi", "pm-kaushal-vikas", "community-based-training"],
  },
  {
    id: "start-business",
    icon: "🏪",
    label_en: "I want to start a business",
    label_kn: "ನಾನು ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೇನೆ",
    query_en: "I want to start a small business and need a loan or subsidy for self-employment",
    query_kn: "ನಾನು ಸಣ್ಣ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಲು ಸಾಲ ಅಥವಾ ಸಬ್ಸಿಡಿ ಬೇಕು",
    scheme_slugs: ["udyogini", "pm-mudra-yojana", "standup-india", "self-employment-scheme"],
  },
  {
    id: "farmer",
    icon: "🌾",
    label_en: "I'm a farmer",
    label_kn: "ನಾನು ರೈತ",
    query_en: "I am a farmer and need support for agriculture irrigation and crop loan",
    query_kn: "ನಾನು ರೈತ ಮತ್ತು ಕೃಷಿ ನೀರಾವರಿ ಮತ್ತು ಬೆಳೆ ಸಾಲಕ್ಕೆ ಬೆಂಬಲ ಬೇಕು",
    scheme_slugs: ["pm-kisan", "ganga-kalyana", "farm-loan-waiver", "krushi-aranya-protsaha"],
  },
  {
    id: "housing",
    icon: "🏠",
    label_en: "I need a house",
    label_kn: "ನನಗೆ ಮನೆ ಬೇಕು",
    query_en: "I need help building or buying a house for my family",
    query_kn: "ನನ್ನ ಕುಟುಂಬಕ್ಕೆ ಮನೆ ಕಟ್ಟಲು ಅಥವಾ ಖರೀದಿಸಲು ಸಹಾಯ ಬೇಕು",
    scheme_slugs: ["ambedkar-housing", "pmay-urban", "pmay-gramin"],
  },
  {
    id: "food",
    icon: "🍚",
    label_en: "I need food / ration",
    label_kn: "ನನಗೆ ಆಹಾರ / ಪಡಿತರ ಬೇಕು",
    query_en: "I need food grains and ration support for my family",
    query_kn: "ನನ್ನ ಕುಟುಂಬಕ್ಕೆ ಆಹಾರ ಧಾನ್ಯ ಮತ್ತು ಪಡಿತರ ಬೆಂಬಲ ಬೇಕು",
    scheme_slugs: ["anna-bhagya", "nfsa-ration"],
  },
  {
    id: "health",
    icon: "🏥",
    label_en: "I need health insurance",
    label_kn: "ನನಗೆ ಆರೋಗ್ಯ ವಿಮೆ ಬೇಕು",
    query_en: "I need health insurance and medical treatment support for my family",
    query_kn: "ನನ್ನ ಕುಟುಂಬಕ್ಕೆ ಆರೋಗ್ಯ ವಿಮೆ ಮತ್ತು ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ಬೆಂಬಲ ಬೇಕು",
    scheme_slugs: ["ayushman-bharat", "gruha-arogya-yojana"],
  },
];
