import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

const Layout = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-100">
      {/* Top navigation */}
      <nav className="sticky top-0 z-40 bg-secondary-900/95 backdrop-blur shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-xs font-bold text-secondary-900 shadow-sm">
                JC
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg md:text-xl font-bold text-white">JobConnect</span>
                <span className="text-[10px] md:text-[11px] text-secondary-300 uppercase tracking-wide">
                  Jobs • Talent • Hiring
                </span>
              </div>
            </Link>

            {/* Public navigation links */}
            <div className="hidden md:flex items-center gap-1 bg-secondary-800/60 rounded-full px-2 py-1 border border-secondary-700">
              {!currentUser && (
                <>
                  <Link
                    to="/jobs"
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-100 hover:text-white hover:bg-secondary-700 transition"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    to="/companies"
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-100 hover:text-white hover:bg-secondary-700 transition"
                  >
                    Companies
                  </Link>
                  <Link
                    to="/about"
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-100 hover:text-white hover:bg-secondary-700 transition"
                  >
                    About
                  </Link>
                </>
              )}
            </div>

            {/* Auth / dashboard actions */}
            <div className="flex items-center gap-2">
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-100 hover:text-white hover:bg-secondary-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-accent-500 text-white hover:bg-accent-600 hover:text-white transition shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {userData?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-100 hover:text-white hover:bg-secondary-700 transition"
                    >
                      Admin
                    </Link>
                  )}
                  {userData?.role === 'company' && (
                    <>
                      <Link
                        to="/company/dashboard"
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-100 hover:text-white hover:bg-secondary-700 transition"
                      >
                        Company
                      </Link>
                      <Link
                        to="/company/post-job"
                        className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-500 text-white hover:bg-accent-600 transition"
                      >
                        Post Job
                      </Link>
                    </>
                  )}
                  {userData?.role === 'employee' && (
                    <>
                      <Link
                        to="/employee/dashboard"
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-100 hover:text-white hover:bg-secondary-700 transition"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employee/jobs"
                        className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-100 hover:text-white hover:bg-secondary-700 transition"
                      >
                        My Jobs
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-200 hover:text-white hover:bg-secondary-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

