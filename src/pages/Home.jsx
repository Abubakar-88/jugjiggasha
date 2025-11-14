import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Users, BookOpen, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentNotice, setCurrentNotice] = useState(0);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const slidingMessages = [
    {
      text: "পরিচালনায় জামিয়াতুল মাদীনা মনোহরদী, নরসিংদী",
      type: "info"
    },
    {
      text: "মাদরাসার গরীব মেধাবী শিক্ষার্থীদের জন্য দান করুন",
      type: "donate"
    },
    {
      text: "দ্বীনি শিক্ষা বিস্তারে আপনার সহযোগিতা প্রয়োজন",
      type: "info"
    }
  ];
  
  const slidingNotice = [
    {
      text: "অত্র মাদ্রাসায় প্রতি শনিবার মাগরিবের পর",
      type: "info"
    },
     {
      text: "দ্বিনি মজলিস আয়োজিত হয়",
      type: "info"
    },
    {
      text: "আমরা উপস্থিত থাকব সকল কে উপস্থিত হওয়ার জন্য অনুরোধ রইল",
      type: "info"
    },
    {
      text: "দ্বীনি জ্ঞান আহরন করা প্রত্যেক মুসলিমের জন্য ফরজ",
      type: "info"
    }
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidingMessages.length);
    }, 3000);

    const noticeInterval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % slidingNotice.length);
    }, 4000); // Notice slides every 4 seconds

    return () => {
      clearInterval(messageInterval);
      clearInterval(noticeInterval);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/islamic-questions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const stats = [
    { icon: MessageCircle, number: '১০০০+', label: 'মাসআলা উত্তরিত' },
    { icon: Users, number: '৫০০+', label: 'সদস্য' },
    { icon: BookOpen, number: '২০+', label: 'ক্যাটাগরি' },
  ];

  return (
    <div className="min-h-screen">
      {/* Top Sliding Message Banner */}
      <div className="bg-green-800 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="relative h-8 w-full text-center">
              {slidingMessages.map((message, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {message.type === 'donate' && (
                      <Heart className="h-5 w-5 text-red-300 animate-pulse" />
                    )}
                    <span className="text-lg font-medium bangla-text">
                      {message.text}
                    </span>
                    {message.type === 'donate' && (
                      <Link 
                        to="/donate" 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full text-sm font-medium bangla-text transition-colors ml-4"
                      >
                        দান করুন
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Slider - Right to Left */}
      <div className="bg-yellow-500 text-black py-2 overflow-hidden">
        <div className="relative">
          {/* Moving Notice Container */}
          <div className="animate-marquee whitespace-nowrap">
            {slidingNotice.map((notice, index) => (
              <span
                key={index}
                className={`mx-8 text-sm font-medium bangla-text inline-block ${
                  index === currentNotice ? 'opacity-100' : 'opacity-0 absolute'
                }`}
              >
                📢 {notice.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative Notice Design with Smooth Slide */}
      <div className="bg-orange-500 text-white py-2 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="bg-white text-orange-600 px-3 py-1 rounded-md mr-4 flex-shrink-0">
              <span className="text-sm font-bold bangla-text">নোটিশ</span>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="relative h-6">
                {slidingNotice.map((notice, index) => (
                  <div
                    key={index}
                    className={`absolute top-0 left-0 w-full transition-transform duration-1000 ease-in-out ${
                      index === currentNotice 
                        ? 'translate-x-0' 
                        : index < currentNotice 
                          ? '-translate-x-full' 
                          : 'translate-x-full'
                    }`}
                  >
                    <span className="text-sm font-medium bangla-text">
                      {notice.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for custom animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Madrasha Info */}
            <div className="mb-8">
              <div className="bg-green-800 inline-flex items-center px-6 py-3 rounded-full mb-4">
                <BookOpen className="h-6 w-6 mr-2" />
                <span className="text-lg font-semibold bangla-text">
                  জামিআতুল মাদীনা মনোহরদী
                </span>
              </div>
              <p className="text-green-200 text-lg bangla-text max-w-2xl mx-auto">
                একটি প্রতিষ্ঠিত ইসলামী শিক্ষা প্রতিষ্ঠান, যেখানে কুরআন-হাদীসের পাশাপাশি 
                আধুনিক শিক্ষাও প্রদান করা হয়
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bangla-text">
              আপনার প্রশ্নের উত্তর খুঁজুন
            </h1>
            <p className="text-xl md:text-2xl mb-8 bangla-text text-green-100">
              ইসলামী মাসআলা-মাসায়েলের নির্ভরযোগ্য প্ল্যাটফর্ম
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="ইসলামী মাসআলা সম্পর্কে জানতে চাই..."
                    className="w-full px-6 py-4 rounded-lg text-gray-800 text-lg bangla-text focus:outline-none focus:ring-4 focus:ring-green-300"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Search size={24} />
                  </button>
                </div>
              </form>
              <p className="text-green-200 text-sm mt-2 bangla-text">
                উদাহরণ: "ওযু ভঙ্গ", "নামাজের ফরজ", "হালাল খাবার"
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/ask-islamic-question"
                className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors bangla-text"
              >
                মাসআলা জিজ্ঞাসা করুন
              </Link>
              <Link
                to="/donate"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors bangla-text"
              >
                মাদরাসায় দান করুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your existing code... */}
      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <stat.icon className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-lg text-gray-600 bangla-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">কেন আমাদের প্ল্যাটফর্ম ব্যবহার করবেন?</h2>
            <p className="text-lg text-gray-600 bangla-text">কুরআন-সুন্নাহ ভিত্তিক নির্ভরযোগ্য সমাধান</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bangla-text">কুরআন-সুন্নাহ ভিত্তিক</h3>
              <p className="text-gray-600 bangla-text">সকল মাসআলা কুরআন ও সহীহ হাদীসের আলোকে সমাধান করা হয়</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bangla-text">অভিজ্ঞ আলেমগণ</h3>
              <p className="text-gray-600 bangla-text">অভিজ্ঞ আলেম-উলামাদের কাছ থেকে নির্ভরযোগ্য উত্তর পান</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bangla-text">বিনামূল্যে সেবা</h3>
              <p className="text-gray-600 bangla-text">সম্পূর্ণ বিনামূল্যে ইসলামী মাসআলার সমাধান প্রদান</p>
            </div>
          </div>
        </div>
      </section>

      {/* Madrasha Donation Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-red-300" />
            <h2 className="text-3xl font-bold mb-4 bangla-text">জামিআতুল মাদীনা মনোহরদী মাদরাসায় দান করুন</h2>
            <p className="text-xl mb-8 text-green-100 bangla-text max-w-3xl mx-auto">
              এই মাদরাসায় শতাধিক গরীব মেধাবী শিক্ষার্থী ইসলামী ও আধুনিক শিক্ষা গ্রহণ করছে। 
              আপনার দান তাদের শিক্ষা কার্যক্রম চালু রাখতে সহায়তা করবে।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donate"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors bangla-text"
              >
                এখনই দান করুন
              </Link>
              <Link
                to="/about"
                className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors bangla-text"
              >
                আমাদের সম্পর্কে জানুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Questions Preview */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">সাম্প্রতিক মাসআলা</h2>
            <p className="text-lg text-gray-600 bangla-text">ইদানীং জিজ্ঞাসিত কিছু গুরুত্বপূর্ণ মাসআলা</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Questions - You can replace with actual data from API */}
            <div className="card p-6">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full bangla-text mb-4 inline-block">
                ইবাদত
              </span>
              <h3 className="text-lg font-semibold mb-3 bangla-text">ওযু ভঙ্গের কারণগুলো কী কী?</h3>
              <p className="text-gray-600 text-sm bangla-text mb-4">
                ওযু ভঙ্গের প্রধান কারণগুলো জানতে চাই...
              </p>
              <Link to="/islamic-questions" className="text-green-600 hover:text-green-700 font-medium bangla-text text-sm">
                উত্তর দেখুন →
              </Link>
            </div>

            <div className="card p-6">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full bangla-text mb-4 inline-block">
                খানা-পিনা
              </span>
              <h3 className="text-lg font-semibold mb-3 bangla-text">হালাল খাদ্যের বৈশিষ্ট্য কী?</h3>
              <p className="text-gray-600 text-sm bangla-text mb-4">
                হালাল খাদ্য চেনার উপায়গুলো জানতে চাই...
              </p>
              <Link to="/islamic-questions" className="text-green-600 hover:text-green-700 font-medium bangla-text text-sm">
                উত্তর দেখুন →
              </Link>
            </div>

            <div className="card p-6">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full bangla-text mb-4 inline-block">
                বিবাহ
              </span>
              <h3 className="text-lg font-semibold mb-3 bangla-text">ইসলামী বিবাহের শর্তগুলো কী?</h3>
              <p className="text-gray-600 text-sm bangla-text mb-4">
                ইসলামী বিবাহ সঠিক হওয়ার জন্য কী কী শর্ত প্রয়োজন...
              </p>
              <Link to="/islamic-questions" className="text-green-600 hover:text-green-700 font-medium bangla-text text-sm">
                উত্তর দেখুন →
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/islamic-questions"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold bangla-text inline-block"
            >
              সকল মাসআলা দেখুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;