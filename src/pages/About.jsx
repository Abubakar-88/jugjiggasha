import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Target, 
  Heart, 
  Award, 
  Clock, 
  Shield,
  MessageCircle,
  Globe,
  Star,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: 'মুফতি আব্দল্লাহ জুবায়ের',
      role: 'প্রধান মুফতি ও ইসলামিক গবেষক',
      bio: '১০+ বছর ইসলামিক স্টাডিজ ও ফতোয়া বিভাগে অভিজ্ঞতা',
      qualification: 'দাওরায়ে হাদীস, ইফতা, মারকাযুদ দাওয়াহ আল ইসলামিয়া.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'মুফতি ফয়জুল্লাহ ফাহাদ',
      role: 'মুফতি ও ইসলামিক গবেষক',
      bio: '১০+ বছর ইসলামিক স্টাডিজ ও ফতোয়া বিভাগে অভিজ্ঞতা',
      qualification: 'দাওরায়ে হাদীস, ইফতা, মারকাযুদ দাওয়াহ আল ইসলামিয়া. খতিব, সালামবাগ মসজিদ রামপুরা, ঢাকা',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'মুফতি নুরুদ্দীন',
      role: 'সদস্য ফাতওয়া বিভাগ',
      bio: '৫+ বছর ইসলামিক স্টাডিজ ও ফতোয়া বিভাগে অভিজ্ঞতা',
      qualification: 'দাওরায়ে হাদীস, ইফতা',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'মাওলানা সফিউল্লাহ ',
      role: 'শায়খুল হাদীস',
      bio: 'ইমাম ও খতিব, মনোহরদী বাজার জামে মসজিদ, মনোহরদী, নরসিংদী',
      qualification: 'হাদীস বিশেষজ্ঞ',
      image: '/api/placeholder/150/150'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'কুরআন-সুন্নাহ ভিত্তিক',
      description: 'সকল মাসআলা কুরআন ও সহীহ হাদীসের আলোকে সমাধান করা হয়'
    },
    {
      icon: CheckCircle,
      title: 'সহীহ তথ্য',
      description: 'শুধুমাত্র বিশুদ্ধ ও যাচাইকৃত তথ্য প্রদান করা হয়'
    },
    {
      icon: Heart,
      title: 'উম্মাহর সেবা',
      description: 'সমগ্র মুসলিম উম্মাহর সেবাই আমাদের প্রধান লক্ষ্য'
    },
    {
      icon: Globe,
      title: 'বিনামূল্যে সেবা',
      description: 'সকলের জন্য বিনামূল্যে ইসলামী জ্ঞান অ্যাক্সেস নিশ্চিত করি'
    }
  ];

  const specialties = [
    {
      icon: BookOpen,
      title: 'ইবাদত সম্পর্কিত মাসআলা',
      items: ['নামাজ', 'রোজা', 'হজ্জ', 'জাকাত', 'কুরবানী']
    },
    {
      icon: Users,
      title: 'পারিবারিক বিষয়াদি',
      items: ['বিয়ে-শাদী', 'তালাক', 'ইদ্দত', 'উত্তরাধিকার']
    },
    {
      icon: Star,
      title: 'আকীদা ও মানহাজ',
      items: ['তাওহীদ', 'ঈমান', 'বিদআত', 'ছুফীবাদ']
    },
    {
      icon: MessageCircle,
      title: 'দৈনন্দিন জীবনের মাসআলা',
      items: ['খানা-পিনা', 'পোশাক-পরিচ্ছদ', 'লেনদেন', 'সামাজিকতা']
    }
  ];

  const milestones = [
    {
      year: '২০১৮',
      title: 'যাত্রা শুরু',
      description: 'ইসলামী মাসআলা ওয়েবসাইটের যাত্রা শুরু'
    },
    {
      year: '২০১৯',
      title: '১০০০+ ফতোয়া',
      description: '১০০০ এর বেশি ফতোয়া প্রদান করা হয়েছে'
    },
    {
      year: '২০২০',
      title: 'মোবাইল অ্যাপ',
      description: 'অ্যান্ড্রয়েড ও iOS অ্যাপ চালু'
    },
    {
      year: '২০২১',
      title: '৫ ভাষায় সেবা',
      description: 'বাংলা, ইংরেজি, আরবি, উর্দু ও হিন্দিতে সেবা'
    },
    {
      year: '২০২২',
      title: 'লাইভ সেশন',
      description: 'সাপ্তাহিক লাইভ প্রশ্নোত্তর সেশন চালু'
    },
    {
      year: '২০২৩',
      title: '৫০,০০০+ ব্যবহারকারী',
      description: '৫০,০০০+ নিবন্ধিত সদস্য অর্জন'
    },
    {
      year: '২০২৪',
      title: 'বিশেষজ্ঞ প্যানেল',
      description: '২৫+ ইসলামিক স্কলারের বিশেষজ্ঞ প্যানেল'
    }
  ];

  const stats = [
    { icon: MessageCircle, number: '৫০,০০০+', label: 'মাসআলার উত্তর' },
    { icon: Users, number: '২৫+', label: 'ইসলামিক স্কলার' },
    { icon: BookOpen, number: '১৫+', label: 'বিষয় ক্যাটাগরি' },
    { icon: Globe, number: '৫', label: 'ভাষায় সেবা' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bangla-text">
              ইসলামী মাসআলা-মাসায়েল
            </h1>
            <p className="text-xl md:text-2xl mb-8 bangla-text text-green-100 leading-relaxed">
              কুরআন-সুন্নাহ ভিত্তিক নির্ভরযোগ্য ইসলামী সমাধান
              <br />
              আপনার যেকোনো মাসআলার উত্তর পাবেন আমাদের কাছে
            </p>
            
            <div className="mt-8">
              <Link
                to="/ask-islamic-question"
                className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors bangla-text"
              >
                মাসআলা জিজ্ঞাসা করুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 bangla-text">আমাদের লক্ষ্য</h2>
              </div>
              <p className="text-lg text-gray-600 bangla-text leading-relaxed mb-6">
                একটি বিশ্বস্ত ডিজিটাল প্ল্যাটফর্ম তৈরি করা যেখানে প্রতিটি মুসলমান 
                তাদের দৈনন্দিন জীবনের যেকোনো ইসলামী মাসআলার সঠিক ও নির্ভরযোগ্য উত্তর 
                কুরআন ও সুন্নাহর আলোকে পেতে পারে।
              </p>
              <ul className="space-y-3 text-gray-600 bangla-text">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  কুরআন-সুন্নাহ ভিত্তিক সমাধান
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  বিশুদ্ধ আকীদার আলোকে নির্দেশনা
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  অভিজ্ঞ আলেম-উলামাদের তত্ত্বাবধান
                </li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center mb-6">
                <Award className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 bangla-text">আমাদের ভিশন</h2>
              </div>
              <p className="text-lg text-gray-600 bangla-text leading-relaxed mb-6">
                বিশ্বের সবচেয়ে বিশ্বস্ত ও ব্যাপকভাবে ব্যবহৃত ইসলামী মাসআলা 
                প্ল্যাটফর্ম হওয়া। আমরা চাই প্রতিটি মুসলমান তাদের ধর্মীয় 
                বিষয়গুলোর সঠিক সমাধান সহজে ও দ্রুত পেতে পারে।
              </p>
              <ul className="space-y-3 text-gray-600 bangla-text">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  বহুভাষায় ইসলামী জ্ঞান বিস্তার
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ডিজিটাল যুগে ইসলামের সঠিক বার্তা পৌঁছে দেওয়া
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  বিশ্বব্যাপী মুসলিম উম্মাহর সেবা প্রদান
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">
              আমাদের মূলনীতি
            </h2>
            <p className="text-lg text-gray-600 bangla-text">
              যে ইসলামী মূলনীতিগুলো আমাদের কাজকে পরিচালিত করে
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 bangla-text">{value.title}</h3>
                <p className="text-gray-600 bangla-text">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">
              আমাদের বিশেষজ্ঞতা
            </h2>
            <p className="text-lg text-gray-600 bangla-text">
              ইসলামের বিভিন্ন ক্ষেত্রে আমাদের বিশেষজ্ঞ আলেম-উলামাগণ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialties.map((specialty, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <specialty.icon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold bangla-text">{specialty.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialty.items.map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="bg-white text-green-700 px-3 py-1 rounded-full text-sm font-medium bangla-text border border-green-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">
              আমাদের যাত্রাপথ
            </h2>
            <p className="text-lg text-gray-600 bangla-text">
              সময়ের সাথে সাথে আমাদের অর্জন ও উন্নয়ন
            </p>
          </div>

          <div className="relative">
        
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-200 h-full hidden lg:block"></div>
            
            <div className="space-y-12 lg:space-y-0">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative lg:flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } timeline-mobile`}>
              
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8'} mb-4 lg:mb-0`}>
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 bangla-text">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 bangla-text">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white hidden lg:block timeline-dot"></div>
                  
                  
                  <div className="lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bangla-text">
              আমাদের বিশেষজ্ঞ আলেম-উলামা
            </h2>
            <p className="text-lg text-gray-600 bangla-text">
              যারা ইসলামী মাসআলার সঠিক সমাধান প্রদান করেন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center bg-green-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                />
                <h3 className="text-xl font-semibold mb-2 bangla-text">{member.name}</h3>
                <p className="text-green-600 font-medium mb-2 bangla-text">{member.role}</p>
                <p className="text-gray-600 text-sm mb-3 bangla-text">{member.bio}</p>
                <p className="text-gray-500 text-xs bangla-text">{member.qualification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-green-200" />
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-200 bangla-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 bangla-text">
            আপনার মাসআলার সমাধান পান
          </h2>
          <p className="text-lg text-gray-600 mb-8 bangla-text max-w-2xl mx-auto">
            ইসলামের যেকোনো বিষয়ে আপনার প্রশ্ন জিজ্ঞাসা করুন এবং 
            অভিজ্ঞ আলেম-উলামাদের কাছ থেকে কুরআন-সুন্নাহ ভিত্তিক সঠিক উত্তর পান।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ask-islamic-question"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-8 py-3 rounded-lg transition-colors bangla-text"
            >
              মাসআলা জিজ্ঞাসা করুন
            </Link>
            <Link
              to="/islamic-questions"
              className="bg-white hover:bg-gray-100 text-green-600 font-semibold text-lg px-8 py-3 rounded-lg border border-green-600 transition-colors bangla-text"
            >
              মাসআলা ব্রাউজ করুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;