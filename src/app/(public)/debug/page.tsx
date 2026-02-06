import { createClient } from "@/lib/supabase/server"
import { PageContainer } from "@/components/layout"
import { DebugSchemeList } from "@/components/debugger/debug-scheme-list"

export const metadata = {
  title: "Check Eligibility | SamGov",
  description:
    "Select a Karnataka welfare scheme to check your eligibility using our interactive debugger.",
}

async function getSchemesWithTrees() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("decision_trees")
    .select("scheme_id, schemes(id, slug, name_en, name_kn, department)")
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching schemes with trees:", error)
    return []
  }

  // Extract unique schemes from the join
  const schemeMap = new Map<string, { id: string; slug: string; name_en: string; name_kn: string | null; department: string | null }>()
  for (const row of data || []) {
    const scheme = row.schemes as unknown as { id: string; slug: string; name_en: string; name_kn: string | null; department: string | null }
    if (scheme && !schemeMap.has(scheme.id)) {
      schemeMap.set(scheme.id, scheme)
    }
  }

  return Array.from(schemeMap.values()).sort((a, b) => a.name_en.localeCompare(b.name_en))
}

export default async function DebugPickerPage() {
  const schemes = await getSchemesWithTrees()

  return (
    <PageContainer className="py-4">
      <DebugSchemeList schemes={schemes} />
    </PageContainer>
  )
}
