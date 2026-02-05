/**
 * Document Sourcing Script (Direct Pipeline)
 * Takes curated text from the manifest, chunks it, embeds via Cohere,
 * and inserts directly into Supabase — bypassing the HTTP API entirely.
 *
 * This avoids the pdf-parse worker issue in Next.js Turbopack.
 *
 * Usage: npx tsx scripts/source-documents.ts
 *
 * Requires:
 * - COHERE_API_KEY in .env.local
 * - SUPABASE_SERVICE_ROLE_KEY in .env.local
 * - NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { sha256 } from "js-sha256";
import { DOCUMENT_MANIFEST, type DocumentEntry } from "./document-manifest";
import { chunkText } from "../src/lib/rag/ingestion/chunker";
import { generateEmbeddingsBatch } from "../src/lib/rag/embeddings";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
function loadEnv() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * Get scheme IDs from Supabase
 */
async function getSchemeIds(): Promise<Map<string, string>> {
  const admin = createAdminClient();
  const { data: schemes } = await admin.from("schemes").select("id, slug");
  const map = new Map<string, string>();
  for (const s of schemes || []) {
    map.set(s.slug, s.id);
  }
  return map;
}

/**
 * Process a single document entry: chunk → embed → store
 */
async function processDocument(
  entry: DocumentEntry,
  schemeId: string | null
): Promise<{
  success: boolean;
  document_id?: string;
  chunk_count?: number;
  cohere_calls?: number;
  error?: string;
}> {
  const admin = createAdminClient();

  if (!entry.manual_text) {
    return { success: false, error: "No manual_text content" };
  }

  const text = entry.manual_text;
  const filename = `${entry.scheme_slug}-${entry.document_type}.pdf`;

  // 1. Chunk the text (plain text, not markdown)
  const chunks = chunkText(text, false, 1, "en");

  if (chunks.length === 0) {
    return { success: false, error: "No chunks produced from text" };
  }

  // 2. Hash each chunk for deduplication
  const processedChunks = chunks.map((chunk) => ({
    content: chunk.content,
    content_hash: sha256(chunk.content),
    metadata: {
      ...chunk.metadata,
      source_url: entry.source_url,
    },
    token_count: chunk.token_count,
  }));

  // 3. Check for existing hashes
  const hashes = processedChunks.map((c) => c.content_hash);
  const { data: existingHashes } = await admin
    .from("document_chunks")
    .select("content_hash")
    .in("content_hash", hashes);

  const existingHashSet = new Set(
    (existingHashes || []).map((r: { content_hash: string }) => r.content_hash)
  );
  const newChunks = processedChunks.filter(
    (c) => !existingHashSet.has(c.content_hash)
  );

  if (newChunks.length === 0) {
    // All duplicates — create document record only
    const { data: doc, error: docError } = await admin
      .from("documents")
      .insert({
        scheme_id: schemeId,
        document_type: entry.document_type,
        title: entry.title,
        filename,
        source_url: entry.source_url,
        extraction_method: "native",
        extraction_confidence: 1.0,
      })
      .select("id")
      .single();

    if (docError) {
      return { success: false, error: `Doc insert: ${docError.message}` };
    }

    return {
      success: true,
      document_id: doc.id,
      chunk_count: 0,
      cohere_calls: 0,
    };
  }

  // 4. Generate embeddings in batches of 96
  const BATCH_SIZE = 96;
  const embeddings: number[][] = [];
  let cohereCallsUsed = 0;

  for (let i = 0; i < newChunks.length; i += BATCH_SIZE) {
    const batch = newChunks.slice(i, i + BATCH_SIZE);
    const batchTexts = batch.map((c) => c.content);
    const batchEmbeddings = await generateEmbeddingsBatch(batchTexts);
    embeddings.push(...batchEmbeddings);
    cohereCallsUsed++;
  }

  // 5. Insert document record
  const { data: doc, error: docError } = await admin
    .from("documents")
    .insert({
      scheme_id: schemeId,
      document_type: entry.document_type,
      title: entry.title,
      filename,
      source_url: entry.source_url,
      extraction_method: "native",
      extraction_confidence: 1.0,
    })
    .select("id")
    .single();

  if (docError) {
    return { success: false, error: `Doc insert: ${docError.message}` };
  }

  // 6. Insert chunks with embeddings
  const chunkInserts = newChunks.map((chunk, index) => ({
    document_id: doc.id,
    content: chunk.content,
    content_hash: chunk.content_hash,
    metadata: chunk.metadata,
    embedding: `[${embeddings[index].join(",")}]`,
    token_count: chunk.token_count,
  }));

  const { error: chunksError } = await admin
    .from("document_chunks")
    .insert(chunkInserts);

  if (chunksError) {
    // Clean up on failure
    await admin.from("documents").delete().eq("id", doc.id);
    return { success: false, error: `Chunks insert: ${chunksError.message}` };
  }

  return {
    success: true,
    document_id: doc.id,
    chunk_count: newChunks.length,
    cohere_calls: cohereCallsUsed,
  };
}

async function main() {
  console.log("=== SamGov Document Sourcing (Direct Pipeline) ===\n");

  // Check prerequisites
  if (!process.env.COHERE_API_KEY) {
    console.error("ERROR: COHERE_API_KEY not set in .env.local");
    process.exit(1);
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL not set in .env.local");
    process.exit(1);
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY not set in .env.local");
    process.exit(1);
  }

  // Get scheme IDs
  console.log("Fetching scheme IDs...");
  const schemeIds = await getSchemeIds();
  console.log(`Found ${schemeIds.size} schemes\n`);

  // Process each document
  const results: Array<{
    slug: string;
    title: string;
    success: boolean;
    chunks?: number;
    cohere_calls?: number;
    error?: string;
  }> = [];

  let totalCohereUsed = 0;

  for (const entry of DOCUMENT_MANIFEST) {
    console.log(`Processing: ${entry.title}...`);

    const schemeId = schemeIds.get(entry.scheme_slug) || null;
    const result = await processDocument(entry, schemeId);

    if (result.success) {
      console.log(
        `  OK: ${result.chunk_count} chunks, ${result.cohere_calls} Cohere calls, doc_id=${result.document_id}`
      );
      totalCohereUsed += result.cohere_calls || 0;
      results.push({
        slug: entry.scheme_slug,
        title: entry.title,
        success: true,
        chunks: result.chunk_count,
        cohere_calls: result.cohere_calls,
      });
    } else {
      console.log(`  FAIL: ${result.error}`);
      results.push({
        slug: entry.scheme_slug,
        title: entry.title,
        success: false,
        error: result.error,
      });
    }

    // Rate limit: wait 2s between uploads to respect Cohere limits
    console.log("  Waiting 2s (rate limit)...\n");
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Summary
  console.log("\n=== Summary ===");
  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`Total: ${results.length} documents`);
  console.log(`Succeeded: ${succeeded.length}`);
  console.log(`Failed: ${failed.length}`);

  if (succeeded.length > 0) {
    console.log("\nSucceeded:");
    for (const r of succeeded) {
      console.log(
        `  ${r.slug}: ${r.title} (${r.chunks} chunks, ${r.cohere_calls} Cohere calls)`
      );
    }
  }

  if (failed.length > 0) {
    console.log("\nFailed:");
    for (const r of failed) {
      console.log(`  ${r.slug}: ${r.title} - ${r.error}`);
    }
  }

  const totalChunks = succeeded.reduce((sum, r) => sum + (r.chunks || 0), 0);
  console.log(`\nTotal chunks created: ${totalChunks}`);
  console.log(`Total Cohere calls used: ${totalCohereUsed} (of 1000/month)`);
}

main().catch(console.error);
