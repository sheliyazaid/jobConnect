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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Job Opportunities</h1>
        <p className="text-gray-600 mb-6">
          Discover exciting career opportunities from verified companies
        </p>
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No jobs found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-primary-600 font-medium mb-2">{job.companyName}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                <span>{job.location}</span> • <span>{job.type || 'Full-time'}</span>
              </div>
              <Link
                to="/login"
                className="block text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Want to see more opportunities? Create an account to access full job details and apply!
        </p>
        <Link
          to="/register"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          Sign Up Now
        </Link>
      </div>
    </div>
  );
};

export default JobsPreview;

