/**
 * Document Ingestion Orchestrator
 * Coordinates: extract text → chunk → deduplicate → embed → store
 *
 * Pipeline: PDF → document-processor → chunker → embeddings → Supabase
 */

import { sha256 } from "js-sha256";
import { extractText } from "./document-processor";
import { chunkText } from "./chunker";
import { checkQuota, recordUsage } from "./quota-tracker";
import { generateEmbeddingsBatch } from "../embeddings";
import { createAdminClient } from "../../supabase/admin";
import type { DocumentUpload, ProcessedChunk } from "../types";

/**
 * Ingestion result returned after processing a document
 */
export interface IngestionResult {
  document_id: string;
  chunk_count: number;
  skipped_duplicates: number;
  extraction_method: "native" | "ocr";
  language: "en" | "kn" | "mixed";
  credits_used: number;
  cohere_calls_used: number;
}

/**
 * Ingest a document: extract text, chunk, embed, and store in Supabase.
 *
 * @param upload - Document upload request with PDF buffer and metadata
 * @returns Ingestion result with stats
 */
export async function ingestDocument(
  upload: DocumentUpload
): Promise<IngestionResult> {
  // 1. Check Cohere quota before starting
  const cohereQuota = await checkQuota("cohere");
  if (!cohereQuota.allowed) {
    throw new Error(cohereQuota.message || "Cohere quota exhausted");
  }
  if (cohereQuota.warning) {
    console.warn(`[ingest] ${cohereQuota.message}`);
  }

  // 2. Extract text from PDF (pdf-parse → LlamaParse tiered)
  const pdfBuffer =
    upload.content instanceof Buffer
      ? upload.content
      : Buffer.from(new Uint8Array(upload.content));
  const extraction = await extractText(pdfBuffer, upload.filename);

  // Record LlamaParse usage if it was used
  if (extraction.credits_used > 0) {
    await recordUsage("llamaparse", "parse_page", extraction.credits_used, {
      filename: upload.filename,
      pages: extraction.page_count,
    });
  }

  // 3. Chunk the extracted text
  const textChunks = chunkText(
    extraction.text,
    extraction.is_markdown,
    extraction.page_count,
    extraction.language
  );

  if (textChunks.length === 0) {
    throw new Error(
      `No text chunks produced from ${upload.filename}. ` +
        "The document may be empty or contain only images without extractable text."
    );
  }

  // 4. Deduplicate - hash each chunk and check against existing
  const admin = createAdminClient();
  const processedChunks: ProcessedChunk[] = textChunks.map((chunk) => ({
    content: chunk.content,
    content_hash: sha256(chunk.content),
    metadata: {
      ...chunk.metadata,
      source_url: upload.source_url,
      circular_number: upload.circular_number,
    },
    token_count: chunk.token_count,
  }));

  // Check for existing hashes to skip duplicates
  const hashes = processedChunks.map((c) => c.content_hash);
  const { data: existingHashes } = await admin
    .from("document_chunks")
    .select("content_hash")
    .in("content_hash", hashes);

  const existingHashSet = new Set(
    (existingHashes || []).map((r) => r.content_hash)
  );
  const newChunks = processedChunks.filter(
    (c) => !existingHashSet.has(c.content_hash)
  );
  const skippedDuplicates = processedChunks.length - newChunks.length;

  if (newChunks.length === 0) {
    // All chunks are duplicates - still create the document record
    const { data: doc, error: docError } = await admin
      .from("documents")
      .insert({
        scheme_id: upload.scheme_id || null,
        document_type: upload.document_type,
        title: upload.title,
        filename: upload.filename,
        source_url: upload.source_url,
        circular_number: upload.circular_number || null,
        issue_date: upload.issue_date || null,
        extraction_method: extraction.extraction_method,
        extraction_confidence: extraction.confidence,
      })
      .select("id")
      .single();

    if (docError) {
      throw new Error(`Failed to create document record: ${docError.message}`);
    }

    return {
      document_id: doc.id,
      chunk_count: 0,
      skipped_duplicates: skippedDuplicates,
      extraction_method: extraction.extraction_method,
      language: extraction.language,
      credits_used: extraction.credits_used,
      cohere_calls_used: 0,
    };
  }

  // 5. Generate embeddings in batches of 96
  const BATCH_SIZE = 96;
  const embeddings: number[][] = [];
  let cohereCallsUsed = 0;

  for (let i = 0; i < newChunks.length; i += BATCH_SIZE) {
    // Check quota before each batch
    const batchQuota = await checkQuota("cohere");
    if (!batchQuota.allowed) {
      throw new Error(
        `Cohere quota exhausted after embedding ${i} of ${newChunks.length} chunks. ` +
          (batchQuota.message || "")
      );
    }

    const batch = newChunks.slice(i, i + BATCH_SIZE);
    const batchTexts = batch.map((c) => c.content);
    const batchEmbeddings = await generateEmbeddingsBatch(batchTexts);
    embeddings.push(...batchEmbeddings);

    // Record Cohere usage
    cohereCallsUsed++;
    await recordUsage("cohere", "embed_batch", 1, {
      batch_size: batch.length,
      filename: upload.filename,
    });
  }

  // 6. Insert document record
  const { data: doc, error: docError } = await admin
    .from("documents")
    .insert({
      scheme_id: upload.scheme_id || null,
      document_type: upload.document_type,
      title: upload.title,
      filename: upload.filename,
      source_url: upload.source_url,
      circular_number: upload.circular_number || null,
      issue_date: upload.issue_date || null,
      extraction_method: extraction.extraction_method,
      extraction_confidence: extraction.confidence,
    })
    .select("id")
    .single();

  if (docError) {
    throw new Error(`Failed to create document record: ${docError.message}`);
  }

  // 7. Insert chunks with embeddings
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
    // Clean up the document record if chunks fail
    await admin.from("documents").delete().eq("id", doc.id);
    throw new Error(`Failed to insert chunks: ${chunksError.message}`);
  }

  return {
    document_id: doc.id,
    chunk_count: newChunks.length,
    skipped_duplicates: skippedDuplicates,
    extraction_method: extraction.extraction_method,
    language: extraction.language,
    credits_used: extraction.credits_used,
    cohere_calls_used: cohereCallsUsed,
  };
}
