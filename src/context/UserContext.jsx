import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrCreateUser, saveUser } from '../utils/user';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userData = getOrCreateUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      // Fallback user creation
      const fallbackUser = {
        id: Date.now().toString(),
        username: `User${Math.floor(Math.random() * 1000)}`,
        avatar: null,
        status: 'online',
        createdAt: new Date().toISOString()
      };
      setUser(fallbackUser);
      saveUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const updateUsername = (newUsername) => {
    updateUser({ username: newUsername });
  };

  const updateStatus = (newStatus) => {
    updateUser({ status: newStatus });
  };

  const value = {
    user,
    loading,
    updateUser,
    updateUsername,
    updateStatus
  };

  if (loading) {
    return (
      <div className="h-screen bg-discord-darker flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
