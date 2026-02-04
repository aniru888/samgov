import { createClient } from "@/lib/supabase/server";
import { Scheme } from "@/types/scheme";
import Link from "next/link";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Karnataka Welfare Schemes | SamGov",
  description:
    "Browse Karnataka government welfare schemes and check your eligibility. Includes Gruha Lakshmi, Shakti, Anna Bhagya and more.",
};

async function getSchemes(): Promise<Scheme[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .order("name_en");

  if (error) {
    console.error("Error fetching schemes:", error);
    return [];
  }

  return data || [];
}

export default async function SchemesPage() {
  const schemes = await getSchemes();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Karnataka Welfare Schemes
          </h1>
          <p className="text-gray-600">
            Browse government welfare schemes and understand eligibility
            criteria. Information is for guidance only - always verify on
            official portals.
          </p>
        </header>

        {schemes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">
              No schemes available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <Link
      href={`/schemes/${scheme.slug}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            {scheme.name_en}
          </h2>
          {scheme.name_kn && (
            <span className="text-sm text-gray-500 ml-2">{scheme.name_kn}</span>
          )}
        </div>

        {scheme.department && (
          <p className="text-sm text-gray-500 mb-3">{scheme.department}</p>
        )}

        {scheme.benefits_summary && (
          <p className="text-gray-700 mb-4 line-clamp-2">
            {scheme.benefits_summary}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-blue-600 text-sm font-medium">
            View details &rarr;
          </span>
          {scheme.last_verified_at && (
            <span className="text-xs text-gray-400">
              Verified:{" "}
              {new Date(scheme.last_verified_at).toLocaleDateString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
