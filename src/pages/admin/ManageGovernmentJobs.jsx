import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Edit, Trash2, LockOpen, Lock, Calendar, MapPin, Users, Eye } from 'lucide-react';

export default function ManageGovernmentJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [departments, setDepartments] = useState(new Set());

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'govJobs'));
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        applicationStartDate: doc.data().applicationStartDate,
        applicationLastDate: doc.data().applicationLastDate,
      }));
      setJobs(jobsData);

      // Extract unique departments
      const depts = new Set(jobsData.map(job => job.department));
      setDepartments(depts);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (filter !== 'all' && filter !== 'department') {
      filtered = jobs.filter(job => job.status === filter);
    }

    setFilteredJobs(filtered);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setEditData({ ...job });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updateData = { ...editData };
      delete updateData.id;

      await updateDoc(doc(db, 'govJobs', selectedJob.id), updateData);
      setSuccess('Job updated successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // Refresh list
      fetchJobs();
      setShowEditModal(false);
      setEditData(null);
    } catch (err) {
      setError('Failed to update job');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'govJobs', selectedJob.id));
      setSuccess('Job deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);

      fetchJobs();
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const handleMarkClosed = async () => {
    try {
      await updateDoc(doc(db, 'govJobs', selectedJob.id), {
        status: selectedJob.status === 'closed' ? 'active' : 'closed'
      });
      setSuccess(`Job marked as ${selectedJob.status === 'closed' ? 'active' : 'closed'}`);
      setTimeout(() => setSuccess(''), 3000);

      fetchJobs();
      setShowCloseModal(false);
    } catch (err) {
      setError('Failed to update job status');
    }
  };

  const getTotalVacancies = (vacancies) => {
    return Object.values(vacancies || {}).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-red-100 text-red-700';
      case 'expired': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Manage Government Jobs</h1>
            <p className="text-secondary-600 mt-2">View and manage all government job postings</p>
          </div>
          <a
            href="/admin/post-government-job"
            className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition hover:text-white font-medium flex items-center gap-2"
          >
            + Post New Job
          </a>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-secondary-900">{jobs.length}</div>
            <div className="text-sm text-secondary-600">Total Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-2xl font-bold text-secondary-900">{jobs.filter(j => j.status === 'active').length}</div>
            <div className="text-sm text-secondary-600">Active Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="text-2xl font-bold text-secondary-900">{jobs.filter(j => j.status === 'closed').length}</div>
            <div className="text-sm text-secondary-600">Closed Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-secondary-900">{jobs.filter(j => j.status === 'expired').length}</div>
            <div className="text-sm text-secondary-600">Expired Jobs</div>
          </div>
        </div>

{/* Filters */}
<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
  <div className="flex flex-wrap gap-2">
    {['all', 'active', 'closed', 'expired'].map(status => {

      const statusColors = {
        all: 'bg-blue-500 text-white',
        active: 'bg-green-500 text-white',
        closed: 'bg-red-500 text-white',
        expired: 'bg-yellow-500 text-white'
      };

      return (
        <button
          key={status}
          onClick={() => setFilter(status)}
          className={`px-4 py-2 rounded-lg transition ${
            filter === status
              ? `${statusColors[status]} shadow-md`
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      );
    })}
  </div>
</div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
        )}

        {/* Jobs Table */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-secondary-600">No government jobs found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Job Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Vacancies</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Last Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {filteredJobs.map((job, idx) => (
                    <tr key={job.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}>
                      <td className="px-6 py-4 text-sm text-secondary-900 font-medium">{job.title}</td>
                      <td className="px-6 py-4 text-sm text-secondary-700">{job.department}</td>
                      <td className="px-6 py-4 text-sm text-secondary-700">{job.location}</td>
                      <td className="px-6 py-4 text-sm text-secondary-700">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {getTotalVacancies(job.vacancies)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(job.applicationLastDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setShowJobModal(true);
                            }}
                            className="p-2 text-secondary-600 hover:bg-secondary-100 rounded transition"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(job)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setShowCloseModal(true);
                            }}
                            className={`p-2 rounded transition ${
                              job.status === 'closed'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-orange-600 hover:bg-orange-50'
                            }`}
                            title={job.status === 'closed' ? 'Reopen' : 'Close'}
                          >
                            {job.status === 'closed' ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
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

      {/* View Job Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-secondary-50 border-b border-secondary-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-secondary-900">Job Details</h3>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-secondary-600 hover:text-secondary-900 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary-600 uppercase font-semibold">Title</p>
                <p className="text-secondary-900 font-medium">{selectedJob.title}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600 uppercase font-semibold">Department</p>
                <p className="text-secondary-900 font-medium">{selectedJob.department}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600 uppercase font-semibold">Location</p>
                <p className="text-secondary-900 font-medium">{selectedJob.location}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600 uppercase font-semibold">Type</p>
                <p className="text-secondary-900 font-medium">{selectedJob.governmentJobType}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600 uppercase font-semibold">Vacancies</p>
                <p className="text-secondary-900 font-medium">{getTotalVacancies(selectedJob.vacancies)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600 uppercase font-semibold">Status</p>
                <p className={`font-medium ${getStatusColor(selectedJob.status)} inline-flex px-2 py-1 rounded`}>
                  {selectedJob.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-600 uppercase font-semibold">Application Last Date</p>
                <p className="text-secondary-900 font-medium">{formatDate(selectedJob.applicationLastDate)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600 uppercase font-semibold">Qualification</p>
                <p className="text-secondary-900 font-medium">{selectedJob.qualification}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-secondary-600 uppercase font-semibold">Description</p>
                <p className="text-secondary-700 text-sm mt-1">{selectedJob.description}</p>
              </div>
              {selectedJob.officialNotificationLink && (
                <div className="col-span-2">
                  <a
                    href={selectedJob.officialNotificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm"
                  >
                    📄 Official Notification Link
                  </a>
                </div>
              )}
            </div>
            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => setShowJobModal(false)}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-secondary-50 border-b border-secondary-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-secondary-900">Edit Job</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-secondary-600 hover:text-secondary-900 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Application Last Date</label>
                <input
                  type="date"
                  value={editData.applicationLastDate}
                  onChange={(e) => setEditData({...editData, applicationLastDate: e.target.value})}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Delete Job?</h3>
              <p className="text-secondary-600 mb-6">
                Are you sure you want to delete "{selectedJob.title}"? This action cannot be undone.
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

      {/* Close Job Modal */}
      {showCloseModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {selectedJob.status === 'closed' ? 'Reopen Job?' : 'Close Job?'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {selectedJob.status === 'closed'
                  ? `Are you sure you want to reopen "${selectedJob.title}"?`
                  : `Are you sure you want to close "${selectedJob.title}"?`}
              </p>
            </div>
            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkClosed}
                className={`px-4 py-2 text-white rounded transition ${
                  selectedJob.status === 'closed'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {selectedJob.status === 'closed' ? 'Reopen' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
