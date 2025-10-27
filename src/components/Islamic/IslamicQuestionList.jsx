import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionAPI, categoryAPI } from '../../services/api';
import { Search, Filter, BookOpen, Clock, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const IslamicQuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5); // প্রতি পেজে ৫টি প্রশ্ন

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterQuestions();
    setCurrentPage(1); // Filter change করলে প্রথম পেজে ফিরে যাবে
  }, [questions, selectedCategory, searchQuery]);

  const loadData = async () => {
    try {
      const [questionsRes, categoriesRes] = await Promise.all([
        questionAPI.getAll(),
        categoryAPI.getAll()
      ]);
      setQuestions(questionsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => 
        q.category && q.category.id.toString() === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        (q.category && q.category.name.toLowerCase().includes(query))
      );
    }

    setFilteredQuestions(filtered);
  };

  // Get current questions for pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Calculate total pages
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Show first 4 pages and last page
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page and last 4 pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show pages around current page
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">
          ইসলামী মাসআলা-মাসায়েল
        </h1>
        <p className="text-lg text-gray-600 bangla-text">
          বিভিন্ন ইসলামী বিষয়ে জিজ্ঞাসিত প্রশ্ন ও উত্তর
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="প্রশ্ন খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 bangla-text">
          মোট {filteredQuestions.length}টি প্রশ্ন পাওয়া গেছে
        </p>
        <p className="text-gray-600 bangla-text">
          পেজ {currentPage} / {totalPages}
        </p>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {currentQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2 bangla-text">
              কোন প্রশ্ন পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 bangla-text">
              {searchQuery || selectedCategory !== 'all' 
                ? 'আপনার সার্চের সাথে মিলে এমন কোন প্রশ্ন নেই' 
                : 'এখনও কোন প্রশ্ন জমা হয়নি'
              }
            </p>
          </div>
        ) : (
          currentQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center mb-2 sm:mb-0">
                    {question.category && (
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full bangla-text">
                        {question.category.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="bangla-text">{formatDate(question.createdAt)}</span>
                  </div>
                </div>

                {/* Question Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 bangla-text">
                  {question.title}
                </h3>

                {/* Question Description */}
                <p className="text-gray-600 mb-4 line-clamp-3 bangla-text">
                  {question.description}
                </p>

                {/* Answer Section */}
                {question.isAnswered ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800 bangla-text">উত্তর:</span>
                    </div>
                    <p className="text-green-700 bangla-text line-clamp-2">{question.answer}</p>
                    {question.answeredAt && (
                      <div className="text-sm text-green-600 mt-2 bangla-text">
                        উত্তর দেওয়া হয়েছে: {formatDate(question.answeredAt)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-700 bangla-text">
                      <Clock className="h-4 w-4 inline mr-1" />
                      উত্তর দেওয়া হবে শীঘ্রই ইনশাআল্লাহ
                    </p>
                  </div>
                )}

                {/* View Details Link */}
                <div className="mt-4 text-right">
                  <Link
                    to={`/questions/${question.id}`}
                    className="text-green-600 hover:text-green-700 font-medium bangla-text inline-flex items-center"
                  >
                    বিস্তারিত দেখুন 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-8">
          {/* Previous Button */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="bangla-text">পূর্ববর্তী</span>
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {getPageNumbers().map((number, index) => (
              number === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === number
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                  }`}
                >
                  {number}
                </button>
              )
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
            }`}
          >
            <span className="bangla-text">পরবর্তী</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}

      {/* Questions Per Page Selector */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 bangla-text">
          প্রতি পেজে {questionsPerPage}টি প্রশ্ন দেখানো হচ্ছে
        </div>
        
        {/* You can add questions per page selector here if needed */}
        {/*
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 bangla-text">প্রতি পেজে:</span>
          <select 
            value={questionsPerPage}
            onChange={(e) => setQuestionsPerPage(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="5">৫</option>
            <option value="10">১০</option>
            <option value="20">২০</option>
          </select>
        </div>
        */}
      </div>
    </div>
  );
};

export default IslamicQuestionList;