// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { User, LogOut, Settings, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout, getUserStats } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const stats = getUserStats();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
    setShowUserMenu(false);
  };

  return (
    <header className="bg-gray-900 text-white shadow-xl border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">🎬</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CineExplorer
              </h1>
              <p className="text-xs text-gray-400">Descubre tu próxima película favorita</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200 border border-gray-600"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{user?.name}</div>
                      <div className="text-sm text-gray-400">{user?.email}</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {stats && (
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Estadísticas</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-purple-400">{stats.totalFavorites}</div>
                        <div className="text-xs text-gray-400">Favoritos</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">{stats.moviesFavorites}</div>
                        <div className="text-xs text-gray-400">Películas</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-400">{stats.tvFavorites}</div>
                        <div className="text-xs text-gray-400">Series</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Options */}
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition duration-200">
                    <Heart size={16} className="text-pink-400" />
                    <span>Mis Favoritos</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition duration-200">
                    <Settings size={16} className="text-gray-400" />
                    <span>Configuración</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-700 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-900 hover:bg-opacity-50 transition duration-200 text-red-400"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;