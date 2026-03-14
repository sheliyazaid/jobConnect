import { Link } from 'react-router-dom';

const Advertising = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-8">Advertising</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Advertising on JobConnect</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect offers comprehensive advertising solutions for companies and recruiters to reach millions of job seekers actively searching for opportunities.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Advertising Options</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Featured Job Listings</h4>
                <p className="text-secondary-600">Get your job postings featured prominently in search results and homepage recommendations.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Company Branding Ads</h4>
                <p className="text-secondary-600">Increase brand visibility with display ads showcasing your company.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Sponsored Content</h4>
                <p className="text-secondary-600">Share company news, culture, and career insights through sponsored articles.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Video Ads</h4>
                <p className="text-secondary-600">Engage job seekers with video content about your company and opportunities.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Advertising Standards</h3>
            <p className="text-secondary-600 mb-4">
              We maintain high standards for advertising to ensure a positive experience for our users. All ads must comply with our advertising policies.
            </p>
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-secondary-800 mb-3">Our Standards Include:</h4>
              <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                <li>No misleading or false claims</li>
                <li>No discrimination in job ads</li>
                <li>Clear and accurate job descriptions</li>
                <li>Compliance with employment laws</li>
                <li>No prohibited content (hate speech, adult content, etc.)</li>
                <li>Transparent pricing and terms</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Pricing & Packages</h3>
            <p className="text-secondary-600 mb-4">
              We offer flexible advertising packages for businesses of all sizes, from startups to Fortune 500 companies. Contact our advertising team for custom quotes.
            </p>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Advertise with Us</h3>
            <p className="text-secondary-600 mb-4">
              Reach millions of job seekers and grow your company. Contact our advertising specialists today.
            </p>
            <Link to="/register" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
              Get Started
            </Link>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Email: ads@jobconnect.com
              <br />
              Phone: (555) 123-4567
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

export default Advertising;
