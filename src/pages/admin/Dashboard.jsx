import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';
import { Users, Building2, Briefcase, FileText, Clock, TrendingUp, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalEmployees: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch companies
        const companiesRef = collection(db, 'users');
        const companiesQuery = query(companiesRef, where('role', '==', 'company'));
        const companiesSnapshot = await getDocs(companiesQuery);
        const companies = companiesSnapshot.size;
        const pendingCompanies = companiesSnapshot.docs.filter(
          doc => doc.data().status === 'pending'
        ).length;

        // Fetch employees
        const employeesQuery = query(companiesRef, where('role', '==', 'employee'));
        const employeesSnapshot = await getDocs(employeesQuery);
        const employees = employeesSnapshot.size;
        const pendingEmployees = employeesSnapshot.docs.filter(
          doc => doc.data().status === 'pending'
        ).length;

        // Fetch jobs
        const jobsRef = collection(db, 'jobs');
        const jobsSnapshot = await getDocs(jobsRef);
        const jobs = jobsSnapshot.size;

        // Fetch applications
        const applicationsRef = collection(db, 'applications');
        const applicationsSnapshot = await getDocs(applicationsRef);
        const applications = applicationsSnapshot.size;

        setStats({
          totalCompanies: companies,
          totalEmployees: employees,
          totalJobs: jobs,
          totalApplications: applications,
          pendingApprovals: pendingCompanies + pendingEmployees,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 flex items-center gap-3">
          <LayoutDashboard size={40} />
          Admin Dashboard
        </h1>
        <p className="text-secondary-700 mt-2">Real-time platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-secondary-900 mb-1">
                {stats.totalCompanies}
              </div>
              <div className="text-secondary-700 font-semibold text-sm">Companies</div>
            </div>
            <Building2 size={28} className="text-accent-500" />
          </div>
          <div className="text-xs text-secondary-600 mt-2">Total registered</div>
        </div>

        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-accent-500 mb-1">
                {stats.totalEmployees}
              </div>
              <div className="text-secondary-700 font-semibold text-sm">Job Seekers</div>
            </div>
            <Users size={28} className="text-secondary-900" />
          </div>
          <div className="text-xs text-secondary-600 mt-2">Active employees</div>
        </div>

        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-1">
                {stats.totalJobs}
              </div>
              <div className="text-secondary-700 font-semibold text-sm">Active Jobs</div>
            </div>
            <Briefcase size={28} className="text-green-600" />
          </div>
          <div className="text-xs text-secondary-600 mt-2">Job postings</div>
        </div>

        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-1">
                {stats.totalApplications}
              </div>
              <div className="text-secondary-700 font-semibold text-sm">Applications</div>
            </div>
            <FileText size={28} className="text-purple-600" />
          </div>
          <div className="text-xs text-secondary-600 mt-2">Total submissions</div>
        </div>

        <div className="card bg-white hover:shadow-2xl border-yellow-300">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-1">
                {stats.pendingApprovals}
              </div>
              <div className="text-secondary-700 font-semibold text-sm">Pending</div>
            </div>
            <Clock size={28} className="text-yellow-600" />
          </div>
          <div className="text-xs text-secondary-600 mt-2">Awaiting approval</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/approve-users"
              className="block btn-primary text-center flex items-center justify-center gap-2"
            >
              <Clock size={18} />
              Review Pending Approvals
            </Link>
            <Link
              to="/admin/manage-companies"
              className="block btn-secondary text-center flex items-center justify-center gap-2"
            >
              <Building2 size={18} />
              Manage Companies
            </Link>
            <Link
              to="/admin/manage-employees"
              className="block btn-secondary text-center flex items-center justify-center gap-2"
            >
              <Users size={18} />
              Manage Employees
            </Link>
            <Link
              to="/admin/manage-jobs"
              className="block btn-secondary text-center flex items-center justify-center gap-2"
            >
              <Briefcase size={18} />
              Manage Job Postings
            </Link>
          </div>
        </div>

        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Platform Statistics</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center p-3 bg-primary-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Total Users:</span>
              <span className="text-2xl font-bold text-secondary-900">{stats.totalCompanies + stats.totalEmployees}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Active Companies:</span>
              <span className="text-2xl font-bold text-secondary-900">{stats.totalCompanies}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Job Seekers:</span>
              <span className="text-2xl font-bold text-secondary-900">{stats.totalEmployees}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Job Postings:</span>
              <span className="text-2xl font-bold text-secondary-900">{stats.totalJobs}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Total Applications:</span>
              <span className="text-2xl font-bold text-secondary-900">{stats.totalApplications}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="card bg-gradient-to-r from-secondary-900 to-secondary-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 text-white">System Health</h3>
            <p className="text-white/80">All systems operational. Last updated just now.</p>
          </div>
          <Link
            to="/admin/reports"
            className="btn-accent flex items-center gap-2 text-white hover:text-white"
          >
            <TrendingUp size={18} />
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

