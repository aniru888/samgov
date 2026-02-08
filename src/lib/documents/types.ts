/**
 * Document preparation guide - provides actionable guidance on how to obtain
 * required documents for government scheme applications in Karnataka.
 */
export interface DocumentGuide {
  /** Canonical document name (English) */
  name_en: string
  /** Kannada document name */
  name_kn: string
  /** Where to obtain this document */
  where_en: string
  where_kn: string
  /** How to apply / process */
  how_en: string
  how_kn: string
  /** Estimated processing time */
  timeline_en: string
  timeline_kn: string
  /** Cost (if any) */
  cost_en: string
  cost_kn: string
  /** Online portal URL (if available) */
  online_url?: string
  /** Online portal name */
  online_portal_en?: string
  online_portal_kn?: string
  /** Additional tips */
  tips_en?: string
  tips_kn?: string
}
