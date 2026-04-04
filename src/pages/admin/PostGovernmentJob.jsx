import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Briefcase, Calendar, Map, File, CheckCircle } from 'lucide-react';

export default function PostGovernmentJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    governmentJobType: 'central',
    qualification: '',
    ageLimit: { minAge: '', maxAge: '' },
    yearsOfExperienceRequired: '',
    vacancies: { general: '', obc: '', sc: '', st: '', other: '' },
    applicationStartDate: '',
    applicationLastDate: '',
    examDate: '',
    officialNotificationLink: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Job Title is required';
    if (!formData.department.trim()) return 'Department is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.qualification.trim()) return 'Qualification is required';
    if (!formData.applicationStartDate) return 'Application Start Date is required';
    if (!formData.applicationLastDate) return 'Application Last Date is required';
    if (new Date(formData.applicationLastDate) <= new Date(formData.applicationStartDate)) {
      return 'Application Last Date must be after Start Date';
    }
    if (!formData.description.trim()) return 'Description is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const jobData = {
        ...formData,
        ageLimit: {
          minAge: parseInt(formData.ageLimit.minAge) || null,
          maxAge: parseInt(formData.ageLimit.maxAge) || null,
        },
        vacancies: {
          general: parseInt(formData.vacancies.general) || 0,
          obc: parseInt(formData.vacancies.obc) || 0,
          sc: parseInt(formData.vacancies.sc) || 0,
          st: parseInt(formData.vacancies.st) || 0,
          other: parseInt(formData.vacancies.other) || 0,
        },
        yearsOfExperienceRequired: parseInt(formData.yearsOfExperienceRequired) || 0,
        status: 'active',
        postedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'govJobs'), jobData);

      setSuccessMessage('Government job posted successfully!');
      setTimeout(() => {
        navigate('/admin/manage-government-jobs');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-secondary-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">Post Government Job</h1>
          </div>
          <p className="text-secondary-600 mt-2">Create a new government job posting for your platform</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6 pb-3 border-b border-secondary-200">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Civil Engineer"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., Ministry of Education"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Job Type *
                </label>
                <select
                  name="governmentJobType"
                  value={formData.governmentJobType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                >
                  <option value="central">Central Government</option>
                  <option value="state">State Government</option>
                  <option value="psu">PSU</option>
                  <option value="defence">Defence</option>
                  <option value="railway">Railway</option>
                  <option value="banking">Banking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New Delhi"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Eligibility Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6 pb-3 border-b border-secondary-200">
              Eligibility Criteria
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Qualification Required *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's in Engineering"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperienceRequired"
                  value={formData.yearsOfExperienceRequired}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Minimum Age
                </label>
                <input
                  type="number"
                  value={formData.ageLimit.minAge}
                  onChange={(e) => handleNestedChange('ageLimit', 'minAge', e.target.value)}
                  placeholder="18"
                  min="0"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Maximum Age
                </label>
                <input
                  type="number"
                  value={formData.ageLimit.maxAge}
                  onChange={(e) => handleNestedChange('ageLimit', 'maxAge', e.target.value)}
                  placeholder="65"
                  min="0"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Vacancies Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6 pb-3 border-b border-secondary-200">
              Vacancies by Category
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {['general', 'obc', 'sc', 'st', 'other'].map(category => (
                <div key={category}>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 capitalize">
                    {category === 'general' ? 'General' : category.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    value={formData.vacancies[category]}
                    onChange={(e) => handleNestedChange('vacancies', category, e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Important Dates Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6 pb-3 border-b border-secondary-200">
              Important Dates
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Application Start Date *
                </label>
                <input
                  type="date"
                  name="applicationStartDate"
                  value={formData.applicationStartDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Application Last Date *
                </label>
                <input
                  type="date"
                  name="applicationLastDate"
                  value={formData.applicationLastDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Exam Date
                </label>
                <input
                  type="date"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6 pb-3 border-b border-secondary-200">
              Official Links
            </h2>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Official Notification Link
              </label>
              <input
                type="url"
                name="officialNotificationLink"
                value={formData.officialNotificationLink}
                onChange={handleInputChange}
                placeholder="https://example.com/notification"
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6 pb-3 border-b border-secondary-200">
              Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter job description, responsibilities, and requirements..."
                rows="6"
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-secondary-600 text-white rounded-lg disabled:bg-secondary-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Posting...' : 'Post Government Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/manage-government-jobs')}
              className="px-6 py-3 bg-secondary-200 text-secondary-900 rounded-lg hover:bg-secondary-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
