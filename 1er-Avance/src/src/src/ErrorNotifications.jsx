// src/components/ErrorHandling/ErrorNotifications.jsx
import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle, 
  Info, 
  AlertCircle, 
  WifiOff,
  RefreshCw 
} from 'lucide-react';

// Componente individual de notificación
const NotificationItem = ({ 
  notification, 
  onClose, 
  onRetry, 
  autoClose = true,
  autoCloseDelay = 5000 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let progressInterval;
    let closeTimeout;

    if (autoClose && notification.type !== 'error') {
      // Actualizar barra de progreso
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (autoCloseDelay / 100));
          return Math.max(0, newProgress);
        });
      }, 100);

      // Auto cerrar
      closeTimeout = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [autoClose, autoCloseDelay, notification.type]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry(notification);
    }
    handleClose();
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'network':
        return <WifiOff size={20} className="text-blue-400" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-900 border-green-700';
      case 'warning':
        return 'bg-yellow-900 border-yellow-700';
      case 'error':
        return 'bg-red-900 border-red-700';
      case 'network':
        return 'bg-blue-900 border-blue-700';
      case 'info':
      default:
        return 'bg-gray-800 border-gray-600';
    }
  };

  const getProgressColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'error':
        return 'bg-red-400';
      case 'network':
        return 'bg-blue-400';
      case 'info':
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm
        transition-all duration-300 transform
        ${getBackgroundColor()}
        ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      {/* Barra de progreso */}
      {autoClose && notification.type !== 'error' && (
        <div className="absolute bottom-0 left-0 h-1 bg-gray-700 w-full">
          <div
            className={`h-full transition-all duration-100 ease-linear ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start space-x-3">
        {/* Icono */}
        <div className="flex-shrink-0 pt-0.5">
          {getIcon()}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {notification.title || getTitleByType(notification.type)}
              </p>
              <p className="text-sm text-gray-300 mt-1 break-words">
                {notification.message}
              </p>
              
              {/* Información adicional */}
              {notification.context && (
                <div className="mt-2 text-xs text-gray-400">
                  {notification.code && (
                    <span className="inline-block mr-2">
                      Código: {notification.code}
                    </span>
                  )}
                  {notification.timestamp && (
                    <span className="inline-block">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-1 ml-2">
              {/* Botón de reintentar para errores de red */}
              {notification.type === 'network' && onRetry && (
                <button
                  onClick={handleRetry}
                  className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                  title="Reintentar"
                >
                  <RefreshCw size={16} />
                </button>
              )}
              
              {/* Botón de cerrar */}
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                title="Cerrar"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Obtener título por tipo de notificación
const getTitleByType = (type) => {
  switch (type) {
    case 'success':
      return '¡Éxito!';
    case 'warning':
      return 'Advertencia';
    case 'error':
      return 'Error';
    case 'network':
      return 'Error de conexión';
    case 'validation':
      return 'Error de validación';
    case 'info':
    default:
      return 'Información';
  }
};

// Componente principal de notificaciones
const ErrorNotifications = ({ 
  notifications = [], 
  onClose, 
  onRetry,
  position = 'top-right',
  maxNotifications = 5 
}) => {
  // Limitar el número de notificaciones mostradas
  const displayedNotifications = notifications.slice(0, maxNotifications);

  if (displayedNotifications.length === 0) {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div
      className={`
        fixed z-50 space-y-2 w-full max-w-sm
        ${getPositionClasses()}
      `}
    >
      {displayedNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
          onRetry={onRetry}
          autoClose={notification.type !== 'error'}
          autoCloseDelay={notification.type === 'success' ? 3000 : 5000}
        />
      ))}
      
      {/* Indicador de notificaciones adicionales */}
      {notifications.length > maxNotifications && (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">
            +{notifications.length - maxNotifications} notificación(es) más
          </p>
        </div>
      )}
    </div>
  );
};

export default ErrorNotifications;