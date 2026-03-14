import { Link } from 'react-router-dom';

const SmallBusiness = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Small Business Solutions</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Everything you need to hire great people and grow your small business with confidence.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Growing Your Small Business</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect is designed to help small businesses and startups find and hire the right talent without the enterprise price tag. We offer affordable, flexible solutions tailored for growing companies.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Small Business Benefits</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2 mb-4">
              <li>Affordable pay-per-posting pricing starting at just $49</li>
              <li>Access to millions of qualified candidates</li>
              <li>Easy-to-use job posting and candidate screening tools</li>
              <li>Free company profile page</li>
              <li>Dedicated support from our small business team</li>
              <li>No long-term contracts required</li>
              <li>Flexible packages that scale with your business</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Pricing Plans</h3>
            <div className="space-y-4">
              <div className="border-2 border-secondary-200 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-secondary-800 mb-2">Starter</h4>
                <p className="text-2xl font-bold text-secondary-600 mb-3">$49/job</p>
                <ul className="list-disc pl-6 text-secondary-600 space-y-1">
                  <li>Post 1 job for 30 days</li>
                  <li>Review up to 50 applications</li>
                  <li>Basic candidate screening</li>
                </ul>
              </div>
              <div className="border-2 border-primary-600 p-4 rounded-lg bg-secondary-100">
                <h4 className="text-lg font-semibold text-secondary-800 mb-2">Professional</h4>
                <p className="text-2xl font-bold text-secondary-600 mb-3">$199/month</p>
                <ul className="list-disc pl-6 text-secondary-600 space-y-1">
                  <li>Post up to 5 concurrent jobs</li>
                  <li>Unlimited applications</li>
                  <li>Advanced screening tools</li>
                  <li>Priority support</li>
                </ul>
              </div>
              <div className="border-2 border-secondary-200 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-secondary-800 mb-2">Team</h4>
                <p className="text-2xl font-bold text-secondary-600 mb-3">$499/month</p>
                <ul className="list-disc pl-6 text-secondary-600 space-y-1">
                  <li>Post up to 20 concurrent jobs</li>
                  <li>Multiple user accounts</li>
                  <li>Team collaboration features</li>
                  <li>24/7 dedicated support</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Why Small Businesses Love JobConnect</h3>
            <div className="bg-secondary-50 p-4 rounded-lg">
              <blockquote className="text-secondary-600 border-l-4 border-primary-600 pl-4">
                "JobConnect helped us find the perfect team members without the huge recruitment costs. Highly recommended!"
              </blockquote>
              <p className="text-sm text-gray-500 mt-2">- Sarah Chen, Founder of TechStart</p>
            </div>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Ready to Grow Your Team?</h3>
            <p className="text-secondary-600 mb-4">
              Get started with JobConnect today. No credit card required for the first job posting.
            </p>
            <Link to="/register" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
              Post Your First Job Free
            </Link>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Email: smallbiz@jobconnect.com
              <br />
              Phone: (555) 123-4567 ext. 2
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

export default SmallBusiness;
