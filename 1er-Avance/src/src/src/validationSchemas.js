// src/utils/validationSchemas.js
import { z } from 'zod';

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(100, 'El email es demasiado largo'),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña es demasiado larga')
});

// Schema para registro
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras'),
  
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(100, 'El email es demasiado largo'),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña es demasiado larga')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirmar contraseña es requerido')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

// Schema para búsqueda
export const searchSchema = z.object({
  searchTerm: z
    .string()
    .max(100, 'Término de búsqueda demasiado largo')
    .optional(),
  
  sortBy: z
    .enum(['popularity', 'rating', 'date', 'title'], {
      errorMap: () => ({ message: 'Opción de ordenamiento inválida' })
    })
    .default('popularity'),
  
  filterBy: z
    .string()
    .max(50, 'Filtro demasiado largo')
    .default('all'),
  
  page: z
    .number()
    .int('La página debe ser un número entero')
    .min(1, 'La página debe ser mayor a 0')
    .default(1),
  
  limit: z
    .number()
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser mayor a 0')
    .max(100, 'El límite no puede ser mayor a 100')
    .default(20)
});

// Schema para perfil de usuario
export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras'),
  
  email: z
    .string()
    .email('Formato de email inválido')
    .max(100, 'El email es demasiado largo'),
  
  bio: z
    .string()
    .max(500, 'La biografía es demasiado larga')
    .optional(),
  
  favoriteGenres: z
    .array(z.string())
    .max(10, 'No puedes seleccionar más de 10 géneros')
    .optional()
});

// Schema para comentarios/reseñas
export const reviewSchema = z.object({
  movieId: z
    .number()
    .int('ID de película inválido')
    .positive('ID de película debe ser positivo'),
  
  rating: z
    .number()
    .min(1, 'La calificación debe ser al menos 1')
    .max(10, 'La calificación no puede ser mayor a 10')
    .multipleOf(0.1, 'La calificación debe tener máximo un decimal'),
  
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(100, 'El título es demasiado largo'),
  
  content: z
    .string()
    .min(10, 'La reseña debe tener al menos 10 caracteres')
    .max(2000, 'La reseña es demasiado larga'),
  
  spoilers: z
    .boolean()
    .default(false)
});

// Schema para configuración de la aplicación
export const appSettingsSchema = z.object({
  theme: z
    .enum(['light', 'dark', 'system'], {
      errorMap: () => ({ message: 'Tema inválido' })
    })
    .default('dark'),
  
  language: z
    .enum(['es', 'en'], {
      errorMap: () => ({ message: 'Idioma inválido' })
    })
    .default('es'),
  
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    recommendations: z.boolean().default(true)
  }).default({}),
  
  privacy: z.object({
    showProfile: z.boolean().default(true),
    showFavorites: z.boolean().default(false),
    allowRecommendations: z.boolean().default(true)
  }).default({})
});

// Tipos TypeScript inferidos de los schemas (para proyectos con TypeScript)
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;
export type AppSettings = z.infer<typeof appSettingsSchema>;

// Helper para validar datos
export const validateData = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      
      return {
        success: false,
        data: null,
        errors: formattedErrors
      };
    }
    
    return {
      success: false,
      data: null,
      errors: { general: 'Error de validación desconocido' }
    };
  }
};

// Helper para validación asíncrona
export const validateDataAsync = async (schema, data) => {
  try {
    const validatedData = await schema.parseAsync(data);
    return {
      success: true,
      data: validatedData,
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      
      return {
        success: false,
        data: null,
        errors: formattedErrors
      };
    }
    
    return {
      success: false,
      data: null,
      errors: { general: 'Error de validación desconocido' }
    };
  }
};

// Schema personalizado para validar URLs de imágenes
export const imageUrlSchema = z
  .string()
  .url('URL de imagen inválida')
  .refine(
    url => {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return validExtensions.some(ext => url.toLowerCase().includes(ext));
    },
    'La URL debe apuntar a una imagen válida (jpg, jpeg, png, gif, webp)'
  );

// Validador personalizado para fechas
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
  .refine(
    dateString => {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date.getTime());
    },
    'Fecha inválida'
  )
  .refine(
    dateString => {
      const date = new Date(dateString);
      const now = new Date();
      return date <= now;
    },
    'La fecha no puede ser en el futuro'
  );