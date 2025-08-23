// src/utils/utils.js

// Formatear fecha
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Formatear duración
export const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Truncar texto
export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Filtrar y ordenar elementos
export const filterAndSortItems = (items, searchTerm, sortBy, filterBy) => {
  let filtered = [...items];

  // Filtrar por término de búsqueda
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(item => {
      const title = (item.title || item.name || '').toLowerCase();
      const overview = (item.overview || '').toLowerCase();
      const genres = (item.genres || []).join(' ').toLowerCase();
      
      return title.includes(searchLower) || 
             overview.includes(searchLower) ||
             genres.includes(searchLower);
    });
  }

  // Filtrar por género
  if (filterBy && filterBy !== 'all') {
    filtered = filtered.filter(item =>
      item.genres && item.genres.some(genre => 
        genre.toLowerCase().includes(filterBy.toLowerCase())
      )
    );
  }

  // Ordenar elementos
  switch (sortBy) {
    case 'rating':
      return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    case 'date':
      return filtered.sort((a, b) => {
        const dateA = new Date(a.releaseDate || a.firstAirDate || a.year);
        const dateB = new Date(b.releaseDate || b.firstAirDate || b.year);
        return dateB - dateA;
      });
    
    case 'title':
      return filtered.sort((a, b) => {
        const titleA = (a.title || a.name || '').toLowerCase();
        const titleB = (b.title || b.name || '').toLowerCase();
        return titleA.localeCompare(titleB);
      });
    
    case 'popularity':
    default:
      return filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }
};

// Obtener imagen placeholder
export const getPlaceholderImage = (width = 300, height = 450, text = 'Sin Imagen') => {
  return `https://via.placeholder.com/${width}x${height}/374151/9CA3AF?text=${encodeURIComponent(text)}`;
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar contraseña
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Generar ID único
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// Obtener estadísticas de calificación
export const getRatingColor = (rating) => {
  if (rating >= 8.5) return 'text-green-400';
  if (rating >= 7.0) return 'text-yellow-400';
  if (rating >= 5.5) return 'text-orange-400';
  return 'text-red-400';
};

// Formatear número con separadores de miles
export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-ES').format(number);
};

// Obtener año de fecha
export const getYear = (dateString) => {
  return new Date(dateString).getFullYear();
};

// Debounce para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validar datos del formulario de login
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.email) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'El email no es válido';
  }
  
  if (!formData.password) {
    errors.password = 'La contraseña es requerida';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validar datos del formulario de registro
export const validateRegisterForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }
  
  if (!formData.email) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'El email no es válido';
  }
  
  if (!formData.password) {
    errors.password = 'La contraseña es requerida';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Manejar errores de carga de imágenes
export const handleImageError = (event, fallbackSrc) => {
  if (event.target.src !== fallbackSrc) {
    event.target.src = fallbackSrc || getPlaceholderImage();
  }
};