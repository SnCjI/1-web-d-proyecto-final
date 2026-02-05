// src/hooks/useError.js
import { useState, useCallback, useRef } from 'react';
import { handleError, retry } from '../utils/errorHandler';

// Hook principal para manejo de errores
export const useError = () => {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const activeRequests = useRef(new Set());

  // Agregar un nuevo error
  const addError = useCallback((error, context = {}) => {
    const handledError = handleError(error, context);
    
    setErrors(prevErrors => {
      // Evitar errores duplicados
      const isDuplicate = prevErrors.some(
        err => err.message === handledError.message && 
               err.code === handledError.code
      );
      
      if (!isDuplicate) {
        return [...prevErrors, handledError];
      }
      
      return prevErrors;
    });
    
    return handledError;
  }, []);

  // Remover error específico
  const removeError = useCallback((errorId) => {
    setErrors(prevErrors => prevErrors.filter(err => err.id !== errorId));
  }, []);

  // Limpiar todos los errores
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Limpiar errores por tipo
  const clearErrorsByType = useCallback((type) => {
    setErrors(prevErrors => prevErrors.filter(err => err.type !== type));
  }, []);

  // Obtener errores por tipo
  const getErrorsByType = useCallback((type) => {
    return errors.filter(err => err.type === type);
  }, [errors]);

  // Verificar si hay errores de un tipo específico
  const hasErrors = useCallback((type = null) => {
    if (type) {
      return errors.some(err => err.type === type);
    }
    return errors.length > 0;
  }, [errors]);

  // Wrapper para operaciones asíncronas con manejo de errores
  const withErrorHandling = useCallback(async (operation, context = {}) => {
    const requestId = Date.now().toString();
    activeRequests.current.add(requestId);
    
    try {
      setIsLoading(true);
      const result = await operation();
      return result;
    } catch (error) {
      const handledError = addError(error, { ...context, requestId });
      throw handledError;
    } finally {
      activeRequests.current.delete(requestId);
      if (activeRequests.current.size === 0) {
        setIsLoading(false);
      }
    }
  }, [addError]);

  // Wrapper con retry automático
  const withRetry = useCallback(async (operation, options = {}) => {
    const { maxAttempts = 3, delay = 1000, context = {} } = options;
    
    try {
      const result = await retry(
        () => withErrorHandling(operation, context),
        maxAttempts,
        delay
      );
      return result;
    } catch (error) {
      throw error; // El error ya fue manejado por withErrorHandling
    }
  }, [withErrorHandling]);

  return {
    errors,
    isLoading,
    addError,
    removeError,
    clearErrors,
    clearErrorsByType,
    getErrorsByType,
    hasErrors,
    withErrorHandling,
    withRetry
  };
};

// Hook para validación de formularios con Zod
export const useFormValidation = (schema, options = {}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState({});
  const { addError } = useError();
  
  const { 
    validateOnChange = true, 
    validateOnBlur = true,
    showErrorsOnTouched = true 
  } = options;

  // Validar un campo específico
  const validateField = useCallback((fieldName, value, showError = true) => {
    try {
      // Crear un esquema parcial para validar solo este campo
      const fieldSchema = schema.pick({ [fieldName]: true });
      fieldSchema.parse({ [fieldName]: value });
      
      // Si la validación es exitosa, remover error
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      return { success: true, error: null };
    } catch (error) {
      if (error.errors) {
        const fieldError = error.errors[0]?.message || 'Error de validación';
        
        if (showError && (!showErrorsOnTouched || touched[fieldName])) {
          setValidationErrors(prev => ({
            ...prev,
            [fieldName]: fieldError
          }));
        }
        
        return { success: false, error: fieldError };
      }
      
      return { success: false, error: 'Error de validación desconocido' };
    }
  }, [schema, touched, showErrorsOnTouched]);

  // Validar todo el formulario
  const validateForm = useCallback((data, showErrors = true) => {
    try {
      const validatedData = schema.parse(data);
      
      if (showErrors) {
        setValidationErrors({});
        setIsValid(true);
      }
      
      return { 
        success: true, 
        data: validatedData, 
        errors: {} 
      };
    } catch (error) {
      if (error.errors) {
        const formattedErrors = {};
        error.errors.forEach(err => {
          const fieldName = err.path.join('.');
          formattedErrors[fieldName] = err.message;
        });
        
        if (showErrors) {
          setValidationErrors(formattedErrors);
          setIsValid(false);
          
          // Agregar error general si es necesario
          addError(error, { 
            type: 'validation', 
            form: true,
            fields: Object.keys(formattedErrors) 
          });
        }
        
        return { 
          success: false, 
          data: null, 
          errors: formattedErrors 
        };
      }
      
      const generalError = 'Error de validación del formulario';
      if (showErrors) {
        addError(new Error(generalError), { type: 'validation', form: true });
      }
      
      return { 
        success: false, 
        data: null, 
        errors: { general: generalError } 
      };
    }
  }, [schema, addError]);

  // Marcar campo como tocado
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));
  }, []);

  // Handler para onChange con validación
  const handleFieldChange = useCallback((fieldName, value) => {
    if (validateOnChange) {
      const shouldShowError = !showErrorsOnTouched || touched[fieldName];
      validateField(fieldName, value, shouldShowError);
    }
  }, [validateField, validateOnChange, showErrorsOnTouched, touched]);

  // Handler para onBlur con validación
  const handleFieldBlur = useCallback((fieldName, value) => {
    setFieldTouched(fieldName, true);
    
    if (validateOnBlur) {
      validateField(fieldName, value, true);
    }
  }, [validateField, validateOnBlur, setFieldTouched]);

  // Limpiar errores de validación
  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
    setIsValid(true);
    setTouched({});
  }, []);

  // Limpiar error de campo específico
  const clearFieldError = useCallback((fieldName) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    validationErrors,
    isValid: isValid && Object.keys(validationErrors).length === 0,
    touched,
    validateField,
    validateForm,
    setFieldTouched,
    handleFieldChange,
    handleFieldBlur,
    clearValidationErrors,
    clearFieldError
  };
};

// Hook para manejo de estado de carga y errores de API
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { withErrorHandling } = useError();

  const execute = useCallback(async (operation, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      resetDataOnStart = false,
      context = {} 
    } = options;

    if (resetDataOnStart) {
      setData(null);
    }
    setError(null);
    setLoading(true);

    try {
      const result = await withErrorHandling(operation, context);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);