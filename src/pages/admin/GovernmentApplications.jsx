import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, XCircle, Eye, Download, Filter, Clock } from 'lucide-react';

export default function GovernmentApplications() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobFilter, setJobFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, jobFilter, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'govApplications'));
      const appData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(appData);
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'govJobs'));
      const jobData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobData);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const applyFilters = () => {
    let filtered = applications;

    if (filter !== 'all') {
      filtered = filtered.filter(app => app.status === filter);
    }

    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.govJobId === jobFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleApprove = async () => {
    try {
      const updateData = {
        status: 'approved',
        approvalNotes: approvalNotes,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'govApplications', selectedApplication.id), updateData);

      await addDoc(collection(db, 'govNotifications'), {
        employeeId: selectedApplication.employeeId,
        govJobId: selectedApplication.govJobId,
        jobTitle: selectedApplication.jobTitle,
        type: 'application_approved',
        title: 'Application Approved',
        message: `Your application for ${selectedApplication.jobTitle} has been approved!`,
        isRead: false,
        createdAt: serverTimestamp()
      });

      setSuccess('Application approved successfully!');
      setTimeout(() => setSuccess(''), 3000);

      fetchApplications();
      setShowApproveModal(false);
      setApprovalNotes('');
    } catch (err) {
      setError('Failed to approve application');
    }
  };

  const handleReject = async () => {
    try {
      const updateData = {
        status: 'rejected',
        rejectionReason: rejectionReason,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'govApplications', selectedApplication.id), updateData);

      await addDoc(collection(db, 'govNotifications'), {
        employeeId: selectedApplication.employeeId,
        govJobId: selectedApplication.govJobId,
        jobTitle: selectedApplication.jobTitle,
        type: 'application_rejected',
        title: 'Application Not Selected',
        message: `Your application for ${selectedApplication.jobTitle} has not been selected.`,
        isRead: false,
        createdAt: serverTimestamp()
      });

      setSuccess('Application rejected successfully!');
      setTimeout(() => setSuccess(''), 3000);

      fetchApplications();
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err) {
      setError('Failed to reject application');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr?.seconds ? dateStr.seconds * 1000 : dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <h1 className="text-3xl font-bold text-secondary-900">Applications Review</h1>
          <p className="text-secondary-600 mt-2">Review and manage government job applications</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'all', label: 'Total', color: 'border-gray-500' },
            { key: 'submitted', label: 'Pending', color: 'border-blue-500', icon: Clock },
            { key: 'approved', label: 'Approved', color: 'border-green-500', icon: CheckCircle },
            { key: 'rejected', label: 'Rejected', color: 'border-red-500', icon: XCircle }
          ].map(stat => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              className={`p-4 rounded-lg border-l-4 transition ${filter === stat.key
                ? `${stat.color} border-2 bg-primary-50 shadow-md`
                : `${stat.color} bg-white hover:shadow-md`
                }`}
            >
              <div className="text-2xl font-bold text-secondary-900">{statusCounts[stat.key]}</div>
              <div className="text-sm text-secondary-600 font-medium">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-secondary-100">
          <div className="flex flex-wrap items-center gap-4">

            {/* Title */}
            <div className="flex items-center gap-2 text-secondary-700 font-medium">
              <Filter className="w-5 h-5" />
              Filters:
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2">
              {['all', 'submitted', 'approved', 'rejected'].map(status => {

                const statusColors = {
                  all: 'bg-gray-500 text-white',
                  submitted: 'bg-blue-500 text-white',
                  approved: 'bg-green-500 text-white',
                  rejected: 'bg-red-500 text-white'
                };

                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                        ? `${statusColors[status]} shadow-md`
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Dropdown */}
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Table */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-secondary-100">
            <p className="text-secondary-600 text-lg">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-secondary-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Job</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Qualification</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Applied</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {filteredApplications.map((app, idx) => (
                    <tr key={app.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-secondary-50 hover:bg-secondary-100'}>
                      <td className="px-6 py-4 text-sm text-secondary-900 font-medium">{app.fullName}</td>
                      <td className="px-6 py-4 text-sm text-secondary-700">{app.jobTitle}</td>
                      <td className="px-6 py-4 text-sm text-secondary-700">{app.qualification}</td>
                      <td className="px-6 py-4 text-sm text-secondary-700">{formatDate(app.appliedAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowViewModal(true);
                            }}
                            className="p-2 text-secondary-600 hover:bg-secondary-100 rounded transition"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {app.status === 'submitted' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setShowApproveModal(true);
                                }}
                                className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setShowRejectModal(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
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

      {/* Modals */}
      {/* View Modal */}
      {showViewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-secondary-50 border-b border-secondary-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-secondary-900">Application Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-secondary-600 hover:text-secondary-900 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold">Name</p>
                  <p className="text-secondary-900 font-medium">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold">Email</p>
                  <p className="text-secondary-900 font-medium text-sm">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold">Phone</p>
                  <p className="text-secondary-900 font-medium">{selectedApplication.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold">Qualification</p>
                  <p className="text-secondary-900 font-medium">{selectedApplication.qualification}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold">Experience</p>
                  <p className="text-secondary-900 font-medium">{selectedApplication.yearsOfExperience || 0} years</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold">Job</p>
                  <p className="text-secondary-900 font-medium">{selectedApplication.jobTitle}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-secondary-600 uppercase font-semibold">Address</p>
                  <p className="text-secondary-900 font-medium">{selectedApplication.address}</p>
                </div>
                {selectedApplication.resumeUrl && (
                  <div className="col-span-2">
                    <p className="text-xs text-secondary-600 uppercase font-semibold">Resume</p>
                    <a
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 hover:underline text-sm flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-lg font-semibold text-secondary-900">Approve Application?</h3>
              </div>
              <p className="text-secondary-600 mb-4">
                Are you sure you want to approve {selectedApplication.fullName}'s application for {selectedApplication.jobTitle}?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">Approval Notes (Optional)</label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes or feedback..."
                  rows="3"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setApprovalNotes('');
                }}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-lg font-semibold text-secondary-900">Reject Application?</h3>
              </div>
              <p className="text-secondary-600 mb-4">
                Are you sure you want to reject {selectedApplication.fullName}'s application?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">Rejection Reason (Optional)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this application is being rejected..."
                  rows="3"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
