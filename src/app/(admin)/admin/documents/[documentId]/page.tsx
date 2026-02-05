import { DocumentDetail } from "@/components/admin/document-detail";

export const metadata = {
  title: "Document Details | Admin",
};

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <DocumentDetail documentId={documentId} />
      </div>
    </main>
  );
}
