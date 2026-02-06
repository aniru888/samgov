/**
 * Embed Schemes Script
 * Generates Cohere embeddings for all schemes without embeddings
 * Uses the same embedding pipeline as document chunks
 *
 * Usage: npx tsx scripts/embed-schemes.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!COHERE_API_KEY) {
  console.error("Missing COHERE_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const COHERE_API_URL = "https://api.cohere.ai/v1/embed";
const COHERE_MODEL = "embed-multilingual-v3.0";
const COHERE_BATCH_SIZE = 96;
const EMBEDDING_DIMENSIONS = 1024;

/**
 * Generate embeddings using Cohere API (same as src/lib/rag/embeddings.ts)
 */
async function generateEmbeddingsBatch(
  texts: string[],
  inputType: "search_document" | "search_query" = "search_document"
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += COHERE_BATCH_SIZE) {
    const batch = texts.slice(i, i + COHERE_BATCH_SIZE);
    console.log(`  Embedding batch ${Math.floor(i / COHERE_BATCH_SIZE) + 1}: ${batch.length} texts`);

    const response = await fetch(COHERE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: COHERE_MODEL,
        texts: batch,
        input_type: inputType,
        embedding_types: ["float"],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cohere API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (!data.embeddings?.float || !Array.isArray(data.embeddings.float)) {
      throw new Error("Invalid embedding response from Cohere");
    }

    for (const embedding of data.embeddings.float) {
      if (embedding.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(
          `Invalid embedding dimensions: expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`
        );
      }
    }

    allEmbeddings.push(...data.embeddings.float);

    // Rate limit: 2000 inputs/min on trial, be conservative
    if (i + COHERE_BATCH_SIZE < texts.length) {
      console.log("  Waiting 2s for rate limit...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return allEmbeddings;
}

/**
 * Build search text for a scheme
 */
function buildSearchText(scheme: {
  name_en: string;
  name_kn?: string | null;
  department?: string | null;
  eligibility_summary?: string | null;
  benefits_summary?: string | null;
  target_group?: string | null;
  tags?: string[] | null;
}): string {
  const parts = [
    scheme.name_en,
    scheme.name_kn || "",
    scheme.department ? `Department: ${scheme.department}` : "",
    scheme.target_group ? `For: ${scheme.target_group}` : "",
    scheme.eligibility_summary ? `Eligibility: ${scheme.eligibility_summary}` : "",
    scheme.benefits_summary ? `Benefits: ${scheme.benefits_summary}` : "",
    scheme.tags?.length ? `Keywords: ${scheme.tags.join(", ")}` : "",
  ];

  return parts.filter(Boolean).join(". ");
}

async function embedSchemes() {
  console.log("\n=== Embed Schemes ===\n");

  // Fetch schemes without embeddings
  const { data: schemes, error } = await supabase
    .from("schemes")
    .select("id, slug, name_en, name_kn, department, eligibility_summary, benefits_summary, target_group, tags")
    .is("scheme_embedding", null)
    .eq("is_active", true);

  if (error) {
    console.error("Failed to fetch schemes:", error);
    process.exit(1);
  }

  if (!schemes || schemes.length === 0) {
    console.log("No schemes need embedding. All done!");
    return;
  }

  console.log(`Found ${schemes.length} schemes to embed\n`);

  // Build search texts
  const searchTexts = schemes.map((s) => buildSearchText(s));

  // Log sample
  console.log("Sample search text (first scheme):");
  console.log(`  ${searchTexts[0].substring(0, 200)}...\n`);

  // Generate embeddings
  console.log("Generating embeddings with Cohere...");
  const embeddings = await generateEmbeddingsBatch(searchTexts, "search_document");

  console.log(`\nGenerated ${embeddings.length} embeddings\n`);

  // Update schemes in DB
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < schemes.length; i++) {
    const { error: updateError } = await supabase
      .from("schemes")
      .update({
        scheme_embedding: JSON.stringify(embeddings[i]),
        search_text: searchTexts[i],
      })
      .eq("id", schemes[i].id);

    if (updateError) {
      console.error(`  Failed to update ${schemes[i].slug}:`, updateError.message);
      errors++;
    } else {
      updated++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Embedded: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log(`Cohere calls used: ${Math.ceil(schemes.length / COHERE_BATCH_SIZE)}`);

  // Track usage
  try {
    await supabase.from("api_usage").insert({
      service: "cohere",
      operation: "embed_schemes",
      calls_used: Math.ceil(schemes.length / COHERE_BATCH_SIZE),
      tokens_used: schemes.length,
    });
    console.log("Usage tracked in api_usage table");
  } catch {
    console.log("Note: Could not track usage in api_usage table (may not exist)");
  }
}

embedSchemes().catch(console.error);
