import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | SamGov",
  description: "Privacy Policy for the SamGov welfare scheme guide.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Privacy Policy</span>
        </nav>

        <article className="bg-white rounded-lg shadow p-8 prose prose-gray max-w-none">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: February 2026</p>

          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy describes how SamGov (&quot;we&quot;,
            &quot;our&quot;, or &quot;the Service&quot;) collects, uses, and
            protects your information when you use our welfare scheme guide.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide</h3>
          <p>When using the eligibility debugger or AI Q&A features:</p>
          <ul>
            <li>
              Responses to eligibility questions (income ranges, family status,
              etc.)
            </li>
            <li>Questions submitted to the AI assistant</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li>
              Basic analytics data (page views, feature usage - aggregated and
              anonymized)
            </li>
            <li>
              Device type and browser information for compatibility purposes
            </li>
          </ul>

          <h3>2.3 Information We Do NOT Collect</h3>
          <p>We explicitly do not collect:</p>
          <ul>
            <li>
              Personally identifiable information (name, Aadhaar, phone number)
            </li>
            <li>Exact income or financial details</li>
            <li>Government ID numbers or documents</li>
            <li>Location data beyond general region</li>
          </ul>

          <h2>3. How We Use Information</h2>
          <p>Information collected is used only for:</p>
          <ul>
            <li>Providing eligibility guidance based on your inputs</li>
            <li>Answering questions through our AI assistant</li>
            <li>Improving our service and content accuracy</li>
            <li>Aggregated analytics to understand usage patterns</li>
          </ul>

          <h2>4. Data Storage and Security</h2>
          <ul>
            <li>
              Eligibility debugger inputs are processed in real-time and not
              permanently stored
            </li>
            <li>AI chat sessions may be temporarily cached for performance</li>
            <li>
              We use industry-standard security measures to protect data in
              transit
            </li>
            <li>
              We do not sell, rent, or share personal information with third
              parties
            </li>
          </ul>

          <h2>5. Third-Party Services</h2>
          <p>Our Service uses:</p>
          <ul>
            <li>
              <strong>Supabase</strong> for data storage (hosted in India -
              Mumbai region)
            </li>
            <li>
              <strong>Google Gemini AI</strong> for AI-powered responses
            </li>
            <li>
              <strong>Vercel</strong> for hosting
            </li>
          </ul>
          <p>
            These services have their own privacy policies governing data they
            process.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use minimal cookies for essential functionality only (language
            preference, session management). We do not use tracking cookies or
            third-party advertising cookies.
          </p>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Not provide optional information</li>
            <li>Clear your browser&apos;s local storage at any time</li>
            <li>Request information about data we may have collected</li>
            <li>Request deletion of any data associated with your session</li>
          </ul>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            This Service is intended for adult users seeking welfare scheme
            information. We do not knowingly collect information from children
            under 18.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be
            posted on this page with an updated revision date.
          </p>

          <h2>10. Contact</h2>
          <p>
            For privacy-related questions or concerns, please contact us through
            our feedback channels.
          </p>

          <hr />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 not-prose">
            <p className="text-blue-800 text-sm">
              <strong>Important:</strong> SamGov is not affiliated with any
              government agency. This privacy policy applies only to our
              Service. Government portals have their own privacy policies which
              you should review when applying for schemes.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
