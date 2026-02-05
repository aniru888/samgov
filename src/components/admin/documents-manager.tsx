"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuotaDashboard } from "./quota-dashboard";
import { DocumentList } from "./document-list";
import { UploadForm } from "./upload-form";
import type { DocumentItem } from "./document-card";

interface QuotaData {
  cohere: { used: number; limit: number; pct: number };
  llamaparse: { used: number; limit: number; pct: number };
  gemini: { used: number; limit: number; pct: number };
}

interface DocumentsState {
  documents: DocumentItem[];
  quota: QuotaData;
  loading: boolean;
  error: string | null;
}

const defaultQuota: QuotaData = {
  cohere: { used: 0, limit: 1000, pct: 0 },
  llamaparse: { used: 0, limit: 10000, pct: 0 },
  gemini: { used: 0, limit: 600, pct: 0 },
};

export function DocumentsManager() {
  const router = useRouter();
  const [state, setState] = React.useState<DocumentsState>({
    documents: [],
    quota: defaultQuota,
    loading: true,
    error: null,
  });

  const fetchDocuments = React.useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/documents");
      const result = await response.json();

      if (!result.success) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: result.error || "Failed to load documents.",
        }));
        return;
      }

      setState({
        documents: result.data.documents || [],
        quota: result.data.quota || defaultQuota,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to connect to the server.",
      }));
    }
  }, []);

  React.useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Loading state
  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Failed to Load
        </h2>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          {state.error}
        </p>
        <Button onClick={fetchDocuments}>Try Again</Button>
      </div>
    );
  }

  // Content
  return (
    <div className="space-y-6">
      {/* Quota Dashboard */}
      <QuotaDashboard quota={state.quota} />

      {/* Tabs: Documents / Upload */}
      <Tabs defaultValue="documents">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="documents">
              Documents ({state.documents.length})
            </TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={fetchDocuments}>
            Refresh
          </Button>
        </div>

        <TabsContent value="documents">
          <DocumentList
            documents={state.documents}
            onSelectDocument={(id) => {
              router.push(`/admin/documents/${id}`);
            }}
          />
        </TabsContent>

        <TabsContent value="upload">
          <UploadForm
            quota={state.quota}
            onUploadComplete={fetchDocuments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
