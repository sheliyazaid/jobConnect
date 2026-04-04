import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, CheckCircle, BarChart3, Building2, Users, Briefcase, LogOut, Mail, FileText, Eye } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-secondary-900 text-white shadow-2xl flex flex-col">
        <div className="p-8 border-b border-secondary-800 ">
          <h1 className="text-3xl font-bold tracking-wide text-white">JobConnect</h1>
          {/* <p className="text-secondary-300 text-sm mt-1">Control Panel</p> */}
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          {/* Main Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Main</p>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </div>

          {/* Management Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Management</p>
            <Link
              to="/admin/manage-companies"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Building2 size={20} />
              Companies
            </Link>
            <Link
              to="/admin/manage-employees"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Users size={20} />
              Employees
            </Link>
            <Link
              to="/admin/manage-jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Briefcase size={20} />
              Job Postings
            </Link>
          </div>

          {/* Actions Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Actions</p>
            <Link
              to="/admin/approve-users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <CheckCircle size={20} />
              Pending Approvals
            </Link>
          </div>

          {/* Support Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Support</p>
            <Link
              to="/admin/contacts"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Mail size={20} />
              Messages
            </Link>
          </div>

          {/* Analytics Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Analytics</p>
            <Link
              to="/admin/reports"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <BarChart3 size={20} />
              Reports
            </Link>
          </div>

          {/* Government Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Government</p>
            <Link
              to="/admin/post-government-job"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <FileText size={20} />
              Post Job
            </Link>
            <Link
              to="/admin/manage-government-jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Briefcase size={20} />
              Manage Jobs
            </Link>
            <Link
              to="/admin/government-applications"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Eye size={20} />
              Applications
            </Link>
            {/* <Link
              to="/admin/government-notifications"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Mail size={20} />
              Notifications
            </Link> */}
            <Link
              to="/admin/expired-government-jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <BarChart3 size={20} />
              Expired Jobs
            </Link>
            <Link
              to="/admin/government-categories"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Briefcase size={20} />
              Categories
            </Link>
            <Link
              to="/admin/government-reports"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <BarChart3 size={20} />
              Reports
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-secondary-800 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2.5 rounded-lg font-medium transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-primary-100 min-h-screen overflow-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
