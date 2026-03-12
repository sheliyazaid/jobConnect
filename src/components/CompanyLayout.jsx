import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, User, Briefcase, LogOut } from 'lucide-react';

const CompanyLayout = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

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
          <p className="text-secondary-300 text-sm mt-1">Company Portal</p>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          {/* Main Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Main</p>
            <Link
              to="/company/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </div>

          {/* Management Section */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Manage</p>
            <Link
              to="/company/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <User size={20} />
              Company Profile
            </Link>
            <Link
              to="/company/post-job"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition font-medium text-white hover:text-white"
            >
              <Briefcase size={20} />
              Post Job
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-secondary-800 space-y-3">
          <div className="text-sm text-secondary-300 mb-3 pb-3 border-b border-secondary-700">
            <p className="font-semibold text-white">{userData?.companyName}</p>
            <p className="text-xs text-secondary-400 text-white">{userData?.email}</p>
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

export default CompanyLayout;
