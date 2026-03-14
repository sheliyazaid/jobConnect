import { Link } from 'react-router-dom';

const SafetyCenter = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Safety Center</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Learn how JobConnect protects you against scams and how you can stay safe while job searching.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Safety & Security</h2>
            <p className="text-secondary-600 mb-4">
              Your safety and security are our top priority. JobConnect is committed to providing a secure platform where you can confidently search for jobs and collaborate with employers.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Scam Prevention</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <h4 className="font-semibold text-secondary-800 mb-2">Common Job Scams to Avoid:</h4>
              <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                <li>Offers requesting upfront payments or fees</li>
                <li>Jobs requiring you to cash checks or wire money</li>
                <li>Requests for personal information like SSN or bank details</li>
                <li>Too-good-to-be-true salary offers</li>
                <li>Communication only through email or text (no phone)</li>
                <li>Requests to work from home with minimal qualifications</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Safety Tips</h3>
            <div className="space-y-3 text-secondary-600">
              <p><strong>✓ Do:</strong> Use your real phone number only for legitimate companies</p>
              <p><strong>✓ Do:</strong> Research the company before applying</p>
              <p><strong>✓ Do:</strong> Report suspicious job postings</p>
              <p><strong>✓ Do:</strong> Use strong passwords and enable two-factor authentication</p>
              <p><strong>✗ Don't:</strong> Share your password or login credentials</p>
              <p><strong>✗ Don't:</strong> Send money for "background checks" or "training"</p>
              <p><strong>✗ Don't:</strong> Click suspicious links or download unknown files</p>
              <p><strong>✗ Don't:</strong> Ignore your gut feeling about a job offer</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Data Protection</h3>
            <p className="text-secondary-600 mb-4">
              We use industry-standard encryption and security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure data storage and backup systems</li>
              <li>Compliance with GDPR, CCPA, and other privacy laws</li>
              <li>Regular staff training on security best practices</li>
              <li>Incident response team monitoring 24/7</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Account Security</h3>
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-secondary-800 mb-3">Protect Your Account:</h4>
              <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                <li>Use a strong, unique password (12+ characters)</li>
                <li>Enable two-factor authentication</li>
                <li>Never share your login credentials</li>
                <li>Review connected apps and sign out unused devices</li>
                <li>Keep your email address updated</li>
                <li>Log out on shared computers</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Report Safety Issues</h3>
            <p className="text-secondary-600 mb-4">
              If you encounter a scam, fraudulent job posting, or suspicious activity, please report it immediately.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-secondary-600 mb-2">
                <strong>Email:</strong> safety@jobconnect.com
              </p>
              <p className="text-sm text-secondary-600">
                <strong>Report Scam:</strong> Use the "Report" button on any job posting
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">If You've Been Scammed</h3>
            <p className="text-secondary-600 mb-4">
              If you believe you've been a victim of a scam:
            </p>
            <ol className="list-decimal pl-6 text-secondary-600 space-y-2">
              <li>Stop all communication with the scammer</li>
              <li>Report it to JobConnect immediately</li>
              <li>Contact the FTC at reportfraud.ftc.gov</li>
              <li>If money was involved, contact your bank</li>
              <li>Consider placing a fraud alert on your credit report</li>
              <li>Save all evidence and documentation</li>
            </ol>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Questions about safety? Email: security@jobconnect.com
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-secondary-600 hover:text-secondary-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SafetyCenter;
