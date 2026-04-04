import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Briefcase, User, LogOut, FileText, Award, BookMarked, CheckSquare, Bell, MessageCircle, Settings, Flag } from 'lucide-react';

const EmployeeLayout = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Collapse sidebar to icons on Jobs page
  const isJobsPage = location.pathname === '/employee/jobs';
  const sidebarWidth = isJobsPage ? 'w-20' : 'w-72';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-secondary-900 text-white shadow-2xl flex flex-col">
        <div className="p-8 border-b border-secondary-800">
          <h1 className="text-3xl font-bold tracking-wide text-white">JobConnect</h1>
          <p className="text-secondary-300 text-sm mt-1">Job Seeker Portal</p>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          {/* Main Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Main</p>
            <Link
              to="/employee/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </div>

          {/* Opportunities Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Opportunities</p>
            <Link
              to="/employee/jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Briefcase size={20} />
              Browse Jobs
            </Link>
            <Link
              to="/employee/applied-jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <CheckSquare size={20} />
              Applied Jobs
            </Link>
            <Link
              to="/employee/saved-jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <BookMarked size={20} />
              Saved Jobs
            </Link>
          </div>

          {/* Government Jobs Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Government Jobs</p>
            <Link
              to="/employee/government-jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Briefcase size={20} />
              Browse Jobs
            </Link>
            <Link
              to="/employee/government-applications"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <CheckSquare size={20} />
              My Applications
            </Link>
          </div>

          {/* Updates Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Updates</p>
            <Link
              to="/employee/notifications"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Bell size={20} />
              Notifications
            </Link>
            <Link
              to="/employee/messages"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <MessageCircle size={20} />
              Messages
            </Link>
          </div>

          {/* Profile Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Profile</p>
            <Link
              to="/employee/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <User size={20} />
              My Profile
            </Link>
            <Link
              to="/employee/skills"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Award size={20} />
              Skills & Experience
            </Link>
          </div>

          {/* Settings Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Settings</p>
            <Link
              to="/employee/account-settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Settings size={20} />
              Account Settings
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-secondary-800 space-y-3">
          <div className="text-sm text-secondary-300 mb-3 pb-3 border-b border-secondary-700">
            <p className="font-semibold text-white">{userData?.firstName} {userData?.lastName}</p>
            <p className="text-xs text-secondary-400">{userData?.email}</p>
          </div>
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

export default EmployeeLayout;
