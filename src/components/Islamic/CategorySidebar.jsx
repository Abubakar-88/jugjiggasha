import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../../services/api';
import { Folder, BookOpen, ChevronRight } from 'lucide-react';

const CategorySidebar = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex justify-between items-center py-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 sticky top-6">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center bangla-text">
          <Folder className="h-5 w-5 mr-2 text-green-600" />
          সকল ক্যাটাগরি
        </h3>
      </div>

      {/* Categories List */}
      <div className="p-4">
        {/* All Categories */}
        <button
          onClick={() => handleCategoryClick('all')}
          className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-3 text-green-600" />
            <span className="bangla-text font-medium">সকল মাসআলা</span>
          </div>
          <div className="flex items-center">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full bangla-text">
              {categories.reduce((total, cat) => total + (cat.questionCount || 0), 0)}
            </span>
            <ChevronRight className={`h-4 w-4 ml-2 ${
              selectedCategory === 'all' ? 'text-green-600' : 'text-gray-400'
            }`} />
          </div>
        </button>

        {/* Individual Categories */}
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                selectedCategory === category.id.toString()
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="bangla-text text-left">{category.name}</span>
              </div>
              <div className="flex items-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  selectedCategory === category.id.toString()
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.questionCount || 0}
                </span>
                <ChevronRight className={`h-4 w-4 ml-2 ${
                  selectedCategory === category.id.toString() ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
            </button>
          ))}
        </div>

        {/* No Categories Message */}
        {categories.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Folder className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="bangla-text">কোন ক্যাটাগরি পাওয়া যায়নি</p>
          </div>
        )}

        {/* Ask Question CTA */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2 bangla-text text-sm">
            প্রশ্ন নেই?
          </h4>
          <p className="text-green-700 text-xs mb-3 bangla-text">
            আপনার ইসলামী মাসআলা জিজ্ঞাসা করুন
          </p>
          <Link
            to="/ask-islamic-question"
            className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium bangla-text transition-colors"
          >
            মাসআলা জিজ্ঞাসা করুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;