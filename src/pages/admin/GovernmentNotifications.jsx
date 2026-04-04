import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Send, Bell, Trash2 } from 'lucide-react';

export default function GovernmentNotifications() {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    recipientType: 'all',
    selectedJob: '',
    type: 'new_job',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsSnap, usersSnap, notificationsSnap] = await Promise.all([
        getDocs(collection(db, 'govJobs')),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'govNotifications'))
      ]);

      setJobs(jobsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

      setUsers(usersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.role === 'employee'));

      setNotifications(notificationsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.message.trim()) return 'Message is required';
    if (formData.recipientType === 'job' && !formData.selectedJob) {
      return 'Please select a job';
    }
    return '';
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSending(true);
    setError('');

    try {
      const recipients = formData.recipientType === 'all'
        ? users
        : formData.recipientType === 'job'
          ? users.filter(u => {
              // Only get users who applied for this job
              const appliedJobs = notifications.filter(n => n.govJobId === formData.selectedJob);
              return appliedJobs.some(app => app.employeeId === u.id);
            })
          : [];

      if (recipients.length === 0 && formData.recipientType !== 'all') {
        setWarning('No recipients found for this job');
        return;
      }

      // Send notifications
      const notificationsToCreate = formData.recipientType === 'all'
        ? users.map(user => ({
            employeeId: user.id,
            type: formData.type,
            title: formData.title,
            message: formData.message,
            isRead: false,
            createdAt: serverTimestamp()
          }))
        : recipients.map(user => ({
            employeeId: user.id,
            govJobId: formData.selectedJob,
            type: formData.type,
            title: formData.title,
            message: formData.message,
            isRead: false,
            createdAt: serverTimestamp()
          }));

      await Promise.all(
        notificationsToCreate.map(notif =>
          addDoc(collection(db, 'govNotifications'), notif)
        )
      );

      setSuccess(`Notification sent to ${notificationsToCreate.length} user(s)!`);
      setTimeout(() => setSuccess(''), 3000);

      setFormData({
        recipientType: 'all',
        selectedJob: '',
        type: 'new_job',
        title: '',
        message: ''
      });

      fetchData();
    } catch (err) {
      setError('Failed to send notification: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'govNotifications', notificationId));
      setSuccess('Notification deleted');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const notificationTypes = [
    { value: 'new_job', label: '📢 New Job Posted' },
    { value: 'application_deadline', label: '⏰ Application Deadline' },
    { value: 'exam_date', label: '📅 Exam Date Announced' },
    { value: 'result_announcement', label: '🎉 Result Announcement' },
    { value: 'important_update', label: '⚠️ Important Update' },
    { value: 'reminder', label: '🔔 Reminder' }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Government Job Notifications</h1>
          <p className="text-secondary-600 mt-2">Send notifications to users about government jobs</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Send Notification Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Send className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-secondary-900">Send Notification</h2>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-4">
                {/* Recipient Type */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Send To
                  </label>
                  <select
                    name="recipientType"
                    value={formData.recipientType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Users</option>
                    <option value="job">Users Applied for a Job</option>
                  </select>
                </div>

                {/* Job Selection */}
                {formData.recipientType === 'job' && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Select Job *
                    </label>
                    <select
                      name="selectedJob"
                      value={formData.selectedJob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Choose a job...</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Notification Type */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Notification Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {notificationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Notification title"
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Notification message"
                    rows="4"
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-secondary-400 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send Notification'}
                </button>
              </form>
            </div>
          </div>

          {/* Notification History */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-secondary-900">Notification History</h2>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-8 text-secondary-600">
                  <p>No notifications sent yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.slice(0, 20).map(notif => (
                    <div
                      key={notif.id}
                      className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-secondary-900">{notif.title}</p>
                          <p className="text-sm text-secondary-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-secondary-500 mt-2">{formatDate(notif.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
