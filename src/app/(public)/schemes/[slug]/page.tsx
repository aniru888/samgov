import { createClient } from "@/lib/supabase/server";
import { Scheme } from "@/types/scheme";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/schemes" className="text-blue-600 hover:underline">
            Schemes
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{scheme.name_en}</span>
        </nav>

        {/* Header */}
        <header className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {scheme.name_en}
              </h1>
              {scheme.name_kn && (
                <p className="text-xl text-gray-600">{scheme.name_kn}</p>
              )}
            </div>
            {scheme.application_url && (
              <a
                href={scheme.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply on Official Portal
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>

          {scheme.department && (
            <p className="mt-4 text-gray-500">
              <span className="font-medium">Department:</span>{" "}
              {scheme.department}
            </p>
          )}
        </header>

        {/* Benefits */}
        {scheme.benefits_summary && (
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Benefits
            </h2>
            <p className="text-gray-700">{scheme.benefits_summary}</p>
          </section>
        )}

        {/* Eligibility */}
        {scheme.eligibility_summary && (
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Basic Eligibility Criteria
            </h2>
            <p className="text-gray-700 mb-4">{scheme.eligibility_summary}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These are basic eligibility criteria.
                Additional conditions may apply. Rules may have changed since
                our last verification. Always check the official portal for the
                most current requirements.
              </p>
            </div>
          </section>
        )}

        {/* Debug Eligibility CTA */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Were you rejected for this scheme?
          </h2>
          <p className="text-blue-800 mb-4">
            Use our eligibility debugger to understand why your application may
            have been rejected and what you can do to fix it.
          </p>
          <Link
            href={`/debug/${scheme.slug}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Debug My Rejection
          </Link>
        </section>

        {/* Footer Info */}
        <footer className="text-center text-sm text-gray-500 space-y-2">
          {scheme.last_verified_at && (
            <p>
              Information last verified:{" "}
              {new Date(scheme.last_verified_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {scheme.official_source_url && (
            <p>
              Source:{" "}
              <a
                href={scheme.official_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Official Department Website
              </a>
            </p>
          )}
        </footer>
      </div>
    </main>
  );
}
