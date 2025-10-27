import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/Admin/AdminLogin';
import AdminQuestionList from '../components/Admin/AdminQuestionList';
import AdminCategoryManager from '../components/Admin/AdminCategoryManager';
import AdminAddQuestion from '../components/Admin/AdminAddQuestion';
import { MessageSquare, FolderPlus, List, Shield, LogOut } from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    // Check if user is already logged in
    const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(authenticated);
  }, []);

  const handleLogin = (success) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    setActiveTab('questions');
  };

  const tabs = [
    { id: 'questions', name: 'প্রশ্ন ম্যানেজমেন্ট', icon: MessageSquare },
    { id: 'add-question', name: 'প্রশ্ন যোগ করুন', icon: FolderPlus },
    { id: 'categories', name: 'ক্যাটাগরি ম্যানেজমেন্ট', icon: List },
  ];

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 bangla-text">
                  অ্যাডমিন প্যানেল
                </h1>
                <p className="text-sm text-gray-500 bangla-text">
                  ইসলামী মাসআলা ম্যানেজমেন্ট
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center bangla-text transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              লগআউট
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    <span className="bangla-text">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'questions' && <AdminQuestionList />}
            {activeTab === 'add-question' && <AdminAddQuestion />}
            {activeTab === 'categories' && <AdminCategoryManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;