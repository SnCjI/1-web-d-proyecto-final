// src/components/Auth/ProtectedRoute.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
      <h2 className="text-2xl font-bold text-white mb-2">CineExplorer</h2>
      <p className="text-gray-300">Cargando...</p>
    </div>
  </div>
);

// Auth wrapper component
const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm onToggle={() => setIsLogin(false)} />
  ) : (
    <RegisterForm onToggle={() => setIsLogin(true)} />
  );
};

// Main protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Show auth forms if user is not authenticated
  if (!user) {
    return <AuthWrapper />;
  }

  // Render protected content if user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;