import { Link } from 'react-router-dom';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Help Center</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Answers, guides, and resources to help you get the most out of JobConnect.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-secondary-600 mb-6">
              Find answers to common questions about JobConnect. If you cant find what you're looking for, contact our support team.
            </p>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">Getting Started</h3>
                <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I create an account?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I reset my password?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">What information do I need to register?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I verify my email?</a>
                  </li>
                </ul>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">Browsing & Applying for Jobs</h3>
                <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I search for jobs?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I apply for a job?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">Can I save jobs for later?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I delete an application?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">Can I withdraw an application?</a>
                  </li>
                </ul>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">Profile & Resume</h3>
                <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I update my profile?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I upload a resume?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">Can I have multiple resumes?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I make my profile public?</a>
                  </li>
                </ul>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">Messaging & Communication</h3>
                <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I message employers?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I turn off notifications?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I block someone?</a>
                  </li>
                </ul>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">Company-Specific Questions</h3>
                <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I post a job?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How long does a job posting stay active?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">Can I edit a job posting?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I review applicants?</a>
                  </li>
                </ul>
              </div>

              <div className="pb-4">
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">Account & Privacy</h3>
                <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I delete my account?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I check my privacy settings?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">Can I download my data?</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-600 hover:underline">How do I report a violation?</a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Still Need Help?</h3>
            <p className="text-secondary-600 mb-4">
              If you couldn't find the answer you're looking for, our support team is here to help.
            </p>
            <div className="space-y-2">
              <p className="text-secondary-600">
                <strong>Email:</strong> support@jobconnect.com
              </p>
              <p className="text-secondary-600">
                <strong>Phone:</strong> (555) 123-4567
              </p>
              <p className="text-secondary-600">
                <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
              </p>
              <p className="text-secondary-600">
                <strong>Live Chat:</strong> Available on our website
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Knowledge Base</h3>
            <p className="text-secondary-600 mb-4">
              Browse our comprehensive knowledge base for detailed articles and tutorials.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="#" className="block p-4 border rounded-lg hover:bg-secondary-50 transition">
                <h4 className="font-semibold text-secondary-800 mb-2">Video Tutorials</h4>
                <p className="text-sm text-secondary-600">Step-by-step videos to help you get started</p>
              </Link>
              <Link to="#" className="block p-4 border rounded-lg hover:bg-secondary-50 transition">
                <h4 className="font-semibold text-secondary-800 mb-2">Documentation</h4>
                <p className="text-sm text-secondary-600">Technical documentation and guides</p>
              </Link>
            </div>
          </section>
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

export default HelpCenter;
