
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SmsZone from './pages/SmsZone';
import Stories from './pages/Stories';
import BdJobs from './pages/BdJobs';
import JobExam from './pages/JobExam';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { User, UserRole, DynamicPage } from './types';
import { ADMIN_CREDENTIALS } from './constants';

// Dynamic Page Renderer Component
const DynamicPageLoader: React.FC = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<DynamicPage | null>(null);

  useEffect(() => {
    const pages: DynamicPage[] = JSON.parse(localStorage.getItem('site_pages') || '[]');
    const found = pages.find(p => p.slug === slug);
    setPage(found || null);
  }, [slug]);

  if (!page) return (
    <div className="max-w-4xl mx-auto py-32 text-center">
      <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
      <p className="text-gray-400 font-bold">Page not found</p>
      <Navigate to="/" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-gray-100">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-12 font-poppins">{page.title}</h1>
        <div className="prose prose-xl prose-indigo max-w-none text-gray-600 leading-loose whitespace-pre-wrap font-medium">
          {page.content}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('current_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sms" element={<SmsZone />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/jobs" element={<BdJobs />} />
          <Route path="/exam" element={<JobExam />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register onRegister={handleLogin} />} />
          <Route path="/profile" element={user ? <Profile user={user} onUpdate={handleLogin} /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={user ? <Profile user={user} onUpdate={handleLogin} /> : <Navigate to="/login" />} />
          <Route path="/page/:slug" element={<DynamicPageLoader />} />
          <Route 
            path="/admin" 
            element={
              user && (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) 
              ? <AdminDashboard /> 
              : <Navigate to="/login" />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
