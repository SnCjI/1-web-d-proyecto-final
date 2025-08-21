# 🎬 Explorador de Películas y Series

## Descripción del Proyecto

**Movie Explorer** es una aplicación web moderna desarrollada en React que permite a los usuarios explorar, buscar y descubrir información detallada sobre películas y series de televisión. La aplicación ofrecerá una experiencia intuitiva y visualmente atractiva para los amantes del cine y las series.

## Características Principales

### Funcionalidades Core
- **Búsqueda avanzada** de películas y series por título, género, año, etc.
- **Exploración por categorías**: populares, mejor valoradas, próximos estrenos
- **Información detallada** de cada título: sinopsis, reparto, calificaciones, trailers
- **Sistema de favoritos** para guardar títulos de interés
- **Filtros dinámicos** por género, año, calificación, etc.
- **Interfaz responsive** adaptada a dispositivos móviles y desktop

### Funcionalidades Avanzadas (Fases posteriores)
- Sistema de reseñas y calificaciones personales
- Recomendaciones personalizadas
- Listas personalizadas de "Ver más tarde"
- Integración con redes sociales para compartir
- Modo oscuro/claro
- Historial de visualización

## Stack Tecnológico

### Frontend
- **React 18+** con Hooks y Context API
- **React Router** para navegación
- **Styled Components** o **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- **React Query** para manejo de estado del servidor

### API Externa
- **The Movie Database (TMDb) API** - Fuente principal de datos
- Posible integración con **OMDb API** como respaldo

### Herramientas de Desarrollo
- **Vite** como bundler y dev server
- **ESLint** y **Prettier** para calidad de código
- **Vercel** para deployment
- **Git** y **GitHub** para control de versiones

## API y Fuentes de Datos

### The Movie Database (TMDb)
- **URL Base**: `https://api.themoviedb.org/3/`
- **Documentación**: https://developers.themoviedb.org/3
- **Endpoints principales**:
  - `/movie/popular` - Películas populares
  - `/movie/top_rated` - Mejores calificadas
  - `/search/movie` - Búsqueda de películas
  - `/tv/popular` - Series populares
  - `/genre/movie/list` - Lista de géneros

### Datos que manejaremos
- Información básica: título, sinopsis, fecha de estreno
- Medios: posters, backdrops, trailers
- Metadatos: géneros, duración, calificaciones
- Reparto y crew principal
- Recomendaciones y contenido similar

## Estructura del Proyecto

```
movie-explorer/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── movie/
│   │   ├── search/
│   │   └── layout/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── MovieDetail.jsx
│   │   ├── Search.jsx
│   │   └── Favorites.jsx
│   ├── hooks/
│   ├── services/
│   │   └── tmdbApi.js
│   ├── context/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

## Roadmap de Desarrollo

### Fase 1: Configuración y Base (Semanas 1-2)
- [ ] Configuración inicial del proyecto con Vite
- [ ] Configuración de la API de TMDb
- [ ] Estructura básica de componentes
- [ ] Sistema de routing básico
- [ ] Diseño de la interfaz principal

### Fase 2: Funcionalidades Core (Semanas 3-4)
- [ ] Implementación de búsqueda
- [ ] Listados de películas populares y top rated
- [ ] Vista detallada de películas
- [ ] Sistema de filtros básicos
- [ ] Responsive design

### Fase 3: Características Avanzadas (Semanas 5-6)
- [ ] Sistema de favoritos
- [ ] Integración de series de TV
- [ ] Optimizaciones de rendimiento
- [ ] Testing básico
- [ ] Deployment en Vercel

### Fase 4: Pulimiento y Extras (Semanas 7-8)
- [ ] Modo oscuro
- [ ] Animaciones y transiciones
- [ ] Mejoras en UX/UI
- [ ] Optimización SEO
- [ ] Documentación final

## Configuración del Entorno de Desarrollo

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta en TMDb para obtener API Key
- Git configurado

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/[tu-usuario]/movie-explorer.git

# Instalar dependencias
cd movie-explorer
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Agregar tu API Key de TMDb en .env.local

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno Necesarias
```
VITE_TMDB_API_KEY=tu_api_key_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

## Acuerdos de Trabajo y Metodología

### Metodología de Desarrollo
Utilizaremos una metodología ágil inspirada en **SCRUM** adaptada para el contexto educativo:

#### Sprints
- **Duración**: 2 semanas por sprint
- **Sprint Planning**: Definición de objetivos y tareas al inicio de cada sprint
- **Daily Standups**: Revisiones de progreso (3 veces por semana)
- **Sprint Review**: Demostración de funcionalidades completadas
- **Sprint Retrospective**: Análisis de mejoras para el siguiente sprint

#### Roles y Responsabilidades
- **Product Owner**: Sensei (define prioridades y requirements)
- **Scrum Master**: Rotación entre miembros del equipo
- **Development Team**: Todos los participantes del proyecto

### Estándares de Código

#### Git Flow
- **Rama principal**: `main` (código en producción)
- **Rama de desarrollo**: `develop` (integración de features)
- **Ramas de features**: `feature/nombre-funcionalidad`
- **Ramas de hotfix**: `hotfix/descripcion-fix`

#### Convenciones de Commits
```
tipo(alcance): descripción breve

Tipos válidos:
- feat: nueva funcionalidad
- fix: corrección de bug
- docs: cambios en documentación
- style: cambios de formato (no afectan funcionalidad)
- refactor: refactorización de código
- test: agregar o modificar tests
- chore: tareas de mantenimiento

Ejemplo:
feat(search): agregar filtro por género en búsqueda
```

#### Estándares de Código
- **Naming**: camelCase para variables y funciones, PascalCase para componentes
- **Estructura de archivos**: Un componente por archivo
- **Props**: Usar PropTypes o TypeScript para validación
- **Estados**: Preferir hooks sobre class components
- **Comentarios**: JSDoc para funciones importantes

### Proceso de Revisión de Código

#### Pull Requests
1. **Crear PR** desde feature branch hacia develop
2. **Descripción clara** de los cambios realizados
3. **Asignar reviewer** (mínimo 1 persona del equipo)
4. **Revisión de código** y feedback constructivo
5. **Merge** solo después de aprobación y tests pasando

#### Checklist para PRs
- [ ] Código sigue los estándares establecidos
- [ ] Funcionalidad probada manualmente
- [ ] No hay console.logs innecesarios
- [ ] Responsive design implementado
- [ ] Comentarios y documentación actualizada

### Herramientas de Comunicación

#### Canales de Comunicación
- **Discord/Slack**: Comunicación diaria del equipo
- **GitHub Issues**: Tracking de bugs y features
- **GitHub Projects**: Gestión de tareas y sprints
- **Google Meet**: Reuniones de sprint y pair programming

#### Horarios de Trabajo
- **Disponibilidad general**: [Definir horarios del equipo]
- **Reuniones de equipo**: [Definir días y horarios]
- **Pair programming**: Sesiones coordinadas según disponibilidad

### Criterios de Aceptación

#### Definition of Done
Una funcionalidad se considera terminada cuando:
- [ ] Código implementado y funcional
- [ ] Responsive design aplicado
- [ ] Revisión de código completada
- [ ] Documentación actualizada
- [ ] Probado en diferentes navegadores
- [ ] Merge realizado a develop

#### Calidad de Código
- **Funcionalidad**: La feature funciona según especificación
- **Performance**: Tiempo de carga aceptable (<3s)
- **Usabilidad**: Interfaz intuitiva y accesible
- **Mantenibilidad**: Código limpio y bien estructurado

## Recursos y Referencias

### Documentación Técnica
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TMDb API Documentation](https://developers.themoviedb.org/3)
- [Vite Documentation](https://vitejs.dev/)

### Inspiración de Diseño
- Netflix
- Disney+
- IMDb
- Letterboxd

### Herramientas Útiles
- [Figma](https://figma.com) - Diseño de interfaces
- [Postman](https://postman.com) - Testing de API
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debugging
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/) - Debugging React

## Contribuciones y Contacto

### Cómo Contribuir
1. Fork del repositorio
2. Crear branch para tu feature
3. Implementar cambios siguiendo los estándares
4. Hacer commit con mensaje descriptivo
5. Crear Pull Request con descripción detallada

- [Sensei/Instructor]

**¡Happy Coding!** 🚀🎬

*Último update: [Fecha actual]*
