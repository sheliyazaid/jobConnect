import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

const JobsPreview = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRef = collection(db, 'jobs');
        const q = query(jobsRef, where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        const jobsList = [];
        querySnapshot.forEach((doc) => {
          jobsList.push({ id: doc.id, ...doc.data() });
        });
        setJobs(jobsList);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header + search */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-3">
              Browse Job Opportunities
            </h1>
            <p className="text-secondary-700 text-base md:text-lg max-w-2xl">
              Discover roles from verified companies that match your skills and career goals.
            </p>
          </div>
          <div className="w-full md:max-w-sm">
            <label className="block text-xs font-semibold text-secondary-700 mb-2 uppercase tracking-wide">
              Search jobs
            </label>
            <input
              type="text"
              placeholder="Search by title or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-secondary-200 rounded-lg bg-white focus:outline-none focus:border-secondary-900 text-secondary-900 text-sm"
            />
          </div>
        </div>

        {/* Jobs grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-secondary-200 py-16 px-6 text-center">
            <p className="text-secondary-700 text-lg mb-2">No jobs found.</p>
            <p className="text-secondary-500 text-sm">
              Try adjusting your search or check back soon for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-secondary-200 transition p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">
                    {job.type || 'Full‑time'}
                  </p>
                  <h3 className="text-lg font-semibold text-secondary-900 line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {job.companyName || 'Company confidential'} •{' '}
                    {job.location || 'Location flexible'}
                  </p>
                  {/* <p className="text-sm text-secondary-600 line-clamp-3">
                    {job.description}
                  </p> */}
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full bg-primary-100 text-secondary-900 text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-secondary-900 hover:text-secondary-700"
                  >
                    View details
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-500 text-white hover:bg-accent-600"
                  >
                    Apply now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <div className="inline-block bg-white rounded-xl border border-secondary-200 px-8 py-6 shadow-sm">
            <p className="text-secondary-700 mb-3 text-sm md:text-base">
              Want to unlock full job details and apply in one click?
            </p>
            <Link
              to="/register"
              className="inline-block bg-accent-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-accent-600 text-sm"
            >
              Create your free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPreview;

