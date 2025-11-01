import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI, questionAPI } from '../../services/api';
import { Book, Send, AlertCircle, Clock, User, Phone, Mail, Info } from 'lucide-react';
import { Link } from 'react-router-dom'

const IslamicQuestionForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    userEmail: '',
    userPhone: '',
    userName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Categories load error:', error);
      setMessage({ 
        type: 'error', 
        text: 'ক্যাটাগরি লোড করতে সমস্যা হয়েছে' 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.categoryId || !formData.userPhone.trim()) {
      setMessage({ 
        type: 'error', 
        text: 'দয়া করে প্রশ্নের শিরোনাম, বিস্তারিত বিবরণ, ক্যাটাগরি এবং ফোন নম্বর প্রদান করুন' 
      });
      return;
    }

    if (formData.title.trim().length < 10) {
      setMessage({ 
        type: 'error', 
        text: 'প্রশ্নের শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে' 
      });
      return;
    }

    if (formData.description.trim().length < 20) {
      setMessage({ 
        type: 'error', 
        text: 'প্রশ্নের বিস্তারিত বিবরণ কমপক্ষে ২০ অক্ষরের হতে হবে' 
      });
      return;
    }

    // Phone number validation
    const phoneRegex = /^(?:\+88|01)?(?:\d{9}|\d{10})$/;
    if (!phoneRegex.test(formData.userPhone.trim().replace(/\s/g, ''))) {
      setMessage({ 
        type: 'error', 
        text: 'দয়া করে একটি সঠিক ফোন নম্বর প্রদান করুন' 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await questionAPI.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
        userEmail: formData.userEmail.trim(),
        userPhone: formData.userPhone.trim(),
        userName: formData.userName.trim()
      });
      
      setMessage({ 
        type: 'success', 
        text: 'আপনার মাসআলাটি সফলভাবে জমা হয়েছে। শীঘ্রই আমাদের আলেমগণ উত্তর প্রদান করবেন ইনশাআল্লাহ।' 
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        userEmail: '',
        userPhone: '',
        userName: ''
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/islamic-questions');
      }, 3000);

    } catch (error) {
      console.error('Question submission error:', error);
      setMessage({ 
        type: 'error', 
        text: 'প্রশ্ন জমা করতে সমস্যা হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।' 
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
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Book className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">
          ইসলামী মাসআলা জিজ্ঞাসা
        </h1>
        <p className="text-lg text-gray-600 bangla-text">
          আপনার ইসলাম সম্পর্কিত যেকোনো প্রশ্ন এখানে জিজ্ঞাসা করুন
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Form Guidelines */}
        <div className="bg-green-50 border-b border-green-200 p-6">
          <h3 className="font-semibold text-green-800 mb-3 bangla-text text-lg">
            মাসআলা জিজ্ঞাসার নিয়মাবলী:
          </h3>
          <ul className="text-green-700 space-y-2 bangla-text">
            <li className="flex items-start">
              <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>উত্তর পেতে ২৪-৪৮ ঘন্টা সময় লাগতে পারে</span>
            </li>
            <li className="flex items-start">
              <Book className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>প্রশ্নটি স্পষ্ট এবং সংক্ষিপ্তভাবে লিখুন</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>সম্মানজনক ভাষা ব্যবহার করুন</span>
            </li>
            <li className="flex items-start">
              <Phone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>ফোন নম্বর বাধ্যতামূলক - প্রশ্ন বুঝতে সমস্যা হলে আমরা কল করব</span>
            </li>
          </ul>
        </div>

        <div className="p-6">
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
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 bangla-text flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  আপনার তথ্য
                </h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="আপনার পুরো নাম"
                  className="input-field bangla-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  <Mail className="h-4 w-4 inline mr-1" />
                  ইমেইল
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input-field"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  <Phone className="h-4 w-4 inline mr-1" />
                  ফোন নম্বর <span className="text-red-500">*</span>
                  
                  {/* Info Icon with Tooltip */}
                  <div 
                    className="inline-flex items-center ml-2 relative"
                    onMouseEnter={() => setShowPhoneTooltip(true)}
                    onMouseLeave={() => setShowPhoneTooltip(false)}
                  >
                    <Info className="h-4 w-4 text-blue-500 cursor-help" />
                    
                    {/* Tooltip */}
                    {showPhoneTooltip && (
                      <div className="absolute left-0 bottom-6 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 z-10 shadow-lg">
                        <div className="flex items-start">
                          <Info className="h-4 w-4 text-blue-300 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="bangla-text">
                            আপনার প্রশ্ন বুঝতে সমস্যা হলে আমরা এই নম্বরে কল করে সাহায্য করতে পারি। 
                            ফোন নম্বরটি সঠিকভাবে প্রদান করুন।
                          </span>
                        </div>
                        <div className="absolute -bottom-1 left-4 w-3 h-3 bg-gray-900 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </label>
                
                <input
                  type="tel"
                  name="userPhone"
                  value={formData.userPhone}
                  onChange={handleChange}
                  placeholder="০১৭XXXXXXXX"
                  required
                  className="input-field bangla-text border-green-300 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1 bangla-text">
                  ফোন নম্বর বাধ্যতামূলক
                </p>
              </div>
            </div>

            {/* Question Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 bangla-text">
                মাসআলার বিবরণ
              </h3>

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  মাসআলার ক্যাটাগরি <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="input-field bangla-text"
                >
                  <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1 bangla-text">
                  আপনার মাসআলা কোন বিষয়ের সাথে সম্পর্কিত তা নির্বাচন করুন
                </p>
              </div>

              {/* Question Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  মাসআলার শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="উদাহরণ: ওযু ভঙ্গের কারণগুলো কী কী?"
                  required
                  minLength="10"
                  className="input-field bangla-text"
                />
                <p className="text-sm text-gray-500 mt-1 bangla-text">
                  কমপক্ষে ১০ অক্ষরের একটি সংক্ষিপ্ত শিরোনাম লিখুন
                </p>
              </div>

              {/* Question Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 bangla-text">
                  মাসআলার বিস্তারিত বিবরণ <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="8"
                  placeholder="আপনার মাসআলাটি বিস্তারিতভাবে বর্ণনা করুন...
উদাহরণ: আমি জানতে চাই যে ওযু অবস্থায় যদি কেউ হাসলে বা কথা বললে ওযু ভঙ্গ হয় কিনা? আর যদি ভঙ্গ হয় তাহলে কী কী কারণে ওযু ভঙ্গ হতে পারে?"
                  required
                  minLength="20"
                  className="input-field bangla-text resize-none"
                />
                <p className="text-sm text-gray-500 mt-1 bangla-text">
                  কমপক্ষে ২০ অক্ষরের বিস্তারিত বিবরণ লিখুন
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t">
              <div className="text-sm text-gray-500 bangla-text">
                <p>মাসআলা জমা দেওয়ার মাধ্যমে আপনি আমাদের 
                  <Link to="/terms" className="text-green-600 hover:text-green-700 mx-1">
                    শর্তাবলী
                  </Link>
                  স্বীকার করেছেন
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[200px] bangla-text"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    জমা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    মাসআলা জমা দিন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-3 bangla-text text-lg">
          গুরুত্বপূর্ণ তথ্য:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700 bangla-text">
          <div>
            <h4 className="font-medium mb-2">ফোন নম্বর কেন প্রয়োজন?</h4>
            <p className="text-sm">আপনার প্রশ্নটি যদি অস্পষ্ট বা জটিল হয়, আমরা সরাসরি ফোন করে বুঝতে সাহায্য করব। এটি দ্রুত উত্তর পাওয়ার সহায়ক।</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">কতদিন সময় লাগবে?</h4>
            <p className="text-sm">সাধারণত ২৪-৪৮ ঘন্টার মধ্যে উত্তর দেওয়া হয়। জটিল মাসআলার ক্ষেত্রে বেশি সময় লাগতে পারে</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicQuestionForm;