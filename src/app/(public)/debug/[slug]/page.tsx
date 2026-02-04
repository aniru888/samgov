import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageContainer } from "@/components/layout"
import { Wizard } from "@/components/debugger"

interface DebugPageProps {
  params: Promise<{
    slug: string
  }>
}

// Fetch scheme data server-side
async function getScheme(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("schemes")
    .select("id, slug, name_en, name_kn")
    .eq("slug", slug)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function DebugPage({ params }: DebugPageProps) {
  const { slug } = await params
  const scheme = await getScheme(slug)

  if (!scheme) {
    notFound()
  }

  return (
    <PageContainer className="py-4">
      <Wizard
        schemeSlug={scheme.slug}
        schemeName={scheme.name_en}
      />
    </PageContainer>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: DebugPageProps) {
  const { slug } = await params
  const scheme = await getScheme(slug)

  if (!scheme) {
    return {
      title: "Scheme Not Found | SamGov",
    }
  }

  return {
    title: `Check Eligibility - ${scheme.name_en} | SamGov`,
    description: `Check if you may be eligible for the ${scheme.name_en} scheme. This tool helps you understand basic eligibility criteria.`,
  }
}
