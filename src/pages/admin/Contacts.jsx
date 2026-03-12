import { useState, useEffect } from 'react';
import { Mail, Archive, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [expandedId, setExpandedId] = useState(null);

  // Fetch messages from Firestore
  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setMessages([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Filter messages
  const filteredMessages =
    filter === 'unread' ? messages.filter((msg) => msg.status === 'unread') : messages;

  // Mark message as read
  const handleMarkAsRead = async (messageId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'contacts', messageId), {
        status: currentStatus === 'unread' ? 'read' : 'unread',
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  // Delete message
  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(db, 'contacts', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    return role === 'employee' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
  };

  const unreadCount = messages.filter((msg) => msg.status === 'unread').length;

  return (
    <div className="min-h-screen bg-primary-100">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <Mail size={24} className="text-accent-600" />
              </div>
              Messages
            </h1>
            <p className="text-secondary-600">
              {unreadCount > 0 ? `${unreadCount} unread message(s)` : 'All messages reviewed'}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-secondary-900 text-white'
                : 'bg-white text-secondary-900 border border-secondary-100 hover:border-secondary-300'
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition ${
              filter === 'unread'
                ? 'bg-secondary-900 text-white'
                : 'bg-white text-secondary-900 border border-secondary-100 hover:border-secondary-300'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-secondary-500">Loading messages...</div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="card bg-white text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No messages</h3>
            <p className="text-secondary-600">
              {filter === 'unread' ? 'All messages have been reviewed' : 'No messages yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`card bg-white border-l-4 transition ${
                  message.status === 'unread'
                    ? 'border-l-blue-500 bg-blue-50'
                    : 'border-l-secondary-300'
                }`}
              >
                <button
                  onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                  className="w-full"
                >
                  <div className="between items-start">
                    <div className="flex-1">
                      {/* Sender Info */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-secondary-900">{message.senderName}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRoleBadgeColor(message.senderRole)}`}>
                          {message.senderRole === 'employee' ? 'Job Seeker' : 'Company'}
                        </span>
                        {message.status === 'unread' && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white font-medium">
                            New
                          </span>
                        )}
                      </div>

                      {/* Subject */}
                      <h3 className="font-semibold text-secondary-900 text-lg mb-1">{message.subject}</h3>

                      {/* Preview or Full Message */}
                      {expandedId === message.id ? (
                        <div className="mt-4 text-secondary-700 whitespace-pre-wrap break-words">
                          {message.message}
                        </div>
                      ) : (
                        <p className="text-secondary-600 line-clamp-2">{message.message}</p>
                      )}

                      {/* Date and Email */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-secondary-500">
                        <span>{formatDate(message.createdAt)}</span>
                        <span>From: {message.senderEmail}</span>
                      </div>
                    </div>

                    {/* Toggle Icon */}
                    <div className="ml-4">
                      {expandedId === message.id ? (
                        <ChevronUp size={20} className="text-secondary-400" />
                      ) : (
                        <ChevronDown size={20} className="text-secondary-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Action Buttons - Show when expanded */}
                {expandedId === message.id && (
                  <div className="mt-4 pt-4 border-t border-secondary-100 flex gap-3">
                    <button
                      onClick={() => handleMarkAsRead(message.id, message.status)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition text-sm"
                    >
                      <Archive size={16} />
                      {message.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
