import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Trash2, X, Briefcase } from 'lucide-react';

const CompanyManageJobs = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | active | inactive | closed
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!currentUser) return;

        const jobsRef = collection(db, 'jobs');
        const jobsQuery = query(jobsRef, where('companyId', '==', currentUser.uid));
        const querySnapshot = await getDocs(jobsQuery);

        const jobsList = [];
        const appRef = collection(db, 'applications');

        for (const jobDoc of querySnapshot.docs) {
          const job = jobDoc.data();
          const appQuery = query(appRef, where('jobId', '==', jobDoc.id));
          const appSnap = await getDocs(appQuery);

          jobsList.push({
            id: jobDoc.id,
            ...job,
            totalApplications: appSnap.size,
          });
        }

        setJobs(jobsList);
      } catch (error) {
        console.error('Error fetching company jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentUser]);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: newStatus,
      });
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)),
      );
      if (selectedJob?.id === jobId) {
        setSelectedJob({ ...selectedJob, status: newStatus });
      }
      alert('Job status updated successfully!');
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      if (selectedJob?.id === jobId) {
        setShowModal(false);
      }
      alert('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const filteredJobs =
    filter === 'all' ? jobs : jobs.filter((job) => (job.status || 'inactive') === filter);

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
        <h1 className="text-4xl font-bold text-secondary-900 flex items-center gap-3">
          <Briefcase size={40} />
          Manage Job Listings
        </h1>
        <p className="text-secondary-700 mt-2">
          View, update, pause or delete the jobs you have posted.
        </p>
      </div>

      <div className="card bg-white mb-6">
        <label className="block text-sm font-bold text-secondary-900 mb-3">Filter by Status:</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'All Jobs', color: 'bg-secondary-100' },
            { value: 'active', label: 'Active', color: 'bg-green-100' },
            { value: 'inactive', label: 'Inactive', color: 'bg-gray-100' },
            { value: 'closed', label: 'Closed', color: 'bg-red-100' },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === btn.value
                  ? `${btn.color} text-secondary-900 ring-2 ring-secondary-900`
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <p className="text-secondary-700 text-lg">No jobs found for this filter.</p>
        </div>
      ) : (
        <div className="card bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200 bg-secondary-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                  Applicants
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <tr
                  key={job.id}
                  className={`border-b border-secondary-100 hover:bg-secondary-50 transition ${
                    index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-secondary-900">{job.title}</p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {job.description?.substring(0, 60)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-secondary-700">{job.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-secondary-700 text-sm capitalize">
                      {job.type || 'full-time'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        (job.status || 'inactive') === 'active'
                          ? 'bg-green-100 text-green-800'
                          : (job.status || 'inactive') === 'closed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {(job.status || 'inactive').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-secondary-900 font-semibold">
                      {job.totalApplications}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowModal(true);
                        }}
                        className="flex items-center justify-center gap-1 bg-blue-600 text-white px-2 py-1.5 rounded hover:bg-blue-700 transition text-xs"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            job.id,
                            (job.status || 'inactive') === 'active' ? 'inactive' : 'active',
                          )
                        }
                        className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition ${
                          (job.status || 'inactive') === 'active'
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        title={
                          (job.status || 'inactive') === 'active' ? 'Deactivate' : 'Activate'
                        }
                      >
                        {(job.status || 'inactive') === 'active' ? (
                          <>
                            <EyeOff size={14} />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye size={14} />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-secondary-100 p-6">
              <h2 className="text-2xl font-bold text-secondary-900">Job Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-secondary-400 hover:text-secondary-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-secondary-600 text-sm font-medium">Job Title</p>
                  <p className="text-secondary-900 font-semibold text-lg">{selectedJob.title}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Location</p>
                  <p className="text-secondary-900">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Job Type</p>
                  <p className="text-secondary-900 capitalize">
                    {selectedJob.type || 'full-time'}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Salary</p>
                  <p className="text-secondary-900">{selectedJob.salary || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                      (selectedJob.status || 'inactive') === 'active'
                        ? 'bg-green-100 text-green-800'
                        : (selectedJob.status || 'inactive') === 'closed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {(selectedJob.status || 'inactive').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Total Applications</p>
                  <p className="text-secondary-900 font-semibold">
                    {selectedJob.totalApplications}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-secondary-600 text-sm font-medium">Description</p>
                  <p className="text-secondary-700">{selectedJob.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-secondary-600 text-sm font-medium mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-900 text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-secondary-100 p-6 flex gap-3">
              <button
                onClick={() => {
                  handleStatusChange(
                    selectedJob.id,
                    (selectedJob.status || 'inactive') === 'active' ? 'inactive' : 'active',
                  );
                  setShowModal(false);
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                  (selectedJob.status || 'inactive') === 'active'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {(selectedJob.status || 'inactive') === 'active' ? (
                  <>
                    <EyeOff size={18} />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye size={18} />
                    Activate
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedJob.id);
                }}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center gap-2 bg-secondary-100 text-secondary-900 px-4 py-2 rounded-lg hover:bg-secondary-200 transition font-medium"
              >
                <X size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManageJobs;


