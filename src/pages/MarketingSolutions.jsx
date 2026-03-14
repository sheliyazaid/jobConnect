import { Link } from 'react-router-dom';

const MarketingSolutions = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Marketing Solutions</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Grow your employer brand and reach more qualified candidates with targeted campaigns.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Reach Your Target Audience</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect Marketing Solutions helps companies build their employer brand and reach millions of job seekers. Advertise your company to top talent and increase brand awareness.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Our Marketing Services</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Employer Branding</h4>
                <p className="text-secondary-600">Build a strong employer brand and attract top talent with compelling company stories.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Sponsored Job Ads</h4>
                <p className="text-secondary-600">Get your job postings featured at the top of search results to attract qualified candidates.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Company Page Promotion</h4>
                <p className="text-secondary-600">Showcase your company culture, team, and benefits on an enhanced company profile.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Email Campaigns</h4>
                <p className="text-secondary-600">Target specific job seekers with personalized email messages about your company and openings.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Analytics & Insights</h4>
                <p className="text-secondary-600">Track campaign performance with detailed analytics and ROI measurement.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Why Choose JobConnect Marketing?</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Access to millions of job seekers in your industry</li>
              <li>Targeted advertising options</li>
              <li>Easy-to-use campaign management tools</li>
              <li>Expert support from our marketing team</li>
              <li>Flexible budgets to fit any business size</li>
              <li>Detailed reporting and optimization</li>
            </ul>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Start Your Campaign Today</h3>
            <p className="text-secondary-600 mb-4">
              Contact our marketing specialists to create a customized solution for your company.
            </p>
            <Link to="/register" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
              Get Started
            </Link>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Email: marketing@jobconnect.com
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

export default MarketingSolutions;
