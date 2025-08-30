// src/contexts/AuthContextEnhanced.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginSchema, registerSchema, validateData } from '../utils/validationSchemas';
import { 
  AppError, 
  AuthenticationError, 
  ValidationError,
  ERROR_CODES 
} from '../utils/errorHandler';
import { useError } from '../hooks/useError';

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

// Simulación de API calls
const mockAPI = {
  // Simular login
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular diferentes escenarios
        if (email === 'admin@test.com' && password === 'admin123') {
          resolve({
            id: 1,
            email,
            name: 'Administrador',
            role: 'admin',
            favorites: [],
            settings: {},
            lastLogin: new Date().toISOString()
          });
        } else if (email === 'user@test.com' && password === 'user123') {
          resolve({
            id: 2,
            email,
            name: 'Usuario Demo',
            role: 'user',
            favorites: [],
            settings: {},
            lastLogin: new Date().toISOString()
          });
        } else if (email.includes('slow')) {
          // Simular respuesta lenta
          setTimeout(() => {
            reject(new AuthenticationError('Servidor lento'));
          }, 5000);
        } else if (email.includes('error')) {
          // Simular error del servidor
          reject(new AppError('Error interno del servidor', 500, ERROR_CODES.SERVER_ERROR));
        } else {
          // Credenciales incorrectas
          reject(new AuthenticationError('Email o contraseña incorrectos'));
        }
      }, 1000); // Simular latencia de red
    });
  },

  // Simular registro
  async register(email, password, name) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular usuario ya existente
        if (email === 'admin@test.com' || email === 'user@test.com') {
          reject(new AppError(
            'Ya existe una cuenta con este email', 
            409, 
            ERROR_CODES.USER_ALREADY_EXISTS
          ));
        } else if (email.includes('invalid')) {
          reject(new ValidationError('Email inválido', 'email'));
        } else {
          // Registro exitoso
          resolve({
            id: Date.now(),
            email,
            name,
            role: 'user',
            favorites: [],
            settings: {},
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
        }
      }, 1500);
    });
  },

  // Simular verificación de token
  async verifyToken(token) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const userData = JSON.parse(localStorage.getItem('movieExplorerUser'));
          if (userData && userData.token === token) {
            resolve(userData);
          } else {
            reject(new AuthenticationError('Token inválido'));
          }
        } catch (error) {
          reject(new AuthenticationError('Error de autenticación'));
        }
      }, 500);
    });
  }
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { addError, withErrorHandling } = useError();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('movieExplorerUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Verificar si el token es válido (simulado)
          if (userData.token) {
            await mockAPI.verifyToken(userData.token);
            setUser(userData);
          }
        }
      } catch (error) {
        // Token inválido o error de verificación
        localStorage.removeItem('movieExplorerUser');
        addError(error, { context: 'auth_initialization' });
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, [addError]);

  // Función de login con validación
  const login = async (formData) => {
    return withErrorHandling(async () => {
      setIsAuthenticating(true);

      // Validar datos con Zod
      const validation = validateData(loginSchema, formData);
      if (!validation.success) {
        throw new ValidationError('Datos de login inválidos');
      }

      const { email, password } = validation.data;

      // Llamada a la API
      const userData = await mockAPI.login(email, password);
      
      // Generar token simulado
      const userWithToken = {
        ...userData,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        loginTime: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem('movieExplorerUser', JSON.stringify(userWithToken));
      setUser(userWithToken);

      return { 
        success: true, 
        user: userWithToken,
        message: `¡Bienvenido de vuelta, ${userData.name}!`
      };
    }, { context: 'user_login', operation: 'authentication' })
    .finally(() => {
      setIsAuthenticating(false);
    });
  };

  // Función de registro con validación
  const register = async (formData) => {
    return withErrorHandling(async () => {
      setIsAuthenticating(true);

      // Validar datos con Zod
      const validation = validateData(registerSchema, formData);
      if (!validation.success) {
        throw new ValidationError('Datos de registro inválidos');
      }

      const { email, password, name } = validation.data;

      // Llamada a la API
      const userData = await mockAPI.register(email, password, name);
      
      // Generar token simulado
      const userWithToken = {
        ...userData,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        loginTime: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem('movieExplorerUser', JSON.stringify(userWithToken));
      setUser(userWithToken);

      return { 
        success: true, 
        user: userWithToken,
        message: `¡Cuenta creada exitosamente! Bienvenido, ${userData.name}!`
      };
    }, { context: 'user_registration', operation: 'authentication' })
    .finally(() => {
      setIsAuthenticating(false);
    });
  };

  // Función de logout
  const logout = async () => {
    return withErrorHandling(async () => {
      // Simular llamada a API para invalidar token
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('movieExplorerUser');
      
      return { 
        success: true, 
        message: 'Sesión cerrada exitosamente' 
      };
    }, { context: 'user_logout', operation: 'authentication' });
  };

  // Actualizar perfil de usuario
  const updateProfile = async (profileData) => {
    return withErrorHandling(async () => {
      if (!user) {
        throw new AuthenticationError('Usuario no autenticado');
      }

      // Validar datos del perfil
      const validation = validateData(userProfileSchema, profileData);
      if (!validation.success) {
        throw new ValidationError('Datos de perfil inválidos');
      }

      // Simular actualización en API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...validation.data,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('movieExplorerUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { 
        success: true, 
        user: updatedUser,
        message: 'Perfil actualizado exitosamente'
      };
    }, { context: 'profile_update', userId: user?.id });
  };

  // Agregar a favoritos con validación
  const addToFavorites = async (movie) => {
    return withErrorHandling(async () => {
      if (!user) {
        throw new AuthenticationError('Debes iniciar sesión para agregar favoritos');
      }

      if (!movie || !movie.id) {
        throw new ValidationError('Datos de película inválidos');
      }

      // Verificar si ya está en favoritos
      const isAlreadyFavorite = user.favorites?.some(fav => fav.id === movie.id);
      if (isAlreadyFavorite) {
        throw new AppError('Esta película ya está en tus favoritos', 409);
      }

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));

      const movieWithMetadata = {
        ...movie,
        addedAt: new Date().toISOString(),
        userId: user.id
      };

      const updatedUser = {
        ...user,
        favorites: [...(user.favorites || []), movieWithMetadata],
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('movieExplorerUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { 
        success: true, 
        message: `"${movie.title || movie.name}" agregada a favoritos`
      };
    }, { context: 'add_favorite', movieId: movie?.id, userId: user?.id });
  };

  // Remover de favoritos
  const removeFromFavorites = async (movieId) => {
    return withErrorHandling(async () => {
      if (!user) {
        throw new AuthenticationError('Usuario no autenticado');
      }

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300));

      const movieToRemove = user.favorites?.find(fav => fav.id === movieId);
      const updatedUser = {
        ...user,
        favorites: (user.favorites || []).filter(movie => movie.id !== movieId),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('movieExplorerUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { 
        success: true, 
        message: `"${movieToRemove?.title || movieToRemove?.name || 'Película'}" removida de favoritos`
      };
    }, { context: 'remove_favorite', movieId, userId: user?.id });
  };

  // Verificar si es favorito
  const isFavorite = (movieId) => {
    return user?.favorites?.some(movie => movie.id === movieId) || false;
  };

  // Obtener estadísticas del usuario
  const getUserStats = () => {
    if (!user) return null;
    
    const favorites = user.favorites || [];
    
    return {
      totalFavorites: favorites.length,
      moviesFavorites: favorites.filter(item => item.type === 'movies').length,
      tvFavorites: favorites.filter(item => item.type === 'tv').length,
      memberSince: user.createdAt || user.loginTime,
      lastLogin: user.lastLogin,
      favoriteGenres: getFavoriteGenres(favorites)
    };
  };

  // Obtener géneros favoritos del usuario
  const getFavoriteGenres = (favorites) => {
    const genreCount = {};
    
    favorites.forEach(item => {
      if (item.genres) {
        item.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });

    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));
  };

  // Cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    return withErrorHandling(async () => {
      if (!user) {
        throw new AuthenticationError('Usuario no autenticado');
      }

      // Validar nueva contraseña
      const validation = validateData(
        loginSchema.pick({ password: true }), 
        { password: newPassword }
      );
      
      if (!validation.success) {
        throw new ValidationError('Nueva contraseña inválida');
      }

      // Simular verificación de contraseña actual en API
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulación simple de verificación
          if (currentPassword.length < 6) {
            reject(new AuthenticationError('Contraseña actual incorrecta'));
          } else {
            resolve();
          }
        }, 1000);
      });

      return { 
        success: true, 
        message: 'Contraseña actualizada exitosamente'
      };
    }, { context: 'change_password', userId: user?.id });
  };

  // Refrescar datos del usuario
  const refreshUser = async () => {
    return withErrorHandling(async () => {
      if (!user?.token) {
        throw new AuthenticationError('No hay sesión activa');
      }

      // Simular llamada a API para obtener datos actualizados
      const updatedUserData = await mockAPI.verifyToken(user.token);
      
      const refreshedUser = {
        ...user,
        ...updatedUserData,
        lastRefresh: new Date().toISOString()
      };

      localStorage.setItem('movieExplorerUser', JSON.stringify(refreshedUser));
      setUser(refreshedUser);

      return { 
        success: true, 
        user: refreshedUser,
        message: 'Datos actualizados'
      };
    }, { context: 'refresh_user', userId: user?.id });
  };

  const value = {
    // Estado
    user,
    loading,
    isAuthenticating,
    
    // Acciones de autenticación
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    
    // Favoritos
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    
    // Utilidades
    getUserStats,
    
    // Flags de estado
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};