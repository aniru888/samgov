import { createClient } from "@/lib/supabase/server";
import { Scheme } from "@/types/scheme";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SchemeDetailClient } from "@/components/scheme";
import { extractFAQFromTree, generateFAQJsonLd } from "@/lib/rules-engine/faq-extractor";
import type { DecisionTree } from "@/lib/rules-engine/types";

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

async function getDecisionTree(
  schemeId: string
): Promise<{ hasTree: boolean; tree: DecisionTree | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decision_trees")
    .select("id, tree")
    .eq("scheme_id", schemeId)
    .eq("is_active", true)
    .limit(1);

  if (error || !data || data.length === 0) {
    return { hasTree: false, tree: null };
  }

  return { hasTree: true, tree: data[0].tree as DecisionTree };
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

  const { hasTree, tree } = await getDecisionTree(scheme.id);

  // Extract FAQs from decision tree for SEO
  const faqs = tree ? extractFAQFromTree(tree, scheme.name_en) : [];
  const faqJsonLd = faqs.length > 0 ? generateFAQJsonLd(faqs) : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <SchemeDetailClient
        scheme={scheme}
        hasDecisionTree={hasTree}
        faqs={faqs}
      />
    </>
  );
}
