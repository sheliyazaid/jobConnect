import { useState, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import { Navigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Briefcase, Calendar, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

export default function GovernmentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'govApplications'),
        where('employeeId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0));
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredApplications = () => {
    if (filter === 'all') return applications;
    return applications.filter(app => app.status === filter);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const filteredApps = getFilteredApplications();
  const statusCounts = {
    all: applications.length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-secondary-900">My Applications</h1>
          </div>
          <p className="text-secondary-600">Track your government job applications</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'all', label: 'Total', color: 'border-gray-500', bgColor: 'bg-gray-50' },
            { key: 'submitted', label: 'Pending', color: 'border-blue-500', bgColor: 'bg-blue-50' },
            { key: 'approved', label: 'Approved', color: 'border-green-500', bgColor: 'bg-green-50' },
            { key: 'rejected', label: 'Rejected', color: 'border-red-500', bgColor: 'bg-red-50' }
          ].map(stat => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              className={`p-4 rounded-lg border-l-4 transition ${stat.bgColor} ${stat.color} ${
                filter === stat.key ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="text-2xl font-bold text-secondary-900">{statusCounts[stat.key]}</div>
              <div className="text-sm text-secondary-600">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-secondary-100">
          <div className="flex flex-wrap gap-2">
            {['all', 'submitted', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-secondary-100">
            <Briefcase className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600 text-lg">
              {applications.length === 0
                ? 'You haven\'t applied to any government jobs yet'
                : 'No applications found with this status'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map(app => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm border border-secondary-100 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {app.jobTitle}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-secondary-600 text-sm">{app.department}</p>
                  </div>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-secondary-50 rounded-lg text-sm">
                  <div>
                    <p className="text-secondary-600 font-semibold uppercase text-xs mb-1">Applied On</p>
                    <div className="flex items-center gap-2 text-secondary-900 font-medium">
                      <Calendar className="w-4 h-4" />
                      {formatDate(app.appliedAt)}
                    </div>
                  </div>
                  <div>
                    <p className="text-secondary-600 font-semibold uppercase text-xs mb-1">Qualification</p>
                    <p className="text-secondary-900 font-medium">{app.qualification}</p>
                  </div>
                  <div>
                    <p className="text-secondary-600 font-semibold uppercase text-xs mb-1">Experience</p>
                    <p className="text-secondary-900 font-medium">{app.yearsOfExperience || 0} years</p>
                  </div>
                  <div>
                    <p className="text-secondary-600 font-semibold uppercase text-xs mb-1">Updated</p>
                    <p className="text-secondary-900 font-medium">{formatDate(app.updatedAt)}</p>
                  </div>
                </div>

                {/* Contact & Resume */}
                <div className="border-t border-secondary-200 pt-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-secondary-600 text-sm font-semibold mb-1">Email</p>
                      <a href={`mailto:${app.email}`} className="text-primary-600 hover:text-primary-700 hover:underline text-sm font-medium">
                        {app.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-secondary-600 text-sm font-semibold mb-1">Phone</p>
                      <a href={`tel:${app.phone}`} className="text-primary-600 hover:text-primary-700 hover:underline text-sm font-medium">
                        {app.phone}
                      </a>
                    </div>
                    {app.resumeUrl && (
                      <div>
                        <p className="text-secondary-600 text-sm font-semibold mb-1">Resume</p>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback Messages */}
                {app.status === 'approved' && app.approvalNotes && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-semibold mb-1">✓ Approval Notes</p>
                    <p className="text-sm text-green-700">{app.approvalNotes}</p>
                  </div>
                )}

                {app.status === 'rejected' && app.rejectionReason && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-semibold mb-1">✗ Feedback</p>
                    <p className="text-sm text-red-700">{app.rejectionReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
