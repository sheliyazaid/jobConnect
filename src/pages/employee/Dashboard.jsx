import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, CheckCircle, Clock, Mail, User, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import ContactModal from '../../components/ContactModal';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const EmployeeDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!currentUser) return;

        // Fetch applications
        const appRef = collection(db, 'applications');
        const appQuery = query(appRef, where('employeeId', '==', currentUser.uid));
        const appSnapshot = await getDocs(appQuery);
        const appsList = [];
        appSnapshot.forEach((doc) => {
          appsList.push({ id: doc.id, ...doc.data() });
        });
        setApplications(appsList);

        // Fetch saved jobs
        const savedRef = collection(db, 'savedJobs');
        const savedQuery = query(savedRef, where('employeeId', '==', currentUser.uid));
        const savedSnapshot = await getDocs(savedQuery);
        const savedList = [];
        savedSnapshot.forEach((doc) => {
          savedList.push({ id: doc.id, ...doc.data() });
        });
        setSavedJobs(savedList);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Prepare data for charts
  const getApplicationStatusData = () => {
    const statusCounts = {
      applied: applications.filter(a => a.status === 'applied').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      interview: applications.filter(a => a.status === 'interview').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };

    return [
      { name: 'Under Review', value: statusCounts.applied, color: '#3B82F6' },
      { name: 'Shortlisted', value: statusCounts.shortlisted, color: '#10B981' },
      { name: 'Interview', value: statusCounts.interview, color: '#A855F7' },
      { name: 'Rejected', value: statusCounts.rejected, color: '#EF4444' },
    ].filter(item => item.value > 0);
  };

  // Get applications timeline data (last 7 days)
  const getApplicationsTimeline = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const count = applications.filter(app => {
        const appDate = app.appliedAt instanceof Timestamp
          ? app.appliedAt.toDate()
          : new Date(app.appliedAt);
        return appDate.toDateString() === date.toDateString();
      }).length;

      last7Days.push({ date: dateStr, applications: count });
    }
    return last7Days;
  };

  // Compare saved vs applied
  const getSavedVsApplied = () => {
    return [
      { name: 'Applied', count: applications.length },
      { name: 'Saved', count: savedJobs.length },
    ];
  };

  // Calculate stats
  const stats = {
    totalApplications: applications.length,
    totalSavedJobs: savedJobs.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interviews: applications.filter(a => a.status === 'interview').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statusData = getApplicationStatusData();
  const timelineData = getApplicationsTimeline();
  const savedVsAppliedData = getSavedVsApplied();

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 pb-6 border-b border-secondary-200">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Welcome back, {userData?.firstName} 👋
        </h1>
        <p className="text-secondary-600 text-lg">Here's an overview of your job search activity</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.totalApplications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium">Saved Jobs</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.totalSavedJobs}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium">Shortlisted</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.shortlisted}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium">Interview Invites</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.interviews}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Status Distribution */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <PieChartIcon size={24} className="text-primary-600" />
            Application Status Distribution
          </h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-secondary-500">
              <p>No applications yet. Start applying to jobs!</p>
            </div>
          )}
        </div>

        {/* Saved vs Applied Jobs */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-primary-600" />
            Applications Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={savedVsAppliedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#09637E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Application Timeline */}
      <div className="card bg-white mb-8">
        <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
          <Clock size={24} className="text-primary-600" />
          Application Activity (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#09637E"
              strokeWidth={2}
              dot={{ fill: '#09637E', r: 5 }}
              activeDot={{ r: 7 }}
              name="Applications Submitted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center Content - Shortcuts */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Links</h2>
            <Link
              to="/employee/jobs"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">Browse More Jobs</p>
                <p className="text-secondary-600 text-sm">Explore new opportunities</p>
              </div>
              <Briefcase size={24} className="text-secondary-900" />
            </Link>
            <Link
              to="/employee/applied-jobs"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">View Applied Jobs</p>
                <p className="text-secondary-600 text-sm">Track your applications</p>
              </div>
              <FileText size={24} className="text-secondary-900" />
            </Link>
            <Link
              to="/employee/saved-jobs"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">View Saved Jobs</p>
                <p className="text-secondary-600 text-sm">Check your bookmarked positions</p>
              </div>
              <TrendingUp size={24} className="text-secondary-900" />
            </Link>
            <Link
              to="/employee/profile"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">Update Profile</p>
                <p className="text-secondary-600 text-sm">Manage your personal information</p>
              </div>
              <User size={24} className="text-secondary-900" />
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="card bg-white">
            <h3 className="font-semibold text-secondary-900 mb-4 text-sm">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-secondary-600 font-medium mb-1">Status</p>
                <p className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                  Active
                </p>
              </div>
              <div>
                <p className="text-secondary-600 font-medium mb-1">Email</p>
                <p className="text-secondary-900 break-all text-xs">{userData?.email}</p>
              </div>
              <div>
                <p className="text-secondary-600 font-medium mb-1">Phone</p>
                <p className="text-secondary-900">{userData?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-secondary-600 font-medium mb-1">Location</p>
                <p className="text-secondary-900">{userData?.address || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-white">
            <h3 className="font-semibold text-secondary-900 mb-4 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/employee/jobs"
                className="block w-full bg-secondary-900 text-white px-4 py-2 rounded-lg hover:bg-secondary-800 transition text-xs font-medium text-center"
              >
                Browse Jobs
              </Link>
              <Link
                to="/employee/notifications"
                className="block w-full bg-secondary-100 text-secondary-900 px-4 py-2 rounded-lg hover:bg-secondary-200 transition text-xs font-medium text-center"
              >
                Notifications
              </Link>
              <Link
                to="/employee/messages"
                className="block w-full bg-accent-100 text-accent-700 px-4 py-2 rounded-lg hover:bg-accent-200 transition text-xs font-medium text-center"
              >
                Messages
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="card bg-white">
            <h3 className="font-semibold text-secondary-900 mb-4 text-sm">Need Help?</h3>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-accent-100 text-accent-700 px-4 py-2 rounded-lg hover:bg-accent-200 transition text-xs font-medium"
            >
              <Mail size={14} />
              Contact Admin
            </button>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default EmployeeDashboard;

