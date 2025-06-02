// src/contexts/AppContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { partyService, quotationService } from '../services/api';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Global loading state
  const [globalLoading, setGlobalLoading] = useState(false);
  
  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalParties: 0,
    totalQuotations: 0,
    totalRevenue: 0,
    totalProfit: 0,
    conversionRate: 0,
    recentActivity: [],
    upcomingFollowUps: []
  });
  
  // App settings
  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata',
    notifications: {
      email: true,
      browser: true,
      followUps: true,
      newQuotations: true
    },
    dashboard: {
      refreshInterval: 300000, // 5 minutes
      showRecentActivity: true,
      showUpcomingTasks: true
    }
  });
  
  // Search states
  const [globalSearch, setGlobalSearch] = useState({
    term: '',
    results: [],
    isSearching: false,
    filters: {
      parties: true,
      quotations: true,
      components: false
    }
  });
  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load app settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('empresspc_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setAppSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading app settings:', error);
      }
    }
  }, []);

  // Save app settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('empresspc_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setGlobalLoading(true);
      
      const [partiesRes, quotationsRes] = await Promise.all([
        partyService.getStats(),
        quotationService.getStats()
      ]);
      
      // Calculate stats
      const parties = partiesRes.data?.total || 0;
      const quotations = quotationsRes.data?.total || 0;
      const revenue = quotationsRes.data?.totalValue || 0;
      
      // Mock recent activity (replace with real API when available)
      const recentActivity = [
        {
          id: 1,
          type: 'party_created',
          message: 'New client added',
          timestamp: new Date().toISOString(),
          icon: 'user-plus',
          color: 'success'
        },
        {
          id: 2,
          type: 'quotation_sent',
          message: 'Quotation sent to client',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          icon: 'file-invoice',
          color: 'primary'
        }
      ];
      
      setDashboardStats({
        totalParties: parties,
        totalQuotations: quotations,
        totalRevenue: revenue,
        totalProfit: revenue * 0.25, // Mock 25% profit margin
        conversionRate: quotations > 0 ? (parties / quotations * 100) : 0,
        recentActivity,
        upcomingFollowUps: []
      });
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Global search function
  const performGlobalSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setGlobalSearch(prev => ({ ...prev, results: [], term: '' }));
      return;
    }
    
    try {
      setGlobalSearch(prev => ({ ...prev, isSearching: true, term: searchTerm }));
      
      const results = [];
      
      // Search parties if enabled
      if (globalSearch.filters.parties) {
        try {
          const partiesRes = await partyService.search({ search: searchTerm });
          const parties = partiesRes.data?.data || partiesRes.data || [];
          
          parties.slice(0, 5).forEach(party => {
            results.push({
              id: party._id,
              type: 'party',
              title: party.name,
              subtitle: `${party.phone} • ${party.dealStatus}`,
              url: `/parties/${party._id}`,
              icon: 'user',
              badge: party.partyId
            });
          });
        } catch (error) {
          console.warn('Party search failed:', error);
        }
      }
      
      // Search quotations if enabled
      if (globalSearch.filters.quotations) {
        try {
          const quotationsRes = await quotationService.getAll();
          const quotations = quotationsRes.data?.data || quotationsRes.data || [];
          
          const filteredQuotations = quotations
            .filter(q => 
              q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              q.party?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5);
          
          filteredQuotations.forEach(quotation => {
            results.push({
              id: quotation._id,
              type: 'quotation',
              title: quotation.title,
              subtitle: `${quotation.party?.name} • ₹${quotation.totalAmount?.toLocaleString()}`,
              url: `/quotations/${quotation._id}`,
              icon: 'file-invoice-dollar',
              badge: quotation.status
            });
          });
        } catch (error) {
          console.warn('Quotation search failed:', error);
        }
      }
      
      setGlobalSearch(prev => ({ 
        ...prev, 
        results: results.slice(0, 10), // Limit to 10 results
        isSearching: false 
      }));
      
    } catch (error) {
      console.error('Global search error:', error);
      setGlobalSearch(prev => ({ ...prev, isSearching: false }));
    }
  };

  // Update app settings
  const updateAppSettings = (newSettings) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Settings updated successfully');
  };

  // Add notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount(prev => prev + 1);
    
    // Auto-remove notification after 5 seconds if it's not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  // Mark notification as read
  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(notif => notif.id !== id);
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Format currency based on app settings
  const formatCurrency = (amount) => {
    const { currency } = appSettings;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date based on app settings
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: appSettings.timezone
    }).format(new Date(date));
  };

  // Context value
  const value = {
    // Global state
    globalLoading,
    setGlobalLoading,
    
    // Dashboard
    dashboardStats,
    fetchDashboardStats,
    
    // Settings
    appSettings,
    updateAppSettings,
    
    // Search
    globalSearch,
    performGlobalSearch,
    setGlobalSearch,
    
    // Notifications
    notifications,
    unreadCount,
    addNotification,
    markNotificationRead,
    removeNotification,
    clearAllNotifications,
    
    // Utility functions
    formatCurrency,
    formatDate
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};