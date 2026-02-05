/**
 * Document Upload API Route
 * POST /api/documents - Upload a PDF for ingestion
 * GET /api/documents - List all documents with stats
 */

import { NextResponse } from "next/server";
import { ingestDocument } from "@/lib/rag/ingestion/ingest";
import { getMonthlyUsage } from "@/lib/rag/ingestion/quota-tracker";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DocumentType } from "@/lib/rag/types";

export const runtime = "nodejs";

/** Max upload size: 20MB */
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const VALID_DOCUMENT_TYPES: DocumentType[] = [
  "circular",
  "faq",
  "guideline",
  "announcement",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract fields
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const documentType = formData.get("document_type") as string | null;
    const sourceUrl = formData.get("source_url") as string | null;
    const schemeId = formData.get("scheme_id") as string | null;
    const circularNumber = formData.get("circular_number") as string | null;
    const issueDate = formData.get("issue_date") as string | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { success: false, error: "Missing 'file' field. Upload a PDF file." },
        { status: 400 }
      );
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing 'title' field." },
        { status: 400 }
      );
    }

    if (
      !documentType ||
      !VALID_DOCUMENT_TYPES.includes(documentType as DocumentType)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid 'document_type'. Must be one of: ${VALID_DOCUMENT_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!sourceUrl || sourceUrl.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing 'source_url' field." },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      const url = new URL(sourceUrl.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        return NextResponse.json(
          { success: false, error: "source_url must use http or https protocol." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "source_url is not a valid URL." },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { success: false, error: "Only PDF files are accepted." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer and verify PDF magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // PDF files must start with %PDF magic bytes
    const pdfMagic = buffer.subarray(0, 5).toString("ascii");
    if (!pdfMagic.startsWith("%PDF")) {
      return NextResponse.json(
        { success: false, error: "File does not appear to be a valid PDF." },
        { status: 400 }
      );
    }

    // Run ingestion pipeline
    const result = await ingestDocument({
      scheme_id: schemeId || undefined,
      document_type: documentType as DocumentType,
      title: title.trim(),
      filename: file.name,
      source_url: sourceUrl.trim(),
      circular_number: circularNumber || undefined,
      issue_date: issueDate || undefined,
      content: buffer,
    });

    return NextResponse.json({
      success: true,
      data: {
        document_id: result.document_id,
        chunk_count: result.chunk_count,
        skipped_duplicates: result.skipped_duplicates,
        extraction_method: result.extraction_method,
        language: result.language,
        credits_used: result.credits_used,
        cohere_calls_used: result.cohere_calls_used,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[documents/POST]", message);

    // Check for quota-related errors
    if (message.includes("quota")) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Document ingestion failed. Please try again or contact support." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const admin = createAdminClient();

    // Get documents with chunk counts
    const { data: documents, error } = await admin
      .from("documents")
      .select(
        `
        id,
        scheme_id,
        document_type,
        title,
        filename,
        source_url,
        circular_number,
        issue_date,
        extraction_method,
        extraction_confidence,
        is_active,
        created_at,
        updated_at
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to list documents: ${error.message}`);
    }

    // Get chunk counts per document
    const { data: chunkCounts, error: countError } = await admin
      .from("document_chunks")
      .select("document_id")
      .in(
        "document_id",
        (documents || []).map((d) => d.id)
      );

    if (countError) {
      console.warn("Failed to get chunk counts:", countError.message);
    }

    // Count chunks per document
    const countMap = new Map<string, number>();
    for (const row of chunkCounts || []) {
      countMap.set(row.document_id, (countMap.get(row.document_id) || 0) + 1);
    }

    // Get API usage stats
    const usage = await getMonthlyUsage();

    return NextResponse.json({
      success: true,
      data: {
        documents: (documents || []).map((doc) => ({
          ...doc,
          chunk_count: countMap.get(doc.id) || 0,
        })),
        quota: usage,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[documents/GET]", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
