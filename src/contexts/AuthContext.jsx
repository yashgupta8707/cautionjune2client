// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

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

  // Initialize authentication state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Verify token with backend
          const response = await authService.getProfile();
          setUser(response.data.user);
          setIsAuthenticated(true);
          
          console.log('✅ Authentication initialized successfully');
        } catch (error) {
          console.error('❌ Auth initialization error:', error);
          
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          setUser(null);
          setIsAuthenticated(false);
          
          // Only show error if it's not a network issue
          if (error.response?.status === 401) {
            toast.error('Session expired. Please login again.');
          }
        }
      } else {
        console.log('🔐 No auth token found');
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login...');
      
      const response = await authService.login(credentials);
      
      // Store token
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${response.data.user.name}!`);
      console.log('✅ Login successful');
      
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('📝 Attempting registration...');
      
      const response = await authService.register(userData);
      
      // Store token
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome to EmpressPC, ${response.data.user.name}!`);
      console.log('✅ Registration successful');
      
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      let message = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          message = errors.map(err => err.message).join('. ');
        }
      }
      
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('👋 Logging out...');
      
      // Try to logout from backend (optional, don't wait for response)
      authService.logout().catch(() => {
        // Ignore logout errors, just clean local state
      });
      
      // Clear local state
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      
      toast.success('Logged out successfully');
      console.log('✅ Logout successful');
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Even if logout fails, clear local state
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      
      window.location.href = '/login';
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      console.log('📝 Updating profile...');
      
      const response = await authService.updateProfile(profileData);
      setUser(response.data.user);
      
      toast.success('Profile updated successfully!');
      console.log('✅ Profile update successful');
      
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      
      const message = error.response?.data?.message || 'Profile update failed. Please try again.';
      toast.error(message);
      
      return { success: false, message };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      console.log('🔒 Changing password...');
      
      await authService.changePassword(passwordData);
      
      toast.success('Password changed successfully!');
      console.log('✅ Password change successful');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Password change error:', error);
      
      const message = error.response?.data?.message || 'Password change failed. Please try again.';
      toast.error(message);
      
      return { success: false, message };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is active
  const isUserActive = () => {
    return user?.isActive === true;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('❌ Refresh user error:', error);
      
      // If token is invalid, logout
      if (error.response?.status === 401) {
        logout();
      }
      
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Context value
  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Authentication methods
    login,
    register,
    logout,
    
    // Profile methods
    updateProfile,
    changePassword,
    refreshUser,
    
    // Utility methods
    hasRole,
    isAdmin,
    isUserActive,
    getUserInitials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};