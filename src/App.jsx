import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import InstallPrompt from './components/PWA/InstallPrompt';
import Home from './pages/Home';
import About from './pages/About';
import IslamicQuestions from './pages/Islamic/IslamicQuestions';
import AskIslamicQuestion from './pages/Islamic/AskIslamicQuestion';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import QuestionDetail from './pages/QuestionDetail';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
 import AdminPanel from './pages/AdminPanel';
import NotificationPermission from './components/NotificationPermission';
import ZakatPage from './pages/ZakatPage';

function App() {

  useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js') // Ensure this path is correct
      .then((registration) => {
        console.log('SW Registered successfully');
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.log('SW Registration failed:', error);
      });
  }
}, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
             <Route path="/contact" element={<Contact />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
             {/* Islamic Routes */}
            <Route path="/islamic-questions" element={<IslamicQuestions />} />
            <Route path="/zakat-calculator" element={<ZakatPage />} />
            <Route path="/ask-islamic-question" element={<AskIslamicQuestion />} />
            <Route path="/donate" element={<Donate />} />
             <Route path="/admin" element={<AdminPanel />} />
             <Route path="/notification-permission" element={<NotificationPermission />} />
           <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
         {/* PWA Install Prompt */}
        <InstallPrompt />
      </div>
    </Router>
  );
}

export default App;
