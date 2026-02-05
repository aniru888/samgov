/**
 * Admin Documents Page
 * Manage the AI knowledge base: view documents, quota usage, and upload new PDFs.
 */

import { Metadata } from "next";
import { DocumentsManager } from "@/components/admin/documents-manager";

export const metadata: Metadata = {
  title: "Manage Documents | SamGov Admin",
  description:
    "Upload and manage document knowledge base for SamGov AI-powered scheme guidance.",
};

export default function AdminDocumentsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] bg-gray-50">
      {/* Header section */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-900">
            Document Manager
          </h1>
          <p className="text-sm text-gray-500">
            Manage the AI knowledge base documents
          </p>
        </div>
      </div>

      {/* Content area with bottom nav padding */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-24">
        <DocumentsManager />
      </div>
    </div>
  );
}
