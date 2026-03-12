import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const EmployeeApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;

      try {
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('employeeId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const applicationsList = [];
        querySnapshot.forEach((doc) => {
          applicationsList.push({ id: doc.id, ...doc.data() });
        });
        setApplications(applicationsList.sort((a, b) => new Date(b.appliedAt?.toDate?.() || b.appliedAt) - new Date(a.appliedAt?.toDate?.() || a.appliedAt)));
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
      case 'accepted':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Accepted' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' };
      case 'under_review':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Under Review' };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: FileText, label: 'Submitted' };
    }
  };

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const stats = {
    total: applications.length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-900"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-secondary-200">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2 flex items-center gap-3">
          <FileText size={40} />
          My Applications
        </h1>
        <p className="text-secondary-600 text-lg">Track all your job applications and their status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium mb-2">Total</p>
              <p className="text-4xl font-bold text-secondary-900">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText size={28} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium mb-2">Under Review</p>
              <p className="text-4xl font-bold text-yellow-600">{stats.under_review}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock size={28} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium mb-2">Accepted</p>
              <p className="text-4xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={28} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium mb-2">Rejected</p>
              <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="w-14 h-14 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle size={28} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'under_review', 'accepted', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? 'bg-secondary-900 text-white'
                : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
            }`}
          >
            {status === 'all' ? 'All Applications' :
             status === 'under_review' ? 'Under Review' :
             status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-secondary-400" />
          </div>
          <p className="text-secondary-700 font-medium mb-2">No applications found</p>
          <p className="text-secondary-600 text-sm">
            {filterStatus === 'all'
              ? 'You haven\'t applied to any jobs yet'
              : `No ${filterStatus.replace('_', ' ')} applications`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const statusInfo = getStatusColor(application.status);
            const StatusIcon = statusInfo.icon;
            return (
              <div key={application.id} className="card bg-white hover:shadow-lg transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="font-semibold text-secondary-900 text-lg">{application.jobTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusInfo.bg} ${statusInfo.text} flex items-center gap-1`}>
                        <StatusIcon size={16} />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-secondary-700 font-medium mb-1">{application.companyName}</p>
                    <p className="text-secondary-600 text-sm mb-3">{application.jobDescription || 'Job description not available'}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-secondary-600">Location</p>
                        <p className="text-secondary-900 font-medium">{application.location || 'Remote'}</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Salary</p>
                        <p className="text-secondary-900 font-medium">{application.salary || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Applied</p>
                        <p className="text-secondary-900 font-medium">
                          {new Date(application.appliedAt?.toDate?.() || application.appliedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeApplications;
