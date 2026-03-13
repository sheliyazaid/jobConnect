import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Mail,
  PieChart as PieChartIcon,
} from 'lucide-react';
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

const CompanyDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!currentUser) return;

        // Fetch all jobs posted by this company
        const jobsRef = collection(db, 'jobs');
        const jobsQuery = query(jobsRef, where('companyId', '==', currentUser.uid));
        const jobsSnapshot = await getDocs(jobsQuery);
        const jobsList = [];
        jobsSnapshot.forEach((doc) => {
          jobsList.push({ id: doc.id, ...doc.data() });
        });
        setJobs(jobsList);

        // Fetch all applications for this company's jobs
        const appRef = collection(db, 'applications');
        const applicationsForCompany = [];

        for (const job of jobsList) {
          const appQuery = query(appRef, where('jobId', '==', job.id));
          const appSnapshot = await getDocs(appQuery);
          appSnapshot.forEach((doc) => {
            applicationsForCompany.push({ id: doc.id, ...doc.data() });
          });
        }

        setApplications(applicationsForCompany);

        // Get 5 most recent applications
        const sorted = applicationsForCompany
          .sort((a, b) => {
            const dateA = a.appliedAt instanceof Timestamp ? a.appliedAt.toDate() : new Date(a.appliedAt);
            const dateB = b.appliedAt instanceof Timestamp ? b.appliedAt.toDate() : new Date(b.appliedAt);
            return dateB - dateA;
          })
          .slice(0, 5);

        setRecentApplications(sorted);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Calculate stats
  const stats = {
    totalJobs: jobs.length,
    totalApplications: applications.length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    interviews: applications.filter((a) => a.status === 'interview').length,
    underReview: applications.filter((a) => a.status === 'applied').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  // Get application status data
  const getApplicationStatusData = () => {
    return [
      { name: 'Under Review', value: stats.underReview, color: '#3B82F6' },
      { name: 'Shortlisted', value: stats.shortlisted, color: '#10B981' },
      { name: 'Interview', value: stats.interviews, color: '#A855F7' },
      { name: 'Rejected', value: stats.rejected, color: '#EF4444' },
    ].filter((item) => item.value > 0);
  };

  // Get application timeline (last 7 days)
  const getApplicationTimeline = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const count = applications.filter((app) => {
        const appDate = app.appliedAt instanceof Timestamp ? app.appliedAt.toDate() : new Date(app.appliedAt);
        return appDate.toDateString() === date.toDateString();
      }).length;

      last7Days.push({ date: dateStr, applications: count });
    }
    return last7Days;
  };

  // Get job status data
  const getJobStats = () => {
    const active = jobs.filter((j) => j.status === 'active').length;
    const closed = jobs.filter((j) => j.status === 'closed').length;
    const paused = jobs.filter((j) => j.status === 'paused' || !j.status).length;

    return [
      { name: 'Active', count: active },
      { name: 'Paused', count: paused },
      { name: 'Closed', count: closed },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statusData = getApplicationStatusData();
  const timelineData = getApplicationTimeline();
  const jobStatsData = getJobStats();

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 pb-6 border-b border-secondary-200">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Welcome back, {userData?.companyName} 👋
        </h1>
        <p className="text-secondary-600 text-lg">Here's an overview of your recruitment activity</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium">Active Jobs</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.totalJobs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.totalApplications}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-orange-600" />
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
              <p className="text-secondary-600 text-sm font-medium">Interviews Scheduled</p>
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
              <p>No applications yet. Post a job to start recruiting!</p>
            </div>
          )}
        </div>

        {/* Job Status Overview */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-primary-600" />
            Job Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobStatsData}>
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
              name="Applications Received"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center Content - Quick Links */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Links</h2>
            <Link
              to="/company/post-job"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">Post New Job</p>
                <p className="text-secondary-600 text-sm">Create a new job listing</p>
              </div>
              <Plus size={24} className="text-secondary-900" />
            </Link>
            <Link
              to="/company/manage-jobs"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">Manage Jobs</p>
                <p className="text-secondary-600 text-sm">Edit or view your job listings</p>
              </div>
              <Briefcase size={24} className="text-secondary-900" />
            </Link>
            <Link
              to="/company/applicants"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">Review Applicants</p>
                <p className="text-secondary-600 text-sm">Evaluate and manage candidates</p>
              </div>
              <Users size={24} className="text-secondary-900" />
            </Link>
            <Link
              to="/company/profile"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">Company Profile</p>
                <p className="text-secondary-600 text-sm">Update your company information</p>
              </div>
              <Eye size={24} className="text-secondary-900" />
            </Link>
          </div>
        </div>

        {/* Sidebar - Recent Applications */}
        <div className="space-y-6">
          {/* Recent Applications */}
          <div className="card bg-white">
            <h3 className="font-semibold text-secondary-900 mb-4 text-sm">Recent Applications</h3>
            {recentApplications.length > 0 ? (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div key={app.id} className="pb-3 border-b border-secondary-100 last:border-0 last:pb-0">
                    <p className="text-secondary-900 font-medium text-sm truncate">{app.candidateName || 'Anonymous'}</p>
                    <p className="text-secondary-600 text-xs">
                      {app.appliedAt instanceof Timestamp
                        ? app.appliedAt.toDate().toLocaleDateString()
                        : new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                        app.status === 'shortlisted'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : app.status === 'interview'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {app.status?.replace('_', ' ').charAt(0).toUpperCase() + app.status?.slice(1) || 'Applied'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 text-sm">No applications yet</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card bg-white">
            <h3 className="font-semibold text-secondary-900 mb-4 text-sm">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <p className="text-secondary-600">Under Review</p>
                <p className="font-bold text-secondary-900">{stats.underReview}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-secondary-600">Shortlisted</p>
                <p className="font-bold text-green-600">{stats.shortlisted}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-secondary-600">Interviews</p>
                <p className="font-bold text-purple-600">{stats.interviews}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-secondary-600">Rejected</p>
                <p className="font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-white">
            <h3 className="font-semibold text-secondary-900 mb-4 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/company/post-job"
                className="block w-full bg-secondary-900 text-white px-4 py-2 rounded-lg hover:bg-secondary-800 transition text-xs font-medium text-center"
              >
                Post Job
              </Link>
              <Link
                to="/company/applicants"
                className="block w-full bg-secondary-100 text-secondary-900 px-4 py-2 rounded-lg hover:bg-secondary-200 transition text-xs font-medium text-center"
              >
                View Applicants
              </Link>
              <Link
                to="/company/messages"
                className="block w-full bg-accent-100 text-accent-700 px-4 py-2 rounded-lg hover:bg-accent-200 transition text-xs font-medium text-center"
              >
                Messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
