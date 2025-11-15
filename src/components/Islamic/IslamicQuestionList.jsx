import React, { useState, useEffect, useCallback, useMemo, useDeferredValue } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { questionAPI, categoryAPI } from '../../services/api';
import { Search, Filter, BookOpen, Clock, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import CategorySidebar from './CategorySidebar';

const IslamicQuestionList = () => {
 const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const questionsPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();

  // 🔥 New: Track preloaded pages
  const [preloadedPages, setPreloadedPages] = useState(new Set());

  // Memoized filter function
  const filterQuestions = useCallback((questions, category, query) => {
    if (category === 'all' && !query) return questions;

    let filtered = questions;

    if (category !== 'all') {
      filtered = filtered.filter(q => 
        q.category && q.category.id.toString() === category
      );
    }

    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchQuery) ||
        (q.description && q.description.toLowerCase().includes(searchQuery)) ||
        (q.category && q.category.name.toLowerCase().includes(searchQuery)) ||
        (q.answer && q.answer.toLowerCase().includes(searchQuery))
      );
    }

    return filtered;
  }, []);

  // 🔥 Optimized: Use deferred search for better performance
  const filteredQuestions = useMemo(() => 
    filterQuestions(questions, selectedCategory, deferredSearchQuery),
    [questions, selectedCategory, deferredSearchQuery, filterQuestions]
  );

  // 🔥 Optimized: Load data with preloading
  const loadData = useCallback(async (page = currentPage, isPreload = false) => {
    if (!isPreload) {
      setLoading(true);
    }

    try {
      const response = await questionAPI.getAnsweredPaginated(page, questionsPerPage, 'createdAt', 'desc');
      const responseData = response.data;
      
      const questionsData = responseData.content || responseData.questions || [];
      const totalElements = responseData.totalElements || responseData.totalItems || 0;
      const totalPages = responseData.totalPages || 1;

      if (!isPreload) {
        setQuestions(questionsData);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
        
        if (initialLoad) {
          setInitialLoad(false);
        }

        // 🔥 Preload next 2 pages in background
        if (page < totalPages - 1) {
          setTimeout(() => {
            const nextPage1 = page + 1;
            const nextPage2 = page + 2;
            
            if (nextPage1 < totalPages && !preloadedPages.has(nextPage1)) {
              loadData(nextPage1, true);
              setPreloadedPages(prev => new Set(prev.add(nextPage1)));
            }
            if (nextPage2 < totalPages && !preloadedPages.has(nextPage2)) {
              loadData(nextPage2, true);
              setPreloadedPages(prev => new Set(prev.add(nextPage2)));
            }
          }, 500);
        }
      }

      return questionsData;
    } catch (error) {
      console.error('Data load error:', error);
      if (!isPreload) {
        setQuestions([]);
        setTotalPages(0);
        setTotalElements(0);
      }
      return [];
    } finally {
      if (!isPreload) {
        setLoading(false);
      }
    }
  }, [currentPage, questionsPerPage, initialLoad, preloadedPages]);

  // 🔥 Optimized: Load categories separately
  const loadCategories = useCallback(async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Categories load error:', error);
      setCategories([]);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
    
    // Load initial data in parallel
    Promise.all([
      loadData(0, false),
      loadCategories()
    ]);

    // Preload first few pages for instant navigation
    setTimeout(() => {
      questionAPI.preloadPages(1, 3, questionsPerPage)
        .then(results => {
          console.log('Preloaded pages 1-3');
        });
    }, 1000);

  }, []);

  // Handle page changes
  useEffect(() => {
    loadData(currentPage, false);
  }, [currentPage, loadData]);

  // 🔥 Optimized search with better debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchParams.set('search', searchQuery);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams);
      
      // Clear cache when search changes for fresh results
      if (searchQuery) {
        questionAPI.clearCache('answered_');
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchParams, setSearchParams]);

  // 🔥 Optimized event handlers
  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId.toString());
    setCurrentPage(0);
    // Clear cache when category changes
    questionAPI.clearCache('answered_');
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(0);
    questionAPI.clearCache('answered_');
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setCurrentPage(0);
    questionAPI.clearCache('answered_');
  }, []);

  // 🔥 Optimized pagination
  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // 🔥 Memoized page numbers
  const pageNumbers = useMemo(() => {
    const numbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        numbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i <= 3; i++) {
          numbers.push(i);
        }
        numbers.push('...');
        numbers.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        numbers.push(0);
        numbers.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          numbers.push(i);
        }
      } else {
        numbers.push(0);
        numbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          numbers.push(i);
        }
        numbers.push('...');
        numbers.push(totalPages - 1);
      }
    }
    
    return numbers;
  }, [currentPage, totalPages]);

  

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  }, []);

  // Preload next page
  useEffect(() => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      questionAPI.getAnsweredPaginated(nextPage, questionsPerPage, 'createdAt', 'desc')
        .then(() => console.log(`Preloaded page ${nextPage}`))
        .catch(err => console.log('Preload failed:', err));
    }
  }, [currentPage, totalPages, questionsPerPage]);

  if (loading && initialLoad) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Search Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">
          ইসলামী মাসআলা-মাসায়েল
        </h1>
        <p className="text-lg text-gray-600 bangla-text">
          বিভিন্ন ইসলামী বিষয়ে জিজ্ঞাসিত প্রশ্ন ও উত্তর
        </p>
        
        {/* Show search results info */}
        {searchQuery && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
            <p className="text-green-800 bangla-text">
              "<strong>{searchQuery}</strong>" এর জন্য {filteredQuestions.length}টি ফলাফল পাওয়া গেছে
            </p>
            <button
              onClick={clearSearch}
              className="text-green-600 hover:text-green-800 text-sm bangla-text mt-1 underline"
            >
              সব ফলাফল দেখুন
            </button>
          </div>
        )}
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Questions Content - 2/3 width */}
        <div className="lg:w-2/3">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSearchSubmit}>
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
            </form>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 bangla-text">
              মোট {totalElements}টি উত্তর দেওয়া প্রশ্ন পাওয়া গেছে
            </p>
            <p className="text-gray-600 bangla-text">
              পেজ {currentPage + 1} / {totalPages}
            </p>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Questions Grid */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2 bangla-text">
                      কোন প্রশ্ন পাওয়া যায়নি
                    </h3>
                    <p className="text-gray-500 bangla-text mb-4">
                      {searchQuery || selectedCategory !== 'all' 
                        ? 'আপনার সার্চের সাথে মিলে এমন কোন প্রশ্ন নেই' 
                        : 'এখনও কোন উত্তর দেওয়া প্রশ্ন নেই'
                      }
                    </p>
                    {(searchQuery || selectedCategory !== 'all') && (
                      <button
                        onClick={clearSearch}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium bangla-text transition-colors"
                      >
                        সব প্রশ্ন দেখুন
                      </button>
                    )}
                  </div>
                ) : (
                  filteredQuestions.map((question) => (
                    <QuestionCard 
                      key={question.id} 
                      question={question} 
                      formatDate={formatDate}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageNumbers={pageNumbers}
                  onPageChange={setCurrentPage}
                  onNextPage={nextPage}
                  onPrevPage={prevPage}
                />
              )}
            </>
          )}
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="lg:w-1/3">
          <CategorySidebar 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
            categories={categories}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

// Separate Question Card Component for better performance
const QuestionCard = React.memo(({ question, formatDate }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
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
      {question.isAnswered && question.answer && (
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
));

// Separate Pagination Component
const Pagination = React.memo(({ 
  currentPage, 
  totalPages, 
  pageNumbers, 
  onPageChange, 
  onNextPage, 
  onPrevPage 
}) => (
  <div className="flex justify-center items-center space-x-2 mb-8">
    {/* Previous Button */}
    <button
      onClick={onPrevPage}
      disabled={currentPage === 0}
      className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
        currentPage === 0
          ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
      }`}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      <span className="bangla-text">পূর্ববর্তী</span>
    </button>

    {/* Page Numbers */}
    <div className="flex space-x-1">
      {pageNumbers.map((number, index) => (
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
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              currentPage === number
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
            }`}
          >
            {number + 1}
          </button>
        )
      ))}
    </div>

    {/* Next Button */}
    <button
      onClick={onNextPage}
      disabled={currentPage === totalPages - 1}
      className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
        currentPage === totalPages - 1
          ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
      }`}
    >
      <span className="bangla-text">পরবর্তী</span>
      <ChevronRight className="h-4 w-4 ml-1" />
    </button>
  </div>
));

export default IslamicQuestionList;