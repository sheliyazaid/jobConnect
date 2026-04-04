import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Tag, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function GovernmentJobCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const defaultCategories = [
    { name: 'Central Government', description: 'Central Government of India jobs' },
    { name: 'State Government', description: 'State Government jobs' },
    { name: 'PSU', description: 'Public Sector Undertaking jobs' },
    { name: 'Defence', description: 'Defence and Armed Forces jobs' },
    { name: 'Railway', description: 'Indian Railway jobs' },
    { name: 'Banking', description: 'Banking sector jobs' },
    { name: 'Other', description: 'Other government organizations' }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'govJobCategories'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ name: '', description: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description
    });
    setSelectedCategory(category);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Category name is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (isEditing && selectedCategory) {
        await updateDoc(doc(db, 'govJobCategories', selectedCategory.id), {
          name: formData.name,
          description: formData.description
        });
        setSuccess('Category updated successfully!');
      } else {
        await addDoc(collection(db, 'govJobCategories'), {
          name: formData.name,
          description: formData.description,
          createdAt: serverTimestamp()
        });
        setSuccess('Category created successfully!');
      }

      setTimeout(() => setSuccess(''), 3000);
      fetchCategories();
      setShowModal(false);
    } catch (err) {
      setError('Failed to save category');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'govJobCategories', selectedCategory.id));
      setSuccess('Category deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchCategories();
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const handleInitializeDefaults = async () => {
    try {
      const existingNames = new Set(categories.map(c => c.name));
      const toAdd = defaultCategories.filter(cat => !existingNames.has(cat.name));

      if (toAdd.length === 0) {
        setSuccess('All default categories already exist!');
        return;
      }

      await Promise.all(
        toAdd.map(cat =>
          addDoc(collection(db, 'govJobCategories'), {
            name: cat.name,
            description: cat.description,
            createdAt: serverTimestamp()
          })
        )
      );

      setSuccess(`Added ${toAdd.length} categories!`);
      setTimeout(() => setSuccess(''), 3000);
      fetchCategories();
    } catch (err) {
      setError('Failed to initialize categories');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-8 h-8 text-secondary-600" />
            <h1 className="text-3xl font-bold text-secondary-900">Job Categories</h1>
          </div>
          <p className="text-secondary-600">Manage government job categories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <X className="w-5 h-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-100 p-4 mb-6 flex justify-between items-center">
          <div className="text-sm text-secondary-600 font-medium">
            {categories.length} categories
          </div>
          <div className="flex gap-2">
            {categories.length === 0 && (
              <button
                onClick={handleInitializeDefaults}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                Initialize Defaults
              </button>
            )}
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-secondary-100 p-12 text-center">
            <Tag className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600 mb-6 text-lg">No categories yet</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleInitializeDefaults}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                Initialize Default Categories
              </button>
              <button
                onClick={handleOpenModal}
                className="px-6 py-2 bg-secondary-200 text-secondary-900 rounded-lg hover:bg-secondary-300 transition font-medium"
              >
                Create New
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-sm border border-secondary-100 hover:shadow-md hover:border-primary-200 transition p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary-600" />
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {category.description || 'No description provided'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="bg-secondary-50 border-b border-secondary-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-secondary-900">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-secondary-600 hover:text-secondary-900 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Central Government"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of this category"
                  rows="3"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </form>

            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition font-medium"
              >
                {isEditing ? 'Update' : 'Create'} Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 text-center">
              <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Delete Category?</h3>
              <p className="text-secondary-600 mb-6">
                Are you sure you want to delete "{selectedCategory.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-secondary-200 text-secondary-900 rounded hover:bg-secondary-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
