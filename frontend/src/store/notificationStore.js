import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api/notifications';

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Get user notifications
  getNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL, createAuthenticatedRequest());
      const notifications = response.data;
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      set({ 
        notifications, 
        unreadCount,
        isLoading: false 
      });
      return { success: true };
    } catch (error) {
      console.error('Notification fetch error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Failed to fetch notifications';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await axios.put(`${API_URL}/${notificationId}/read`, {}, createAuthenticatedRequest());
      
      // Update local state
      const notifications = get().notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      );
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      set({ notifications, unreadCount });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to mark as read';
      return { success: false, error: errorMessage };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      await axios.put(`${API_URL}/read-all`, {}, createAuthenticatedRequest());
      
      // Update local state
      const notifications = get().notifications.map(n => ({ ...n, isRead: true }));
      
      set({ notifications, unreadCount: 0 });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to mark all as read';
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useNotificationStore;