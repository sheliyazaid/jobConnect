import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Careers at JobConnect</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          Help us build the future of hiring and connect millions of people with life‑changing opportunities.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Join Our Team</h2>
            <p className="text-secondary-600 mb-4">
              At JobConnect, we're building the future of recruitment. We're looking for talented, passionate people to help us connect millions of job seekers with their dream jobs.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Our Culture</h3>
            <p className="text-secondary-600 mb-4">
              We believe in creating a workplace where innovation thrives, diversity is celebrated, and every team member can grow and succeed.
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Collaborative and inclusive team environment</li>
              <li>Opportunities for professional growth and learning</li>
              <li>Competitive compensation and benefits</li>
              <li>Remote and flexible work options</li>
              <li>Health insurance, retirement plans, and wellness programs</li>
              <li>Paid time off and parental leave</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Open Positions</h3>
            <p className="text-secondary-600 mb-4">
              We regularly open positions in engineering, product, sales, marketing, design, and other departments. Check our careers page for current openings.
            </p>
            <div className="bg-secondary-100 p-4 rounded-lg">
              <p className="text-sm text-secondary-600">
                We are always interested in hearing from talented professionals. Even if there's no current opening that matches your skills, we encourage you to submit your resume.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">What We Look For</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Strong communication and collaboration skills</li>
              <li>Problem-solving ability and analytical thinking</li>
              <li>Passion for our mission</li>
              <li>Growth mindset and willingness to learn</li>
              <li>Attention to detail and quality work</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Diversity & Inclusion</h3>
            <p className="text-secondary-600 mb-4">
              JobConnect is committed to building a diverse and inclusive workplace. We welcome applications from all backgrounds and experiences. We do not discriminate based on race, color, religion, sex, national origin, age, disability, or any other protected characteristic.
            </p>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Ready to Apply?</h3>
            <p className="text-secondary-600 mb-4">
              Visit our careers portal to browse open positions and submit your application.
            </p>
            <Link to="/register" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
              Explore Opportunities
            </Link>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Email: careers@jobconnect.com
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

export default Careers;
