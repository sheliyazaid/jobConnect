import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Privacy & Terms</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Learn how JobConnect protects your data, how we use it, and the terms that govern use of our platform.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Privacy Policy</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect ("we", "our", "us", or "Company") operates the website and mobile application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>

            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Data Collection</h3>
            <p className="text-secondary-600 mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2 mb-4">
              <li>Personal Data: Name, email address, phone number, skills, experience</li>
              <li>Usage Data: Browser type, operating system, referring pages, time spent</li>
              <li>Cookies and similar tracking technologies</li>
              <li>File uploads and communications</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Data Security</h3>
            <p className="text-secondary-600 mb-4">
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your Personal Data, but we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Terms of Service</h3>
            <p className="text-secondary-600 mb-4">
              By accessing and using JobConnect, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">User Responsibilities</h3>
            <p className="text-secondary-600 mb-4">
              Users are responsible for maintaining the confidentiality of your account information and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Limitation of Liability</h3>
            <p className="text-secondary-600 mb-4">
              In no event shall JobConnect be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
            </p>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              For complete privacy and terms information, or if you have questions, please contact us at privacy@jobconnect.com
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

export default Privacy;
