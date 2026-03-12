import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Download } from 'lucide-react';

const CompanyApplicants = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // Fetch applications
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

  const filteredApplications = selectedJob === 'all'
    ? applications
    : applications.filter(app => app.jobId === selectedJob);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: newStatus,
      });
      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      alert(`Application ${newStatus === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status');
    }
  };

  const viewApplicantProfile = async (employeeId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', employeeId));
      if (userDoc.exists()) {
        setApplicantProfile(userDoc.data());
        setSelectedApplication(employeeId);
      }
    } catch (error) {
      console.error('Error fetching applicant profile:', error);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applicants</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Job:</label>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {application.jobTitle}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Applied on {new Date(application.appliedAt?.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => viewApplicantProfile(application.employeeId)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    View Profile
                  </button>
                  {application.status === 'applied' || application.status === 'under_review' ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(application.id, 'accepted')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {applicantProfile && selectedApplication && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Applicant Profile</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Name</h3>
                  <p className="text-gray-600">
                    {applicantProfile.firstName} {applicantProfile.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">{applicantProfile.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">{applicantProfile.phone}</p>
                </div>
                {applicantProfile.skills && applicantProfile.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {applicantProfile.skills.map((skill, idx) => (
                        <span key={idx} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {applicantProfile.experience && applicantProfile.experience.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                    <div className="space-y-2">
                      {applicantProfile.experience.map((exp, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium">{exp.position} at {exp.company}</div>
                          <div className="text-gray-600">{exp.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {applicantProfile.education && applicantProfile.education.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                    <div className="space-y-2">
                      {applicantProfile.education.map((edu, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium">{edu.degree}</div>
                          <div className="text-gray-600">{edu.institution} - {edu.year}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {applicantProfile.resume && (
                  <div>
                    <a
                      href={applicantProfile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyApplicants;

