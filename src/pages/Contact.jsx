import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'ফোন নম্বর',
      details: '০১৬৭৩৫৭৪৫৩৫',
      description: 'সকাল ৬টা থেকে রাত ১০টা',
      action: 'call'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: '০১৬৭৩৫৭৪৫৩৫',
      description: '২৪/৭ সংযোগ উপলব্ধ',
      action: 'whatsapp'
    },
    {
      icon: Mail,
      title: 'ইমেইল',
      details: 'jamiatulmadina@gmail.com',
      description: 'যেকোনো প্রশ্নের জন্য',
      action: 'email'
    },
    {
      icon: MapPin,
      title: 'ঠিকানা',
      details: 'মনোহরদী, নরসিংদী',
      description: 'বাংলাদেশ',
      action: null
    },
    {
      icon: Clock,
      title: 'কার্যকাল',
      details: 'শনিবার - বৃহস্পতিবার',
      description: 'সকাল ৬:০০ - রাত ১০:০০',
      action: null
    }
  ];

  const openWhatsApp = () => {
    const phoneNumber = '01673574535';
    const message = 'আসসালামু আলাইকুম, জামিয়াতুল মাদীনা মনোহরদী সম্পর্কে জানতে চাই।';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openPhone = () => {
    window.location.href = 'tel:01673574535';
  };

  const openEmail = () => {
    window.location.href = 'mailto:jamiatulmadina@gmail.com';
  };

  const handleAction = (action) => {
    switch(action) {
      case 'whatsapp':
        openWhatsApp();
        break;
      case 'call':
        openPhone();
        break;
      case 'email':
        openEmail();
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 bangla-text mb-4">যোগাযোগ করুন</h1>
          <p className="text-lg text-gray-600 bangla-text max-w-2xl mx-auto">
            জামিয়াতুল মাদীনা মনোহরদীর সাথে সরাসরি যোগাযোগ করুন। যেকোনো প্রশ্ন, পরামর্শ বা সহযোগিতার জন্য আমরা আপনার সেবায় প্রস্তুত।
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                  item.action ? 'cursor-pointer hover:bg-green-50' : ''
                }`}
                onClick={() => item.action && handleAction(item.action)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    item.action === 'whatsapp' ? 'bg-green-100' : 
                    item.action === 'call' ? 'bg-blue-100' :
                    item.action === 'email' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      item.action === 'whatsapp' ? 'text-green-600' : 
                      item.action === 'call' ? 'text-blue-600' :
                      item.action === 'email' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 bangla-text">{item.title}</h3>
                    <p className="text-gray-700 bangla-text font-medium mt-1">{item.details}</p>
                    <p className="text-sm text-gray-500 bangla-text mt-1">{item.description}</p>
                    
                    {item.action === 'whatsapp' && (
                      <button className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm bangla-text transition-colors flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>মেসেজ করুন</span>
                      </button>
                    )}
                    
                    {item.action === 'call' && (
                      <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm bangla-text transition-colors flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>কল করুন</span>
                      </button>
                    )}
                    
                    {item.action === 'email' && (
                      <button className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm bangla-text transition-colors flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>ইমেইল করুন</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 bangla-text text-center">দ্রুত যোগাযোগ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={openWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg font-semibold bangla-text transition-colors flex flex-col items-center justify-center space-y-3"
            >
              <MessageCircle className="h-8 w-8" />
              <span>WhatsApp এ চ্যাট করুন</span>
              <span className="text-green-200 text-sm">২৪/৭ উপলব্ধ</span>
            </button>
            
            <button
              onClick={openPhone}
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg font-semibold bangla-text transition-colors flex flex-col items-center justify-center space-y-3"
            >
              <Phone className="h-8 w-8" />
              <span>সরাসরি কল করুন</span>
              <span className="text-blue-200 text-sm">সকাল ৬টা - রাত ১০টা</span>
            </button>
            
            <button
              onClick={openEmail}
              className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg font-semibold bangla-text transition-colors flex flex-col items-center justify-center space-y-3"
            >
              <Mail className="h-8 w-8" />
              <span>ইমেইল পাঠান</span>
              <span className="text-red-200 text-sm">২৪ ঘন্টার মধ্যে রিপ্লাই</span>
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 bangla-text text-center">আমাদের অবস্থান</h2>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 bangla-text text-lg">মনোহরদী, নরসিংদী, বাংলাদেশ</p>
              <p className="text-gray-500 bangla-text mt-2">জামিয়াতুল মাদীনা মনোহরদী ইসলামী শিক্ষা প্রতিষ্ঠান</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-red-800 bangla-text mb-4">জরুরি যোগাযোগ</h3>
            <p className="text-red-700 bangla-text text-lg mb-6">
              কোনো জরুরি প্রয়োজনে নিচের নম্বরগুলোতে সরাসরি যোগাযোগ করুন
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-red-800 bangla-text font-semibold">মুহাম্মদ আব্দুল্লাহ</p>
                <p className="text-gray-700 bangla-text">প্রধান শিক্ষক</p>
                <p className="text-xl font-bold text-red-600 bangla-text mt-2">০১৬৭৩৫৭৪৫৩৫</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-red-800 bangla-text font-semibold">মাদ্রাসা অফিস</p>
                <p className="text-gray-700 bangla-text">প্রশাসনিক বিভাগ</p>
                <p className="text-xl font-bold text-red-600 bangla-text mt-2">০১৬৭৩৫৭৪৫৩৫</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openPhone}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold bangla-text flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>জরুরি কল করুন</span>
              </button>
              <button
                onClick={openWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold bangla-text flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>জরুরি মেসেজ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          style={{
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)'
          }}
        >
          <MessageCircle className="h-8 w-8" />
        </button>
        <div className="absolute -top-2 -right-2">
          <span className="flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contact;