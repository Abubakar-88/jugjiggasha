import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { questionAPI } from '../services/api';
import { ArrowLeft, Calendar, User, MessageCircle, ThumbsUp, Share } from 'lucide-react';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestion();
    loadComments();
  }, [id]);

  const loadQuestion = async () => {
    try {
      const response = await questionAPI.getById(id);
      setQuestion(response.data);
    } catch (error) {
      console.error('Question load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    // Temporary mock comments - backend-এ comment system add করতে পারেন
    const mockComments = [
      {
        id: 1,
        text: 'এই উত্তরটি খুবই সহজবোধ্য হয়েছে। জাজাকাল্লাহু খাইরান।',
        user: 'আব্দুল্লাহ',
        time: '২ ঘন্টা আগে',
        likes: 5
      },
      {
        id: 2,
        text: 'আরও কিছু উদাহরণ দিলে ভালো হতো।',
        user: 'ফাতেমা',
        time: '১ ঘন্টা আগে',
        likes: 2
      }
    ];
    setComments(mockComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      // Temporary - backend-এ comment API add করতে হবে
      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        user: 'আপনি',
        time: 'এখনই',
        likes: 0
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Comment submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 bangla-text">প্রশ্নটি পাওয়া যায়নি</h2>
          <Link to="/islamic-questions" className="text-green-600 hover:text-green-700 bangla-text">
            সকল প্রশ্ন দেখুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/islamic-questions" 
            className="inline-flex items-center text-green-600 hover:text-green-700 bangla-text"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            সকল প্রশ্নে ফিরে যান
          </Link>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
          <div className="p-6">
            {/* Question Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                {question.category && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full bangla-text">
                    {question.category.name}
                  </span>
                )}
                {question.isAnswered ? (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full bangla-text">
                    উত্তর দেওয়া হয়েছে
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full bangla-text">
                    উত্তর প্রতীক্ষায়
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="bangla-text">{formatDate(question.createdAt)}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <User className="h-4 w-4 mr-1" />
              <span className="bangla-text">
                {question.userName || 'অজানা ব্যবহারকারী'}
              </span>
            </div>

            {/* Question Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 bangla-text leading-tight">
              {question.title}
            </h1>

            {/* Question Description */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 text-lg bangla-text leading-relaxed whitespace-pre-wrap">
                {question.description}
              </p>
            </div>

            {/* Answer Section */}
            {question.isAnswered && question.answer && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-green-800 bangla-text">উত্তর:</h2>
                </div>
                <div className="prose max-w-none">
                  <p className="text-green-700 text-lg bangla-text leading-relaxed whitespace-pre-wrap">
                    {question.answer}
                  </p>
                </div>
                {question.answeredAt && (
                  <div className="flex items-center text-sm text-green-600 mt-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="bangla-text">
                      উত্তর দেওয়া হয়েছে: {formatDate(question.answeredAt)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                <ThumbsUp className="h-5 w-5 mr-1" />
                <span className="bangla-text">উপকারী</span>
              </button>
              
              <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                <Share className="h-5 w-5 mr-1" />
                <span className="bangla-text">শেয়ার করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 bangla-text flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
              মন্তব্য ({comments.length})
            </h2>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  আপনার মন্তব্য লিখুন
                </label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="4"
                  placeholder="আপনার মূল্যবান মন্তব্য এখানে লিখুন..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bangla-text resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium bangla-text transition-colors"
              >
                {submitting ? 'পোস্ট হচ্ছে...' : 'মন্তব্য পোস্ট করুন'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bangla-text">
                  এখনও কোন মন্তব্য নেই। প্রথম মন্তব্য করুন!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 bangla-text">{comment.user}</h4>
                          <p className="text-sm text-gray-500 bangla-text">{comment.time}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center text-gray-500 hover:text-green-600 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                    </div>
                    
                    <p className="text-gray-700 bangla-text leading-relaxed whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related Questions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 bangla-text">সম্পর্কিত প্রশ্নসমূহ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* You can add related questions here */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2 bangla-text">ওযু ভঙ্গের নিয়ম</h4>
              <p className="text-sm text-gray-600 bangla-text line-clamp-2">ওযু ভঙ্গের বিভিন্ন কারণ সম্পর্কে বিস্তারিত...</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2 bangla-text">নামাজের ফরজ</h4>
              <p className="text-sm text-gray-600 bangla-text line-clamp-2">নামাজের ফরজ ও ওয়াজিব সম্পর্কে জানুন...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;