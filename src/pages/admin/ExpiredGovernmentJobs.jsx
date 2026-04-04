import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Archive, Trash2, Calendar } from 'lucide-react';

export default function ExpiredGovernmentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchExpiredJobs();
  }, []);

  const fetchExpiredJobs = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'govJobs'));
      const allJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter jobs that are closed or past application deadline
      const today = new Date();
      const expiredJobs = allJobs.filter(job => {
        const lastDate = new Date(job.applicationLastDate);
        return job.status === 'closed' || job.status === 'expired' || lastDate < today;
      }).sort((a, b) => new Date(b.applicationLastDate) - new Date(a.applicationLastDate));

      setJobs(expiredJobs);
    } catch (err) {
      setError('Failed to fetch expired jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (jobId) => {
    try {
      await updateDoc(doc(db, 'govJobs', jobId), {
        status: 'expired'
      });
      setSuccess('Job archived successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchExpiredJobs();
    } catch (err) {
      setError('Failed to archive job');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'govJobs', selectedJob.id));
      setSuccess('Job deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchExpiredJobs();
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysExpired = (lastDate) => {
    const today = new Date();
    const expire = new Date(lastDate);
    const diffTime = today - expire;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days ago` : 'Expires soon';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Archive className="w-8 h-8 text-secondary-600" />
            <h1 className="text-3xl font-bold text-secondary-900">Expired Government Jobs</h1>
          </div>
          <p className="text-secondary-600 mt-2">Manage jobs past their application deadline</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="text-2xl font-bold text-secondary-900">{jobs.length}</div>
          <div className="text-sm text-secondary-600">Expired Jobs</div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
        )}

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-secondary-600">No expired jobs found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Job Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Last Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {jobs.map((job, idx) => (
                    <tr key={job.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}>
                      <td className="px-6 py-4 text-sm text-secondary-900 font-medium">{job.title}</td>
                      <td className="px-6 py-4 text-sm text-secondary-700">{job.department}</td>
                      <td className="px-6 py-4 text-sm text-secondary-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-secondary-400" />
                          <div>
                            <div>{formatDate(job.applicationLastDate)}</div>
                            <div className="text-xs text-secondary-500">{getDaysExpired(job.applicationLastDate)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'expired'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {job.status !== 'expired' && (
                            <button
                              onClick={() => handleArchive(job.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Delete Job?</h3>
              <p className="text-secondary-600 mb-6">
                Are you sure you want to permanently delete "{selectedJob.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
