import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const PostJob = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'full-time',
    salary: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'jobs'), {
        ...formData,
        companyId: currentUser.uid,
        companyName: userData?.companyName,
        status: 'active',
        createdAt: new Date(),
      });

      alert('Job posted successfully!');
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 flex items-center gap-3">
          <Briefcase size={40} />
          Post a New Job
        </h1>
        <p className="text-secondary-700 mt-2">Create a new job posting for your company</p>
      </div>

      <form onSubmit={handleSubmit} className="card bg-white space-y-6">
        <div>
          <label htmlFor="title" className="block text-secondary-800 font-semibold mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-secondary-800 font-semibold mb-2">
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 resize-none"
            placeholder="Describe the job responsibilities, requirements, and benefits..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-secondary-800 font-semibold mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
              placeholder="e.g., New York, NY"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-secondary-800 font-semibold mb-2">
              Job Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="salary" className="block text-secondary-800 font-semibold mb-2">
            Salary Range (Optional)
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., $50,000 - $70,000"
            className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
          />
        </div>

        <div>
          <label className="block text-secondary-800 font-semibold mb-3">Required Skills *</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill (e.g., JavaScript, React)"
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
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-accent-100 text-accent-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
                    className="text-accent-900 hover:text-accent-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-secondary-600 text-sm italic">Add at least one skill</p>
          )}
        </div>

        <div className="flex gap-4 pt-6 border-t-2 border-primary-200">
          <button
            type="submit"
            disabled={loading || formData.skills.length === 0}
            className="btn-primary flex-1"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/company/dashboard')}
            className="flex-1 px-6 py-2.5 bg-secondary-200 text-secondary-900 rounded-lg hover:bg-secondary-300 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;

