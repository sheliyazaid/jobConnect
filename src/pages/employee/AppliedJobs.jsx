import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, CheckCircle, Clock, XCircle, MessageSquare, MapPin, Video } from 'lucide-react';

const AppliedJobs = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, applied, shortlisted, rejected, interview

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!currentUser) return;

        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('employeeId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const applicationsList = [];

        querySnapshot.forEach((doc) => {
          applicationsList.push({ id: doc.id, ...doc.data() });
        });

        // Sort by applied date (newest first)
        applicationsList.sort((a, b) => {
          const dateA = a.appliedAt instanceof Timestamp ? a.appliedAt.toDate() : new Date(a.appliedAt);
          const dateB = b.appliedAt instanceof Timestamp ? b.appliedAt.toDate() : new Date(b.appliedAt);
          return dateB - dateA;
        });

        setApplications(applicationsList);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: Clock };
      case 'shortlisted':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle };
      case 'rejected':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircle };
      case 'interview':
        return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: MessageSquare };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: Briefcase };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'applied':
        return 'Under Review';
      case 'shortlisted':
        return 'Shortlisted';
      case 'rejected':
        return 'Rejected';
      case 'interview':
        return 'Interview Invited';
      default:
        return status;
    }
  };

  const formatDate = (date) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    if (date instanceof Timestamp) {
      date = date.toDate();
    } else if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interview: applications.filter(a => a.status === 'interview').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          My Applications 📋
        </h1>
        <p className="text-secondary-600 text-lg">Track your job applications and their status</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.total}</p>
            </div>
            <Briefcase size={28} className="text-primary-600" />
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">Under Review</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{stats.applied}</p>
            </div>
            <Clock size={28} className="text-blue-600" />
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">Shortlisted</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{stats.shortlisted}</p>
            </div>
            <CheckCircle size={28} className="text-green-600" />
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">Interviews</p>
              <p className="text-3xl font-bold text-purple-700 mt-2">{stats.interview}</p>
            </div>
            <MessageSquare size={28} className="text-purple-600" />
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-700 mt-2">{stats.rejected}</p>
            </div>
            <XCircle size={28} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === 'all'
              ? 'btn-primary'
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterStatus('applied')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === 'applied'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
          }`}
        >
          Under Review ({stats.applied})
        </button>
        <button
          onClick={() => setFilterStatus('shortlisted')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === 'shortlisted'
              ? 'bg-green-600 text-white'
              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
          }`}
        >
          Shortlisted ({stats.shortlisted})
        </button>
        <button
          onClick={() => setFilterStatus('interview')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === 'interview'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
          }`}
        >
          Interviews ({stats.interview})
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === 'rejected'
              ? 'bg-red-600 text-white'
              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
          }`}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <Briefcase size={40} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-700 font-semibold text-lg">No applications found</p>
          <p className="text-secondary-600 text-sm mt-2">
            {filterStatus === 'all'
              ? 'Start applying to jobs to see them here'
              : `No applications with "${getStatusLabel(filterStatus)}" status`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const statusInfo = getStatusColor(app.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={app.id} className="card bg-white hover:shadow-lg transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 text-lg">{app.jobTitle}</h3>
                    <p className="text-secondary-600 text-sm mt-1">{app.companyName}</p>

                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-secondary-600 text-sm">
                        <Calendar size={16} />
                        <span>Applied {formatDate(app.appliedAt)}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${statusInfo.text} font-semibold text-sm`}>
                        <StatusIcon size={16} />
                        <span>{getStatusLabel(app.status)}</span>
                      </div>
                    </div>

                    {/* Interview Details (when scheduled) */}
                    {app.status === 'interview' && (
                      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                        <h4 className="font-semibold text-purple-900 text-sm">Interview Details</h4>
                        {app.interviewDate && (
                          <div className="flex items-center gap-2 text-purple-800 text-sm">
                            <Calendar size={14} />
                            <span>{formatDateTime(app.interviewDate)}</span>
                          </div>
                        )}
                        {app.interviewMode && (
                          <div className="flex items-center gap-2 text-purple-800 text-sm">
                            {app.interviewMode === 'online' ? <Video size={14} /> : <MapPin size={14} />}
                            <span className="capitalize">{app.interviewMode}</span>
                            {app.interviewLocation && <span className="text-purple-700">- {app.interviewLocation}</span>}
                          </div>
                        )}
                        {app.interviewNotes && (
                          <div className="text-purple-800 text-sm">
                            <p className="font-medium">Notes:</p>
                            <p className="mt-1">{app.interviewNotes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/employee/job/${app.jobId}`)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      View Job
                    </button>
                    {app.conversationId && (
                      <button
                        onClick={() => navigate(`/employee/messages?conv=${app.conversationId}`)}
                        className="px-4 py-2 rounded-lg font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition text-sm flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={16} />
                        Message
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`mt-4 inline-block px-4 py-2 rounded-full ${statusInfo.bg} border ${statusInfo.border}`}>
                  <p className={`font-medium text-sm ${statusInfo.text}`}>{getStatusLabel(app.status)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
