import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CheckCircle, XCircle, FileText, User, Building2 } from 'lucide-react';

const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        setPendingUsers(usersList);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApproval = async (userId, action) => {
    setProcessing(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: action === 'approve' ? 'approved' : 'rejected',
      });
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      alert(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    } finally {
      setProcessing(null);
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
    <div>
      <h1 className="text-4xl font-bold text-secondary-900 mb-8 flex items-center gap-3">
        <CheckCircle size={36} className="text-green-600" />
        Pending User Approvals
      </h1>

      {pendingUsers.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
          <p className="text-secondary-700 text-lg font-medium">No pending approvals at the moment!</p>
          <p className="text-secondary-600 text-sm mt-2">All users have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div key={user.id} className="card bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full ${
                      user.role === 'company' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {user.role === 'company' ? (
                        <Building2 size={24} className="text-blue-700" />
                      ) : (
                        <User size={24} className="text-green-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold inline-block ${
                        user.role === 'company' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role?.toUpperCase()}
                      </span>
                      <p className="text-xs text-secondary-500 mt-1">
                        Registered: {new Date(user.createdAt?.toDate?.() || user.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {user.role === 'employee' ? (
                    <>
                      <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <span className="text-secondary-600 font-medium">Email:</span>
                          <p className="text-secondary-900">{user.email}</p>
                        </div>
                        <div>
                          <span className="text-secondary-600 font-medium">Phone:</span>
                          <p className="text-secondary-900">{user.phone}</p>
                        </div>
                        <div>
                          <span className="text-secondary-600 font-medium">Address:</span>
                          <p className="text-secondary-900">{user.address || 'Not specified'}</p>
                        </div>
                      </div>

                      {/* Skills */}
                      {user.skills && user.skills.length > 0 && (
                        <div className="mb-4">
                          <span className="text-secondary-600 font-medium">Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {user.skills.map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      {user.experience && user.experience.length > 0 && (
                        <div className="mb-4">
                          <span className="text-secondary-600 font-medium block mb-2">Work Experience:</span>
                          <div className="space-y-2">
                            {user.experience.map((exp, index) => (
                              <div key={index} className="bg-secondary-50 p-3 rounded-lg border border-secondary-100 text-sm">
                                <p className="font-semibold text-secondary-900">{exp.company}</p>
                                <p className="text-secondary-700">{exp.position} • {exp.duration}</p>
                                {exp.description && <p className="text-secondary-600 mt-1">{exp.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {user.education && user.education.length > 0 && (
                        <div className="mb-4">
                          <span className="text-secondary-600 font-medium block mb-2">Education:</span>
                          <div className="space-y-2">
                            {user.education.map((edu, index) => (
                              <div key={index} className="bg-secondary-50 p-3 rounded-lg border border-secondary-100 text-sm">
                                <p className="font-semibold text-secondary-900">{edu.school}</p>
                                <p className="text-secondary-700">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                                {edu.startDate && edu.endDate && <p className="text-secondary-600">{edu.startDate} - {edu.endDate}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {user.certifications && user.certifications.length > 0 && (
                        <div className="mb-4">
                          <span className="text-secondary-600 font-medium block mb-2">Certifications:</span>
                          <div className="space-y-2">
                            {user.certifications.map((cert, index) => (
                              <div key={index} className="bg-secondary-50 p-3 rounded-lg border border-secondary-100 text-sm">
                                <p className="font-semibold text-secondary-900">{cert.name}</p>
                                <p className="text-secondary-700">{cert.issuer}</p>
                                {cert.date && <p className="text-secondary-600">{cert.date}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.resume && (
                        <a
                          href={user.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-secondary-900 hover:text-accent-600 font-medium text-sm mb-3"
                        >
                          <FileText size={16} />
                          View Resume
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                        {user.companyName}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <span className="text-secondary-600 font-medium">Contact Person:</span>
                          <p className="text-secondary-900">{user.contactPerson}</p>
                        </div>
                        <div>
                          <span className="text-secondary-600 font-medium">Email:</span>
                          <p className="text-secondary-900">{user.email}</p>
                        </div>
                        <div>
                          <span className="text-secondary-600 font-medium">Phone:</span>
                          <p className="text-secondary-900">{user.phone}</p>
                        </div>
                        <div>
                          <span className="text-secondary-600 font-medium">Location:</span>
                          <p className="text-secondary-900">{user.location}</p>
                        </div>
                      </div>
                      {user.website && (
                        <p className="text-secondary-600 mb-3">
                          <strong>Website:</strong> <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-secondary-900 hover:text-accent-600 font-medium">{user.website}</a>
                        </p>
                      )}
                      {user.companyDescription && (
                        <div className="p-3 bg-primary-100 rounded-lg border border-primary-200">
                          <p className="text-secondary-700 text-sm"><strong>About:</strong> {user.companyDescription}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApproval(user.id, 'approve')}
                    disabled={processing === user.id}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(user.id, 'reject')}
                    disabled={processing === user.id}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-semibold"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveUsers;

