// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación al cargar la aplicación
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('movieExplorerUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('movieExplorerUser');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Función de login
  const login = (email, password) => {
    if (email && password) {
      const userData = { 
        id: Date.now(), 
        email, 
        name: email.split('@')[0],
        favorites: [],
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('movieExplorerUser', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Email y contraseña son requeridos' };
  };

  // Función de registro
  const register = (email, password, name) => {
    if (email && password && name) {
      const userData = { 
        id: Date.now(), 
        email, 
        name,
        favorites: [],
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('movieExplorerUser', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Todos los campos son requeridos' };
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('movieExplorerUser');
  };

  // Agregar a favoritos
  const addToFavorites = (movie) => {
    if (user && movie) {
      const updatedUser = {
        ...user,
        favorites: [...user.favorites, { ...movie, addedAt: new Date().toISOString() }]
      };
      setUser(updatedUser);
      localStorage.setItem('movieExplorerUser', JSON.stringify(updatedUser));
    }
  };

  // Remover de favoritos
  const removeFromFavorites = (movieId) => {
    if (user) {
      const updatedUser = {
        ...user,
        favorites: user.favorites.filter(movie => movie.id !== movieId)
      };
      setUser(updatedUser);
      localStorage.setItem('movieExplorerUser', JSON.stringify(updatedUser));
    }
  };

  // Verificar si es favorito
  const isFavorite = (movieId) => {
    return user?.favorites?.some(movie => movie.id === movieId) || false;
  };

  // Obtener estadísticas del usuario
  const getUserStats = () => {
    if (!user) return null;
    
    return {
      totalFavorites: user.favorites?.length || 0,
      moviesFavorites: user.favorites?.filter(item => item.type === 'movies')?.length || 0,
      tvFavorites: user.favorites?.filter(item => item.type === 'tv')?.length || 0,
      memberSince: user.createdAt
    };
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getUserStats
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};