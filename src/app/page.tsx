import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Karnataka Welfare Scheme Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Understand government welfare schemes, check your eligibility, and
            troubleshoot application rejections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schemes"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Schemes
            </Link>
            <Link
              href="/ask"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          How We Can Help
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            }
            title="Browse Schemes"
            description="Explore Karnataka government welfare schemes like Gruha Lakshmi, Shakti, and Anna Bhagya with clear eligibility information."
          />
          <FeatureCard
            icon={
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
                />
              </svg>
            }
            title="Debug Rejections"
            description="Step through common rejection reasons and understand what might have gone wrong with your application."
          />
          <FeatureCard
            icon={
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            title="Ask Questions"
            description="Get answers to your questions about scheme eligibility, documents required, and application process."
          />
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">
            Important Notice
          </h2>
          <p className="text-amber-700">
            This is NOT a government website. Information provided here is for
            guidance only. Eligibility criteria may change. Always verify on{" "}
            <a
              href="https://sevasindhu.karnataka.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-amber-900"
            >
              official Karnataka government portals
            </a>{" "}
            before applying.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              SamGov - Karnataka Welfare Scheme Guide
            </p>
            <nav className="flex gap-6 text-sm">
              <Link
                href="/schemes"
                className="text-gray-600 hover:text-gray-900"
              >
                Schemes
              </Link>
              <Link href="/ask" className="text-gray-600 hover:text-gray-900">
                Ask
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-900"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
