import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, RefreshCw, Bell } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      
      // Request notification permission for installed app
      if (Notification.permission === 'default') {
        setTimeout(() => {
          requestNotificationPermission();
        }, 3000);
      }
    }

    // Check for iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    if (isIos()) {
      setIsIOS(true);
    }

    // For Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 10000);
        localStorage.setItem('hasVisited', 'true');
      }
    };

    checkForUpdates();

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

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Show confirmation
        showNotificationGrantedMessage();
      }
    }
  };

  const showNotificationGrantedMessage = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_WELCOME_NOTIFICATION'
      });
    }
  };

  const handleNotificationRequest = () => {
    if (notificationPermission === 'granted') {
      // Already granted
      return;
    }
    
    if (notificationPermission === 'denied') {
      alert('Notification permission is denied. Please enable it from browser settings.');
      return;
    }

    requestNotificationPermission();
  };

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.update();
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
        localStorage.setItem('appInstalled', 'true');
        
        // Request notification after install
        setTimeout(() => {
          requestNotificationPermission();
        }, 2000);
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
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
              <div className="flex items-center mt-1">
                <Bell className="h-3 w-3 text-green-600 mr-1" />
                <p className="text-xs text-green-600 bangla-text">
                  সাপ্তাহিক দ্বীনী মজলিসের রিমাইন্ডার পাবেন
                </p>
              </div>
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
            <button
              onClick={handleNotificationRequest}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center bangla-text mt-2"
            >
              <Bell className="h-4 w-4 mr-2" />
              নোটিফিকেশন অন করুন
            </button>
          </div>
        ) : (
          <div className="space-y-2">
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
            <button
              onClick={handleNotificationRequest}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center bangla-text"
            >
              <Bell className="h-4 w-4 mr-2" />
              সাপ্তাহিক রিমাইন্ডার পান
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;