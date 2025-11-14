import React, { useState, useEffect } from 'react';
import { questionAPI } from '../../services/api';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  MessageCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  X,
  Expand,
  Mail,
  Phone
} from 'lucide-react';

const AdminQuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showFullAnswerModal, setShowFullAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  
  // Loading states for different actions
  const [loadingStates, setLoadingStates] = useState({
    answer: null, // question id for which answer is being submitted
    delete: null, // question id for which delete is in progress
    edit: null, // question id for which edit is in progress
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [questions, searchQuery, statusFilter]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      console.error('Questions load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        (q.userName && q.userName.toLowerCase().includes(query)) ||
        (q.answer && q.answer.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (statusFilter === 'answered') {
      filtered = filtered.filter(q => q.isAnswered);
    } else if (statusFilter === 'unanswered') {
      filtered = filtered.filter(q => !q.isAnswered);
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
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
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

  const handleAnswerSubmit = async (questionId) => {
    if (!answerText.trim()) return;

    try {
      // Set loading state for this specific question
      setLoadingStates(prev => ({ ...prev, answer: questionId }));

      await questionAPI.answer(questionId, answerText);
      await loadQuestions(); // Reload questions
      setShowAnswerModal(false);
      setAnswerText('');
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Answer submission error:', error);
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, answer: null }));
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('আপনি কি এই প্রশ্নটি ডিলিট করতে চান?')) {
      try {
        // Set loading state for this specific question
        setLoadingStates(prev => ({ ...prev, delete: questionId }));

        await questionAPI.delete(questionId);
        await loadQuestions(); // Reload questions
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        // Clear loading state
        setLoadingStates(prev => ({ ...prev, delete: null }));
      }
    }
  };

  const handleEditAnswer = async (questionId) => {
    if (!answerText.trim()) return;

    try {
      // Set loading state for this specific question
      setLoadingStates(prev => ({ ...prev, edit: questionId }));

      await questionAPI.answer(questionId, answerText);
      await loadQuestions(); // Reload questions
      setShowAnswerModal(false);
      setAnswerText('');
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Answer edit error:', error);
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, edit: null }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  // Show full answer in modal
  const showFullAnswer = (question) => {
    setSelectedQuestion(question);
    setShowFullAnswerModal(true);
  };

  // Open answer modal for new answer or edit
  const openAnswerModal = (question, isEdit = false) => {
    setSelectedQuestion(question);
    setAnswerText(isEdit ? question.answer || '' : '');
    setShowAnswerModal(true);
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
      {/* Filters and Pagination Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text"
          >
            <option value="all">সকল প্রশ্ন</option>
            <option value="answered">উত্তর দেওয়া</option>
            <option value="unanswered">উত্তরবিহীন</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 flex items-center bangla-text">
          মোট প্রশ্ন: {filteredQuestions.length}
        </div>

        <div className="text-sm text-gray-600 flex items-center bangla-text">
          পেজ {currentPage} / {totalPages}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4 mb-8">
        {currentQuestions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2 bangla-text">
              কোন প্রশ্ন পাওয়া যায়নি
            </h3>
          </div>
        ) : (
          currentQuestions.map((question) => (
            <div key={question.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    {question.category && (
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full bangla-text">
                        {question.category.name}
                      </span>
                    )}
                    {!question.isAnswered && (
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full bangla-text">
                        উত্তর প্রয়োজন
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="bangla-text">{formatDate(question.createdAt)}</span>
                  </div>
                </div>

                {/* User Info - Updated based on your API response */}
                {(question.userEmail || question.userPhone) && (
                  <div className="mb-3 text-sm text-gray-600 flex flex-wrap gap-4">
                    {question.userEmail && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        <span>ইমেইল: {question.userEmail}</span>
                      </div>
                    )}
                    {question.userPhone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="bangla-text">ফোন: {question.userPhone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Title & Description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 bangla-text">
                  {question.title}
                </h3>
                <p className="text-gray-600 mb-4 bangla-text whitespace-pre-wrap">
                  {question.description}
                </p>

                {/* Answer Section */}
                {question.isAnswered ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800 bangla-text">উত্তর:</span>
                      </div>
                      {question.answer && question.answer.length > 200 && (
                        <button
                          onClick={() => showFullAnswer(question)}
                          className="flex items-center text-green-600 hover:text-green-700 text-sm bangla-text"
                        >
                          <Expand className="h-4 w-4 mr-1" />
                          সম্পূর্ণ পড়ুন
                        </button>
                      )}
                    </div>
                    
                    <p className="text-green-700 bangla-text whitespace-pre-wrap">
                      {question.answer && question.answer.length > 200 
                        ? `${question.answer.substring(0, 200)}...` 
                        : question.answer
                      }
                    </p>
                    
                    {question.answeredAt && (
                      <div className="text-sm text-green-600 mt-2 bangla-text">
                        উত্তর দেওয়া হয়েছে: {formatDate(question.answeredAt)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-700 bangla-text">
                      উত্তর দেওয়া হয়নি
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {!question.isAnswered && (
                    <button
                      onClick={() => openAnswerModal(question, false)}
                      disabled={loadingStates.answer === question.id}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center bangla-text"
                    >
                      {loadingStates.answer === question.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          লোড হচ্ছে...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          উত্তর দিন
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={() => openAnswerModal(question, true)}
                    disabled={loadingStates.edit === question.id}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center bangla-text"
                  >
                    {loadingStates.edit === question.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        লোড হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-1" />
                        {question.isAnswered ? 'এডিট করুন' : 'উত্তর দিন'}
                      </>
                    )}
                  </button>

                  {question.isAnswered && question.answer && (
                    <button
                      onClick={() => showFullAnswer(question)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center bangla-text"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      সম্পূর্ণ উত্তর
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={loadingStates.delete === question.id}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center bangla-text"
                  >
                    {loadingStates.delete === question.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        লোড হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        ডিলিট করুন
                      </>
                    )}
                  </button>
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

      {/* Answer Edit/Add Modal */}
      {showAnswerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold bangla-text">
                  {selectedQuestion?.isAnswered ? 'উত্তর এডিট করুন' : 'উত্তর প্রদান করুন'}
                </h3>
                <button
                  onClick={() => {
                    setShowAnswerModal(false);
                    setAnswerText('');
                    setSelectedQuestion(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {selectedQuestion && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 bangla-text">প্রশ্ন:</h4>
                  <p className="text-gray-700 bangla-text font-medium">{selectedQuestion.title}</p>
                  <p className="text-gray-600 mt-2 bangla-text whitespace-pre-wrap">
                    {selectedQuestion.description}
                  </p>
                  
                  {/* User Info in Modal */}
                  {(selectedQuestion.userEmail || selectedQuestion.userPhone) && (
                    <div className="mt-3 text-sm text-gray-600 flex flex-wrap gap-4">
                      {selectedQuestion.userEmail && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          <span>ইমেইল: {selectedQuestion.userEmail}</span>
                        </div>
                      )}
                      {selectedQuestion.userPhone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="bangla-text">ফোন: {selectedQuestion.userPhone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  উত্তর <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows="12"
                  placeholder="বিস্তারিত উত্তর লিখুন..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text resize-none"
                />
                <p className="text-sm text-gray-500 mt-1 bangla-text">
                  উত্তরটি বিস্তারিত এবং সহজবোধ্য করুন
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAnswerModal(false);
                    setAnswerText('');
                    setSelectedQuestion(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 bangla-text border border-gray-300 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  onClick={() => selectedQuestion?.isAnswered ? 
                    handleEditAnswer(selectedQuestion.id) : 
                    handleAnswerSubmit(selectedQuestion.id)
                  }
                  disabled={!answerText.trim() || loadingStates.answer === selectedQuestion?.id || loadingStates.edit === selectedQuestion?.id}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium bangla-text flex items-center"
                >
                  {(loadingStates.answer === selectedQuestion?.id || loadingStates.edit === selectedQuestion?.id) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      লোড হচ্ছে...
                    </>
                  ) : (
                    selectedQuestion?.isAnswered ? 'আপডেট করুন' : 'প্রকাশ করুন'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Answer View Modal */}
      {showFullAnswerModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold bangla-text">সম্পূর্ণ উত্তর</h3>
                <button
                  onClick={() => {
                    setShowFullAnswerModal(false);
                    setSelectedQuestion(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Question Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-lg mb-2 bangla-text">প্রশ্ন:</h4>
                <p className="text-gray-800 bangla-text font-medium text-lg">{selectedQuestion.title}</p>
                <p className="text-gray-700 mt-3 bangla-text whitespace-pre-wrap">
                  {selectedQuestion.description}
                </p>
                
                {/* User Info in Full Answer Modal */}
                {(selectedQuestion.userEmail || selectedQuestion.userPhone) && (
                  <div className="mt-3 text-sm text-gray-600 flex flex-wrap gap-4">
                    {selectedQuestion.userEmail && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        <span>ইমেইল: {selectedQuestion.userEmail}</span>
                      </div>
                    )}
                    {selectedQuestion.userPhone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="bangla-text">ফোন: {selectedQuestion.userPhone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Full Answer */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h4 className="text-xl font-semibold text-green-800 bangla-text">উত্তর:</h4>
                </div>
                <div className="prose max-w-none">
                  <p className="text-green-700 text-lg bangla-text leading-relaxed whitespace-pre-wrap">
                    {selectedQuestion.answer}
                  </p>
                </div>
                {selectedQuestion.answeredAt && (
                  <div className="flex items-center text-sm text-green-600 mt-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="bangla-text">
                      উত্তর দেওয়া হয়েছে: {formatDate(selectedQuestion.answeredAt)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowFullAnswerModal(false);
                    setSelectedQuestion(null);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium bangla-text"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionList;