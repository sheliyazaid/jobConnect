import { Link } from 'react-router-dom';

const ProfessionalCommunity = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-8">JobConnect Professional Community</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Connect with Professionals in Your Field</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect's Professional Community is a vibrant space where career professionals can network, share experiences, and grow together.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Community Features</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Professional Groups</h4>
                <p className="text-secondary-600">Join industry-specific or role-based groups to connect with peers and share insights.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Discussion Forums</h4>
                <p className="text-secondary-600">Participate in conversations about career development, industry trends, and best practices.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Webinars & Events</h4>
                <p className="text-secondary-600">Attend online workshops, panel discussions, and networking events hosted by industry experts.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Mentorship Program</h4>
                <p className="text-secondary-600">Connect with mentors and mentees to support career growth and development.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Skill-Building Courses</h4>
                <p className="text-secondary-600">Access curated courses to develop new skills and advance your career.</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-4">
                <h4 className="font-semibold text-secondary-800 mb-2">Resource Library</h4>
                <p className="text-secondary-600">Browse articles, case studies, and best practices shared by the community.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Popular Professional Groups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-2">Tech & Software</h4>
                <p className="text-sm text-secondary-600 mb-3">Discussions on software development, AI, cloud computing, and emerging technologies.</p>
                <span className="text-sm text-secondary-600 font-medium">42K members</span>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-2">Business & Leadership</h4>
                <p className="text-sm text-secondary-600 mb-3">Business strategy, leadership tips, and management best practices.</p>
                <span className="text-sm text-secondary-600 font-medium">38K members</span>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-2">Sales & Marketing</h4>
                <p className="text-sm text-secondary-600 mb-3">Sales techniques, marketing strategies, and customer success stories.</p>
                <span className="text-sm text-secondary-600 font-medium">29K members</span>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-2">Design & Creative</h4>
                <p className="text-sm text-secondary-600 mb-3">Design trends, creative projects, and portfolio showcases.</p>
                <span className="text-sm text-secondary-600 font-medium">18K members</span>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-2">Career Development</h4>
                <p className="text-sm text-secondary-600 mb-3">Career transitions, skill development, and professional growth.</p>
                <span className="text-sm text-secondary-600 font-medium">51K members</span>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-2">Job Search Support</h4>
                <p className="text-sm text-secondary-600 mb-3">Interview tips, resume reviews, and job search strategies.</p>
                <span className="text-sm text-secondary-600 font-medium">67K members</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Community Guidelines</h3>
            <p className="text-secondary-600 mb-4">
              To maintain a professional and respectful community, all members agree to:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Treat all members with respect and professionalism</li>
              <li>Share valuable content and insights</li>
              <li>Follow industry best practices and ethics</li>
              <li>Not share confidential or proprietary information</li>
              <li>Avoid self-promotion and spam</li>
              <li>Report inappropriate behavior or content</li>
              <li>Support and mentor other community members</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Expert Contributors</h3>
            <p className="text-secondary-600 mb-4">
              Learn from industry experts who share their knowledge in the JobConnect Professional Community:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Executive coaches and career advisors</li>
              <li>Industry leaders and innovators</li>
              <li>Hiring managers and recruiters</li>
              <li>Successful entrepreneurs</li>
              <li>Certification experts and trainers</li>
            </ul>
          </section>

          <section className="bg-secondary-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Join the Professional Community</h3>
            <p className="text-secondary-600 mb-4">
              Connect with thousands of professionals, expand your network, and advance your career.
            </p>
            <Link to="/register" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
              Join Today
            </Link>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Community Highlights</h3>
            <div className="space-y-3">
              <div className="bg-secondary-100 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-1">Monthly Webinars</h4>
                <p className="text-sm text-secondary-600">Industry experts share insights on career development and industry trends</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-1">Mentorship Matches</h4>
                <p className="text-sm text-secondary-600">Find mentors and mentees to support your professional growth</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-1">Success Stories</h4>
                <p className="text-sm text-secondary-600">Read inspiring stories from members who advanced their careers</p>
              </div>
            </div>
          </section>

          <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4 mt-6">
            <p className="text-sm text-secondary-600">
              Questions about the Professional Community?
              <br />
              Email: community@jobconnect.com
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

export default ProfessionalCommunity;
