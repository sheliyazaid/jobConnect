import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart3, Briefcase, Users, CheckCircle } from 'lucide-react';

export default function GovernmentReports() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsSnap, appsSnap] = await Promise.all([
        getDocs(collection(db, 'govJobs')),
        getDocs(collection(db, 'govApplications'))
      ]);

      setJobs(jobsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

      setApplications(appsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getTotalVacancies = () => {
    return jobs.reduce((sum, job) => {
      const vacancies = Object.values(job.vacancies || {}).reduce((s, v) => s + (parseInt(v) || 0), 0);
      return sum + vacancies;
    }, 0);
  };

  const getApplicationsByStatus = () => {
    return {
      submitted: applications.filter(a => a.status === 'submitted').length,
      approved: applications.filter(a => a.status === 'approved').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };
  };

  const getTopJobs = () => {
    return jobs
      .map(job => {
        const jobApps = applications.filter(a => a.govJobId === job.id);
        return {
          ...job,
          applicationCount: jobApps.length
        };
      })
      .sort((a, b) => b.applicationCount - a.applicationCount)
      .slice(0, 5);
  };

  const getJobTypeDistribution = () => {
    const dist = {};
    jobs.forEach(job => {
      const type = job.governmentJobType || 'other';
      dist[type] = (dist[type] || 0) + 1;
    });
    return dist;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const appStatus = getApplicationsByStatus();
  const topJobs = getTopJobs();
  const jobTypeDistribution = Object.entries(getJobTypeDistribution());

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-secondary-900">Government Jobs Reports</h1>
            </div>
            <p className="text-secondary-600 mt-2">Overview and statistics of government jobs and applications</p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-900 transition"
          >
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-semibold uppercase">Total Government Jobs</p>
                <p className="text-4xl font-bold text-secondary-900 mt-2">{jobs.length}</p>
                <p className="text-xs text-secondary-500 mt-2">{getTotalVacancies()} total vacancies</p>
              </div>
              <Briefcase className="w-12 h-12 text-blue-100" />
            </div>
          </div>

          {/* Total Applications */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-semibold uppercase">Total Applications</p>
                <p className="text-4xl font-bold text-secondary-900 mt-2">{applications.length}</p>
                <p className="text-xs text-secondary-500 mt-2">All statuses combined</p>
              </div>
              <Users className="w-12 h-12 text-green-100" />
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-semibold uppercase">Active Jobs</p>
                <p className="text-4xl font-bold text-secondary-900 mt-2">
                  {jobs.filter(j => j.status === 'active').length}
                </p>
                <p className="text-xs text-secondary-500 mt-2">Accepting applications</p>
              </div>
              <CheckCircle className="w-12 h-12 text-yellow-100" />
            </div>
          </div>

          {/* Approved Applications */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-semibold uppercase">Approved</p>
                <p className="text-4xl font-bold text-secondary-900 mt-2">{appStatus.approved}</p>
                <p className="text-xs text-secondary-500 mt-2">Applicants approved</p>
              </div>
              <CheckCircle className="w-12 h-12 text-purple-100" />
            </div>
          </div>
        </div>

        {/* Application Status Breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-secondary-600 text-sm font-semibold uppercase mb-3">Application Breakdown</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-700 text-sm">Pending</span>
                  <span className="font-bold text-secondary-900">{appStatus.submitted}</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${applications.length > 0 ? (appStatus.submitted / applications.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-700 text-sm">Approved</span>
                  <span className="font-bold text-secondary-900">{appStatus.approved}</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${applications.length > 0 ? (appStatus.approved / applications.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-700 text-sm">Rejected</span>
                  <span className="font-bold text-secondary-900">{appStatus.rejected}</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${applications.length > 0 ? (appStatus.rejected / applications.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Type Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-secondary-600 text-sm font-semibold uppercase mb-3">Jobs by Type</p>
            <div className="space-y-3">
              {jobTypeDistribution.map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-secondary-700 text-sm capitalize">{type}</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-secondary-600 text-sm font-semibold uppercase mb-3">Job Status</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary-700 text-sm">Active</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {jobs.filter(j => j.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-700 text-sm">Closed</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                  {jobs.filter(j => j.status === 'closed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-700 text-sm">Expired</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  {jobs.filter(j => j.status === 'expired').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Jobs */}
        {topJobs.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Top 5 Most Applied Jobs</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Job Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Vacancies</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Applications</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topJobs.map((job, idx) => (
                    <tr key={job.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}>
                      <td className="py-3 px-4 text-sm text-secondary-900 font-medium">{job.title}</td>
                      <td className="py-3 px-4 text-sm text-secondary-700">{job.department}</td>
                      <td className="py-3 px-4 text-sm text-secondary-700">
                        {Object.values(job.vacancies || {}).reduce((s, v) => s + (parseInt(v) || 0), 0)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {job.applicationCount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : job.status === 'closed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
