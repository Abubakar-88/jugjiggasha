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
            © ২০২৪ প্রশ্নোত্তর। সকল অধিকার সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;