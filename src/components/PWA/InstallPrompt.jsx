import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      return;
    }

    // Check for iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    if (isIos()) {
      setIsIOS(true);
      setShowPrompt(true);
      return;
    }

    // For Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 5 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    // Store in localStorage to not show again for 7 days
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  if (isStandalone || !showPrompt) {
    return null;
  }

  // Check if prompt was recently dismissed
  const dismissedTime = localStorage.getItem('installPromptDismissed');
  if (dismissedTime) {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - parseInt(dismissedTime) < sevenDays) {
      return null;
    }
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:right-4 z-50 max-w-md">
      <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 animate-fade-in-up">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Smartphone className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 bangla-text">
                অ্যাপ ইন্সটল করুন
              </h3>
              <p className="text-sm text-gray-600 bangla-text">
                দ্রুত এক্সেসের জন্য অ্যাপটি ইন্সটল করুন
              </p>
            </div>
          </div>
          <button
            onClick={handleClosePrompt}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 bangla-text">
              iOS-এ ইন্সটল করতে:
            </p>
            <ol className="text-sm text-gray-600 space-y-1 bangla-text">
              <li>1. Safari-তে Share বাটন ট্যাপ করুন</li>
              <li>2. "Add to Home Screen" সিলেক্ট করুন</li>
              <li>3. "Add" বাটন ট্যাপ করুন</li>
            </ol>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center bangla-text"
            >
              <Download className="h-4 w-4 mr-2" />
              ইন্সটল করুন
            </button>
            <button
              onClick={handleClosePrompt}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors bangla-text"
            >
              পরে
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;