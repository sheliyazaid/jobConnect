import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Trash2, Mail, CheckCircle, AlertCircle, Briefcase, MessageSquare, Clock, Calendar } from 'lucide-react';

const CompanyNotifications = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!currentUser) return;

        const notificationsRef = collection(db, 'notifications');
        const q = query(
          notificationsRef,
          where('companyId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
        );

        const snapshot = await getDocs(q);
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });

        setNotifications(list);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_application':
        return { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'application_update':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' };
      case 'shortlisted':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' };
      case 'rejected':
        return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' };
      case 'interview':
        return { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'message':
        return { icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' };
      default:
        return { icon: Bell, color: 'text-secondary-600', bg: 'bg-secondary-50' };
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'new_application':
        return 'New Application';
      case 'application_update':
        return 'Application Update';
      case 'shortlisted':
        return 'Shortlisted';
      case 'rejected':
        return 'Rejected';
      case 'interview':
        return 'Interview Update';
      case 'message':
        return 'New Message';
      default:
        return type;
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';

    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleMarkAsRead = async (notificationId, isRead) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, { isRead: !isRead });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: !isRead } : n)),
      );
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    setDeletingId(notificationId);
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    if (!notification.isRead) {
      handleMarkAsRead(notification.id, notification.isRead);
    }
  };

  const filteredNotifications =
    filterType === 'all'
      ? notifications
      : filterType === 'unread'
        ? notifications.filter((n) => !n.isRead)
        : notifications.filter((n) => n.type === filterType);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    newApplications: notifications.filter((n) => n.type === 'new_application').length,
    interviewUpdates: notifications.filter((n) => n.type === 'interview').length,
    messages: notifications.filter((n) => n.type === 'message').length,
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
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Notifications
        </h1>
        <p className="text-secondary-600 text-lg">
          Stay updated on applications, interviews and candidate messages.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">Total</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">{stats.total}</p>
            </div>
            <Bell size={28} className="text-primary-600" />
          </div>
        </div>
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">Unread</p>
              <p className="text-3xl font-bold text-accent-600 mt-2">{stats.unread}</p>
            </div>
            <Mail size={28} className="text-accent-600" />
          </div>
        </div>
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">New Applications</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{stats.newApplications}</p>
            </div>
            <Briefcase size={28} className="text-blue-600" />
          </div>
        </div>
        <div className="card bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 font-medium text-sm">Interview Updates</p>
              <p className="text-3xl font-bold text-purple-700 mt-2">{stats.interviewUpdates}</p>
            </div>
            <Calendar size={28} className="text-purple-600" />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterType === 'all'
              ? 'btn-primary'
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterType === 'unread'
              ? 'bg-accent-600 text-white'
              : 'bg-accent-50 text-accent-700 hover:bg-accent-100 border border-accent-200'
          }`}
        >
          Unread ({stats.unread})
        </button>
        <button
          onClick={() => setFilterType('new_application')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterType === 'new_application'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
          }`}
        >
          New Applications ({stats.newApplications})
        </button>
        <button
          onClick={() => setFilterType('interview')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterType === 'interview'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
          }`}
        >
          Interviews ({stats.interviewUpdates})
        </button>
        <button
          onClick={() => setFilterType('message')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterType === 'message'
              ? 'bg-orange-600 text-white'
              : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
          }`}
        >
          Messages ({stats.messages})
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <Bell size={40} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-700 font-semibold text-lg">No notifications</p>
          <p className="text-secondary-600 text-sm mt-2">
            {filterType === 'all'
              ? "You're all caught up! Check back soon for updates."
              : 'No notifications of this type yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const typeInfo = getNotificationIcon(notification.type);
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`card transition cursor-pointer hover:shadow-lg ${
                  notification.isRead ? 'bg-white' : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${typeInfo.bg} flex-shrink-0`}>
                    <TypeIcon size={24} className={typeInfo.color} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-semibold ${
                              notification.isRead
                                ? 'text-secondary-900'
                                : 'text-secondary-900 font-bold'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="inline-block w-2 h-2 bg-accent-600 rounded-full"></span>
                          )}
                        </div>
                        {notification.jobTitle && (
                          <p className="text-secondary-600 text-sm">{notification.jobTitle}</p>
                        )}
                        {notification.candidateName && (
                          <p className="text-secondary-500 text-sm">
                            Candidate: {notification.candidateName}
                          </p>
                        )}
                        <p className="text-secondary-700 text-sm mt-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              notification.type === 'new_application'
                                ? 'bg-blue-100 text-blue-700'
                                : notification.type === 'message'
                                  ? 'bg-orange-100 text-orange-700'
                                  : notification.type === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                          <span className="text-secondary-500 text-xs flex items-center gap-1">
                            <Clock size={12} />
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id, notification.isRead);
                          }}
                          className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                            notification.isRead
                              ? 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                              : 'btn-primary'
                          }`}
                        >
                          {notification.isRead ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          disabled={deletingId === notification.id}
                          className="flex items-center justify-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold transition bg-red-50 text-red-700 hover:bg-red-100 whitespace-nowrap"
                        >
                          <Trash2 size={12} />
                          {deletingId === notification.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompanyNotifications;


