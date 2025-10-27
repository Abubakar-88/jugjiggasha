import { useState } from 'react'
import './App.css'
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
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Donate from './pages/Donate';
// import QuestionList from './pages/QuestionList';
// import QuestionDetail from './pages/QuestionDetail';
// import SubmitQuestion from './pages/SubmitQuestion';
 import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/questions" element={<QuestionList />} /> */}
            {/* <Route path="/questions/:id" element={<QuestionDetail />} /> */}
            {/* <Route path="/ask" element={<SubmitQuestion />} /> */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
             {/* Islamic Routes */}
            <Route path="/islamic-questions" element={<IslamicQuestions />} />
            <Route path="/ask-islamic-question" element={<AskIslamicQuestion />} />

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
