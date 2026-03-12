import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, Eye, Plus, Mail } from 'lucide-react';
import ContactModal from '../../components/ContactModal';

const CompanyDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // Fetch company's jobs
        const jobsRef = collection(db, 'jobs');
        const jobsQuery = query(jobsRef, where('companyId', '==', currentUser.uid));
        const jobsSnapshot = await getDocs(jobsQuery);
        const jobsList = [];
        jobsSnapshot.forEach((doc) => {
          jobsList.push({ id: doc.id, ...doc.data() });
        });
        setJobs(jobsList);

        // Fetch applications for company's jobs
        const applicationsRef = collection(db, 'applications');
        const applicationsQuery = query(applicationsRef, where('companyId', '==', currentUser.uid));
        const applicationsSnapshot = await getDocs(applicationsQuery);
        const applicationsList = [];
        applicationsSnapshot.forEach((doc) => {
          applicationsList.push({ id: doc.id, ...doc.data() });
        });
        setApplications(applicationsList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

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
          Welcome, {userData?.companyName}
        </h1>
        <p className="text-secondary-700 mt-2">Manage your job postings and review applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-secondary-900 mb-1">
                {jobs.length}
              </div>
              <div className="text-secondary-700 font-semibold text-sm">Job Postings</div>
            </div>
            <Briefcase size={28} className="text-accent-500" />
          </div>
          <div className="text-xs text-secondary-600 mt-2">Active listings</div>
        </div>

        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-1">
                {applications.filter(app => app.status === 'under_review' || app.status === 'applied').length}
              </div>
              <div className="text-secondary-700 font-semibold text-sm">Pending</div>
            </div>
            <Eye size={28} className="text-yellow-600" />
          </div>
          <div className="text-xs text-secondary-600 mt-2">Awaiting review</div>
        </div>

        <div className="card bg-white hover:shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-1">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-secondary-700 font-semibold text-sm">Accepted</div>
            </div>
            <FileText size={28} className="text-green-600" />
          </div>
          <div className="text-xs text-secondary-600 mt-2">Hired candidates</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/company/post-job"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Post New Job
            </Link>
            <Link
              to="/company/applicants"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              View All Applications
            </Link>
            <Link
              to="/company/profile"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Edit Company Profile
            </Link>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-accent-100 text-accent-700 px-4 py-2.5 rounded-lg hover:bg-accent-200 transition text-sm font-medium"
            >
              <Mail size={16} />
              Contact Admin
            </button>
          </div>
        </div>

        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center p-3 bg-primary-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Total Applications:</span>
              <span className="text-2xl font-bold text-secondary-900">{applications.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Pending Review:</span>
              <span className="text-2xl font-bold text-secondary-900">
                {applications.filter(app => app.status === 'under_review' || app.status === 'applied').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Accepted:</span>
              <span className="text-2xl font-bold text-secondary-900">
                {applications.filter(app => app.status === 'accepted').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
              <span className="text-secondary-700 font-semibold">Rejected:</span>
              <span className="text-2xl font-bold text-secondary-900">
                {applications.filter(app => app.status === 'rejected').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">Recent Applications</h2>
      </div>

      {applications.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <FileText size={48} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-700 text-lg font-medium mb-4">No applications yet.</p>
          <p className="text-secondary-600 text-sm mb-6">Post your first job to start receiving applications!</p>
          <Link
            to="/company/post-job"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.slice(0, 5).map((application) => (
            <div key={application.id} className="card bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {application.jobTitle}
                  </h3>
                  <p className="text-secondary-600 text-sm">
                    Applied on {new Date(application.appliedAt?.toDate?.() || application.appliedAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ml-4 ${
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
          <div className="text-center mt-6">
            <Link
              to="/company/applicants"
              className="text-secondary-900 hover:text-accent-600 font-semibold flex items-center justify-center gap-2"
            >
              View All Applications →
            </Link>
          </div>
        </div>
      )}

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default CompanyDashboard;

