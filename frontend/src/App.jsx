import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import useAuthStore from './store/authStore';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Questions = lazy(() => import('./pages/Questions'));
const QuestionDetail = lazy(() => import('./pages/QuestionDetail'));
const AskQuestion = lazy(() => import('./pages/AskQuestion'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  const { initAuth } = useAuthStore();
  
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Loading component for suspense fallback
  const LoadingFallback = () => (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div>
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
