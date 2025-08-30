// src/utils/errorHandler.js

// Tipos de errores personalizados
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'GENERIC_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Error de conexión') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

// Códigos de error específicos
export const ERROR_CODES = {
  // Autenticación
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  
  // Validación
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Red
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Contenido
  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  CONTENT_UNAVAILABLE: 'CONTENT_UNAVAILABLE',
  
  // Genéricos
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED'
};

// Mensajes de error amigables para el usuario
export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Email o contraseña incorrectos',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
  [ERROR_CODES.USER_NOT_FOUND]: 'Usuario no encontrado',
  [ERROR_CODES.USER_ALREADY_EXISTS]: 'Ya existe una cuenta con este email',
  
  [ERROR_CODES.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos',
  [ERROR_CODES.REQUIRED_FIELD]: 'Este campo es obligatorio',
  [ERROR_CODES.INVALID_FORMAT]: 'El formato de los datos es incorrecto',
  
  [ERROR_CODES.CONNECTION_TIMEOUT]: 'Tiempo de conexión agotado, verifica tu internet',
  [ERROR_CODES.SERVER_ERROR]: 'Error en el servidor, intenta más tarde',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Demasiadas solicitudes, espera un momento',
  
  [ERROR_CODES.CONTENT_NOT_FOUND]: 'El contenido que buscas no existe',
  [ERROR_CODES.CONTENT_UNAVAILABLE]: 'Este contenido no está disponible',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'Ha ocurrido un error inesperado',
  [ERROR_CODES.PERMISSION_DENIED]: 'No tienes permisos para realizar esta acción'
};

// Logger de errores
export class ErrorLogger {
  static log(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      name: error.name,
      code: error.code || ERROR_CODES.UNKNOWN_ERROR,
      statusCode: error.statusCode || 500,
      stack: error.stack,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
      url: typeof window !== 'undefined' ? window.location.href : null
    };

    // En desarrollo, mostrar en consola
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error: ${error.name}`);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      console.error('Stack:', error.stack);
      console.error('Context:', context);
      console.groupEnd();
    }

    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === 'production') {
      // Aquí se podría integrar con servicios como Sentry, LogRocket, etc.
      this.sendToLoggingService(errorInfo);
    }

    return errorInfo;
  }

  static sendToLoggingService(errorInfo) {
    // Simulación de envío a servicio de logging
    // En un proyecto real, aquí se integraría con Sentry, LogRocket, etc.
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        // Google Analytics
        window.gtag('event', 'exception', {
          description: errorInfo.message,
          fatal: errorInfo.statusCode >= 500
        });
      }
    } catch (loggingError) {
      console.error('Error al enviar log:', loggingError);
    }
  }
}

// Manejador principal de errores
export const handleError = (error, context = {}) => {
  // Log del error
  const errorInfo = ErrorLogger.log(error, context);
  
  // Determinar el mensaje apropiado para mostrar al usuario
  let userMessage = ERROR_MESSAGES[error.code] || error.message;
  
  // Si es un error de validación con múltiples campos
  if (error.name === 'ZodError') {
    const firstError = error.errors[0];
    userMessage = firstError.message;
  }
  
  return {
    id: Date.now().toString(),
    type: getErrorType(error),
    message: userMessage,
    code: error.code || ERROR_CODES.UNKNOWN_ERROR,
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString(),
    context
  };
};

// Determinar el tipo de error para la UI
const getErrorType = (error) => {
  if (error.statusCode >= 500) return 'error';
  if (error.statusCode >= 400) return 'warning';
  if (error.name === 'ValidationError') return 'validation';
  if (error.name === 'NetworkError') return 'network';
  return 'info';
};

// Wrapper para manejo de errores en async/await
export const withErrorHandling = (asyncFn, context = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      throw handleError(error, context);
    }
  };
};

// Wrapper para manejo de errores en promesas
export const handlePromise = (promise, context = {}) => {
  return promise.catch(error => {
    throw handleError(error, context);
  });
};

// Función para parsear errores de respuesta HTTP
export const parseHttpError = (response, responseData) => {
  const { status, statusText } = response;
  
  let message = statusText;
  let code = ERROR_CODES.UNKNOWN_ERROR;
  
  // Mensajes específicos por código de estado
  switch (status) {
    case 400:
      message = responseData?.message || 'Solicitud inválida';
      code = ERROR_CODES.VALIDATION_FAILED;
      break;
    case 401:
      message = 'No autorizado';
      code = ERROR_CODES.INVALID_CREDENTIALS;
      break;
    case 403:
      message = 'Acceso denegado';
      code = ERROR_CODES.PERMISSION_DENIED;
      break;
    case 404:
      message = 'Recurso no encontrado';
      code = ERROR_CODES.CONTENT_NOT_FOUND;
      break;
    case 429:
      message = 'Demasiadas solicitudes';
      code = ERROR_CODES.RATE_LIMIT_EXCEEDED;
      break;
    case 500:
    default:
      message = 'Error interno del servidor';
      code = ERROR_CODES.SERVER_ERROR;
      break;
  }
  
  return new AppError(message, status, code);
};

// Boundary de errores global
export const globalErrorHandler = (error, errorInfo) => {
  const handledError = handleError(error, { errorInfo });
  
  // Notificar al usuario según el tipo de error
  if (handledError.type === 'error') {
    // Error crítico - mostrar notificación de error
    console.error('Error crítico:', handledError);
  } else if (handledError.type === 'warning') {
    // Advertencia - mostrar toast de advertencia
    console.warn('Advertencia:', handledError);
  }
  
  return handledError;
};

// Utilidades para retry de operaciones
export const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Si es el último intento o el error no es recuperable, lanzar
      if (attempt === maxAttempts || !isRetryableError(error)) {
        throw error;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

// Determinar si un error es recuperable para retry
const isRetryableError = (error) => {
  const retryableCodes = [
    ERROR_CODES.CONNECTION_TIMEOUT,
    ERROR_CODES.SERVER_ERROR,
    ERROR_CODES.RATE_LIMIT_EXCEEDED
  ];
  
  return retryableCodes.includes(error.code) || 
         (error.statusCode >= 500 && error.statusCode < 600);
};