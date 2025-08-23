// src/components/Layout/Navigation.jsx
import React from 'react';
import { Play, Tv, Heart, TrendingUp, Clock } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { 
      id: 'movies', 
      name: 'Películas', 
      icon: Play, 
      description: 'Explora películas populares',
      color: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'tv', 
      name: 'Series', 
      icon: Tv, 
      description: 'Descubre series trending',
      color: 'from-green-500 to-teal-600'
    },
    { 
      id: 'trending', 
      name: 'Trending', 
      icon: TrendingUp, 
      description: 'Lo más popular ahora',
      color: 'from-orange-500 to-red-600'
    },
    { 
      id: 'favorites', 
      name: 'Favoritos', 
      icon: Heart, 
      description: 'Tus contenidos guardados',
      color: 'from-pink-500 to-rose-600'
    },
    { 
      id: 'watchlist', 
      name: 'Ver Después', 
      icon: Clock, 
      description: 'Lista para ver más tarde',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center py-4">
          <div className="flex space-x-2 bg-gray-900 rounded-2xl p-2 border border-gray-600">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 transform ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <div className="text-left">
                    <div className="font-medium">{tab.name}</div>
                    {isActive && (
                      <div className="text-xs opacity-80">{tab.description}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto py-4 space-x-1 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-b ${tab.color} text-white shadow-lg`
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1 font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Info */}
        {activeTab && (
          <div className="hidden sm:block pb-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile scroll indicator */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;