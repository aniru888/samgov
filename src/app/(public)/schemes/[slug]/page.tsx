import { createClient } from "@/lib/supabase/server";
import { Scheme } from "@/types/scheme";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SchemeDetailClient } from "@/components/scheme";

// Revalidate every hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getScheme(slug: string): Promise<Scheme | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching scheme:", error);
    return null;
  }

  return data;
}

async function hasDecisionTree(schemeId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decision_trees")
    .select("id")
    .eq("scheme_id", schemeId)
    .eq("is_active", true)
    .limit(1);

  if (error) return false;
  return (data?.length ?? 0) > 0;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scheme = await getScheme(slug);

  if (!scheme) {
    return {
      title: "Scheme Not Found | SamGov",
    };
  }

  return {
    title: `${scheme.name_en} | SamGov`,
    description:
      scheme.eligibility_summary ||
      `Learn about ${scheme.name_en} eligibility and benefits.`,
  };
}

export default async function SchemePage({ params }: PageProps) {
  const { slug } = await params;
  const scheme = await getScheme(slug);

  if (!scheme) {
    notFound();
  }

  const hasTree = await hasDecisionTree(scheme.id);

  return <SchemeDetailClient scheme={scheme} hasDecisionTree={hasTree} />;
}
