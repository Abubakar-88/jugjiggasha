import React from 'react';

const NotificationTest = () => {
  const testNotification = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'TEST_NOTIFICATION',
        title: 'পরীক্ষামূলক নোটিফিকেশন',
        body: 'সাপ্তাহিক মজলিসের নোটিফিকেশন সিস্টেম কাজ করছে!'
      });
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={testNotification}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        টেস্ট নোটিফিকেশন
      </button>
    </div>
  );
};

export default NotificationTest;