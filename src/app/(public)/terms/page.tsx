import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | SamGov",
  description: "Terms of Service for using the SamGov welfare scheme guide.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Terms of Service</span>
        </nav>

        <article className="bg-white rounded-lg shadow p-8 prose prose-gray max-w-none">
          <h1>Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: February 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using SamGov (&quot;the Service&quot;), you agree to
            be bound by these Terms of Service. If you do not agree to these
            terms, please do not use the Service.
          </p>

          <h2>2. Important Disclaimer</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 not-prose">
            <p className="text-amber-800 font-medium">
              THIS IS NOT A GOVERNMENT WEBSITE. SamGov is an independent
              informational service and is not affiliated with, endorsed by, or
              connected to any government agency, department, or official body.
            </p>
          </div>

          <h2>3. Nature of Information</h2>
          <p>The information provided through SamGov:</p>
          <ul>
            <li>Is for general informational and guidance purposes only</li>
            <li>
              Does not constitute legal, financial, or professional advice
            </li>
            <li>May not reflect the most current eligibility requirements</li>
            <li>Should not be relied upon as a guarantee of eligibility</li>
            <li>
              Cannot replace official government sources or professional
              consultation
            </li>
          </ul>

          <h2>4. No Guarantee of Accuracy</h2>
          <p>
            While we strive to provide accurate and up-to-date information,
            government scheme rules and eligibility criteria change frequently.
            We make no warranties or representations about the accuracy,
            reliability, completeness, or timeliness of any information on this
            Service.
          </p>

          <h2>5. User Responsibilities</h2>
          <p>Users of this Service agree to:</p>
          <ul>
            <li>
              Verify all information on official government portals before
              taking action
            </li>
            <li>
              Not rely solely on this Service for eligibility determinations
            </li>
            <li>Provide accurate information when using the Service</li>
            <li>
              Understand that results from the eligibility debugger are
              indicative only
            </li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, SamGov and its operators
            shall not be liable for any direct, indirect, incidental, special,
            consequential, or punitive damages arising from your use of or
            inability to use the Service, including but not limited to:
          </p>
          <ul>
            <li>Loss of benefits or welfare payments</li>
            <li>Missed application deadlines</li>
            <li>Incorrect eligibility assessments</li>
            <li>Any actions taken based on information provided</li>
          </ul>

          <h2>7. AI-Powered Features</h2>
          <p>
            Certain features of this Service use artificial intelligence to
            provide responses. AI-generated content:
          </p>
          <ul>
            <li>May contain errors or inaccuracies</li>
            <li>Should be verified against official sources</li>
            <li>Is not a substitute for professional advice</li>
          </ul>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of the Service after changes constitutes acceptance of the
            modified terms.
          </p>

          <h2>9. Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us
            through our feedback channels.
          </p>

          <hr />

          <p className="text-sm text-gray-500">
            By using SamGov, you acknowledge that you have read, understood, and
            agree to be bound by these Terms of Service.
          </p>
        </article>
      </div>
    </main>
  );
}
