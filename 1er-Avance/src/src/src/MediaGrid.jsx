// src/components/Media/MediaGrid.jsx
import React, { useState, useEffect } from 'react';
import { Grid, List, Filter } from 'lucide-react';
import MediaCard from './MediaCard';

const MediaGrid = ({ items, type, loading = false }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Reset page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-700 rounded w-20 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="aspect-[2/3] bg-gray-700 animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          No pudimos encontrar contenido que coincida con tus criterios de búsqueda. 
          Intenta ajustar los filtros o buscar algo diferente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {items.length} resultado{items.length !== 1 ? 's' : ''} encontrado{items.length !== 1 ? 's' : ''}
          </h2>
          {totalPages > 1 && (
            <p className="text-sm text-gray-400 mt-1">
              Página {currentPage} de {totalPages} 
              ({startIndex + 1}-{Math.min(endIndex, items.length)} de {items.length})
            </p>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1 border border-gray-600">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition duration-200 ${
              viewMode === 'grid'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Vista en cuadrícula"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition duration-200 ${
              viewMode === 'list'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Vista en lista"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid/List View */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
          : 'space-y-4'
      }>
        {currentItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`${
              viewMode === 'list' ? 'flex bg-gray-800 rounded-xl overflow-hidden border border-gray-700' : ''
            }`}
          >
            {viewMode === 'list' ? (
              // List view layout
              <div className="flex w-full">
                <div className="w-24 sm:w-32 flex-shrink-0">
                  <img
                    src={item.poster || `https://via.placeholder.com/200x300/374151/9CA3AF?text=${encodeURIComponent(item.title || item.name)}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.title || item.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(item.releaseDate || item.firstAirDate || item.year).getFullYear()}
                      {type === 'tv' && item.seasons && ` • ${item.seasons} temporadas`}
                    </p>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {item.overview || 'No hay descripción disponible.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-white font-medium">
                        {item.rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {item.genres?.slice(0, 2).map((genre, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Grid view layout
              <MediaCard item={item} type={type} />
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 py-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition duration-200"
          >
            Anterior
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-lg transition duration-200 ${
                    currentPage === pageNumber
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition duration-200"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;