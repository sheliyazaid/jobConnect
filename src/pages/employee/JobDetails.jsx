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
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/employee/jobs')}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-8 text-sm"
      >
        <ArrowLeft size={18} />
        Back to Jobs
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-secondary-200 rounded-lg p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">{job.title}</h1>
              <p className="text-secondary-600 text-lg font-medium">{job.companyName}</p>
            </div>

            {/* Job Meta - Horizontal Layout */}
            <div className="flex flex-wrap gap-6 text-secondary-700 mb-8 pb-8 border-b border-secondary-200">
              {job.location && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <MapPin size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Location</p>
                    <p className="font-medium text-secondary-900">{job.location}</p>
                  </div>
                </div>
              )}
              {job.type && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Type</p>
                    <p className="font-medium text-secondary-900 capitalize">{job.type}</p>
                  </div>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <DollarSign size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Salary</p>
                    <p className="font-medium text-secondary-900">{job.salary}</p>
                  </div>
                </div>
              )}
              {job.createdAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Clock size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Posted</p>
                    <p className="font-medium text-secondary-900">{new Date(job.createdAt.toDate()).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applying || hasApplied}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition text-sm ${
                  hasApplied
                    ? 'bg-secondary-200 text-secondary-600 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {applying ? 'Applying...' : hasApplied ? 'Already Applied' : 'Apply Now'}
              </button>
              <button
                onClick={handleSaveJob}
                disabled={savingJob}
                className={`px-6 py-3 rounded-lg font-semibold transition border-2 flex items-center justify-center gap-2 text-sm ${
                  isSaved
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-white border-secondary-300 text-secondary-700 hover:border-secondary-400'
                }`}
              >
                <BookMarked size={18} />
                {savingJob ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-secondary-200 rounded-lg p-8">
            <h2 className="text-xl font-bold text-secondary-900 mb-5">Job Description</h2>
            <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap text-sm">{job.description}</p>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white border border-secondary-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-secondary-900 mb-5">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-primary-50 text-primary-700 px-4 py-2.5 rounded-full font-medium text-sm border border-primary-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - About Company */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-secondary-200 rounded-lg p-8 sticky top-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">About Company</h2>

            {company && (
              <div className="space-y-5">
                <div>
                  <p className="text-secondary-600 font-medium text-xs mb-2">Company Name</p>
                  <p className="text-secondary-900 font-bold text-sm">{company.companyName}</p>
                </div>

                {company.industryType && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-blue-700 font-medium text-xs mb-1">Industry</p>
                    <p className="text-secondary-900 font-semibold text-sm">{company.industryType}</p>
                  </div>
                )}

                {company.companySize && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-green-700 font-medium text-xs mb-1">Company Size</p>
                    <p className="text-secondary-900 font-semibold text-sm">{company.companySize}</p>
                  </div>
                )}

                {company.website && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-purple-700 font-medium text-xs mb-1">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-900 font-semibold text-sm hover:text-primary-600 break-all"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.email && (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-orange-700 font-medium text-xs mb-1">Email</p>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-secondary-900 font-semibold text-sm hover:text-primary-600 break-all"
                    >
                      {company.email}
                    </a>
                  </div>
                )}

                {company.phone && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-red-700 font-medium text-xs mb-1">Phone</p>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-secondary-900 font-semibold text-sm hover:text-primary-600"
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
