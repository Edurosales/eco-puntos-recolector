import React, { createContext, useContext } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const success = (message) => addNotification(message, 'success');
  const error = (message) => addNotification(message, 'danger');
  const warning = (message) => addNotification(message, 'warning');
  const info = (message) => addNotification(message, 'info');

  return (
    <NotificationContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            bg={notification.type}
            onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            autohide
            delay={4000}
          >
            <Toast.Header>
              <strong className="me-auto">
                {notification.type === 'success' && '✓ Éxito'}
                {notification.type === 'danger' && '✕ Error'}
                {notification.type === 'warning' && '⚠ Advertencia'}
                {notification.type === 'info' && 'ℹ Información'}
              </strong>
            </Toast.Header>
            <Toast.Body className={notification.type === 'success' || notification.type === 'danger' ? 'text-white' : ''}>
              {notification.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
};
