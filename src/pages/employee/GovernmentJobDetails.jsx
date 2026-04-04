import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../config/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { uploadResumeToCloudinary } from '../../config/cloudinary';
import { Briefcase, MapPin, Users, Calendar, FileText, Upload } from 'lucide-react';

export default function GovernmentJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    yearsOfExperience: '',
    address: ''
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const docSnap = await getDoc(doc(db, 'govJobs', id));

      if (docSnap.exists()) {
        setJob({ id: docSnap.id, ...docSnap.data() });
        checkIfApplied();
      } else {
        setError('Job not found');
      }
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!auth.currentUser) return;

    try {
      const snapshot = await getDoc(doc(db, 'govApplications', `${id}_${auth.currentUser.uid}`));
      if (snapshot.exists()) {
        setHasApplied(true);
      }
    } catch (err) {
      console.error('Error checking application:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Resume must be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phone.trim()) return 'Phone is required';
    if (!formData.qualification.trim()) return 'Qualification is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!resumeFile) return 'Resume upload is required';
    return '';
  };

  const handleApply = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!auth.currentUser) {
      setError('Please log in to apply');
      return;
    }

    setApplying(true);
    setError('');

    try {
      let resumeUrl = '';

      // Upload resume to Cloudinary
      if (resumeFile) {
        resumeUrl = await uploadResumeToCloudinary(resumeFile);
      }

      // Create application record
      const applicationData = {
        govJobId: id,
        employeeId: auth.currentUser.uid,
        jobTitle: job.title,
        department: job.department,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        qualification: formData.qualification,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        address: formData.address,
        resumeUrl: resumeUrl,
        status: 'submitted',
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Create with a composite ID for uniqueness
      const appId = `${id}_${auth.currentUser.uid}`;
      await addDoc(collection(db, 'govApplications'), {
        ...applicationData,
        applicationId: appId
      });

      setSuccess('Application submitted successfully! You will receive updates via notifications.');
      setTimeout(() => {
        navigate('/employee/government-applications');
      }, 2000);
    } catch (err) {
      setError('Failed to submit application: ' + err.message);
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalVacancies = (vacancies) => {
    return Object.values(vacancies || {}).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  };

  const getDaysLeft = (lastDate) => {
    const today = new Date();
    const expire = new Date(lastDate);
    const diffTime = expire - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-600 text-lg">{error || 'Job not found'}</p>
          <button
            onClick={() => navigate('/employee/government-jobs')}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysLeft(job.applicationLastDate);
  const isUrgent = daysLeft <= 7 && daysLeft > 0;
  const applicationClosed = daysLeft <= 0;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200 p-4 md:p-6">
        <div className="max-w-5xl mx-auto flex justify-between items-start">
          <button
            onClick={() => navigate('/employee/government-jobs')}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm mb-4"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Job Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-secondary-900">{job.title}</h1>
                    <p className="text-lg text-secondary-600 mt-2">{job.department}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                    applicationClosed
                      ? 'bg-red-100 text-red-700'
                      : isUrgent
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {applicationClosed ? 'Application Closed' : `${daysLeft} days left`}
                  </span>
                </div>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-secondary-50 rounded-lg">
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold mb-1">Location</p>
                  <p className="text-secondary-900 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold mb-1">Vacancies</p>
                  <p className="text-secondary-900 font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" /> {getTotalVacancies(job.vacancies)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold mb-1">Deadline</p>
                  <p className="text-secondary-900 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {formatDate(job.applicationLastDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 uppercase font-semibold mb-1">Job Type</p>
                  <p className="text-secondary-900 font-medium capitalize">{job.governmentJobType}</p>
                </div>
              </div>

              {/* Eligibility Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4 pb-3 border-b border-secondary-200">
                  Eligibility Criteria
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-secondary-600 uppercase font-semibold mb-2">Qualification Required</p>
                    <p className="text-secondary-900">{job.qualification}</p>
                  </div>
                  {job.ageLimit && (
                    <div>
                      <p className="text-sm text-secondary-600 uppercase font-semibold mb-2">Age Limit</p>
                      <p className="text-secondary-900">
                        {job.ageLimit.minAge} - {job.ageLimit.maxAge} years
                      </p>
                    </div>
                  )}
                  {job.yearsOfExperienceRequired > 0 && (
                    <div>
                      <p className="text-sm text-secondary-600 uppercase font-semibold mb-2">Experience Required</p>
                      <p className="text-secondary-900">{job.yearsOfExperienceRequired} years</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vacancies by Category */}
              {job.vacancies && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-4 pb-3 border-b border-secondary-200">
                    Vacancies by Category
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(job.vacancies).map(([category, count]) => (
                      <div key={category} className="bg-secondary-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-secondary-600 uppercase font-semibold mb-1">{category}</p>
                        <p className="text-2xl font-bold text-primary-600">{count || 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4 pb-3 border-b border-secondary-200">
                  Job Description
                </h2>
                <p className="text-secondary-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
              </div>

              {/* Links */}
              {job.officialNotificationLink && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <a
                    href={job.officialNotificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2 font-semibold"
                  >
                    <FileText className="w-4 h-4" />
                    📄 Official Notification Link
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {applicationClosed ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-secondary-600 text-lg font-semibold">Application Closed</p>
                <p className="text-secondary-500 text-sm mt-2">The application deadline for this job has passed.</p>
              </div>
            ) : hasApplied ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-secondary-900 font-semibold mb-2">Already Applied</p>
                <p className="text-secondary-600 text-sm">You have already submitted your application for this position.</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold mb-4"
                >
                  {showForm ? 'Hide Form' : 'Apply Now'}
                </button>

                {showForm && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">Application Form</h3>

                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="10-digit phone number"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Qualification *</label>
                        <input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          placeholder="e.g., B.Tech in CSE"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Years of Experience</label>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Address *</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Your address"
                          rows="2"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Resume Upload *</label>
                        <div className="border-2 border-dashed border-secondary-300 rounded-lg p-4">
                          <input
                            type="file"
                            onChange={handleResumeChange}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            id="resume-upload"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <Upload className="w-6 h-6 text-secondary-400 mb-2" />
                            <span className="text-sm text-secondary-700 font-medium">
                              {resumeFile ? resumeFile.name : 'Click to upload resume (PDF, DOC, DOCX)'}
                            </span>
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={applying}
                        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-secondary-400 disabled:cursor-not-allowed transition font-semibold text-sm"
                      >
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
