// src/components/Layout/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, SortAsc } from 'lucide-react';
import { availableGenres, sortOptions } from '../../data/mockData';
import { debounce } from '../../utils/utils';

const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy, 
  filterBy, 
  setFilterBy,
  resultsCount = 0
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search to avoid too many updates
  useEffect(() => {
    const debouncedSearch = debounce((value) => {
      setSearchTerm(value);
    }, 300);

    debouncedSearch(localSearchTerm);
  }, [localSearchTerm, setSearchTerm]);

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    setSortBy('popularity');
    setFilterBy('all');
    setLocalSearchTerm('');
    setSearchTerm('');
  };

  const activeFiltersCount = [
    searchTerm && searchTerm.length > 0,
    sortBy !== 'popularity',
    filterBy !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-20">
      <div className="container mx-auto px-4 py-4">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar películas, series, géneros..."
            className="w-full pl-12 pr-12 py-4 bg-gray-900 text-white rounded-2xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-lg"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
          {localSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition duration-200"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition duration-200 ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
              }`}
            >
              <Filter size={16} />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-purple-600 text-xs px-2 py-1 rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-400 hover:text-white transition duration-200 underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Results Count */}
          {searchTerm && (
            <div className="text-sm text-gray-400">
              {resultsCount > 0 
                ? `${resultsCount} resultado${resultsCount !== 1 ? 's' : ''} encontrado${resultsCount !== 1 ? 's' : ''}`
                : 'No se encontraron resultados'
              }
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <SortAsc size={16} />
                  <span>Ordenar por</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <Filter size={16} />
                  <span>Filtrar por género</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="all">Todos los géneros</option>
                  {availableGenres.map(genre => (
                    <option key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filtros rápidos
              </label>
              <div className="flex flex-wrap gap-2">
                {['Acción', 'Comedia', 'Drama', 'Horror', 'Ciencia Ficción'].map(genre => (
                  <button
                    key={genre}
                    onClick={() => setFilterBy(genre.toLowerCase())}
                    className={`px-3 py-1 text-sm rounded-full border transition duration-200 ${
                      filterBy === genre.toLowerCase()
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
