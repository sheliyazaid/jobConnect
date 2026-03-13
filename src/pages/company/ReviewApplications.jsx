import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Briefcase, GraduationCap, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

const ReviewApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterJob, setFilterJob] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!currentUser) return;

        // Fetch company's jobs
        const jobsRef = collection(db, 'jobs');
        const jobsQuery = query(jobsRef, where('companyId', '==', currentUser.uid));
        const jobsSnap = await getDocs(jobsQuery);
        const jobsList = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsList);

        // Fetch applications for company's jobs
        const appRef = collection(db, 'applications');
        const appQuery = query(appRef, where('companyId', '==', currentUser.uid), orderBy('appliedAt', 'desc'));
        const appSnap = await getDocs(appQuery);

        const appList = [];
        appSnap.forEach((docSnap) => {
          appList.push({ id: docSnap.id, ...docSnap.data() });
        });

        setApplications(appList);
        if (appList.length > 0) {
          setSelectedApplication(appList[0]);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const handleStatusChange = async (applicationId, newStatus) => {
    if (newStatus === 'rejected' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setUpdatingId(applicationId);
    try {
      const appRef = doc(db, 'applications', applicationId);
      const updateData = {
        status: newStatus,
        updatedAt: new Date(),
      };

      if (newStatus === 'rejected') {
        updateData.rejectionReason = rejectionReason;
      }

      await updateDoc(appRef, updateData);

      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, ...updateData } : app))
      );

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, ...updateData });
      }

      alert(`Application ${newStatus} successfully!`);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800 border-blue-300',
      shortlisted: 'bg-green-100 text-green-800 border-green-300',
      interview: 'bg-purple-100 text-purple-800 border-purple-300',
      accepted: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || colors.applied;
  };

  const getStatusLabel = (status) => {
    const labels = {
      applied: 'Applied',
      shortlisted: 'Shortlisted',
      interview: 'Interview Scheduled',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredApplications = applications.filter((app) => {
    const jobMatch = filterJob === 'all' || app.jobId === filterJob;
    const statusMatch = filterStatus === 'all' || app.status === filterStatus;
    return jobMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">Review Applicants</h1>
        <p className="text-secondary-600 text-lg">Review and manage applications from candidates</p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 card bg-white p-4 flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-secondary-700 font-medium">Filter by Job:</label>
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="px-3 py-2 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-primary-600 text-secondary-900"
          >
            <option value="all">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-secondary-700 font-medium">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-primary-600 text-secondary-900"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview Scheduled</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6 flex-grow min-h-0">
        {/* Applications List */}
        <div className="w-96 card bg-white overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-secondary-200">
            <h2 className="text-lg font-bold text-secondary-900">Applications</h2>
            <p className="text-secondary-600 text-sm">{filteredApplications.length} found</p>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center p-4">
                <Briefcase size={40} className="mx-auto text-secondary-300 mb-3" />
                <p className="text-secondary-600 font-medium">No applications found</p>
              </div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto space-y-1 p-2">
              {filteredApplications.map((application) => (
                <button
                  key={application.id}
                  onClick={() => setSelectedApplication(application)}
                  className={`w-full text-left p-3 rounded-lg transition duration-200 ${
                    selectedApplication?.id === application.id
                      ? 'bg-primary-100 border-2 border-primary-600'
                      : 'hover:bg-secondary-50 border-2 border-transparent'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-secondary-900 truncate">
                      {application.candidateName || 'Unknown'}
                    </p>
                    <p className="text-secondary-600 text-sm truncate">{application.jobTitle}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(application.status)}`}>
                        {getStatusLabel(application.status)}
                      </span>
                      <p className="text-secondary-500 text-xs">{formatDate(application.appliedAt)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Application Details */}
        {selectedApplication ? (
          <div className="flex-grow card bg-white flex flex-col">
            <div className="p-4 border-b border-secondary-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900">
                    {selectedApplication.candidateName || 'Unknown Candidate'}
                  </h3>
                  <p className="text-secondary-600 mt-1">{selectedApplication.jobTitle}</p>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(selectedApplication.status)}`}>
                  {getStatusLabel(selectedApplication.status)}
                </span>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-secondary-900 flex items-center gap-2">
                  <User size={18} className="text-primary-600" />
                  Contact Information
                </h4>
                <div className="bg-secondary-50 rounded-lg p-4 space-y-2">
                  {selectedApplication.candidateEmail && (
                    <div className="flex items-center gap-2 text-secondary-700">
                      <Mail size={16} className="text-primary-600" />
                      <a href={`mailto:${selectedApplication.candidateEmail}`} className="hover:text-primary-600">
                        {selectedApplication.candidateEmail}
                      </a>
                    </div>
                  )}
                  {selectedApplication.candidatePhone && (
                    <div className="flex items-center gap-2 text-secondary-700">
                      <Phone size={16} className="text-primary-600" />
                      <a href={`tel:${selectedApplication.candidatePhone}`} className="hover:text-primary-600">
                        {selectedApplication.candidatePhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience & Skills */}
              <div className="space-y-3">
                <h4 className="font-bold text-secondary-900 flex items-center gap-2">
                  <Briefcase size={18} className="text-primary-600" />
                  Experience & Skills
                </h4>
                {selectedApplication.candidateExperience > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-blue-900 font-medium">
                      {selectedApplication.candidateExperience} {selectedApplication.candidateExperience === 1 ? 'year' : 'years'} of experience
                    </p>
                  </div>
                )}
                {selectedApplication.candidateSkills && selectedApplication.candidateSkills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-secondary-600 text-sm">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.candidateSkills.map((skill, idx) => (
                        <span key={idx} className="bg-accent-100 text-accent-900 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Application Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-secondary-900 flex items-center gap-2">
                  <Clock size={18} className="text-primary-600" />
                  Application Timeline
                </h4>
                <div className="bg-secondary-50 rounded-lg p-4 space-y-2 text-secondary-700 text-sm">
                  <div className="flex justify-between">
                    <span>Applied:</span>
                    <span className="font-medium">{formatDate(selectedApplication.appliedAt)}</span>
                  </div>
                  {selectedApplication.updatedAt && selectedApplication.updatedAt !== selectedApplication.appliedAt && (
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium">{formatDate(selectedApplication.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rejection Reason (if rejected) */}
              {selectedApplication.status === 'rejected' && selectedApplication.rejectionReason && (
                <div className="space-y-3">
                  <h4 className="font-bold text-red-900 flex items-center gap-2">
                    <XCircle size={18} className="text-red-600" />
                    Rejection Reason
                  </h4>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200 text-red-900">
                    {selectedApplication.rejectionReason}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedApplication.status === 'applied' && (
              <div className="p-4 border-t border-secondary-200 flex gap-3">
                <button
                  onClick={() => handleStatusChange(selectedApplication.id, 'shortlisted')}
                  disabled={updatingId === selectedApplication.id}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  {updatingId === selectedApplication.id ? 'Shortlisting...' : 'Shortlist'}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={updatingId === selectedApplication.id}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold border-2 border-red-300 text-red-700 hover:bg-red-50 transition"
                >
                  <XCircle size={18} className="inline mr-2" />
                  Reject
                </button>
              </div>
            )}

            {selectedApplication.status === 'shortlisted' && (
              <div className="p-4 border-t border-secondary-200 flex gap-3">
                <button
                  onClick={() => handleStatusChange(selectedApplication.id, 'interview')}
                  disabled={updatingId === selectedApplication.id}
                  className="flex-1 btn-primary"
                >
                  {updatingId === selectedApplication.id ? 'Scheduling...' : 'Schedule Interview'}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={updatingId === selectedApplication.id}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold border-2 border-red-300 text-red-700 hover:bg-red-50 transition"
                >
                  Reject
                </button>
              </div>
            )}

            {/* Message Button (always available) */}
            {selectedApplication.conversationId && (
              <div className="p-4 border-t border-secondary-200">
                <button className="w-full px-4 py-2 rounded-lg font-semibold border-2 border-secondary-300 text-secondary-700 hover:bg-secondary-50 transition flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  View Conversation
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-grow card bg-white flex items-center justify-center">
            <div className="text-center">
              <User size={48} className="mx-auto text-secondary-300 mb-4" />
              <p className="text-secondary-600 font-semibold text-lg">Select an application</p>
              <p className="text-secondary-500 text-sm mt-2">Choose from the list to view details and take action</p>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-secondary-900 mb-4">Reject Application</h3>
            <p className="text-secondary-600 mb-4">
              Provide a reason for rejection (optional but helpful for the candidate)
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Lack of required experience, Different skill set needed..."
              className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-primary-600 text-secondary-900 resize-none h-24"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg font-semibold border-2 border-secondary-200 text-secondary-700 hover:bg-secondary-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                disabled={updatingId === selectedApplication.id}
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
              >
                {updatingId === selectedApplication.id ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewApplications;
