import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Trash2, MapPin, DollarSign, Briefcase as BriefcaseIcon } from 'lucide-react';

const SavedJobs = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        if (!currentUser) return;

        const savedRef = collection(db, 'savedJobs');
        const q = query(savedRef, where('employeeId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const savedJobsList = [];

        // Fetch full job details for each saved job
        for (const savedJobDoc of querySnapshot.docs) {
          const savedData = { id: savedJobDoc.id, ...savedJobDoc.data() };

          try {
            const jobRef = doc(db, 'jobs', savedData.jobId);
            const jobDocSnap = await getDoc(jobRef);
            if (jobDocSnap.exists()) {
              savedJobsList.push({
                ...savedData,
                jobDetails: jobDocSnap.data()
              });
            } else {
              savedJobsList.push(savedData);
            }
          } catch (e) {
            savedJobsList.push(savedData);
          }
        }

        // Sort by saved date (newest first)
        savedJobsList.sort((a, b) => {
          const dateA = a.savedAt instanceof Timestamp ? a.savedAt.toDate() : new Date(a.savedAt);
          const dateB = b.savedAt instanceof Timestamp ? b.savedAt.toDate() : new Date(b.savedAt);
          return dateB - dateA;
        });

        setSavedJobs(savedJobsList);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [currentUser]);

  const handleRemoveSavedJob = async (savedJobId) => {
    setDeletingId(savedJobId);
    try {
      await deleteDoc(doc(db, 'savedJobs', savedJobId));
      setSavedJobs(savedJobs.filter(job => job.id !== savedJobId));
      alert('Job removed from saved');
    } catch (error) {
      console.error('Error removing saved job:', error);
      alert('Failed to remove saved job');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Saved Jobs ⭐
        </h1>
        <p className="text-secondary-600 text-lg">Review and manage your bookmarked opportunities</p>
      </div>

      {/* Summary Card */}
      <div className="card bg-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-secondary-600 font-medium text-sm">Total Saved Jobs</p>
            <p className="text-4xl font-bold text-secondary-900 mt-2">{savedJobs.length}</p>
          </div>
          <BriefcaseIcon size={48} className="text-accent-600" />
        </div>
      </div>

      {/* Saved Jobs List */}
      {savedJobs.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <Briefcase size={40} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-700 font-semibold text-lg">No saved jobs yet</p>
          <p className="text-secondary-600 text-sm mt-2">
            Browse jobs and click "Save Job" to bookmark opportunities for later
          </p>
          <button
            onClick={() => navigate('/employee/jobs')}
            className="btn-primary mt-6"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((saved) => (
            <div key={saved.id} className="card bg-white hover:shadow-lg transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900 text-lg">{saved.jobTitle}</h3>
                  <p className="text-secondary-600 text-sm mt-1">{saved.companyName}</p>

                  {saved.jobDetails && (
                    <div className="flex flex-wrap gap-6 mt-4">
                      {saved.jobDetails.location && (
                        <div className="flex items-center gap-2 text-secondary-600 text-sm">
                          <MapPin size={16} />
                          <span>{saved.jobDetails.location}</span>
                        </div>
                      )}
                      {saved.jobDetails.type && (
                        <div className="flex items-center gap-2 text-secondary-600 text-sm">
                          <BriefcaseIcon size={16} />
                          <span className="capitalize">{saved.jobDetails.type}</span>
                        </div>
                      )}
                      {saved.jobDetails.salary && (
                        <div className="flex items-center gap-2 text-secondary-600 text-sm">
                          <DollarSign size={16} />
                          <span>{saved.jobDetails.salary}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-secondary-500 text-sm mt-4">
                    Saved {formatDate(saved.savedAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/employee/job/${saved.jobId}`)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    View Job
                  </button>
                  <button
                    onClick={() => handleRemoveSavedJob(saved.id)}
                    disabled={deletingId === saved.id}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-semibold transition border border-red-200 text-sm"
                  >
                    <Trash2 size={16} />
                    {deletingId === saved.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>

              {saved.jobDetails?.description && (
                <p className="text-secondary-600 text-sm mt-4 line-clamp-2">{saved.jobDetails.description}</p>
              )}

              {saved.jobDetails?.skills && saved.jobDetails.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {saved.jobDetails.skills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-accent-100 text-accent-900 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {saved.jobDetails.skills.length > 5 && (
                    <span className="text-secondary-500 text-xs px-2 py-1">
                      +{saved.jobDetails.skills.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
