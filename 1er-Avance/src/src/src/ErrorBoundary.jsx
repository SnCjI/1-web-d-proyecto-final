// src/components/ErrorHandling/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { ErrorLogger } from '../utils/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error
    const loggedError = ErrorLogger.log(error, {
      errorInfo,
      component: this.props.fallbackComponent || 'Unknown',
      userId: this.props.userId,
      route: window.location.pathname
    });

    this.setState({
      error,
      errorInfo,
      eventId: loggedError.timestamp
    });

    // Callback personalizado si se proporciona
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // UI de error personalizada
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error, 
          this.state.errorInfo, 
          this.handleRetry
        );
      }

      // UI de error por defecto
      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          eventId={this.state.eventId}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
          level={this.props.level || 'page'}
        />
      );
    }

    return this.props.children;
  }
}

// Componente funcional para UI de error
const ErrorFallbackUI = ({ 
  error, 
  errorInfo, 
  eventId,
  onRetry, 
  onReload, 
  onGoHome,
  level = 'page'
}) => {
  const isComponentLevel = level === 'component';
  const isPageLevel = level === 'page';
  const isAppLevel = level === 'app';

  return (
    <div className={`
      flex items-center justify-center p-8
      ${isComponentLevel ? 'min-h-64 bg-gray-800 rounded-lg border border-gray-700' : ''}
      ${isPageLevel ? 'min-h-96 bg-gray-900' : ''}
      ${isAppLevel ? 'min-h-screen bg-gray-900' : ''}
    `}>
      <div className="max-w-md mx-auto text-center">
        {/* Icono de error */}
        <div className={`
          mx-auto flex items-center justify-center rounded-full bg-red-900
          ${isComponentLevel ? 'w-12 h-12 mb-4' : 'w-20 h-20 mb-6'}
        `}>
          <AlertTriangle 
            className="text-red-400" 
            size={isComponentLevel ? 24 : 32} 
          />
        </div>

        {/* Título */}
        <h2 className={`
          font-bold text-white mb-2
          ${isComponentLevel ? 'text-lg' : 'text-2xl'}
        `}>
          {getErrorTitle(level)}
        </h2>

        {/* Descripción */}
        <p className="text-gray-400 mb-6">
          {getErrorDescription(error, level)}
        </p>

        {/* ID del error para soporte */}
        {eventId && (
          <div className="mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 mb-1">ID del Error:</p>
            <p className="text-sm text-gray-300 font-mono break-all">
              {eventId}
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          {/* Botón de reintentar */}
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200"
          >
            <RefreshCw size={16} />
            <span>Reintentar</span>
          </button>

          {/* Botones adicionales para errores de página/app */}
          {(isPageLevel || isAppLevel) && (
            <div className="flex space-x-3">
              <button
                onClick={onReload}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
              >
                <RefreshCw size={14} />
                <span>Recargar</span>
              </button>
              
              <button
                onClick={onGoHome}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
              >
                <Home size={14} />
                <span>Inicio</span>
              </button>
            </div>
          )}
        </div>

        {/* Detalles técnicos en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition">
              <Bug size={16} className="inline mr-2" />
              Detalles técnicos
            </summary>
            <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-xs">
              <div className="mb-2">
                <strong className="text-red-400">Error:</strong>
                <pre className="text-gray-300 whitespace-pre-wrap mt-1">
                  {error?.toString()}
                </pre>
              </div>
              {error?.stack && (
                <div className="mb-2">
                  <strong className="text-red-400">Stack Trace:</strong>
                  <pre className="text-gray-300 whitespace-pre-wrap mt-1 text-xs">
                    {error.stack}
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <strong className="text-red-400">Component Stack:</strong>
                  <pre className="text-gray-300 whitespace-pre-wrap mt-1 text-xs">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getErrorTitle = (level) => {
  switch (level) {
    case 'component':
      return '¡Ups! Error en el componente';
    case 'page':
      return '¡Ups! Error en la página';
    case 'app':
      return '¡Ups! Algo salió mal';
    default:
      return '¡Ups! Ha ocurrido un error';
  }
};

const getErrorDescription = (error, level) => {
  // Mensajes específicos según el tipo de error
  if (error?.message?.includes('ChunkLoadError')) {
    return 'Error al cargar recursos. Por favor, recarga la página.';
  }
  
  if (error?.message?.includes('Network')) {
    return 'Problema de conexión. Verifica tu internet e intenta de nuevo.';
  }

  // Mensajes por nivel
  switch (level) {
    case 'component':
      return 'Este componente ha encontrado un error inesperado. Puedes intentar de nuevo.';
    case 'page':
      return 'Esta página ha encontrado un error inesperado. Puedes recargar o ir al inicio.';
    case 'app':
      return 'La aplicación ha encontrado un error inesperado. Por favor, recarga la página.';
    default:
      return 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.';
  }
};

// HOC para envolver componentes con Error Boundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook para usar Error Boundary programáticamente
export const useErrorBoundary = () => {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const captureError = React.useCallback((error) => {
    setError(error);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return { captureError, resetError };
};

export default ErrorBoundary;