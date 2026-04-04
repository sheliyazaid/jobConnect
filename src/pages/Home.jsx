import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-primary-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-800 text-xs font-semibold uppercase tracking-wide text-white">
              Smart job & talent matching
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Find the right job or the perfect hire in days, not months.
            </h1>
            <p className="text-lg md:text-2xl text-secondary-200">
              JobConnect connects skilled professionals with verified companies through a modern,
              data‑driven hiring experience.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/jobs"
                className="w-full sm:w-auto bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 hover:text-white transition text-sm md:text-base"
              >
                Browse Jobs
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto border-2 border-secondary-200 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-secondary-900 transition text-sm md:text-base"
              >
                I’m Hiring – Post a Job
              </Link>
            </div>

            {/* Simple search hint */}
            <p className="text-xs md:text-sm text-secondary-200">
              No account yet? You can still explore jobs and companies — sign up when you’re ready to apply.
            </p>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 bg-primary-100 border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-900">Explore by Job Category</h2>
              <p className="text-secondary-600 mt-2 text-sm md:text-base">
                Quickly discover roles that match your background and interests.
              </p>
            </div>
            <Link
              to="/jobs"
              className="hidden md:inline-flex text-secondary-900 text-sm font-semibold hover:text-secondary-700"
            >
              View all jobs &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { label: 'Software & IT', count: '120+' },
              { label: 'Design & Creative', count: '60+' },
              { label: 'Marketing', count: '45+' },
              { label: 'Sales & BD', count: '35+' },
              { label: 'Finance', count: '30+' },
              { label: 'Internships', count: '50+' },
            ].map((cat) => (
              <Link
                key={cat.label}
                to="/jobs"
                className="group rounded-xl border border-secondary-200 bg-white hover:border-secondary-900 hover:bg-secondary-50 transition p-3 md:p-4 flex flex-col justify-between"
              >
                <span className="text-xs md:text-sm font-semibold text-secondary-900 group-hover:text-secondary-900">
                  {cat.label}
                </span>
                <span className="mt-1 text-[11px] md:text-xs text-secondary-500">
                  {cat.count} openings
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-900">Featured Jobs</h2>
              <p className="text-secondary-600 mt-2 text-sm md:text-base">
                Hand‑picked roles from fast‑growing companies.
              </p>
            </div>
            <Link
              to="/jobs"
              className="text-secondary-900 text-sm font-semibold hover:text-secondary-700"
            >
              Browse all jobs &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Senior Frontend Engineer',
                company: 'NovaTech Labs',
                location: 'Remote',
                type: 'Full‑time',
                tags: ['React', 'TypeScript', 'UI'],
              },
              {
                title: 'Product Designer',
                company: 'Brightside Studio',
                location: 'Bengaluru, India',
                type: 'Hybrid',
                tags: ['Figma', 'UX Research', 'Design Systems'],
              },
              {
                title: 'Digital Marketing Specialist',
                company: 'Growthify',
                location: 'Mumbai, India',
                type: 'Full‑time',
                tags: ['SEO', 'Performance Ads', 'Analytics'],
              },
            ].map((job) => (
              <div
                key={job.title}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-secondary-200 transition p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">
                    {job.type}
                  </p>
                  <h3 className="text-lg font-semibold text-secondary-900">{job.title}</h3>
                  <p className="text-sm text-secondary-600">
                    {job.company} • {job.location}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-primary-100 text-secondary-900 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to="/jobs"
                    className="text-sm font-semibold text-secondary-900 hover:text-secondary-700"
                  >
                    View details
                  </Link>
                  <Link
                    to="/login"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-500 text-white hover:bg-accent-600 hover:text-white"
                  >
                    Apply now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 bg-primary-100 border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-900">Top Companies Hiring</h2>
              <p className="text-secondary-600 mt-2 text-sm md:text-base">
                Discover organizations that care about culture, growth and flexibility.
              </p>
            </div>
            <Link
              to="/companies"
              className="text-secondary-900 text-sm font-semibold hover:text-secondary-700"
            >
              View all companies &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              'Acme Corp',
              'NovaTech',
              'Brightside',
              'Growthify',
              'CloudNine',
              'FinEdge',
            ].map((name) => (
              <Link
                key={name}
                to="/companies"
                className="group rounded-xl border border-secondary-200 bg-white hover:bg-secondary-50 hover:border-secondary-900 transition p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 border border-secondary-200 mb-3" />
                <p className="text-xs md:text-sm font-semibold text-secondary-900 group-hover:text-secondary-900">
                  {name}
                </p>
                <p className="mt-1 text-[11px] text-secondary-500">View profile</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-10">
            How JobConnect Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Create your profile',
                desc: 'Share your skills, experience and preferences so we can match you with the right roles.',
              },
              {
                step: '2',
                title: 'Browse curated jobs',
                desc: 'Explore verified opportunities from companies that match your interests.',
              },
              {
                step: '3',
                title: 'Apply & message',
                desc: 'Apply with a few clicks and chat with recruiters directly on the platform.',
              },
              {
                step: '4',
                title: 'Interview & get hired',
                desc: 'Track your applications, manage interviews and accept offers with confidence.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-xl shadow-sm border border-secondary-200 p-5 flex flex-col h-full"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-secondary-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-secondary-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-primary-100 border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-10">
            Built for modern hiring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Smart job matching',
                desc: 'See roles that align with your skills, experience and preferences first.',
              },
              {
                title: 'Applicant tracking',
                desc: 'Companies manage applications, shortlist candidates and schedule interviews in one place.',
              },
              {
                title: 'Real‑time notifications',
                desc: 'Stay updated when you get shortlisted, receive a message, or an interview invite.',
              },
              {
                title: 'Saved jobs & profiles',
                desc: 'Save interesting jobs to revisit later and keep your profile ready to apply.',
              },
              {
                title: 'Secure in‑app messaging',
                desc: 'Discuss details, share clarifications and coordinate interviews without leaving the platform.',
              },
              {
                title: 'Company dashboards',
                desc: 'Employers get a powerful view into job performance, applicants and interview pipelines.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-secondary-200 bg-white p-5 hover:bg-secondary-50 hover:border-secondary-900 transition"
              >
                <h3 className="text-base md:text-lg font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-secondary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900">
            Ready to take the next step in your career or hiring journey?
          </h2>
          <p className="text-sm md:text-lg text-secondary-600">
            Join JobConnect for free and start matching with the right opportunities today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition text-sm md:text-base hover:text-white"
            >
              Get Started Free
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto border-2 border-secondary-600 text-secondary-600 px-8 py-3 rounded-lg font-semibold hover:bg-secondary-800 transition text-sm md:text-base hover:text-white hover:border-secondary-800"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

