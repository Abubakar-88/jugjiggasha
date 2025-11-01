import React, { useState } from 'react';
import { Copy, Check, Phone, MessageCircle, Heart, Home, Landmark } from 'lucide-react';

const Donate = () => {
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [activePayment, setActivePayment] = useState('bkash');
  const [donationType, setDonationType] = useState('general'); // 'general', 'land', 'zakat'

  const paymentMethods = [
    {
      id: 'bkash',
      name: 'bKash',
      number: '01684366854',
      icon: '📱',
      instructions: [
        "bKash এ গিয়ে 'Send Money' নির্বাচন করুন",
        "উপরের নম্বরটি দিন",
        "টাকার পরিমাণ লিখুন",
        "আপনার bKash পিন নম্বর দিন",
        "কনফার্ম করুন"
      ]
    },
    {
      id: 'nagad',
      name: 'Nagad',
      number: '01712345678',
      icon: '💳',
      instructions: [
        "Nagad অ্যাপে 'Send Money' তে ক্লিক করুন",
        "উপরের নম্বরটি দিন",
        "টাকার পরিমাণ লিখুন",
        "আপনার Nagad পিন নম্বর দিন",
        "কনফার্ম করুন"
      ]
    },
    {
      id: 'rocket',
      name: 'Rocket',
      number: '01876543210',
      icon: '🚀',
      instructions: [
        "Rocket মেনু থেকে 'Send Money' নির্বাচন করুন",
        "উপরের নম্বরটি দিন",
        "টাকার পরিমাণ লিখুন",
        "আপনার Rocket পিন নম্বর দিন",
        "কনফার্ম করুন"
      ]
    }
  ];

  const donationTypes = [
    {
      id: 'general',
      name: 'সাধারণ দান',
      icon: Heart,
      description: 'মাদ্রাসার সাধারণ খরচ ও শিক্ষার্থীদের সহায়তা',
      color: 'bg-red-500'
    },
    {
      id: 'land',
      name: 'স্থায়ী জমি ক্রয়',
      icon: Home,
      description: 'মাদ্রাসার নিজস্ব স্থায়ী জমি ক্রয় ফান্ড',
      color: 'bg-green-500'
    },
    {
      id: 'zakat',
      name: 'যাকাত ফান্ড',
      icon: Landmark,
      description: 'গরীব ও প্রয়োজনীয় শিক্ষার্থীদের জন্য যাকাত',
      color: 'bg-blue-500'
    }
  ];

  const questions = [
    {
      id: 1,
      question: "দান করার পূর্বে কী কী বিষয় লক্ষ্য রাখা উচিত?",
      answer: "দান করার পূর্বে নিয়ত পরিষ্কার করা, হালাল উপার্জন থেকে দান করা এবং আল্লাহর সন্তুষ্টির জন্য দান করা উচিত।"
    },
    {
      id: 2,
      question: "দানের টাকা কোথায় খরচ হবে?",
      answer: "দানের টাকা মাদরাসার গরীব মেধাবী শিক্ষার্থীদের শিক্ষা, থাকা-খাওয়া, বই-পুস্তক এবং অন্যান্য প্রয়োজনীয় খাতে ব্যয় করা হবে।"
    },
    {
      id: 3,
      question: "কোন পরিমাণ দান করতে পারব?",
      answer: "যেকোনো পরিমাণ দান করতে পারবেন। ছোট-বড় সব দানই আল্লাহর দরবারে কবুল হয়। তবে সামর্থ্য অনুযায়ী দান করা উত্তম।"
    },
    {
      id: 4,
      question: "যাকাত দিতে চাই, কীভাবে দেব?",
      answer: "যাকাত ফান্ডে টাকা পাঠানোর সময় 'যাকাত' বলে মন্তব্য করলে তা আলাদাভাবে হিসাব করা হবে এবং যাকাতের হুকুম অনুযায়ী বণ্টন করা হবে।"
    },
    {
      id: 5,
      question: "স্থায়ী জমি ক্রয় ফান্ডে দান করার বিশেষ সুযোগ কী?",
      answer: "স্থায়ী জমি ক্রয় ফান্ডে দান সাদাকায়ে জারিয়া হিসেবে গণ্য হবে। ইনশাআল্লাহ এতে দানকারী মৃত্যুর পরও সওয়াব পেতে থাকবেন।"
    }
  ];

  const copyToClipboard = (number, methodId) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(methodId);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const activeMethod = paymentMethods.find(method => method.id === activePayment);
  const activeDonationType = donationTypes.find(type => type.id === donationType);

  const getDonationTitle = () => {
    switch(donationType) {
      case 'land':
        return "মাদ্রাসার স্থায়ী জমি ক্রয় ফান্ড";
      case 'zakat':
        return "যাকাত ফান্ড - গরীব শিক্ষার্থীদের সহায়তা";
      default:
        return "মাদ্রাসায় দান করুন";
    }
  };

  const getDonationDescription = () => {
    switch(donationType) {
      case 'land':
        return "মাদ্রাসার নিজস্ব স্থায়ী জমি ক্রয়ের জন্য আপনার দান সাদাকায়ে জারিয়া হিসেবে গণ্য হবে। ইনশাআল্লাহ এতে দানকারী মৃত্যুর পরও সওয়াব পেতে থাকবেন।";
      case 'zakat':
        return "গরীব ও প্রয়োজনীয় শিক্ষার্থীদের জন্য যাকাত ফান্ড। আপনার যাকাত শরিয়ত সম্মতভাবে বণ্টন করা হবে।";
      default:
        return "জামিয়াতুল মাদীনা মনোহরদী মাদরাসার গরীব মেধাবী শিক্ষার্থীদের শিক্ষা কার্যক্রম সচল রাখতে আপনার দান গুরুত্বপূর্ণ ভূমিকা পালন করবে।";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 bangla-text">{getDonationTitle()}</h1>
          </div>
          <p className="text-lg text-gray-600 bangla-text max-w-2xl mx-auto">
            {getDonationDescription()}
          </p>
        </div>

        {/* Donation Type Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 bangla-text">দানের ধরন নির্বাচন করুন</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {donationTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setDonationType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    donationType === type.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`${type.color} p-2 rounded-lg mr-3`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold bangla-text">{type.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 bangla-text">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Payment Methods */}
          <div className="lg:col-span-2">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 bangla-text">পেমেন্ট মাধ্যম নির্বাচন করুন</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setActivePayment(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      activePayment === method.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-semibold bangla-text">{method.name}</div>
                  </button>
                ))}
              </div>

              {/* Selected Payment Method Details */}
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold bangla-text">
                      {activeMethod.icon} {activeMethod.name} নম্বর
                    </h3>
                    <p className="text-gray-600 bangla-text text-sm">
                      নিচের নম্বরটিতে টাকা সেন্ড মানি করুন
                    </p>
                    {donationType !== 'general' && (
                      <p className="text-green-700 bangla-text text-sm mt-1 font-medium">
                        💡 দানের ধরন: {activeDonationType.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(activeMethod.number, activeMethod.id)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {copiedNumber === activeMethod.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="bangla-text">
                      {copiedNumber === activeMethod.id ? 'কপিড!' : 'কপি করুন'}
                    </span>
                  </button>
                </div>

                {/* Phone Number Display */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-mono font-bold text-gray-800">
                      {activeMethod.number}
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-3 bangla-text flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                    কিভাবে টাকা পাঠাবেন:
                  </h4>
                  <ul className="space-y-2">
                    {activeMethod.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start bangla-text text-sm">
                        <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Special Instructions based on donation type */}
                    {donationType === 'general' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-800 bangla-text text-sm">
                        <strong>সাধারণ দানের জন্য বিশেষ নির্দেশনা:</strong> টাকা পাঠানোর সময় Reference হিসেবে <strong>"General"</strong> লিখে পাঠাবেন। 
                        এটি শরিয়ত সম্মতভাবে গরীব শিক্ষার্থী এবং মাদ্রাসার অন্যান্য কাজের জন্য ব্যবহার করা হবে।
                      </p>
                    </div>
                  )}
                  {donationType === 'zakat' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-800 bangla-text text-sm">
                        <strong>যাকাতের জন্য বিশেষ নির্দেশনা:</strong> টাকা পাঠানোর সময় Reference হিসেবে <strong>"ZAKAT"</strong> লিখে পাঠাবেন। 
                        এটি শরিয়ত সম্মতভাবে গরীব শিক্ষার্থীদের মধ্যে বণ্টন করা হবে।
                      </p>
                    </div>
                  )}
                  
                  {donationType === 'land' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 bangla-text text-sm">
                        <strong>স্থায়ী জমি ক্রয় ফান্ড:</strong> টাকা পাঠানোর সময় Reference হিসেবে <strong>"LAND"</strong> লিখে পাঠাবেন। 
                        এটি সাদাকায়ে জারিয়া হিসেবে গণ্য হবে এবং মাদ্রাসার স্থায়ী জমি ক্রয়ে ব্যবহার করা হবে।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Donation Impact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 bangla-text">আপনার দানের প্রভাব</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 bangla-text">৳২০০০</div>
                  <div className="text-sm text-gray-600 bangla-text">একজন শিক্ষার্থীর ১ মাসের বই</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 bangla-text">৳৩০০০</div>
                  <div className="text-sm text-gray-600 bangla-text">১ মাসের খাবার খরচ</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 bangla-text">৳১০০০</div>
                  <div className="text-sm text-gray-600 bangla-text">১ মাসিক ফি</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 bangla-text">৳৫০০</div>
                  <div className="text-sm text-gray-600 bangla-text">অন্যান্য খরচ</div>
                </div>
              </div>
              
              {/* Special Impact for Land Fund */}
              {donationType === 'land' && (
                <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
                  <h3 className="font-semibold text-green-800 bangla-text mb-2">স্থায়ী জমি ক্রয় ফান্ডের বিশেষ সুযোগ:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-green-700 bangla-text">৳১০,০০০</div>
                      <div className="text-xs text-gray-600 bangla-text">১ কাঠা জমি</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-green-700 bangla-text">৳১,০০,০০০</div>
                      <div className="text-xs text-gray-600 bangla-text">১ শতক জমি</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-green-700 bangla-text">৳১০,০০,০০০</div>
                      <div className="text-xs text-gray-600 bangla-text">১ একর জমি</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - FAQ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 bangla-text">সচরাচর জিজ্ঞাসা</h2>
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-800 bangla-text mb-2">
                      {q.question}
                    </h3>
                    <p className="text-sm text-gray-600 bangla-text">
                      {q.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 bangla-text">কন্টাক্ট করুন</h3>
                <p className="text-sm text-gray-600 bangla-text">
                  আরও তথ্যের জন্য কল করুন: <br />
                  <span className="font-mono font-bold">০১৯৭২২৫০৫১২</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Madrasha Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 bangla-text">জামিয়াতুল মাদীনা মনোহরদী</h2>
            <p className="text-gray-600 bangla-text mb-4">
              একটি প্রতিষ্ঠিত ইসলামী শিক্ষা প্রতিষ্ঠান, যেখানে কুরআন-হাদীসের পাশাপাশি 
              আধুনিক শিক্ষাও প্রদান করা হয়। শতাধিক গরীব মেধাবী শিক্ষার্থী এখানে শিক্ষাগ্রহণ করছে।
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 bangla-text">
              <span>📍 নরসিংদী, বাংলাদেশ</span>
              <span>📞 ০১৯৭২২৫০৫১২</span>
              <span>📧 jamiatulmadina@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;