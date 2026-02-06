import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { ExploreClient } from "./explore-client";

export const metadata: Metadata = {
  title: "Find Schemes For You | SamGov Karnataka",
  description:
    "Describe your situation to find Karnataka welfare schemes you may qualify for. AI-powered scheme recommendations.",
};

async function getDecisionTreeSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decision_trees")
    .select("schemes!inner(slug)")
    .eq("is_active", true);

  if (error) {
    console.error("Failed to fetch decision tree slugs:", error);
    return [];
  }

  return (data || []).map((row) => {
    const schemes = row.schemes as unknown as { slug: string } | { slug: string }[];
    if (Array.isArray(schemes)) return schemes[0]?.slug;
    return schemes?.slug;
  }).filter(Boolean) as string[];
}

export default async function ExplorePage() {
  const slugs = await getDecisionTreeSlugs();
  return <ExploreClient decisionTreeSlugs={slugs} />;
}
