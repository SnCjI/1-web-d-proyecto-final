// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateLoginForm } from '../../utils/utils';

const LoginForm = ({ onToggle }) => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    // Validar formulario
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = login(formData.email, formData.password);
      
      if (!result.success) {
        setErrors({ general: result.error || 'Credenciales inválidas' });
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white border-opacity-20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            CineExplorer
          </h1>
          <h2 className="text-2xl font-semibold text-white">
            Bienvenido de vuelta
          </h2>
          <p className="text-gray-300 mt-2">
            Inicia sesión para explorar películas y series
          </p>
        </div>

        {/* Formulario */}
        <div className="space-y-6">
          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              className={`w-full px-4 py-3 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.email 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-white border-opacity-30 focus:ring-purple-500'
              }`}
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="Tu contraseña"
              className={`w-full px-4 py-3 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.password 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-white border-opacity-30 focus:ring-purple-500'
              }`}
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="bg-red-500 bg-opacity-20 border border-red-400 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{errors.general}</p>
            </div>
          )}

          {/* Botón de envío */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 transform ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105'
            } text-white shadow-lg`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          {/* Demo credentials */}
          <div className="bg-blue-500 bg-opacity-20 border border-blue-400 rounded-lg p-3">
            <p className="text-blue-300 text-sm text-center">
              <strong>Demo:</strong> Usa cualquier email y contraseña válidos
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onToggle}
              className="text-purple-400 hover:text-purple-300 font-semibold underline transition duration-200"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;