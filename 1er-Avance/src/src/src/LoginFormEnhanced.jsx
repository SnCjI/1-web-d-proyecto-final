// src/components/Auth/LoginFormEnhanced.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContextEnhanced';
import { useFormValidation } from '../../hooks/useError';
import { loginSchema } from '../../utils/validationSchemas';
import ErrorNotifications from '../ErrorHandling/ErrorNotifications';

const LoginFormEnhanced = ({ onToggle }) => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { login, isAuthenticating } = useAuth();
  
  // Hook de validación de formulario
  const {
    validationErrors,
    isValid,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
    clearValidationErrors
  } = useFormValidation(loginSchema, {
    validateOnChange: true,
    validateOnBlur: true,
    showErrorsOnTouched: true
  });

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    handleFieldChange(name, value);
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    handleFieldBlur(name, value);
  };

  const handleSubmit = async () => {
    // Limpiar notificaciones previas
    setNotifications([]);
    
    // Validar formulario completo
    const validation = validateForm(formData);
    if (!validation.success) {
      addNotification({
        type: 'validation',
        title: 'Error de validación',
        message: 'Por favor corrige los errores en el formulario'
      });
      return;
    }

    try {
      const result = await login(formData);
      
      if (result.success) {
        addNotification({
          type: 'success',
          title: '¡Inicio de sesión exitoso!',
          message: result.message
        });
        
        // Limpiar formulario
        setFormData({ email: '', password: '' });
        clearValidationErrors();
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error de inicio de sesión',
        message: error.message || 'Error desconocido',
        code: error.code
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValid && !isAuthenticating) {
      handleSubmit();
    }
  };

  const handleDemoLogin = (userType) => {
    const demoCredentials = {
      admin: { email: 'admin@test.com', password: 'admin123' },
      user: { email: 'user@test.com', password: 'user123' }
    };

    const credentials = demoCredentials[userType];
    setFormData(credentials);
    
    // Validar y enviar automáticamente
    setTimeout(() => {
      handleSubmit();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative">
      {/* Notificaciones */}
      <ErrorNotifications
        notifications={notifications}
        onClose={removeNotification}
        position="top-right"
      />

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
              <Mail size={16} className="inline mr-2" />
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                className={`w-full pl-4 pr-10 py-3 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                  validationErrors.email 
                    ? 'border-red-400 focus:ring-red-500' 
                    : 'border-white border-opacity-30 focus:ring-purple-500'
                }`}
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyPress={handleKeyPress}
                disabled={isAuthenticating}
                autoComplete="email"
              />
              {/* Indicador de validación */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {formData.email && !validationErrors.email && (
                  <CheckCircle size={20} className="text-green-400" />
                )}
                {validationErrors.email && (
                  <AlertCircle size={20} className="text-red-400" />
                )}
              </div>
            </div>
            {validationErrors.email && (
              <div className="mt-1 flex items-center text-red-400 text-sm">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.email}
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Lock size={16} className="inline mr-2" />
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Tu contraseña"
                className={`w-full pl-4 pr-12 py-3 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                  validationErrors.password 
                    ? 'border-red-400 focus:ring-red-500' 
                    : 'border-white border-opacity-30 focus:ring-purple-500'
                }`}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyPress={handleKeyPress}
                disabled={isAuthenticating}
                autoComplete="current-password"
              />
              
              {/* Botones de acción en el input */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {/* Toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white transition duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                
                {/* Indicador de validación */}
                {formData.password && !validationErrors.password && (
                  <CheckCircle size={16} className="text-green-400" />
                )}
                {validationErrors.password && (
                  <AlertCircle size={16} className="text-red-400" />
                )}
              </div>
            </div>
            {validationErrors.password && (
              <div className="mt-1 flex items-center text-red-400 text-sm">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.password}
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <button
            onClick={handleSubmit}
            disabled={isAuthenticating || !isValid}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 transform ${
              isAuthenticating || !isValid
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg'
            } text-white`}
          >
            {isAuthenticating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>

        {/* Credenciales de demo */}
        <div className="mt-6 space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">Cuentas de demostración:</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isAuthenticating}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition duration-200 disabled:opacity-50"
              >
                Admin Demo
              </button>
              <button
                onClick={() => handleDemoLogin('user')}
                disabled={isAuthenticating}
                className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition duration-200 disabled:opacity-50"
              >
                Usuario Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onToggle}
              disabled={isAuthenticating}
              className="text-purple-400 hover:text-purple-300 font-semibold underline transition duration-200 disabled:opacity-50"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        {/* Información de desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">🔧 Modo desarrollo - Pruebas:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Email con "slow" = respuesta lenta</li>
              <li>• Email con "error" = error del servidor</li>
              <li>• Email con "invalid" = error de validación</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginFormEnhanced;