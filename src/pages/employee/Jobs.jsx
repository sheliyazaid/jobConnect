import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, startAfter, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, X, Heart, CheckCircle, ChevronDown, MapPin, DollarSign } from 'lucide-react';

const EmployeeJobs = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State for data
  const [jobs, setJobs] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastJobSnapshot, setLastJobSnapshot] = useState(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState([]);
  const [openJobTypeFilter, setOpenJobTypeFilter] = useState(false);
  const [openExpFilter, setOpenExpFilter] = useState(false);

  // State for applications and saved jobs
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // Utility Functions

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const jobDate = date instanceof Timestamp ? date.toDate() : new Date(date);
    const now = new Date();
    const diffMs = now - jobDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const extractExperienceLevel = (job) => {
    const titleLower = (job.title || '').toLowerCase();
    const descLower = (job.description || '').toLowerCase();

    if (titleLower.includes('principal') || titleLower.includes('director') || titleLower.includes('vp ') || titleLower.includes('c-level')) {
      return 'Executive';
    }
    if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('architect')) {
      return 'Senior';
    }
    if (titleLower.includes('junior') || titleLower.includes('associate') || descLower.includes('0-2 year') || descLower.includes('entry level')) {
      return 'Entry Level';
    }
    if (descLower.includes('3-5 year') || descLower.includes('mid-level') || descLower.includes('mid level')) {
      return 'Mid Level';
    }
    return 'Mid Level';
  };

  const extractSalaryRange = (salaryStr) => {
    if (!salaryStr) return { min: 0, max: 0 };

    const numbers = salaryStr.match(/\d+/g);
    if (!numbers || numbers.length === 0) return { min: 0, max: 0 };

    const min = parseInt(numbers[0]) * (salaryStr.includes('k') ? 1000 : 1);
    const max = numbers.length > 1 ? parseInt(numbers[1]) * (salaryStr.includes('k') ? 1000 : 1) : min;

    return { min, max };
  };

  const calcJobMatchScore = (userProfile, job) => {
    if (!userProfile || !job) return 0;

    let score = 0;
    let weightedTotal = 0;

    // Skill Match (40%)
    if (userProfile.skills && userProfile.skills.length > 0 && job.skills && job.skills.length > 0) {
      const matchingSkills = job.skills.filter(jobSkill =>
        userProfile.skills.some(userSkill =>
          userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
          jobSkill.toLowerCase().includes(userSkill.toLowerCase())
        )
      ).length;
      const skillScore = (matchingSkills / job.skills.length) * 40;
      score += skillScore;
    }
    weightedTotal += 40;

    // Experience Fit (30%)
    const jobExpLevel = extractExperienceLevel(job);
    const userExp = userProfile.yearsOfExperience || 0;
    let expScore = 0;

    if (jobExpLevel === 'Entry Level' && userExp <= 2) expScore = 30;
    else if (jobExpLevel === 'Mid Level' && userExp >= 2 && userExp <= 7) expScore = 30;
    else if (jobExpLevel === 'Senior' && userExp >= 5) expScore = 30;
    else if (jobExpLevel === 'Executive' && userExp >= 10) expScore = 30;
    else expScore = Math.max(0, 30 - Math.abs((userExp - (jobExpLevel === 'Entry Level' ? 1 : jobExpLevel === 'Mid Level' ? 4 : 8)) * 3));

    score += expScore;
    weightedTotal += 30;

    // Location Match (15%)
    const userCity = (userProfile.address || '').split(',')[0].trim().toLowerCase();
    const jobCity = (job.location || '').split(',')[0].trim().toLowerCase();
    let locationScore = 0;

    if (job.type === 'remote' || job.type?.includes('remote')) {
      locationScore = 15;
    } else if (userCity && jobCity && userCity === jobCity) {
      locationScore = 15;
    }

    score += locationScore;
    weightedTotal += 15;

    // Education & Certifications (15%)
    let credentialScore = 0;
    if (userProfile.certifications && userProfile.certifications.length > 0) {
      const certMentions = userProfile.certifications.filter(cert =>
        (job.description || '').toLowerCase().includes(cert.name?.toLowerCase() || '')
      ).length;
      credentialScore += Math.min(15, certMentions * 5);
    }

    score += credentialScore;
    weightedTotal += 15;

    return Math.round((score / weightedTotal) * 100);
  };

  // Initial fetch with pagination
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }

          const appRef = collection(db, 'applications');
          const appQuery = query(appRef, where('employeeId', '==', currentUser.uid));
          const appSnap = await getDocs(appQuery);
          const appList = [];
          appSnap.forEach(doc => {
            appList.push({ jobId: doc.data().jobId, status: doc.data().status });
          });
          setApplications(appList);

          const saveRef = collection(db, 'savedJobs');
          const saveQuery = query(saveRef, where('employeeId', '==', currentUser.uid));
          const saveSnap = await getDocs(saveQuery);
          const saveList = [];
          saveSnap.forEach(doc => {
            saveList.push(doc.data().jobId);
          });
          setSavedJobs(saveList);
        }

        const jobsRef = collection(db, 'jobs');
        const q = query(
          jobsRef,
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        const querySnapshot = await getDocs(q);
        const jobsList = [];
        const companyIds = new Set();

        querySnapshot.forEach((docSnap) => {
          const jobData = docSnap.data();
          jobsList.push({ id: docSnap.id, ...jobData });
          if (jobData.companyId) companyIds.add(jobData.companyId);
        });

        const companyMap = {};
        for (const companyId of companyIds) {
          try {
            const companyDoc = await getDoc(doc(db, 'users', companyId));
            if (companyDoc.exists()) {
              companyMap[companyId] = companyDoc.data();
            }
          } catch (e) {
            console.error('Error fetching company:', e);
          }
        }

        const jobsWithCompanyData = jobsList.map(job => ({
          ...job,
          companyLogo: companyMap[job.companyId]?.companyLogo || '',
          experienceLevel: extractExperienceLevel(job),
          matchScore: calcJobMatchScore(userData || {}, job),
          salaryRange: extractSalaryRange(job.salary)
        }));

        setJobs(jobsWithCompanyData);
        if (querySnapshot.docs.length > 0) {
          setLastJobSnapshot(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
        setHasMore(querySnapshot.docs.length === 20);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [currentUser]);

  const loadMoreJobs = async () => {
    if (!lastJobSnapshot || !hasMore) return;

    setLoadingMore(true);
    try {
      const jobsRef = collection(db, 'jobs');
      const q = query(
        jobsRef,
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        startAfter(lastJobSnapshot),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const newJobsList = [];
      const companyIds = new Set();

      querySnapshot.forEach((docSnap) => {
        const jobData = docSnap.data();
        newJobsList.push({ id: docSnap.id, ...jobData });
        if (jobData.companyId) companyIds.add(jobData.companyId);
      });

      const companyMap = {};
      for (const companyId of companyIds) {
        try {
          const companyDoc = await getDoc(doc(db, 'users', companyId));
          if (companyDoc.exists()) {
            companyMap[companyId] = companyDoc.data();
          }
        } catch (e) {
          console.error('Error fetching company:', e);
        }
      }

      const jobsWithCompanyData = newJobsList.map(job => ({
        ...job,
        companyLogo: companyMap[job.companyId]?.companyLogo || '',
        experienceLevel: extractExperienceLevel(job),
        matchScore: calcJobMatchScore(userData || {}, job),
        salaryRange: extractSalaryRange(job.salary)
      }));

      setJobs(prev => [...prev, ...jobsWithCompanyData]);
      if (querySnapshot.docs.length > 0) {
        setLastJobSnapshot(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      setHasMore(querySnapshot.docs.length === 20);
    } catch (error) {
      console.error('Error loading more jobs:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter(job =>
        selectedJobTypes.some(type => (job.type || '').toLowerCase().includes(type.toLowerCase()))
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        job.type?.toLowerCase().includes('remote')
      );
    }

    if (salaryMin || salaryMax) {
      filtered = filtered.filter(job => {
        const { min, max } = job.salaryRange;
        const minFilter = salaryMin ? parseInt(salaryMin) : 0;
        const maxFilter = salaryMax ? parseInt(salaryMax) : Infinity;
        return max >= minFilter && min <= maxFilter;
      });
    }

    if (selectedExperienceLevels.length > 0) {
      filtered = filtered.filter(job =>
        selectedExperienceLevels.includes(job.experienceLevel)
      );
    }

    if (sortBy === 'relevance') {
      filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
    } else if (sortBy === 'salary-high') {
      filtered.sort((a, b) => (b.salaryRange?.max || 0) - (a.salaryRange?.max || 0));
    } else if (sortBy === 'salary-low') {
      filtered.sort((a, b) => (a.salaryRange?.min || 0) - (b.salaryRange?.min || 0));
    }

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedJobTypes.length > 0) count++;
    if (selectedLocation) count++;
    if (salaryMin || salaryMax) count++;
    if (selectedExperienceLevels.length > 0) count++;
    return count;
  };

  const clearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedLocation('');
    setSalaryMin('');
    setSalaryMax('');
    setSelectedExperienceLevels([]);
    setSortBy('relevance');
    setSearchTerm('');
  };

  const filteredJobs = applyFilters();

  const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
  const experienceLevelOptions = ['Entry Level', 'Mid Level', 'Senior', 'Executive'];

  const getMatchColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Excellent' };
    if (score >= 60) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Good' };
    if (score >= 40) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Fair' };
    return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', label: 'Match' };
  };

  const isJobApplied = (jobId) => applications.some(app => app.jobId === jobId);
  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3 items-center">
          {/* Job Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-secondary-500" />
              <input
                type="text"
                placeholder="Job title, skills, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-600 text-sm text-secondary-900 bg-white"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="w-48">
            <input
              type="text"
              placeholder="Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-600 text-sm text-secondary-900 bg-white"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-600 text-sm bg-white text-secondary-900 appearance-none pr-8"
            >
              <option value="relevance">Most Relevant</option>
              <option value="newest">Newest</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-3 text-secondary-500 pointer-events-none" />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex gap-3 items-center flex-wrap pb-2">
          {/* Job Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenJobTypeFilter(!openJobTypeFilter)}
              className="px-3 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 text-sm text-secondary-700 font-medium flex items-center gap-2 transition"
            >
              <span>Job Type</span>
              {selectedJobTypes.length > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedJobTypes.length}
                </span>
              )}
              <ChevronDown size={14} className={`transition ${openJobTypeFilter ? 'rotate-180' : ''}`} />
            </button>
            {openJobTypeFilter && (
              <div className="absolute top-10 left-0 bg-white border border-secondary-200 rounded-lg shadow-lg p-3 z-20 min-w-48">
                {jobTypeOptions.map(type => (
                  <label key={type} className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-secondary-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedJobTypes([...selectedJobTypes, type]);
                        } else {
                          setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-secondary-700">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Salary Range */}
          <div className="flex gap-2 items-center bg-white border border-secondary-300 rounded-lg px-3 py-2">
            <span className="text-xs text-secondary-600 font-medium">Salary:</span>
            <input
              type="number"
              placeholder="Min"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              className="w-14 px-2 py-1 border border-secondary-200 rounded text-xs focus:outline-none focus:border-primary-600"
            />
            <span className="text-xs text-secondary-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              className="w-14 px-2 py-1 border border-secondary-200 rounded text-xs focus:outline-none focus:border-primary-600"
            />
          </div>

          {/* Experience Level Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenExpFilter(!openExpFilter)}
              className="px-3 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 text-sm text-secondary-700 font-medium flex items-center gap-2 transition"
            >
              <span>Experience</span>
              {selectedExperienceLevels.length > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedExperienceLevels.length}
                </span>
              )}
              <ChevronDown size={14} className={`transition ${openExpFilter ? 'rotate-180' : ''}`} />
            </button>
            {openExpFilter && (
              <div className="absolute top-10 left-0 bg-white border border-secondary-200 rounded-lg shadow-lg p-3 z-20 min-w-48">
                {experienceLevelOptions.map(level => (
                  <label key={level} className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-secondary-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedExperienceLevels.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedExperienceLevels([...selectedExperienceLevels, level]);
                        } else {
                          setSelectedExperienceLevels(selectedExperienceLevels.filter(l => l !== level));
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-secondary-700">{level}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-secondary-700 hover:text-secondary-900 text-sm font-medium border border-secondary-300 rounded-lg hover:bg-secondary-50 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Active Filters Pills */}
        {(selectedJobTypes.length > 0 || salaryMin || salaryMax || selectedExperienceLevels.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedJobTypes.map(type => (
              <div key={type} className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs text-blue-700">
                {type}
                <button onClick={() => setSelectedJobTypes(selectedJobTypes.filter(t => t !== type))}>
                  <X size={12} />
                </button>
              </div>
            ))}
            {(salaryMin || salaryMax) && (
              <div className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs text-blue-700">
                ${salaryMin || '0'} - ${salaryMax || 'Any'}
                <button onClick={() => { setSalaryMin(''); setSalaryMax(''); }}>
                  <X size={12} />
                </button>
              </div>
            )}
            {selectedExperienceLevels.map(level => (
              <div key={level} className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs text-blue-700">
                {level}
                <button onClick={() => setSelectedExperienceLevels(selectedExperienceLevels.filter(l => l !== level))}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-5 text-sm text-secondary-600 font-medium">
        {filteredJobs.length === 0 ? 'No jobs found' : `Showing ${filteredJobs.length} of ${jobs.length} jobs`}
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="card bg-white p-12 text-center rounded-xl">
          <Briefcase size={48} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-700 font-semibold text-lg">No jobs found</p>
          <p className="text-secondary-600 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => {
              const matchColor = getMatchColor(job.matchScore);
              const applied = isJobApplied(job.id);
              const saved = isJobSaved(job.id);

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md border border-secondary-200 transition p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Job Type */}
                    <p className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">
                      {job.type || "Full-time"}
                    </p>

                    {/* Job Title */}
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {job.title}
                    </h3>

                    {/* Company + Location */}
                    <p className="text-sm text-secondary-600">
                      {job.companyName || "Company confidential"} •{" "}
                      {job.location || "Location flexible"}
                    </p>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full bg-primary-100 text-secondary-900 text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between mt-4">

                  <button
                          onClick={() => navigate(`/employee/job/${job.id}`)}
                          className="text-sm font-semibold text-secondary-900 hover:text-secondary-700"
                        >
                          View Details
                        </button>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!applied && (
                        <button
                          onClick={() => navigate(`/employee/job/${job.id}`)}
                          className="btn-primary text-xs px-3 py-1.5 rounded-lg"
                        >
                          Apply
                        </button>
                      )}

                      {applied && (
                        <span className="text-green-700 text-xs font-medium">
                          Applied
                        </span>
                      )}

                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className={`p-1.5 rounded-lg border transition ${saved
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "border-secondary-300 text-secondary-600 hover:bg-secondary-50"
                          }`}
                      >
                        <Heart size={14} fill={saved ? "currentColor" : "none"} />
                      </button> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMoreJobs}
                disabled={loadingMore}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? 'Loading...' : 'Load More Jobs'}
              </button>
            </div>
          )}

          {!hasMore && jobs.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-secondary-600 text-sm">No more jobs to load</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeJobs;
