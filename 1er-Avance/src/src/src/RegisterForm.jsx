// src/components/Auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateRegisterForm } from '../../utils/utils';

const RegisterForm = ({ onToggle }) => {
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

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
    const validation = validateRegisterForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = register(formData.email, formData.password, formData.name);
      
      if (!result.success) {
        setErrors({ general: result.error || 'Error al crear la cuenta' });
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
            Crea tu cuenta
          </h2>
          <p className="text-gray-300 mt-2">
            Únete y descubre tu próxima película favorita
          </p>
        </div>

        {/* Formulario */}
        <div className="space-y-5">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              className={`w-full px-4 py-3 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.name 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-white border-opacity-30 focus:ring-purple-500'
              }`}
              value={formData.name}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
              placeholder="Mínimo 6 caracteres"
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

          {/* Campo Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              className={`w-full px-4 py-3 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.confirmPassword 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-white border-opacity-30 focus:ring-purple-500'
              }`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
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
                <span>Creando cuenta...</span>
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </button>

          {/* Términos */}
          <p className="text-xs text-gray-400 text-center">
            Al registrarte, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onToggle}
              className="text-purple-400 hover:text-purple-300 font-semibold underline transition duration-200"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;