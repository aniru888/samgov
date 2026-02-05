/**
 * Single Document API Route
 * GET /api/documents/:id - Get document details
 * DELETE /api/documents/:id - Soft-delete a document
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ documentId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { documentId } = await params;
    const admin = createAdminClient();

    // Get document
    const { data: document, error } = await admin
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error || !document) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    // Get chunk count
    const { count } = await admin
      .from("document_chunks")
      .select("id", { count: "exact", head: true })
      .eq("document_id", documentId);

    return NextResponse.json({
      success: true,
      data: {
        ...document,
        chunk_count: count || 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[documents/GET/:id]", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { documentId } = await params;
    const admin = createAdminClient();

    // Soft delete - set is_active to false
    const { data, error } = await admin
      .from("documents")
      .update({ is_active: false })
      .eq("id", documentId)
      .select("id, title")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        title: data.title,
        message: "Document deactivated. Chunks preserved for audit trail.",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[documents/DELETE/:id]", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
