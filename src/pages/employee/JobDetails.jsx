import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, BookMarked, Loader } from 'lucide-react';

const JobDetails = () => {
  const { jobId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Fetch job details
        const jobDoc = await getDoc(doc(db, 'jobs', jobId));
        if (!jobDoc.exists()) {
          alert('Job not found');
          navigate('/employee/jobs');
          return;
        }

        const jobData = { id: jobDoc.id, ...jobDoc.data() };
        setJob(jobData);

        // Fetch company details
        const companyDoc = await getDoc(doc(db, 'users', jobData.companyId));
        if (companyDoc.exists()) {
          setCompany(companyDoc.data());
        }

        // Check if user has already applied
        if (currentUser) {
          const applicationsRef = collection(db, 'applications');
          const existingQuery = query(
            applicationsRef,
            where('employeeId', '==', currentUser.uid),
            where('jobId', '==', jobId)
          );
          const existingDocs = await getDocs(existingQuery);
          setHasApplied(!existingDocs.empty);

          // Check if job is saved
          const savedRef = collection(db, 'savedJobs');
          const savedQuery = query(
            savedRef,
            where('employeeId', '==', currentUser.uid),
            where('jobId', '==', jobId)
          );
          const savedDocs = await getDocs(savedQuery);
          setIsSaved(!savedDocs.empty);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        alert('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, currentUser, navigate]);

  const handleApply = async () => {
    if (!currentUser) {
      alert('Please log in to apply');
      return;
    }

    setApplying(true);
    try {
      if (hasApplied) {
        alert('You have already applied for this job');
        setApplying(false);
        return;
      }

      // Fetch employee's profile data
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Create application record with candidate data snapshot
      const appRef = await addDoc(collection(db, 'applications'), {
        jobId,
        employeeId: currentUser.uid,
        jobTitle: job.title,
        companyName: job.companyName,
        companyId: job.companyId,
        // Candidate data snapshot
        candidateName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        candidateEmail: userData.email || '',
        candidatePhone: userData.phone || '',
        candidateSkills: userData.skills || [],
        candidateExperience: userData.yearsOfExperience || 0,
        // Status tracking
        status: 'applied',
        appliedAt: new Date(),
        updatedAt: new Date(),
        conversationId: null,
      });

      // Create conversation between employee and company
      const convRef = await addDoc(collection(db, 'conversations'), {
        participants: [currentUser.uid, job.companyId],
        applicationId: appRef.id,
        jobId: job.id,
        jobTitle: job.title,
        otherParticipantName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        type: 'job_application',
        createdAt: new Date(),
        lastMessage: `${userData.firstName || 'Candidate'} applied for ${job.title}`,
        lastMessageAt: new Date(),
      });

      // Update application with conversation ID
      await updateDoc(appRef, { conversationId: convRef.id });

      alert('Application submitted successfully!');
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!currentUser) {
      alert('Please log in to save jobs');
      return;
    }

    setSavingJob(true);
    try {
      if (isSaved) {
        // Remove from saved jobs
        const savedRef = collection(db, 'savedJobs');
        const savedQuery = query(
          savedRef,
          where('employeeId', '==', currentUser.uid),
          where('jobId', '==', jobId)
        );
        const savedDocs = await getDocs(savedQuery);
        if (!savedDocs.empty) {
          await deleteDoc(savedDocs.docs[0].ref);
          setIsSaved(false);
          alert('Job removed from saved');
        }
      } else {
        // Add to saved jobs
        await addDoc(collection(db, 'savedJobs'), {
          jobId,
          employeeId: currentUser.uid,
          jobTitle: job.title,
          companyName: job.companyName,
          companyId: job.companyId,
          savedAt: new Date(),
        });
        setIsSaved(true);
        alert('Job saved successfully!');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    } finally {
      setSavingJob(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600 text-lg">Job not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/employee/jobs')}
        className="flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold mb-6"
      >
        <ArrowLeft size={20} />
        Back to Jobs
      </button>

      {/* Header Section */}
      <div className="card bg-white mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-secondary-900">{job.title}</h1>
              <p className="text-secondary-600 text-xl mt-2">{job.companyName}</p>
            </div>

            <div className="flex flex-wrap gap-6 mb-6">
              {job.location && (
                <div className="flex items-center gap-2 text-secondary-700">
                  <MapPin size={20} className="text-accent-600" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.type && (
                <div className="flex items-center gap-2 text-secondary-700">
                  <Briefcase size={20} className="text-accent-600" />
                  <span className="capitalize">{job.type}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2 text-secondary-700">
                  <DollarSign size={20} className="text-accent-600" />
                  <span>{job.salary}</span>
                </div>
              )}
              {job.createdAt && (
                <div className="flex items-center gap-2 text-secondary-700">
                  <Clock size={20} className="text-accent-600" />
                  <span>Posted {new Date(job.createdAt.toDate()).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 whitespace-nowrap">
            <button
              onClick={handleApply}
              disabled={applying || hasApplied}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                hasApplied
                  ? 'bg-secondary-200 text-secondary-600 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {applying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
            </button>
            <button
              onClick={handleSaveJob}
              disabled={savingJob}
              className={`px-6 py-3 rounded-lg font-semibold transition border-2 flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-accent-100 border-accent-300 text-accent-900'
                  : 'bg-white border-secondary-300 text-secondary-700 hover:border-secondary-400'
              }`}
            >
              <BookMarked size={18} />
              {savingJob ? 'Saving...' : isSaved ? 'Saved' : 'Save Job'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="card bg-white">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Job Description</h2>
            <p className="text-secondary-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="card bg-white">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-accent-100 text-accent-900 px-4 py-2 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Company Information */}
        <div className="lg:col-span-1">
          <div className="card bg-white sticky top-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">About Company</h2>

            {company && (
              <div className="space-y-4">
                <div>
                  <p className="text-secondary-600 font-medium text-sm mb-1">Company Name</p>
                  <p className="text-secondary-900 font-bold text-lg">{company.companyName}</p>
                </div>

                {company.industryType && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-600 font-medium text-sm mb-1">Industry</p>
                    <p className="text-secondary-900 font-semibold">{company.industryType}</p>
                  </div>
                )}

                {company.companySize && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-600 font-medium text-sm mb-1">Company Size</p>
                    <p className="text-secondary-900 font-semibold">{company.companySize}</p>
                  </div>
                )}

                {company.website && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-purple-600 font-medium text-sm mb-1">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-900 font-semibold hover:text-accent-600 break-all"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.email && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-600 font-medium text-sm mb-1">Contact Email</p>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-secondary-900 font-semibold hover:text-accent-600 break-all"
                    >
                      {company.email}
                    </a>
                  </div>
                )}

                {company.phone && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-600 font-medium text-sm mb-1">Contact Phone</p>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-secondary-900 font-semibold hover:text-accent-600"
                    >
                      {company.phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
