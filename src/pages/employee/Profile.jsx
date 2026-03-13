import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadToCloudinary } from '../../config/cloudinary';
import { Save, X, Edit2, Mail, Phone, Briefcase, Award, Upload, Loader } from 'lucide-react';

const EmployeeProfile = () => {
  const { currentUser, userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profession: '',
    yearsOfExperience: '',
    bio: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (!currentUser) return;
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            profession: data.profession || '',
            yearsOfExperience: data.yearsOfExperience || '',
            bio: data.bio || '',
            skills: Array.isArray(data.skills) ? data.skills : [],
          });
          setProfileImage(data.profileImage || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file, 'jobconnect/profiles');
      setProfileImage(imageUrl);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!currentUser) return;
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        ...formData,
        profileImage: profileImage,
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        profession: userData.profession || '',
        yearsOfExperience: userData.yearsOfExperience || '',
        bio: userData.bio || '',
        skills: Array.isArray(userData.skills) ? userData.skills : [],
      });
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-secondary-900 flex items-center gap-3">
            <Award size={40} />
            My Profile
          </h1>
          <p className="text-secondary-700 mt-2">Manage your professional information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Profile Card */}
        <div className="card bg-white">
          {isEditing ? (
            <form className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-secondary-200">
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-secondary-100 border-4 border-primary-200 flex items-center justify-center">
                      <Award size={48} className="text-secondary-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 cursor-pointer transition">
                    <Upload size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-center">
                  <p className="text-secondary-900 font-semibold">Upload Profile Photo</p>
                  <p className="text-secondary-600 text-sm">
                    {uploadingImage ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader size={14} className="animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      'JPG, PNG (Max 5MB)'
                    )}
                  </p>
                </div>
              </div>

              {/* Name Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary-800 font-semibold mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-secondary-800 font-semibold mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    required
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary-800 font-semibold mb-2 flex items-center gap-2">
                    <Mail size={18} />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-secondary-800 font-semibold mb-2 flex items-center gap-2">
                    <Phone size={18} />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-secondary-800 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                />
              </div>

              {/* Professional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary-800 font-semibold mb-2 flex items-center gap-2">
                    <Briefcase size={18} />
                    Profession *
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-secondary-800 font-semibold mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    max="70"
                    placeholder="e.g., 5"
                    className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-secondary-800 font-semibold mb-2">Professional Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about yourself, your achievements, and career goals..."
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 resize-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-secondary-800 font-semibold mb-3">Skills</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g., React, Node.js)"
                    className="flex-1 px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-accent-100 text-accent-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-accent-900 hover:text-accent-700 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-600 text-sm italic">Add your professional skills</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-secondary-200 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-300 transition"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Profile Image and Header */}
              <div className="flex items-center gap-6 pb-6 border-b-2 border-primary-200">
                <div>
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-secondary-100 border-4 border-primary-200 flex items-center justify-center">
                      <Award size={48} className="text-secondary-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-secondary-700 flex items-center gap-2 text-lg">
                    <Briefcase size={20} />
                    {formData.profession}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-primary-100 rounded-lg border border-primary-200">
                  <p className="text-secondary-600 font-medium text-sm mb-1 flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </p>
                  <a href={`mailto:${formData.email}`} className="text-secondary-900 font-bold text-lg hover:text-accent-600">
                    {formData.email}
                  </a>
                </div>

                <div className="p-4 bg-primary-100 rounded-lg border border-primary-200">
                  <p className="text-secondary-600 font-medium text-sm mb-1 flex items-center gap-2">
                    <Phone size={16} />
                    Phone
                  </p>
                  <a href={`tel:${formData.phone}`} className="text-secondary-900 font-bold text-lg hover:text-accent-600">
                    {formData.phone}
                  </a>
                </div>

                <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
                  <p className="text-blue-600 font-medium text-sm mb-1">Experience</p>
                  <p className="text-secondary-900 font-bold text-lg">{formData.yearsOfExperience || '0'} years</p>
                </div>

                <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                  <p className="text-green-600 font-medium text-sm mb-1">Skills</p>
                  <p className="text-secondary-900 font-bold text-lg">{formData.skills.length} skills added</p>
                </div>
              </div>

              {/* Address */}
              {formData.address && (
                <div className="p-4 bg-primary-100 rounded-lg border border-primary-200">
                  <p className="text-secondary-600 font-medium text-sm mb-1">Address</p>
                  <p className="text-secondary-900 font-bold">{formData.address}</p>
                </div>
              )}

              {/* Professional Bio */}
              {formData.bio && (
                <div className="p-6 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg border border-secondary-200">
                  <h3 className="text-lg font-bold text-secondary-900 mb-3">Professional Bio</h3>
                  <p className="text-secondary-700 leading-relaxed">{formData.bio}</p>
                </div>
              )}

              {/* Skills Display */}
              {formData.skills.length > 0 && (
                <div className="p-6 bg-white rounded-lg border border-accent-200">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <Award size={22} />
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-accent-100 text-accent-900 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
