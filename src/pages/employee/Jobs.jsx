import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search } from 'lucide-react';

const EmployeeJobs = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applying, setApplying] = useState(null);

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

  const handleApply = async (jobId) => {
    if (!currentUser) return;

    setApplying(jobId);
    try {
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      const jobData = jobDoc.data();

      // Check if already applied
      const applicationsRef = collection(db, 'applications');
      const existingQuery = query(
        applicationsRef,
        where('employeeId', '==', currentUser.uid),
        where('jobId', '==', jobId)
      );
      const existingDocs = await getDocs(existingQuery);
      
      if (!existingDocs.empty) {
        alert('You have already applied for this job');
        setApplying(null);
        return;
      }

      await addDoc(collection(db, 'applications'), {
        jobId,
        employeeId: currentUser.uid,
        jobTitle: jobData.title,
        companyName: jobData.companyName,
        companyId: jobData.companyId,
        status: 'applied',
        appliedAt: new Date(),
      });

      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job');
    } finally {
      setApplying(null);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Browse Jobs 🔍
        </h1>
        <p className="text-secondary-600 text-lg mb-6">Find your next opportunity</p>
        <div className="max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-secondary-500" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 text-sm"
            />
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <Briefcase size={40} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-700 font-semibold text-lg">No jobs found</p>
          <p className="text-secondary-600 text-sm mt-2">Try different search terms or browse all available positions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card bg-white hover:shadow-lg transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-secondary-900 text-base">{job.title}</h3>
                  <p className="text-secondary-600 text-sm mt-1">{job.companyName}</p>
                  <p className="text-secondary-500 text-sm mt-2">
                    {job.location} • {job.type || 'Full-time'} {job.salary && `• ${job.salary}`}
                  </p>
                </div>
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={applying === job.id}
                  className="btn-primary whitespace-nowrap text-sm px-4 py-2"
                >
                  {applying === job.id ? 'Applying...' : 'Apply'}
                </button>
              </div>

              {job.description && (
                <p className="text-secondary-600 text-sm mt-3 line-clamp-2">{job.description}</p>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="bg-accent-100 text-accent-900 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="text-secondary-500 text-xs px-2 py-1">+{job.skills.length - 5} more</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeJobs;

