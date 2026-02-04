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
  created_at: string;
  updated_at: string;
}
