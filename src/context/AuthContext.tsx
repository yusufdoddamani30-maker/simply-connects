import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MOCK_USERS } from '../data/mockData';
import { StorageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  onboard: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('simply_connect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string) => {
    // Check if user exists in localStorage first
    const users = StorageService.getUsers();
    let foundUser = users.find(u => u.email === email);
    
    // If not found, use mock data and save to localStorage
    if (!foundUser) {
      foundUser = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[0];
      // Initialize users in localStorage if empty
      if (users.length === 0) {
        StorageService.saveUsers(MOCK_USERS);
      }
    }
    
    setUser(foundUser);
    localStorage.setItem('simply_connect_user', JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('simply_connect_user');
  };

  const onboard = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('simply_connect_user', JSON.stringify(updatedUser));
      // Also update in storage service
      StorageService.updateUser(user.id, data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, onboard }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
