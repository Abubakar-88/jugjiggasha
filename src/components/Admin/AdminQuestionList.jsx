import React, { useState, useEffect } from 'react';
import { questionAPI } from '../../services/api';
import { Edit, Trash2, Eye, Search, Filter, MessageCircle, Clock } from 'lucide-react';

const AdminQuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchQuery, statusFilter]);

  const loadQuestions = async () => {
    try {
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
        (q.userName && q.userName.toLowerCase().includes(query))
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

  const handleAnswerSubmit = async (questionId) => {
    if (!answerText.trim()) return;

    try {
      await questionAPI.answer(questionId, answerText);
      await loadQuestions(); // Reload questions
      setShowAnswerModal(false);
      setAnswerText('');
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Answer submission error:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('আপনি কি এই প্রশ্নটি ডিলিট করতে চান?')) {
      try {
        await questionAPI.delete(questionId);
        await loadQuestions(); // Reload questions
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
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
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2 bangla-text">
              কোন প্রশ্ন পাওয়া যায়নি
            </h3>
          </div>
        ) : (
          filteredQuestions.map((question) => (
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

                {/* User Info */}
                {(question.userName || question.userEmail) && (
                  <div className="mb-3 text-sm text-gray-600">
                    {question.userName && <span className="bangla-text">প্রশ্নকারী: {question.userName}</span>}
                    {question.userEmail && <span className="ml-3">ইমেইল: {question.userEmail}</span>}
                    {question.userPhone && <span className="ml-3">ফোন: {question.userPhone}</span>}
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
                    <div className="flex items-center mb-2">
                      <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800 bangla-text">উত্তর:</span>
                    </div>
                    <p className="text-green-700 bangla-text whitespace-pre-wrap">{question.answer}</p>
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
                      onClick={() => {
                        setSelectedQuestion(question);
                        setShowAnswerModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center bangla-text"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      উত্তর দিন
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setAnswerText(question.answer || '');
                      setShowAnswerModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center bangla-text"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {question.isAnswered ? 'এডিট করুন' : 'উত্তর দিন'}
                  </button>

                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center bangla-text"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    ডিলিট করুন
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Answer Modal */}
      {showAnswerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 bangla-text">
                {selectedQuestion?.isAnswered ? 'উত্তর এডিট করুন' : 'উত্তর প্রদান করুন'}
              </h3>
              
              {selectedQuestion && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 bangla-text">প্রশ্ন:</h4>
                  <p className="text-gray-700 bangla-text">{selectedQuestion.title}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  উত্তর <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows="8"
                  placeholder="উত্তরটি লিখুন..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAnswerModal(false);
                    setAnswerText('');
                    setSelectedQuestion(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 bangla-text"
                >
                  বাতিল
                </button>
                <button
                  onClick={() => handleAnswerSubmit(selectedQuestion.id)}
                  disabled={!answerText.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium bangla-text"
                >
                  {selectedQuestion?.isAnswered ? 'আপডেট করুন' : 'প্রকাশ করুন'}
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