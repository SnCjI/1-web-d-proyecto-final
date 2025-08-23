// src/components/Media/MediaCard.jsx
import React, { useState } from 'react';
import { Star, Heart, Calendar, Clock, Play, Info, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  formatDate, 
  formatRuntime, 
  truncateText, 
  getRatingColor, 
  getPlaceholderImage, 
  handleImageError 
} from '../../utils/utils';

const MediaCard = ({ item, type }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isItemFavorite = isFavorite(item.id);
  const title = item.title || item.name;
  const releaseDate = item.releaseDate || item.firstAirDate || item.year;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isItemFavorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites({ ...item, type });
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageErrorEvent = (e) => {
    if (!imageError) {
      setImageError(true);
      handleImageError(e, getPlaceholderImage(300, 450, title));
    }
  };

  return (
    <div className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-purple-500">
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-700">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse" />
        )}
        
        <img
          src={item.poster || getPlaceholderImage(300, 450, title)}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-110`}
          onLoad={handleImageLoad}
          onError={handleImageErrorEvent}
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-opacity-30 transition duration-200 flex items-center justify-center space-x-2"
            >
              <Eye size={16} />
              <span>Ver detalles</span>
            </button>
          </div>
        </div>

        {/* Top Actions */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isItemFavorite
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-black bg-opacity-50 text-gray-300 hover:text-red-400 hover:bg-opacity-70'
            }`}
          >
            <Heart size={16} fill={isItemFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg flex items-center space-x-1 backdrop-blur-sm">
          <Star size={12} fill="currentColor" className="text-yellow-400" />
          <span className={`text-sm font-semibold ${getRatingColor(item.rating)}`}>
            {item.rating?.toFixed(1) || 'N/A'}
          </span>
        </div>

        {/* Type Badge */}
        {type === 'tv' && (
          <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
            SERIE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition duration-200">
          {title}
        </h3>

        {/* Info Row */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(releaseDate).getFullYear() || 'N/A'}</span>
          </div>
          {type === 'tv' && item.seasons && (
            <div className="flex items-center space-x-1">
              <Info size={14} />
              <span>{item.seasons} temporada{item.seasons !== 1 ? 's' : ''}</span>
            </div>
          )}
          {type === 'movies' && item.runtime && (
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{formatRuntime(item.runtime)}</span>
            </div>
          )}
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full font-medium"
            >
              {genre}
            </span>
          ))}
          {item.genres?.length > 2 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              +{item.genres.length - 2}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            showDetails
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
          }`}
        >
          {showDetails ? (
            <>
              <Eye size={16} />
              <span>Ocultar</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Ver más</span>
            </>
          )}
        </button>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
            <div>
              <h4 className="text-white font-medium mb-1">Sinopsis</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {truncateText(item.overview || 'No hay descripción disponible.', 200)}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {item.director && (
                <div>
                  <span className="text-gray-400">Director:</span>
                  <div className="text-white font-medium">{item.director}</div>
                </div>
              )}
              {item.creators && (
                <div>
                  <span className="text-gray-400">Creador:</span>
                  <div className="text-white font-medium">{item.creators.join(', ')}</div>
                </div>
              )}
              {releaseDate && (
                <div>
                  <span className="text-gray-400">Estreno:</span>
                  <div className="text-white font-medium">{formatDate(releaseDate)}</div>
                </div>
              )}
              {item.status && (
                <div>
                  <span className="text-gray-400">Estado:</span>
                  <div className="text-white font-medium">{item.status}</div>
                </div>
              )}
            </div>

            {/* Cast */}
            {item.cast && item.cast.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-1">Reparto</h4>
                <p className="text-gray-300 text-sm">
                  {item.cast.slice(0, 3).join(', ')}
                  {item.cast.length > 3 && '...'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;