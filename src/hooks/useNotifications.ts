
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Show toast
    const toastFn = toast[notification.type] || toast;
    toastFn(notification.title, {
      description: notification.message,
      duration: notification.duration || 5000,
      action: notification.action ? {
        label: notification.action.label,
        onClick: notification.action.onClick,
      } : undefined,
    });
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string) => 
    showNotification({ type: 'success', title, message }), [showNotification]);
  
  const error = useCallback((title: string, message?: string) => 
    showNotification({ type: 'error', title, message }), [showNotification]);
  
  const warning = useCallback((title: string, message?: string) => 
    showNotification({ type: 'warning', title, message }), [showNotification]);
  
  const info = useCallback((title: string, message?: string) => 
    showNotification({ type: 'info', title, message }), [showNotification]);

  return {
    notifications,
    showNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
};
