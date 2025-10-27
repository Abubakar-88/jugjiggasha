import React, { useState, useEffect } from 'react';
import { categoryAPI, questionAPI  } from '../../services/api';
import { Plus, AlertCircle } from 'lucide-react';

const AdminAddQuestion = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    answer: '',
    userName: 'Admin' // Default user name for admin questions
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.categoryId || !formData.answer) {
      setMessage({ type: 'error', text: 'দয়া করে সকল প্রয়োজনীয় তথ্য প্রদান করুন' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the questionAPI service instead of direct fetch
      const response = await questionAPI.createWithAnswer(formData);
      
      setMessage({ 
        type: 'success', 
        text: 'প্রশ্ন ও উত্তর সফলভাবে যোগ করা হয়েছে' 
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        answer: '',
        userName: 'Admin'
      });
    } catch (error) {
      console.error('Question creation error:', error);
      setMessage({ 
        type: 'error', 
        text: 'প্রশ্ন যোগ করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 bangla-text">
          নতুন প্রশ্ন ও উত্তর যোগ করুন
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
              ক্যাটাগরি <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text"
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
              প্রশ্নের শিরোনাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="প্রশ্নের শিরোনাম লিখুন"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text"
            />
          </div>

          {/* Question Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
              প্রশ্নের বিবরণ <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="প্রশ্নের বিস্তারিত বিবরণ লিখুন"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text resize-none"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
              উত্তর <span className="text-red-500">*</span>
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows="6"
              placeholder="প্রশ্নের উত্তর লিখুন"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text resize-none"
            />
          </div>

          {/* Hidden User Name Field */}
          <input type="hidden" name="userName" value="Admin" />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  যোগ হচ্ছে...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  প্রশ্ন ও উত্তর যোগ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddQuestion;