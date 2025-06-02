// src/contexts/NotificationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState({
    browser: true,
    sound: true,
    followUps: true,
    quotations: true,
    parties: true,
    system: true
  });

  // Load notification settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  // Save notification settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  }, [settings]);

  // Request browser notification permission
  useEffect(() => {
    if (isAuthenticated && settings.browser && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('✅ Browser notifications enabled');
          }
        });
      }
    }
  }, [isAuthenticated, settings.browser]);

  // Mock real-time notifications (replace with WebSocket/SSE in production)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // Simulate random notifications for demo
      const mockNotifications = [
        {
          type: 'follow_up',
          title: 'Follow-up Reminder',
          message: 'You have 2 follow-ups due today',
          priority: 'medium',
          actionUrl: '/parties?filter=follow-ups'
        },
        {
          type: 'quotation',
          title: 'New Quotation Status',
          message: 'Quotation EPC/25/P0001 marked as sold',
          priority: 'high',
          actionUrl: '/quotations'
        },
        {
          type: 'party',
          title: 'New Client',
          message: 'John Smith added as new client',
          priority: 'low',
          actionUrl: '/parties'
        }
      ];

      // Randomly add a notification (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Add new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    // Check if this type of notification is enabled
    if (!settings[notification.type] && notification.type !== 'system') {
      return;
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 99)]); // Keep last 100
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    const toastOptions = {
      duration: 4000,
      icon: getNotificationIcon(notification.type),
      style: {
        background: getNotificationColor(notification.priority),
        color: '#fff',
      }
    };

    toast(notification.message, toastOptions);

    // Show browser notification if enabled and permission granted
    if (settings.browser && 'Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: notification.type,
        requireInteraction: notification.priority === 'high'
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto close after 5 seconds for non-high priority
      if (notification.priority !== 'high') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    }

    // Play notification sound if enabled
    if (settings.sound && notification.priority === 'high') {
      playNotificationSound();
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
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
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Update notification settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Request permission if browser notifications are enabled
    if (newSettings.browser && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const icons = {
      follow_up: '📅',
      quotation: '📄',
      party: '👤',
      system: '⚙️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
      info: 'ℹ️'
    };
    return icons[type] || '🔔';
  };

  // Get notification color based on priority
  const getNotificationColor = (priority) => {
    const colors = {
      low: '#6c757d',
      medium: '#ffc107',
      high: '#dc3545',
      success: '#28a745',
      info: '#17a2b8'
    };
    return colors[priority] || colors.info;
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notif => notif.type === type);
  };

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = () => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter(notif => new Date(notif.timestamp) > twentyFourHoursAgo);
  };

  // System notifications for different events
  const notifyFollowUpDue = (party) => {
    addNotification({
      type: 'follow_up',
      title: 'Follow-up Due',
      message: `Follow-up due for ${party.name}`,
      priority: 'medium',
      actionUrl: `/parties/${party._id}`,
      metadata: { partyId: party._id }
    });
  };

  const notifyQuotationStatusChange = (quotation, newStatus) => {
    addNotification({
      type: 'quotation',
      title: 'Quotation Status Update',
      message: `${quotation.title} marked as ${newStatus}`,
      priority: newStatus === 'sold' ? 'high' : 'medium',
      actionUrl: `/quotations/${quotation._id}`,
      metadata: { quotationId: quotation._id, status: newStatus }
    });
  };

  const notifyNewParty = (party) => {
    addNotification({
      type: 'party',
      title: 'New Client Added',
      message: `${party.name} added as new client`,
      priority: 'low',
      actionUrl: `/parties/${party._id}`,
      metadata: { partyId: party._id }
    });
  };

  const notifySystemEvent = (message, priority = 'info') => {
    addNotification({
      type: 'system',
      title: 'System Notification',
      message,
      priority
    });
  };

  // Context value
  const value = {
    // State
    notifications,
    unreadCount,
    settings,

    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateSettings,

    // Utilities
    getNotificationsByType,
    getRecentNotifications,
    getNotificationIcon,
    getNotificationColor,

    // System notifications
    notifyFollowUpDue,
    notifyQuotationStatusChange,
    notifyNewParty,
    notifySystemEvent
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};