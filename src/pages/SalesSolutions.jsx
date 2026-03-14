import { Link } from 'react-router-dom';

const SalesSolutions = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Sales Solutions</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Build, train, and scale a high‑performing sales organization with JobConnect.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Grow Your Sales Team</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect Sales Solutions provides tools and insights to help you build, manage, and grow a high-performing sales team.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Our Sales Services</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Sales Talent Recruitment</h4>
                <p className="text-secondary-600">Find and hire top sales professionals with proven track records.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Sales Training Programs</h4>
                <p className="text-secondary-600">Develop your sales team with industry-leading training and workshops.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Sales Analytics</h4>
                <p className="text-secondary-600">Track sales metrics, performance, and opportunities with detailed dashboards.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Account Management</h4>
                <p className="text-secondary-600">Get dedicated support from our sales account managers.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Why Choose JobConnect for Sales?</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Access to pre-vetted sales professionals</li>
              <li>Industry expertise and best practices</li>
              <li>Customized solutions for your needs</li>
              <li>Proven track record of success</li>
              <li>Ongoing support and optimization</li>
            </ul>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Build Your Dream Team</h3>
            <p className="text-secondary-600 mb-4">
              Let us help you find and develop the sales talent you need to achieve your business goals.
            </p>
            <Link to="/register" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
              Get Started
            </Link>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Email: sales@jobconnect.com
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

export default SalesSolutions;
