import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ContactModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser, userData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!message.trim()) {
      setError('Message is required');
      return;
    }
    if (subject.trim().length < 3) {
      setError('Subject must be at least 3 characters');
      return;
    }
    if (message.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      // Add message to Firestore
      await addDoc(collection(db, 'contacts'), {
        senderId: currentUser.uid,
        senderName: userData.firstName && userData.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : userData.companyName || 'Unknown',
        senderEmail: currentUser.email,
        senderRole: userData.role,
        subject: subject.trim(),
        message: message.trim(),
        status: 'unread',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setSubject('');
      setMessage('');

      // Close modal and reset after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <Mail size={20} className="text-accent-600" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900">Contact Admin</h3>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-secondary-900 font-semibold mb-2">Message Sent Successfully!</p>
              <p className="text-secondary-600 text-sm">The admin team will review your message shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-secondary-800 mb-2">
                  Subject *
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Issue with job application"
                  className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-secondary-800 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your issue or inquiry..."
                  rows="5"
                  className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent-600 hover:bg-accent-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 font-semibold py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
