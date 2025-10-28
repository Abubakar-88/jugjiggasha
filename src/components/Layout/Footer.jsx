import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold bangla-text mb-4">প্রশ্নোত্তর</h3>
            <p className="text-gray-300 bangla-text">
              আপনার সকল প্রশ্নের উত্তর পাওয়ার বিশ্বস্ত মাধ্যম
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bangla-text">দ্রুত লিংক</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/questions" className="text-gray-300 hover:text-white transition-colors bangla-text">
                  প্রশ্নসমূহ
                </Link>
              </li>
              <li>
                <Link to="/ask" className="text-gray-300 hover:text-white transition-colors bangla-text">
                  প্রশ্ন করুন
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors bangla-text">
                  আমাদের সম্পর্কে
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bangla-text">সহায়তা</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors bangla-text">
                  যোগাযোগ
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-300 hover:text-white transition-colors bangla-text">
                  ডোনেট
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bangla-text">যোগাযোগ</h4>
            <div className="space-y-2 text-gray-300">
              <p className="bangla-text">ইমেইল: support@proshnottor.com</p>
              <p className="bangla-text">ফোন: +৮৮০ ১৭XX-XXXXXX</p>
            </div>
          </div>
        </div>

      {/* Bottom Bar */}
<div className="mt-8 pt-8 border-t border-gray-700">
  <p className="text-center text-gray-300 bangla-text">
    © ২০২৫ প্রশ্নোত্তর। সকল অধিকার সংরক্ষিত।
  </p>
  
  <div className="text-center mt-2">
    <a 
      href="https://voroshait.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-green-400 hover:text-green-300 transition-colors inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z"/>
      </svg>
      <span className="bangla-text text-sm">Developed by</span>
      <span className="font-semibold text-white">Vorosha IT</span>
    </a>
  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;