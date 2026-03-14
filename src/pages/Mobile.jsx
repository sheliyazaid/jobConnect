import { Link } from 'react-router-dom';

const Mobile = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">JobConnect Mobile Apps</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Stay connected to opportunities and candidates wherever you are with our mobile apps.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Access JobConnect Anywhere</h2>
            <p className="text-secondary-600 mb-4">
              Download our mobile apps to search for jobs, manage applications, and connect with employers on the go.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Mobile Apps Available</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">JobConnect for Job Seekers</h4>
                <p className="text-secondary-600 mb-2">Available on iOS and Android</p>
                <p className="text-sm text-secondary-600">
                  Search jobs, apply instantly, track applications, receive notifications, and message employers.
                </p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">JobConnect for Employers</h4>
                <p className="text-secondary-600 mb-2">Available on iOS and Android</p>
                <p className="text-sm text-secondary-600">
                  Post jobs, review applications, schedule interviews, and communicate with candidates.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-2">For Job Seekers</h4>
                <ul className="list-disc pl-6 text-sm text-secondary-600 space-y-1">
                  <li>Job search with filters</li>
                  <li>One-click apply</li>
                  <li>Application tracking</li>
                  <li>Interview scheduling</li>
                  <li>Direct messaging</li>
                  <li>Profile management</li>
                </ul>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-2">For Employers</h4>
                <ul className="list-disc pl-6 text-sm text-secondary-600 space-y-1">
                  <li>Post jobs on the go</li>
                  <li>Review applications</li>
                  <li>Screen candidates</li>
                  <li>Schedule interviews</li>
                  <li>Message candidates</li>
                  <li>Track hiring progress</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Download Today</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-secondary-100 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-secondary-800 mb-3">Apple App Store</h4>
                <p className="text-sm text-secondary-600 mb-3">Download for iPhone and iPad</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                  Download
                </button>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-secondary-800 mb-3">Google Play Store</h4>
                <p className="text-sm text-secondary-600 mb-3">Download for Android devices</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                  Download
                </button>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">System Requirements</h3>
            <div className="bg-secondary-50 p-4 rounded-lg">
              <p className="text-sm text-secondary-600 mb-2"><strong>iOS:</strong> Requires iOS 12.0 or later</p>
              <p className="text-sm text-secondary-600"><strong>Android:</strong> Requires Android 6.0 or later</p>
            </div>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Need help? Visit our support center or email support@jobconnect.com
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

export default Mobile;
