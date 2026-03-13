import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, Video, Users, CheckCircle, XCircle } from 'lucide-react';

const CompanyInterviews = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming | past | all
  const [schedulingId, setSchedulingId] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    mode: 'online',
    location: '',
    notes: '',
  });

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (!currentUser) return;

        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('companyId', '==', currentUser.uid));
        const snapshot = await getDocs(q);

        const list = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({ id: docSnap.id, ...data });
        });

        setApplications(list);
      } catch (error) {
        console.error('Error fetching interviews/applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [currentUser]);

  const getInterviewDate = (app) => {
    if (!app.interviewDate) return null;
    return app.interviewDate instanceof Timestamp
      ? app.interviewDate.toDate()
      : new Date(app.interviewDate);
  };

  const isUpcoming = (app) => {
    const date = getInterviewDate(app);
    if (!date) return false;
    return date >= new Date();
  };

  const filtered = applications.filter((app) => {
    if (!app.interviewDate) {
      // Also show shortlisted candidates (no interview yet) when viewing upcoming/all
      return filter !== 'past' && (app.status === 'shortlisted' || app.status === 'applied');
    }

    if (filter === 'all') return true;
    return filter === 'upcoming' ? isUpcoming(app) : !isUpcoming(app);
  });

  const handleScheduleClick = (app) => {
    const date = getInterviewDate(app);
    setSchedulingId(app.id);
    setScheduleData({
      date: date ? date.toISOString().slice(0, 10) : '',
      time: date ? date.toTimeString().slice(0, 5) : '',
      mode: app.interviewMode || 'online',
      location: app.interviewLocation || '',
      notes: app.interviewNotes || '',
    });
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSchedule = async () => {
    if (!scheduleData.date || !scheduleData.time || !schedulingId) {
      alert('Please select date and time');
      return;
    }

    try {
      const dateTime = new Date(`${scheduleData.date}T${scheduleData.time}:00`);
      const appRef = doc(db, 'applications', schedulingId);
      await updateDoc(appRef, {
        interviewDate: dateTime,
        interviewMode: scheduleData.mode,
        interviewLocation: scheduleData.location,
        interviewNotes: scheduleData.notes,
        status: 'interview',
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === schedulingId
            ? {
                ...app,
                interviewDate: dateTime,
                interviewMode: scheduleData.mode,
                interviewLocation: scheduleData.location,
                interviewNotes: scheduleData.notes,
                status: 'interview',
              }
            : app,
        ),
      );

      alert('Interview scheduled successfully!');
      setSchedulingId(null);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview');
    }
  };

  const formatDateTime = (app) => {
    const date = getInterviewDate(app);
    if (!date) return 'Not scheduled';
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 flex items-center gap-3">
          <Calendar size={40} />
          Interview Management
        </h1>
        <p className="text-secondary-700 mt-2">
          Schedule and track interviews with shortlisted candidates.
        </p>
      </div>

      <div className="card bg-white mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
            { value: 'all', label: 'All' },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                filter === btn.value
                  ? 'btn-primary'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-secondary-600 text-sm">
          <Users size={18} />
          <span>{filtered.length} candidates in view</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <Calendar size={40} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-700 font-semibold text-lg">No interviews to show</p>
          <p className="text-secondary-600 text-sm mt-2">
            Shortlist candidates from the Applicants page, then schedule interviews here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="card bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-secondary-500 font-medium uppercase tracking-wide">
                      {app.jobTitle}
                    </p>
                    <h2 className="text-lg font-bold text-secondary-900">
                      {app.candidateName || 'Candidate'}
                    </h2>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      app.status === 'interview'
                        ? 'bg-purple-100 text-purple-800'
                        : app.status === 'shortlisted'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {app.status === 'interview' ? (
                      <Clock size={12} />
                    ) : app.status === 'shortlisted' ? (
                      <CheckCircle size={12} />
                    ) : app.status === 'rejected' ? (
                      <XCircle size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    {app.status?.toUpperCase() || 'APPLIED'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-secondary-700">
                    <Calendar size={16} className="text-primary-600" />
                    <span>{formatDateTime(app)}</span>
                  </div>
                  {app.interviewMode && (
                    <div className="flex items-center gap-2 text-secondary-700">
                      <Video size={16} className="text-primary-600" />
                      <span className="capitalize">{app.interviewMode}</span>
                    </div>
                  )}
                  {app.interviewLocation && (
                    <div className="flex items-center gap-2 text-secondary-700">
                      <MapPin size={16} className="text-primary-600" />
                      <span>{app.interviewLocation}</span>
                    </div>
                  )}
                  {app.interviewNotes && (
                    <p className="text-secondary-600 mt-1">
                      <span className="font-semibold">Notes:</span> {app.interviewNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-secondary-100 flex gap-2">
                <button
                  onClick={() => handleScheduleClick(app)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar size={16} />
                  {app.interviewDate ? 'Reschedule' : 'Schedule Interview'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {schedulingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full">
            <div className="flex items-center justify-between border-b border-secondary-100 p-6">
              <h2 className="text-2xl font-bold text-secondary-900">Schedule Interview</h2>
              <button
                onClick={() => setSchedulingId(null)}
                className="text-secondary-400 hover:text-secondary-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary-800 font-semibold mb-2 text-sm">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={scheduleData.date}
                    onChange={handleScheduleChange}
                    className="w-full px-3 py-2 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-secondary-800 font-semibold mb-2 text-sm">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={scheduleData.time}
                    onChange={handleScheduleChange}
                    className="w-full px-3 py-2 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary-800 font-semibold mb-2 text-sm">
                    Mode *
                  </label>
                  <select
                    name="mode"
                    value={scheduleData.mode}
                    onChange={handleScheduleChange}
                    className="w-full px-3 py-2 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 text-sm"
                  >
                    <option value="online">Online Meeting</option>
                    <option value="office">Office Visit</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-secondary-800 font-semibold mb-2 text-sm">
                    Location / Link
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={scheduleData.location}
                    onChange={handleScheduleChange}
                    placeholder="Office address or meeting link"
                    className="w-full px-3 py-2 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-secondary-800 font-semibold mb-2 text-sm">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={scheduleData.notes}
                  onChange={handleScheduleChange}
                  rows="3"
                  className="w-full px-3 py-2 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 text-sm resize-none"
                  placeholder="Share any preparation details or instructions for the candidate..."
                />
              </div>
            </div>

            <div className="border-t border-secondary-100 p-6 flex gap-3 justify-end">
              <button
                onClick={() => setSchedulingId(null)}
                className="px-4 py-2 rounded-lg bg-secondary-100 text-secondary-900 hover:bg-secondary-200 transition font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                className="btn-primary px-5 py-2 text-sm font-semibold"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInterviews;


