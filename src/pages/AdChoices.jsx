import { Link } from 'react-router-dom';

const AdChoices = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Ad Choices & Cookie Preferences</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Understand how we use cookies and how you can control ad personalization on JobConnect.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Your Privacy Choices</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect respects your privacy and gives you control over the information we collect and how it's used. Learn about your ad choices and cookie preferences.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Cookies & Tracking Technologies</h3>
            <p className="text-secondary-600 mb-4">
              We use cookies and similar technologies to enhance your experience, remember your preferences, and understand how you use our site.
            </p>
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-secondary-800 mb-3">Types of Cookies:</h4>
              <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used to show personalized ads</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Personalized Advertising</h3>
            <p className="text-secondary-600 mb-4">
              We show you ads based on your interests and activity. You can control this personalization through your ad preferences.
            </p>
            <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mb-4">
              <p className="text-sm text-secondary-600 mb-3">
                <strong>You can:</strong>
              </p>
              <ul className="list-disc pl-6 text-sm text-secondary-600 space-y-2">
                <li>Opt out of personalized ads</li>
                <li>View and delete ad interest categories</li>
                <li>Control data sharing with partners</li>
                <li>Adjust email notification preferences</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Cookie Management</h3>
            <p className="text-secondary-600 mb-4">
              You can manage your cookie preferences through your browser settings:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Clear cookies from your browser history</li>
              <li>Disable cookies entirely</li>
              <li>Use private/incognito browsing mode</li>
              <li>Install browser extensions for privacy</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              Note: Disabling cookies may affect certain features of our website.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Do Not Track (DNT)</h3>
            <p className="text-secondary-600 mb-4">
              Some browsers include a "Do Not Track" feature. Currently, there is no industry standard for recognizing DNT signals, but we respect your privacy preferences regardless.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">California Privacy Rights</h3>
            <p className="text-secondary-600 mb-4">
              If you are a California resident, you have additional privacy rights under CCPA and CPRA. You can request to know, delete, or correct your personal information.
            </p>
          </section>

          <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Manage Your Preferences</h3>
            <p className="text-sm text-secondary-600 mb-4">
              To update your ad choices and cookie preferences, please visit your account settings or contact us.
            </p>
            <Link to="/account-settings" className="inline-block text-secondary-600 hover:text-secondary-700 font-medium">
              Go to Settings
            </Link>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Questions about your privacy choices?
              <br />
              Email: privacy@jobconnect.com
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

export default AdChoices;
