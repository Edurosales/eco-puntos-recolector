import React, { createContext, useState, useContext, useEffect } from 'react';
import { recolectorService } from '../services/recolectorService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const token = localStorage.getItem('recolector_token');
    const savedUser = localStorage.getItem('recolector_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.rol === 'recolector') {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Si no es recolector, limpiar todo
          localStorage.removeItem('recolector_token');
          localStorage.removeItem('recolector_user');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('recolector_token');
        localStorage.removeItem('recolector_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await recolectorService.login(email, password);
      
      if (data.user && data.user.rol === 'recolector') {
        localStorage.setItem('recolector_token', data.access_token);
        localStorage.setItem('recolector_user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: 'Acceso denegado. Solo recolectores pueden acceder.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = async () => {
    try {
      await recolectorService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('recolector_token');
      localStorage.removeItem('recolector_user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('recolector_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
