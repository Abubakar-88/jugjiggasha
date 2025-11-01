import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, RefreshCw } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    // Check for iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    if (isIos()) {
      setIsIOS(true);
    }

    // For Android/Chrome - Show install prompt only for first time visitors
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has visited before
      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 10000); // Show after 10 seconds for new users
        localStorage.setItem('hasVisited', 'true');
      }
    };

    // Check for updates
    checkForUpdates();

    // Listen for update events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      
      // Check for updates every 24 hours
      registration.update();
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        setUpdateAvailable(true);
      });
    }
  };

  const handleUpdateClick = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      window.location.reload();
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // Don't show again if installed
        localStorage.setItem('appInstalled', 'true');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    // Store in localStorage to not show again for 30 days
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  const isAppInstalled = localStorage.getItem('appInstalled') === 'true';
  const dismissedTime = localStorage.getItem('installPromptDismissed');
  
  if (isAppInstalled) {
    return null;
  }

  if (dismissedTime) {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - parseInt(dismissedTime) < thirtyDays) {
      return null;
    }
  }

  // Show update prompt instead of install prompt if update available
  if (updateAvailable && isStandalone) {
    return (
      <div className="fixed bottom-4 right-4 left-4 md:left-auto md:right-4 z-50 max-w-md">
        <div className="bg-blue-50 rounded-lg shadow-lg border border-blue-200 p-4 animate-fade-in-up">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 bangla-text">
                  নতুন আপডেট উপলব্ধ
                </h3>
                <p className="text-sm text-gray-600 bangla-text">
                  নতুন ফিচার এবং উন্নতির জন্য আপডেট করুন
                </p>
              </div>
            </div>
            <button
              onClick={() => setUpdateAvailable(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpdateClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center bangla-text"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              আপডেট করুন
            </button>
            <button
              onClick={() => setUpdateAvailable(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors bangla-text"
            >
              পরে
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showPrompt || isStandalone) {
    return null;
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
              <p className="text-xs text-green-600 bangla-text mt-1">
                ✅ অটো আপডেট - বারবার ইন্সটল করার প্রয়োজন নেই
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