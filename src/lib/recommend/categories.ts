/**
 * Scheme Categories
 * Taxonomy for categorizing and filtering government schemes
 */

export interface SchemeCategory {
  id: string;
  label_en: string;
  label_kn: string;
  icon: string; // Lucide icon name
}

export const SCHEME_CATEGORIES: SchemeCategory[] = [
  { id: "education", label_en: "Education", label_kn: "ಶಿಕ್ಷಣ", icon: "GraduationCap" },
  { id: "health", label_en: "Health", label_kn: "ಆರೋಗ್ಯ", icon: "Heart" },
  { id: "housing", label_en: "Housing", label_kn: "ವಸತಿ", icon: "Home" },
  { id: "employment", label_en: "Employment", label_kn: "ಉದ್ಯೋಗ", icon: "Briefcase" },
  { id: "agriculture", label_en: "Agriculture", label_kn: "ಕೃಷಿ", icon: "Wheat" },
  { id: "women_children", label_en: "Women & Children", label_kn: "ಮಹಿಳೆ ಮತ್ತು ಮಕ್ಕಳು", icon: "Users" },
  { id: "social_welfare", label_en: "Social Welfare", label_kn: "ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣ", icon: "HeartHandshake" },
  { id: "food_security", label_en: "Food Security", label_kn: "ಆಹಾರ ಭದ್ರತೆ", icon: "Wheat" },
  { id: "financial", label_en: "Financial", label_kn: "ಆರ್ಥಿಕ", icon: "Wallet" },
  { id: "transport", label_en: "Transport", label_kn: "ಸಾರಿಗೆ", icon: "Bus" },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): SchemeCategory | undefined {
  return SCHEME_CATEGORIES.find((c) => c.id === id);
}

/**
 * Get category label in the given language
 */
export function getCategoryLabel(id: string, language: "en" | "kn" = "en"): string {
  const category = getCategoryById(id);
  if (!category) return id;
  return language === "kn" ? category.label_kn : category.label_en;
}
