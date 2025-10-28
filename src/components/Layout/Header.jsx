import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import InstallButton from '../PWA/InstallButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'হোম', href: '/' },
    { name: 'মাসআলা সমূহ', href: '/islamic-questions' },
    { name: 'মাসআলা জিজ্ঞাসা', href: '/ask-islamic-question' },
    { name: 'আমাদের সম্পর্কে', href: '/about' },
    { name: 'যোগাযোগ', href: '/contact' },
    { name: 'দান করুন', href: '/donate' },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Fixed Size */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
           <img
                className="h-14 sm:h-17 md:h-21 w-auto object-contain"
                src="/Jugjiggasha-h-logo.png"
                alt="যুগ-জিজ্ঞাসা"
                />
              {/* Optional: Add text logo for smaller screens */}
              {/* <span className="ml-0 text-lg font-bold text-green-600 bangla-text md:hidden">
                মাসআলা
              </span> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-center">
            <div className="flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    location.pathname === item.href
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Install Button */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <InstallButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <InstallButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;