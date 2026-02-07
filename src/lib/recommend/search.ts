/**
 * Scheme Recommendation Search
 * Uses Cohere embeddings + pgvector for semantic scheme matching
 * No Gemini calls - pure vector search
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { generateQueryEmbedding } from "@/lib/rag/embeddings";

export interface RecommendedScheme {
  id: string;
  slug: string;
  name_en: string;
  name_kn: string | null;
  department: string | null;
  category: string | null;
  target_group: string | null;
  benefits_summary: string | null;
  eligibility_summary: string | null;
  application_url: string | null;
  official_source_url: string | null;
  tags: string[] | null;
  scheme_level: string | null;
  data_source: string | null;
  last_verified_at: string | null;
}

export interface RecommendationResult {
  scheme: RecommendedScheme;
  similarity_score: number;
  match_reason: string;
}

export interface RecommendFilters {
  category?: string;
  level?: string;
}

/**
 * Extract keywords from a query for match reason generation
 */
function extractKeywords(query: string): string[] {
  const stopWords = new Set([
    "i", "am", "a", "an", "the", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "can", "shall", "to", "of", "in",
    "for", "on", "with", "at", "by", "from", "as", "into", "through",
    "during", "before", "after", "above", "below", "between", "and", "but",
    "or", "not", "no", "nor", "so", "yet", "both", "either", "neither",
    "each", "every", "all", "any", "few", "more", "most", "other", "some",
    "such", "than", "too", "very", "just", "also", "my", "me", "we", "our",
    "you", "your", "he", "she", "it", "they", "them", "their", "this",
    "that", "these", "those", "what", "which", "who", "whom", "how",
    "when", "where", "why", "need", "want", "help", "looking", "get",
    "like", "please", "about",
  ]);

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

/**
 * Generate a human-readable match reason
 */
function generateMatchReason(
  queryKeywords: string[],
  scheme: RecommendedScheme,
  language: "en" | "kn" = "en"
): string {
  const schemeText = [
    scheme.name_en,
    scheme.benefits_summary,
    scheme.eligibility_summary,
    scheme.target_group,
    ...(scheme.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchedKeywords = queryKeywords.filter((kw) => schemeText.includes(kw));

  if (matchedKeywords.length > 0) {
    const display = matchedKeywords.slice(0, 4).join(", ");
    return language === "kn"
      ? `ಹೊಂದಾಣಿಕೆ: ${display}`
      : `Matches: ${display}`;
  }

  return language === "kn"
    ? "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ"
    : "Related to your search";
}

/**
 * Recommend schemes based on natural language problem description
 * Uses Cohere embedding + pgvector cosine similarity
 * Cost: 1 Cohere API call per search
 */
export async function recommendSchemes(
  query: string,
  filters?: RecommendFilters,
  limit: number = 10,
  language: "en" | "kn" = "en"
): Promise<RecommendationResult[]> {
  const supabase = createAdminClient();

  // Generate query embedding (1 Cohere call)
  const queryEmbedding = await generateQueryEmbedding(query);

  // Call scheme_recommend RPC
  // pgvector expects text format "[0.1,0.2,...]" via PostgREST
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const { data, error } = await supabase.rpc("scheme_recommend", {
    query_embedding: embeddingStr,
    match_count: limit,
    // Cohere asymmetric search (search_query vs search_document) produces
    // lower similarity scores than symmetric. 0.45 is appropriate threshold.
    similarity_threshold: 0.45,
    filter_category: filters?.category || null,
    filter_level: filters?.level || null,
  });

  if (error) {
    console.error("Scheme recommendation failed:", error);
    throw new Error(`Recommendation search failed: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  const queryKeywords = extractKeywords(query);

  return data.map((row: Record<string, unknown>) => ({
    scheme: {
      id: row.id as string,
      slug: row.slug as string,
      name_en: row.name_en as string,
      name_kn: row.name_kn as string | null,
      department: row.department as string | null,
      category: row.category as string | null,
      target_group: row.target_group as string | null,
      benefits_summary: row.benefits_summary as string | null,
      eligibility_summary: row.eligibility_summary as string | null,
      application_url: row.application_url as string | null,
      official_source_url: row.official_source_url as string | null,
      tags: row.tags as string[] | null,
      scheme_level: row.scheme_level as string | null,
      data_source: row.data_source as string | null,
      last_verified_at: row.last_verified_at as string | null,
    },
    similarity_score: row.similarity_score as number,
    match_reason: generateMatchReason(
      queryKeywords,
      {
        id: row.id as string,
        slug: row.slug as string,
        name_en: row.name_en as string,
        name_kn: row.name_kn as string | null,
        department: row.department as string | null,
        category: row.category as string | null,
        target_group: row.target_group as string | null,
        benefits_summary: row.benefits_summary as string | null,
        eligibility_summary: row.eligibility_summary as string | null,
        application_url: row.application_url as string | null,
        official_source_url: row.official_source_url as string | null,
        tags: row.tags as string[] | null,
        scheme_level: row.scheme_level as string | null,
        data_source: row.data_source as string | null,
        last_verified_at: row.last_verified_at as string | null,
      },
      language
    ),
  }));
}

/**
 * Get all active schemes grouped by category (for browse mode)
 */
export async function getSchemesByCategory(): Promise<
  Record<string, RecommendedScheme[]>
> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("schemes")
    .select("id, slug, name_en, name_kn, department, category, target_group, benefits_summary, eligibility_summary, application_url, official_source_url, tags, scheme_level, data_source, last_verified_at")
    .eq("is_active", true)
    .order("name_en");

  if (error) {
    console.error("Failed to fetch schemes by category:", error);
    throw new Error(`Failed to fetch schemes: ${error.message}`);
  }

  const grouped: Record<string, RecommendedScheme[]> = {};
  for (const scheme of data || []) {
    const cat = scheme.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(scheme);
  }

  return grouped;
}
