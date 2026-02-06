export interface SchemeSource {
  url: string;
  type: "official" | "secondary";
  title: string;
  used_for: string;
}

export interface SchemeHelpline {
  phone?: string[];
  email?: string;
}

export interface Scheme {
  id: string;
  slug: string;
  name_en: string;
  name_kn: string | null;
  department: string | null;
  eligibility_summary: string | null;
  benefits_summary: string | null;
  application_url: string | null;
  official_source_url: string | null;
  last_verified_at: string | null;
  sources: SchemeSource[] | null;
  helpline: SchemeHelpline | null;
  created_at: string;
  updated_at: string;
  // Recommendation fields (from migration 009)
  category: string | null;
  tags: string[] | null;
  target_group: string | null;
  benefits_type: string | null;
  scheme_level: "state" | "central" | "both" | null;
  is_active: boolean;
  data_source: string | null;
}
