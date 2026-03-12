import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Award, BookOpen, Briefcase, Plus, X, Save } from 'lucide-react';

const EmployeeSkills = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('education');

  // New item states
  const [newEducation, setNewEducation] = useState({ school: '', degree: '', field: '', startDate: '', endDate: '' });
  const [newExperience, setNewExperience] = useState({ company: '', position: '', duration: '', description: '' });
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', date: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) return;
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleAddEducation = async () => {
    if (!newEducation.school || !newEducation.degree) {
      alert('Please fill in school and degree');
      return;
    }
    setSaving(true);
    try {
      if (!currentUser) return;
      const education = userData?.education || [];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        education: [...education, newEducation],
      });
      setUserData(prev => ({
        ...prev,
        education: [...(prev?.education || []), newEducation],
      }));
      setNewEducation({ school: '', degree: '', field: '', startDate: '', endDate: '' });
      alert('Education added successfully!');
    } catch (error) {
      console.error('Error adding education:', error);
      alert('Failed to add education');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveEducation = async (index) => {
    setSaving(true);
    try {
      if (!currentUser) return;
      const newEducationList = userData?.education?.filter((_, i) => i !== index) || [];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        education: newEducationList,
      });
      setUserData(prev => ({
        ...prev,
        education: newEducationList,
      }));
    } catch (error) {
      console.error('Error removing education:', error);
      alert('Failed to remove education');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.company || !newExperience.position) {
      alert('Please fill in company and position');
      return;
    }
    setSaving(true);
    try {
      if (!currentUser) return;
      const experience = userData?.experience || [];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        experience: [...experience, newExperience],
      });
      setUserData(prev => ({
        ...prev,
        experience: [...(prev?.experience || []), newExperience],
      }));
      setNewExperience({ company: '', position: '', duration: '', description: '' });
      alert('Experience added successfully!');
    } catch (error) {
      console.error('Error adding experience:', error);
      alert('Failed to add experience');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveExperience = async (index) => {
    setSaving(true);
    try {
      if (!currentUser) return;
      const newExperienceList = userData?.experience?.filter((_, i) => i !== index) || [];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        experience: newExperienceList,
      });
      setUserData(prev => ({
        ...prev,
        experience: newExperienceList,
      }));
    } catch (error) {
      console.error('Error removing experience:', error);
      alert('Failed to remove experience');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCertification = async () => {
    if (!newCertification.name || !newCertification.issuer) {
      alert('Please fill in certification name and issuer');
      return;
    }
    setSaving(true);
    try {
      if (!currentUser) return;
      const certifications = userData?.certifications || [];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        certifications: [...certifications, newCertification],
      });
      setUserData(prev => ({
        ...prev,
        certifications: [...(prev?.certifications || []), newCertification],
      }));
      setNewCertification({ name: '', issuer: '', date: '' });
      alert('Certification added successfully!');
    } catch (error) {
      console.error('Error adding certification:', error);
      alert('Failed to add certification');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCertification = async (index) => {
    setSaving(true);
    try {
      if (!currentUser) return;
      const newCertificationsList = userData?.certifications?.filter((_, i) => i !== index) || [];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        certifications: newCertificationsList,
      });
      setUserData(prev => ({
        ...prev,
        certifications: newCertificationsList,
      }));
    } catch (error) {
      console.error('Error removing certification:', error);
      alert('Failed to remove certification');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-900"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-secondary-200">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2 flex items-center gap-3">
          <Award size={40} />
          Skills & Experience
        </h1>
        <p className="text-secondary-600 text-lg">Manage your education, experience, and certifications</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-secondary-200">
        {[
          { id: 'education', label: 'Education', icon: BookOpen },
          { id: 'experience', label: 'Work Experience', icon: Briefcase },
          { id: 'certifications', label: 'Certifications', icon: Award },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
              activeTab === id
                ? 'border-secondary-900 text-secondary-900'
                : 'border-transparent text-secondary-600 hover:text-secondary-900'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <div className="card bg-white">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Add Education</h2>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="School/University"
                value={newEducation.school}
                onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Degree (e.g., Bachelor of Science)"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                />
                <input
                  type="text"
                  placeholder="Field (e.g., Computer Science)"
                  value={newEducation.field}
                  onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Start Date (e.g., 2018)"
                  value={newEducation.startDate}
                  onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                />
                <input
                  type="text"
                  placeholder="End Date (e.g., 2022)"
                  value={newEducation.endDate}
                  onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                />
              </div>
              <button
                onClick={handleAddEducation}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 font-semibold transition disabled:opacity-50"
              >
                <Plus size={20} />
                Add Education
              </button>
            </div>
          </div>

          {/* Education List */}
          {userData?.education && userData.education.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-secondary-900">Your Education</h2>
              {userData.education.map((edu, index) => (
                <div key={index} className="card bg-white p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-secondary-900 text-lg">{edu.school}</p>
                      <p className="text-secondary-700 font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                      <p className="text-secondary-600 text-sm mt-2">{edu.startDate} - {edu.endDate}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      disabled={saving}
                      className="p-2 hover:bg-red-100 rounded transition disabled:opacity-50"
                    >
                      <X size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="card bg-white">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Add Work Experience</h2>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Company Name"
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Position (e.g., Senior Developer)"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 2 years)"
                  value={newExperience.duration}
                  onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                />
              </div>
              <textarea
                placeholder="Description of your role and achievements"
                value={newExperience.description}
                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500 resize-none"
              />
              <button
                onClick={handleAddExperience}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 font-semibold transition disabled:opacity-50"
              >
                <Plus size={20} />
                Add Experience
              </button>
            </div>
          </div>

          {/* Experience List */}
          {userData?.experience && userData.experience.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-secondary-900">Your Work Experience</h2>
              {userData.experience.map((exp, index) => (
                <div key={index} className="card bg-white p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-secondary-900 text-lg">{exp.company}</p>
                      <p className="text-secondary-700 font-medium">{exp.position}</p>
                      <p className="text-secondary-600 text-sm mt-1">{exp.duration}</p>
                      {exp.description && <p className="text-secondary-600 text-sm mt-3 leading-relaxed">{exp.description}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      disabled={saving}
                      className="p-2 hover:bg-red-100 rounded transition disabled:opacity-50"
                    >
                      <X size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="card bg-white">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Add Certification</h2>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Certification Name (e.g., AWS Solutions Architect)"
                value={newCertification.name}
                onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Issuer/Organization"
                  value={newCertification.issuer}
                  onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                />
                <input
                  type="text"
                  placeholder="Date (e.g., 2024)"
                  value={newCertification.date}
                  onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                />
              </div>
              <button
                onClick={handleAddCertification}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 font-semibold transition disabled:opacity-50"
              >
                <Plus size={20} />
                Add Certification
              </button>
            </div>
          </div>

          {/* Certifications List */}
          {userData?.certifications && userData.certifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-secondary-900">Your Certifications</h2>
              {userData.certifications.map((cert, index) => (
                <div key={index} className="card bg-white p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-secondary-900 text-lg">{cert.name}</p>
                      <p className="text-secondary-700 font-medium">{cert.issuer}</p>
                      {cert.date && <p className="text-secondary-600 text-sm mt-1">{cert.date}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveCertification(index)}
                      disabled={saving}
                      className="p-2 hover:bg-red-100 rounded transition disabled:opacity-50"
                    >
                      <X size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeSkills;
