import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Briefcase, MapPin, Users, Calendar, Search, ChevronDown, X } from 'lucide-react';

export default function GovernmentJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const jobTypes = [
    'central',
    'state',
    'psu',
    'defence',
    'railway',
    'banking'
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedJobType, selectedLocation, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'govJobs'));
      const jobsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(job => job.status === 'active')
        .sort((a, b) => (b.postedAt?.seconds || 0) - (a.postedAt?.seconds || 0));

      setJobs(jobsData);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(term) ||
        job.department.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term)
      );
    }

    if (selectedJobType !== 'all') {
      filtered = filtered.filter(job => job.governmentJobType === selectedJobType);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    setFilteredJobs(filtered);
  };

  const getUniqueValues = (key) => {
    return [...new Set(jobs.map(j => j[key]))].filter(Boolean).sort();
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
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const activeFilters = [
    { key: 'searchTerm', label: searchTerm && `"${searchTerm}"` },
    { key: 'jobType', label: selectedJobType !== 'all' && selectedJobType },
    { key: 'location', label: selectedLocation !== 'all' && selectedLocation }
  ].filter(f => f.label);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-secondary-900">Government Jobs</h1>
          </div>
          <p className="text-secondary-600">Browse active government job opportunities</p>
        </div>
      </div>

      {/* Sticky Search & Filters Bar */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex gap-3 items-center flex-wrap mb-3">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs, departments..."
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-2">
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                <option value="all">All Job Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                <option value="all">All Locations</option>
                {getUniqueValues('location').map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 bg-white"
            >
              <ChevronDown className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="md:hidden flex gap-2 flex-wrap pb-3">
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="flex-1 min-w-40 px-3 py-2 border border-secondary-300 rounded-lg text-sm bg-white"
              >
                <option value="all">All Job Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="flex-1 min-w-40 px-3 py-2 border border-secondary-300 rounded-lg text-sm bg-white"
              >
                <option value="all">All Locations</option>
                {getUniqueValues('location').map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          )}

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center mt-3 pt-3 border-t border-secondary-100">
              <span className="text-sm text-secondary-600 font-medium">Filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-primary-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedJobType !== 'all' && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                  {selectedJobType}
                  <button onClick={() => setSelectedJobType('all')} className="hover:text-primary-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation('all')} className="hover:text-primary-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600 text-lg">No government jobs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-secondary-600 text-sm mb-4">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
            {filteredJobs.map(job => {
              const daysLeft = getDaysLeft(job.applicationLastDate);
              const isUrgent = daysLeft <= 7 && daysLeft > 0;
              const isClosed = daysLeft <= 0;

              return (
                <Link
                  key={job.id}
                  to={`/employee/government-jobs/${job.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition border border-secondary-100 p-5 hover:border-primary-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition">
                        {job.title}
                      </h3>
                      <p className="text-secondary-600 text-sm mt-0.5">{job.department}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                      isClosed
                        ? 'bg-red-100 text-red-700'
                        : isUrgent
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                    }`}>
                      {isClosed ? 'Closed' : `${daysLeft}d left`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2 text-secondary-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary-600">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>{getTotalVacancies(job.vacancies)} posts</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Closes {formatDate(job.applicationLastDate)}</span>
                    </div>
                    <div>
                      <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold capitalize">
                        {job.governmentJobType}
                      </span>
                    </div>
                  </div>

                  <p className="text-secondary-700 text-sm line-clamp-2">
                    {job.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-primary-600 font-semibold text-sm hover:text-primary-700 transition">
                    View Details →
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
