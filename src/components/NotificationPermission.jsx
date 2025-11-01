import React, { useState, useEffect } from 'react';


const NotificationPermission = () => {
  const [permission, setPermission] = useState('default');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setMessage('ব্রাউজার নোটিফিকেশন সাপোর্ট করে না');
    }
  };

  const allowNotifications = async () => {
    try {
      if (!('Notification' in window)) {
        setMessage('এই ব্রাউজার নোটিফিকেশন সাপোর্ট করে না');
        return;
      }

      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setMessage('✅ নোটিফিকেশন পারমিশন অলাউড হয়েছে!');
        
        // Test notification
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification('টেস্ট সফল!', {
            body: 'নোটিফিকেশন সিস্টেম কাজ করছে। শনিবার রাত ১১:১৬টায় অটো নোটিফিকেশন যাবে।',
            icon: '/icon-192x192.png',
            tag: 'test-success'
          });
        }
      } else if (result === 'denied') {
        setMessage('❌ পারমিশন ডিনাই করা হয়েছে। ব্রাউজার সেটিংস থেকে manually allow করতে হবে।');
      } else {
        setMessage('⚠️ পারমিশন দেওয়া হয়নি। আবার চেষ্টা করুন।');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  const testNotification = async () => {
    if (permission !== 'granted') {
      setMessage('প্রথমে নোটিফিকেশন পারমিশন দিন');
      return;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('সাপ্তাহিক মজলিসের আমন্ত্রণ', {
          body: 'আজ শনিবার মাগরিবের পর দ্বীনী মজলিস অনুষ্ঠিত হবে। সকলকে উপস্থিত হওয়ার জন্য বিশেষ অনুরোধ।',
          icon: '/icon-192x192.png',
          actions: [
            { action: 'view', title: 'বিস্তারিত দেখুন' },
            { action: 'dismiss', title: 'বন্ধ করুন' }
          ]
        });
        setMessage('✅ টেস্ট নোটিফিকেশন পাঠানো হয়েছে!');
      }
    } catch (error) {
      setMessage('❌ নোটিফিকেশন পাঠানো যায়নি: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 bangla-text text-green-600">
          নোটিফিকেশন পারমিশন
        </h1>

        {/* Status */}
        <div className={`p-4 rounded-lg mb-4 text-center ${
          permission === 'granted' ? 'bg-green-100 text-green-800' :
          permission === 'denied' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          <p className="font-semibold bangla-text">
            {permission === 'granted' ? '✅ পারমিশন অলাউড' :
             permission === 'denied' ? '❌ পারমিশন ডিনাই' :
             '⚠️ পারমিশন প্রয়োজন'}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-4">
            <p className="text-sm bangla-text text-blue-800">{message}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={allowNotifications}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium bangla-text transition-colors"
          >
            নোটিফিকেশন পারমিশন দিন
          </button>

          <button
            onClick={testNotification}
            disabled={permission !== 'granted'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium bangla-text transition-colors"
          >
            টেস্ট নোটিফিকেশন পাঠান
          </button>

          <button
            onClick={checkPermission}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium bangla-text transition-colors"
          >
            স্ট্যাটাস চেক করুন
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold bangla-text mb-2">নির্দেশনা:</h3>
          <ol className="text-sm bangla-text space-y-1">
            <li>1. "নোটিফিকেশন পারমিশন দিন" বাটনে ক্লিক করুন</li>
            <li>2. ব্রাউজার পারমিশন দিলে "Allow" নির্বাচন করুন</li>
            <li>3. "টেস্ট নোটিফিকেশন পাঠান" বাটনে ক্লিক করুন</li>
            <li>4. নোটিফিকেশন দেখতে পেলে সিস্টেম কাজ করছে</li>
          </ol>
        </div>

        {permission === 'denied' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-semibold bangla-text text-red-800 mb-2">পারমিশন ডিনাই করা হয়েছে?</h3>
            <p className="text-sm bangla-text text-red-700">
              ব্রাউজার সেটিংস থেকে manually allow করতে হবে:
            </p>
            <ul className="text-sm bangla-text text-red-700 mt-2 space-y-1">
              <li>• Chrome: Settings → Privacy → Site Settings → Notifications</li>
              <li>• Firefox: Settings → Privacy & Security → Notifications</li>
              <li>• আপনার site খুঁজে "Allow" সিলেক্ট করুন</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPermission;