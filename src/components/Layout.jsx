import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                JobConnect
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {!currentUser ? (
                <>
                  <Link
                    to="/jobs"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    to="/companies"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Companies
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    About
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  {userData?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {userData?.role === 'company' && (
                    <>
                      <Link
                        to="/company/dashboard"
                        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/company/post-job"
                        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Post Job
                      </Link>
                    </>
                  )}
                  {userData?.role === 'employee' && (
                    <>
                      <Link
                        to="/employee/dashboard"
                        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employee/jobs"
                        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Browse Jobs
                      </Link>
                      <Link
                        to="/employee/profile"
                        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobConnect</h3>
              <p className="text-gray-400">
                Connecting companies with talented job seekers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">About</Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-white">Browse Jobs</Link>
                </li>
                <li>
                  <Link to="/companies" className="hover:text-white">Companies</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: info@jobconnect.com
                <br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 JobConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

