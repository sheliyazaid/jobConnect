import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, CheckCircle, Clock, Mail, User } from 'lucide-react';
import ContactModal from '../../components/ContactModal';

const EmployeeDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 pb-6 border-b border-secondary-200">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Welcome back, {userData?.firstName} 👋
        </h1>
        <p className="text-secondary-600 text-lg">Here's what's happening with your job search</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium mb-2">Welcome</p>
              <p className="text-2xl font-bold text-secondary-900">{userData?.firstName}</p>
            </div>
            <div className="w-14 h-14 bg-accent-50 rounded-lg flex items-center justify-center">
              <Briefcase size={28} className="text-accent-500" />
            </div>
          </div>
          <p className="text-xs text-secondary-600 mt-3">Job Seeker</p>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium mb-2">Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={28} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-secondary-600 mt-3">Account approved</p>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium mb-2">Profession</p>
              <p className="text-2xl font-bold text-secondary-900">{userData?.profession || 'Not set'}</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText size={28} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-secondary-600 mt-3">Current role</p>
        </div>
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
              to="/employee/applications"
              className="card bg-white hover:shadow-lg transition flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-secondary-900">View All Applications</p>
                <p className="text-secondary-600 text-sm">See full details of all applications</p>
              </div>
              <FileText size={24} className="text-secondary-900" />
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
          {/* Quick Actions */}
          <div className="card bg-white">
            <h3 className="font-semibold text-secondary-900 mb-4 text-sm">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-secondary-600 font-medium mb-1">Email</p>
                <p className="text-secondary-900 break-all">{userData?.email}</p>
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
            <div className="space-y-3">
              <Link
                to="/employee/jobs"
                className="block w-full bg-secondary-900 text-white px-4 py-2.5 rounded-lg hover:bg-secondary-800 transition text-sm font-medium text-center"
              >
                Browse Jobs
              </Link>
              <Link
                to="/employee/applications"
                className="block w-full bg-secondary-100 text-secondary-900 px-4 py-2.5 rounded-lg hover:bg-secondary-200 transition text-sm font-medium text-center"
              >
                My Applications
              </Link>
              <Link
                to="/employee/skills"
                className="block w-full bg-accent-100 text-accent-700 px-4 py-2.5 rounded-lg hover:bg-accent-200 transition text-sm font-medium text-center"
              >
                Update Skills
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="card bg-white">
            <h3 className="font-semibold text-secondary-900 mb-4 text-sm">Need Help?</h3>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-accent-100 text-accent-700 px-4 py-2.5 rounded-lg hover:bg-accent-200 transition text-sm font-medium"
            >
              <Mail size={16} />
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

