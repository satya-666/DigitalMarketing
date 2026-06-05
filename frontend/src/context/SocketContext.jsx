import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const SocketContext = createContext(null);

const SOCKET_URL = 'http://localhost:5001';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      autoConnect: false
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Connect socket and register user when logged in
  useEffect(() => {
    if (!socket) return;

    if (user) {
      socket.connect();
      socket.emit('registerUser', user.id);

      // Fetch user notifications list on signin
      const fetchNotifications = async () => {
        try {
          const res = await axios.get('/notifications');
          setNotifications(res.data);
          setUnreadNotifications(res.data.filter(n => !n.is_read).length);
        } catch (err) {
          console.error('Failed to fetch notifications list:', err);
        }
      };
      fetchNotifications();

      // Listen for system notification pushes
      socket.on('messageNotification', (data) => {
        // Only insert if not on chat page (can be handled in App state or chat view)
        // Add new notification record locally
        const mockNotif = {
          id: Date.now(),
          user_id: user.id,
          content: `New chat message received in thread.`,
          is_read: false,
          created_at: new Date()
        };
        setNotifications(prev => [mockNotif, ...prev]);
        setUnreadNotifications(prev => prev + 1);
      });

      // Listen for custom alerts
      socket.on('alertNotification', (content) => {
        const mockNotif = {
          id: Date.now(),
          user_id: user.id,
          content,
          is_read: false,
          created_at: new Date()
        };
        setNotifications(prev => [mockNotif, ...prev]);
        setUnreadNotifications(prev => prev + 1);
      });
    } else {
      socket.disconnect();
      setNotifications([]);
      setUnreadNotifications(0);
    }

    return () => {
      socket.off('messageNotification');
      socket.off('alertNotification');
    };
  }, [socket, user]);

  const markNotificationsAsRead = async () => {
    if (!user) return;
    try {
      await axios.put('/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadNotifications(0);
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const addLocalNotification = (content) => {
    const newNotif = {
      id: Date.now(),
      user_id: user?.id,
      content,
      is_read: false,
      created_at: new Date()
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadNotifications(prev => prev + 1);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadNotifications, markNotificationsAsRead, addLocalNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
