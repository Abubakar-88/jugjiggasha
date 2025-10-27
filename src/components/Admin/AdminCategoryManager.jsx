import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const AdminCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Categories load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'ক্যাটাগরি নাম প্রয়োজন' });
      return;
    }

    try {
      if (editingCategory) {
        // Update category
        await categoryAPI.update(editingCategory.id, formData);
        setMessage({ type: 'success', text: 'ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে' });
      } else {
        // Create new category
        await categoryAPI.create(formData);
        setMessage({ type: 'success', text: 'ক্যাটাগরি সফলভাবে তৈরি করা হয়েছে' });
      }

      await loadCategories();
      resetForm();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: editingCategory ? 'ক্যাটাগরি আপডেট করতে সমস্যা' : 'ক্যাটাগরি তৈরি করতে সমস্যা'
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('আপনি কি এই ক্যাটাগরি ডিলিট করতে চান?')) {
      try {
        await categoryAPI.delete(categoryId);
        await loadCategories();
        setMessage({ type: 'success', text: 'ক্যাটাগরি ডিলিট করা হয়েছে' });
      } catch (error) {
        setMessage({ type: 'error', text: 'ক্যাটাগরি ডিলিট করতে সমস্যা' });
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 bangla-text mb-4 sm:mb-0">
          ক্যাটাগরি ম্যানেজমেন্ট
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center bangla-text"
        >
          <Plus className="h-5 w-5 mr-2" />
          নতুন ক্যাটাগরি
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="bangla-text">{message.text}</span>
          </div>
        </div>
      )}

      {/* Category Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 bangla-text">
            {editingCategory ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি যোগ করুন'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                ক্যাটাগরি নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ক্যাটাগরি নাম লিখুন"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                বিবরণ (ঐচ্ছিক)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 bangla-text"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium bangla-text"
              >
                {editingCategory ? 'আপডেট করুন' : 'যোগ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 bangla-text">
                {category.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {category.description && (
              <p className="text-gray-600 text-sm mb-3 bangla-text">
                {category.description}
              </p>
            )}
            
            <div className="text-sm text-gray-500 bangla-text">
              প্রশ্ন সংখ্যা: {category.questionCount || 0}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 bangla-text">কোন ক্যাটাগরি পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManager;