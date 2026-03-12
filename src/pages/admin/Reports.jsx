import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BarChart3, Users, Building2, Briefcase, FileText, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Reports = () => {
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalEmployees: 0,
    totalJobs: 0,
    totalApplications: 0,
    jobsByStatus: { active: 0, inactive: 0 },
    applicationsByStatus: { pending: 0, accepted: 0, rejected: 0 },
    jobTrendData: [],
    applicationTrendData: [],
    userDistributionData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch users data
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const totalUsers = usersSnapshot.size;

        const companies = usersSnapshot.docs.filter(
          doc => doc.data().role === 'company'
        ).length;
        const employees = usersSnapshot.docs.filter(
          doc => doc.data().role === 'employee'
        ).length;

        // Fetch jobs data
        const jobsRef = collection(db, 'jobs');
        const jobsSnapshot = await getDocs(jobsRef);
        const totalJobs = jobsSnapshot.size;
        const activeJobs = jobsSnapshot.docs.filter(
          doc => doc.data().status === 'active'
        ).length;

        // Fetch applications data
        const applicationsRef = collection(db, 'applications');
        const applicationsSnapshot = await getDocs(applicationsRef);
        const totalApplications = applicationsSnapshot.size;
        const pendingApps = applicationsSnapshot.docs.filter(
          doc => doc.data().status === 'pending'
        ).length;
        const acceptedApps = applicationsSnapshot.docs.filter(
          doc => doc.data().status === 'accepted'
        ).length;
        const rejectedApps = applicationsSnapshot.docs.filter(
          doc => doc.data().status === 'rejected'
        ).length;

        // Process trend data for jobs (past 30 days)
        const jobTrendMap = {};
        jobsSnapshot.docs.forEach((doc) => {
          const createdAt = doc.data().createdAt;
          if (createdAt) {
            const date = createdAt.toDate
              ? createdAt.toDate().toLocaleDateString('en-IN')
              : new Date(createdAt).toLocaleDateString('en-IN');
            jobTrendMap[date] = (jobTrendMap[date] || 0) + 1;
          }
        });
        const jobTrendData = Object.entries(jobTrendMap)
          .map(([date, count]) => ({ date, jobs: count }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-30);

        // Process trend data for applications (past 30 days)
        const appTrendMap = {};
        applicationsSnapshot.docs.forEach((doc) => {
          const appliedAt = doc.data().appliedAt;
          if (appliedAt) {
            const date = appliedAt.toDate
              ? appliedAt.toDate().toLocaleDateString('en-IN')
              : new Date(appliedAt).toLocaleDateString('en-IN');
            appTrendMap[date] = (appTrendMap[date] || 0) + 1;
          }
        });
        const applicationTrendData = Object.entries(appTrendMap)
          .map(([date, count]) => ({ date, applications: count }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-30);

        // User distribution data for pie chart
        const userDistributionData = [
          { name: 'Companies', value: companies },
          { name: 'Job Seekers', value: employees },
        ];

        setReportData({
          totalUsers,
          totalCompanies: companies,
          totalEmployees: employees,
          totalJobs,
          totalApplications,
          jobsByStatus: {
            active: activeJobs,
            inactive: totalJobs - activeJobs,
          },
          applicationsByStatus: {
            pending: pendingApps,
            accepted: acceptedApps,
            rejected: rejectedApps,
          },
          jobTrendData,
          applicationTrendData,
          userDistributionData,
        });
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-900"></div>
      </div>
    );
  }

  const COLORS = ['#09637E', '#FF6B35'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 flex items-center gap-3">
          <BarChart3 size={40} />
          Platform Reports
        </h1>
        <p className="text-secondary-700 mt-2">Comprehensive analytics and platform insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-secondary-600 font-medium mb-2">Total Users</div>
              <div className="text-4xl font-bold text-secondary-900">{reportData.totalUsers}</div>
            </div>
            <Users size={32} className="text-secondary-900 opacity-30" />
          </div>
        </div>
        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-secondary-600 font-medium mb-2">Total Jobs</div>
              <div className="text-4xl font-bold text-accent-500">{reportData.totalJobs}</div>
            </div>
            <Briefcase size={32} className="text-accent-500 opacity-30" />
          </div>
        </div>
        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-secondary-600 font-medium mb-2">Total Applications</div>
              <div className="text-4xl font-bold text-secondary-900">{reportData.totalApplications}</div>
            </div>
            <FileText size={32} className="text-secondary-900 opacity-30" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Job Postings Trend */}
        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-accent-600" />
            Job Postings Trend (30 Days)
          </h2>
          {reportData.jobTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.jobTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke="#FF6B35"
                  name="Jobs Posted"
                  strokeWidth={2}
                  dot={{ fill: '#FF6B35', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex items-center justify-center text-secondary-500">
              No data available
            </div>
          )}
        </div>

        {/* Applications Trend */}
        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600" />
            Applications Trend (30 Days)
          </h2>
          {reportData.applicationTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.applicationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="applications" fill="#3B82F6" name="Applications" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex items-center justify-center text-secondary-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* User Distribution Chart */}
      <div className="card bg-white mb-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
          <Users size={24} className="text-secondary-900" />
          User Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            {reportData.userDistributionData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.userDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportData.userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-secondary-500 w-full">
                No data available
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-2">
                <Building2 size={20} className="text-blue-600" />
                <span className="text-secondary-700 font-semibold">Companies</span>
              </div>
              <div className="text-4xl font-bold text-blue-900">{reportData.totalCompanies}</div>
              <p className="text-sm text-secondary-600 mt-2">
                {reportData.totalUsers > 0
                  ? Math.round((reportData.totalCompanies / reportData.totalUsers) * 100)
                  : 0}
                % of total users
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-orange-600" />
                <span className="text-secondary-700 font-semibold">Job Seekers</span>
              </div>
              <div className="text-4xl font-bold text-orange-900">{reportData.totalEmployees}</div>
              <p className="text-sm text-secondary-600 mt-2">
                {reportData.totalUsers > 0
                  ? Math.round((reportData.totalEmployees / reportData.totalUsers) * 100)
                  : 0}
                % of total users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Distribution - Progress Bars */}
        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <Users size={24} />
            User Breakdown
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-secondary-700 font-medium flex items-center gap-2">
                  <Building2 size={16} />
                  Companies
                </span>
                <span className="font-bold text-secondary-900 text-lg">{reportData.totalCompanies}</span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-3">
                <div
                  className="bg-secondary-900 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      reportData.totalUsers > 0
                        ? (reportData.totalCompanies / reportData.totalUsers) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                {reportData.totalUsers > 0
                  ? Math.round((reportData.totalCompanies / reportData.totalUsers) * 100)
                  : 0}% of total users
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-secondary-700 font-medium flex items-center gap-2">
                  <Users size={16} />
                  Job Seekers
                </span>
                <span className="font-bold text-secondary-900 text-lg">{reportData.totalEmployees}</span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-3">
                <div
                  className="bg-accent-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      reportData.totalUsers > 0
                        ? (reportData.totalEmployees / reportData.totalUsers) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                {reportData.totalUsers > 0
                  ? Math.round((reportData.totalEmployees / reportData.totalUsers) * 100)
                  : 0}% of total users
              </p>
            </div>
          </div>
        </div>

        {/* Jobs Status */}
        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <Briefcase size={24} />
            Job Postings Status
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-secondary-700 font-medium flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-600" />
                  Active Jobs
                </span>
                <span className="font-bold text-secondary-900 text-lg">{reportData.jobsByStatus.active}</span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      reportData.totalJobs > 0
                        ? (reportData.jobsByStatus.active / reportData.totalJobs) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                {reportData.totalJobs > 0
                  ? Math.round((reportData.jobsByStatus.active / reportData.totalJobs) * 100)
                  : 0}% of total jobs
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-secondary-700 font-medium flex items-center gap-2">
                  Inactive Jobs
                </span>
                <span className="font-bold text-secondary-900 text-lg">{reportData.jobsByStatus.inactive}</span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      reportData.totalJobs > 0
                        ? (reportData.jobsByStatus.inactive / reportData.totalJobs) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                {reportData.totalJobs > 0
                  ? Math.round((reportData.jobsByStatus.inactive / reportData.totalJobs) * 100)
                  : 0}% of total jobs
              </p>
            </div>
          </div>
        </div>

        {/* Applications Status */}
        <div className="card bg-white md:col-span-2">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <FileText size={24} />
            Applications Status Overview
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary-100 p-6 rounded-lg border-2 border-primary-200">
              <div className="text-sm text-secondary-600 font-medium mb-2">Pending Review</div>
              <div className="text-4xl font-bold text-secondary-900">
                {reportData.applicationsByStatus.pending}
              </div>
              <div className="text-sm text-secondary-600 mt-3 font-medium">
                {reportData.totalApplications > 0
                  ? Math.round(
                      (reportData.applicationsByStatus.pending / reportData.totalApplications) * 100
                    )
                  : 0}
                %
              </div>
              <div className="w-full bg-primary-200 rounded-full h-2 mt-3">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      reportData.totalApplications > 0
                        ? (reportData.applicationsByStatus.pending / reportData.totalApplications) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-green-100 p-6 rounded-lg border-2 border-green-200">
              <div className="text-sm text-green-700 font-medium mb-2">Accepted</div>
              <div className="text-4xl font-bold text-green-900">
                {reportData.applicationsByStatus.accepted}
              </div>
              <div className="text-sm text-green-700 mt-3 font-medium">
                {reportData.totalApplications > 0
                  ? Math.round(
                      (reportData.applicationsByStatus.accepted / reportData.totalApplications) * 100
                    )
                  : 0}
                %
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-3">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      reportData.totalApplications > 0
                        ? (reportData.applicationsByStatus.accepted / reportData.totalApplications) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-red-100 p-6 rounded-lg border-2 border-red-200">
              <div className="text-sm text-red-700 font-medium mb-2">Rejected</div>
              <div className="text-4xl font-bold text-red-900">
                {reportData.applicationsByStatus.rejected}
              </div>
              <div className="text-sm text-red-700 mt-3 font-medium">
                {reportData.totalApplications > 0
                  ? Math.round(
                      (reportData.applicationsByStatus.rejected / reportData.totalApplications) * 100
                    )
                  : 0}
                %
              </div>
              <div className="w-full bg-red-200 rounded-full h-2 mt-3">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      reportData.totalApplications > 0
                        ? (reportData.applicationsByStatus.rejected / reportData.totalApplications) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
