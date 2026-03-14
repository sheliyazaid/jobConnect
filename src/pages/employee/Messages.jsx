import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Send, MessageCircle, Trash2, Clock, User } from 'lucide-react';

const Messages = () => {
  const { currentUser, userData } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationParticipants, setConversationParticipants] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!currentUser) return;

        const conversationsRef = collection(db, 'conversations');
        const q = query(
          conversationsRef,
          where('participants', 'array-contains', currentUser.uid),
          orderBy('lastMessageAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const conversationsList = [];

        for (const doc of querySnapshot.docs) {
          const convData = { id: doc.id, ...doc.data() };
          conversationsList.push(convData);
        }

        setConversations(conversationsList);

        // Auto-select first conversation if available
        if (conversationsList.length > 0 && !selectedConversation) {
          setSelectedConversation(conversationsList[0]);
          fetchMessages(conversationsList[0].id);
          fetchParticipantName(conversationsList[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser]);

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));

      const querySnapshot = await getDocs(q);
      const messagesList = [];

      querySnapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });

      setMessages(messagesList);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const messagesRef = collection(db, 'conversations', selectedConversation.id, 'messages');

      // Add message
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        senderName: userData?.firstName + ' ' + userData?.lastName,
        text: messageText.trim(),
        createdAt: new Date(),
        isRead: false,
      });

      // Update conversation lastMessage and lastMessageAt
      const convRef = doc(db, 'conversations', selectedConversation.id);
      await updateDoc(convRef, {
        lastMessage: messageText.trim(),
        lastMessageAt: new Date(),
      });

      setMessageText('');
      fetchMessages(selectedConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    fetchParticipantName(conversation.id);
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    setDeletingConversationId(conversationId);
    try {
      // Delete all messages in conversation
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const querySnapshot = await getDocs(messagesRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Delete conversation
      await deleteDoc(doc(db, 'conversations', conversationId));
      setConversations(conversations.filter(conv => conv.id !== conversationId));

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }

      alert('Conversation deleted');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation');
    } finally {
      setDeletingConversationId(null);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getOtherParticipant = (conversation) => {
    const otherUserId = conversation.participants.find(id => id !== currentUser.uid);

    // Check if we already have the participant's data cached
    if (conversationParticipants[otherUserId]) {
      return conversationParticipants[otherUserId];
    }

    return conversation.otherParticipantName || 'Unknown';
  };

  // Fetch other participant's display name
  const fetchParticipantName = async (conversationId) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const otherUserId = conversation.participants.find(id => id !== currentUser.uid);
      if (!otherUserId || conversationParticipants[otherUserId]) return;

      const userDoc = await getDoc(doc(db, 'users', otherUserId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Show company name for companies, employee name for employees
        const displayName = data.companyName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown';

        setConversationParticipants(prev => ({
          ...prev,
          [otherUserId]: displayName
        }));
      }
    } catch (error) {
      console.error('Error fetching participant name:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-secondary-200">
        <h1 className="text-3xl font-bold text-secondary-900">Messages</h1>
        <p className="text-secondary-600 text-sm mt-2">Stay connected with employers and candidates</p>
      </div>

      {/* Messages Container */}
      <div className="flex gap-6 flex-grow min-h-0">
        {/* Conversations List */}
        <div className="w-80 bg-white border border-secondary-200 rounded-lg overflow-y-auto flex flex-col">
          <div className="p-5 border-b border-secondary-200 bg-secondary-50">
            <h2 className="text-lg font-bold text-secondary-900">Conversations</h2>
            <p className="text-secondary-600 text-xs mt-1">{conversations.length} active</p>
          </div>

          {conversations.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center p-6">
                <MessageCircle size={40} className="mx-auto text-secondary-300 mb-3" />
                <p className="text-secondary-600 font-medium">No conversations yet</p>
                <p className="text-secondary-500 text-xs mt-1">Messages will appear here</p>
              </div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto space-y-1 p-3">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full text-left p-3.5 rounded-lg transition duration-200 ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary-100 border-2 border-primary-600'
                      : 'hover:bg-secondary-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-secondary-900 truncate text-sm">
                        {getOtherParticipant(conversation)}
                      </p>
                      <p className="text-secondary-600 text-xs truncate mt-1">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      <p className="text-secondary-500 text-xs mt-1">
                        {formatTime(conversation.lastMessageAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation.id);
                      }}
                      disabled={deletingConversationId === conversation.id}
                      className="p-1.5 hover:bg-red-100 rounded transition text-red-600 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-grow bg-white border border-secondary-200 rounded-lg flex flex-col">
            {/* Chat Header - Professional */}
            <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-primary-100 rounded-t-lg">
              <h2 className="text-2xl font-bold text-secondary-900">
                {getOtherParticipant(selectedConversation)}
              </h2>
              {selectedConversation.jobTitle && (
                <p className="text-secondary-600 text-sm mt-2">Regarding: <span className="font-medium">{selectedConversation.jobTitle}</span></p>
              )}
            </div>

            {/* Messages Display */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle size={40} className="mx-auto text-secondary-300 mb-3" />
                    <p className="text-secondary-600 font-medium">No messages yet</p>
                    <p className="text-secondary-500 text-xs mt-1">Start a conversation below</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2.5 rounded-lg ${
                        message.senderId === currentUser.uid
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : 'bg-secondary-100 text-secondary-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p
                        className={`text-xs mt-1.5 ${
                          message.senderId === currentUser.uid
                            ? 'text-primary-100'
                            : 'text-secondary-500'
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-5 border-t border-secondary-200 bg-secondary-50 rounded-b-lg">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2.5 border-2 border-secondary-300 rounded-lg focus:outline-none focus:border-primary-600 text-secondary-900 text-sm bg-white"
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-grow bg-white border border-secondary-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto text-secondary-300 mb-4" />
              <p className="text-secondary-600 font-semibold text-lg">Select a conversation</p>
              <p className="text-secondary-500 text-sm mt-2">
                {conversations.length === 0
                  ? 'No conversations yet'
                  : 'Choose a conversation from the list to start messaging'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
