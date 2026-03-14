import { Link } from 'react-router-dom';

const TalentSolutions = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Talent Solutions</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Powerful tools for attracting, assessing, and hiring the right people for every role.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Find and Recruit Top Talent</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect Talent Solutions helps companies find, attract, and hire the best talent for their organization. Our comprehensive platform simplifies the recruitment process.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Our Solutions</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Job Posting</h4>
                <p className="text-secondary-600">Post jobs to reach millions of qualified candidates across industries and locations.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Candidate Search</h4>
                <p className="text-secondary-600">Access a database of millions of job seekers with detailed profiles and skills.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Screening & Matching</h4>
                <p className="text-secondary-600">Use AI-powered tools to screen and match candidates with your job requirements.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Interview Scheduling</h4>
                <p className="text-secondary-600">Streamline your interview process with automated scheduling and communication.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Hiring Analytics</h4>
                <p className="text-secondary-600">Track your hiring metrics and optimize your recruitment strategy.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Why Choose JobConnect?</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Access to millions of qualified candidates</li>
              <li>Advanced AI-powered matching algorithm</li>
              <li>Easy-to-use interface</li>
              <li>Affordable pricing plans</li>
              <li>Dedicated support team</li>
              <li>Real-time analytics and reporting</li>
            </ul>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Ready to Find Talent?</h3>
            <p className="text-secondary-600 mb-4">
              Contact our sales team to learn more about Talent Solutions and find a plan that fits your hiring needs.
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

export default TalentSolutions;
