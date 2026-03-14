import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-2">Terms and Conditions</h1>
        <p className="text-secondary-600 mb-10 text-sm">Last updated: March 13, 2024</p>

        <div className="bg-white rounded-xl shadow-sm p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">1. Introduction</h2>
            <p className="text-secondary-700 mb-4">
              Welcome to JobConnect. These Terms and Conditions govern your use of our website, mobile application, and services. By accessing and using JobConnect, you accept and agree to be bound by these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">2. User Accounts</h2>
            <p className="text-secondary-700 mb-3">
              You are responsible for maintaining the confidentiality of your account information and password. You agree to:
            </p>
            <ul className="list-disc pl-6 text-secondary-700 space-y-2">
              <li>Provide accurate and current information during registration</li>
              <li>Maintain the security of your account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">3. Acceptable Use</h2>
            <p className="text-secondary-700 mb-3">
              You agree not to use JobConnect for any illegal, unauthorized, or abusive purposes, including:
            </p>
            <ul className="list-disc pl-6 text-secondary-700 space-y-2">
              <li>Posting false, misleading, or discriminatory content</li>
              <li>Harassment, bullying, or threatening behavior</li>
              <li>Violating intellectual property rights</li>
              <li>Attempting to gain unauthorized access to systems</li>
              <li>Spam or unsolicited commercial communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">4. Job Postings</h2>
            <p className="text-secondary-700 mb-3">
              Companies agree to post accurate job information and comply with all employment laws. JobConnect reserves the right to remove posts that violate these terms or contain illegal content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">5. Intellectual Property</h2>
            <p className="text-secondary-700 mb-3">
              All content on JobConnect, including text, graphics, logos, and software, is the property of JobConnect or its licensors and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-secondary-700 mb-3">
              JobConnect is provided "as is" without warranties. JobConnect shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">7. Indemnification</h2>
            <p className="text-secondary-700 mb-3">
              You agree to indemnify JobConnect against any claims resulting from your breach of these terms or violation of applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">8. Termination</h2>
            <p className="text-secondary-700 mb-3">
              JobConnect may terminate or suspend your account at any time for violations of these terms or for any reason at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">9. Changes to Terms</h2>
            <p className="text-secondary-700 mb-3">
              We reserve the right to modify these terms at any time. Your continued use of JobConnect indicates your acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">10. Governing Law</h2>
            <p className="text-secondary-700 mb-3">
              These terms are governed by applicable laws and regulations. Any legal action shall be resolved in the appropriate courts.
            </p>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <p className="text-secondary-700">
              Questions about these terms? <Link to="/contact-us" className="text-secondary-600 font-semibold hover:text-secondary-800">Contact us</Link>
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-secondary-600 hover:text-secondary-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
