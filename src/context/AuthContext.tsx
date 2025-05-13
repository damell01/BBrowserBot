import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as api from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  companyName?: string;
  pixelInstalled: boolean;
  trackingId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, companyName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updatePixelStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Check pixel status on load
        if (parsedUser.role === 'customer') {
          checkPixelStatus();
        }
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const checkPixelStatus = async () => {
    try {
      const isInstalled = await api.checkPixelStatus();
      if (user && user.pixelInstalled !== isInstalled) {
        updatePixelStatus(isInstalled);
      }
    } catch (error) {
      console.error('Failed to check pixel status:', error);
    }
  };

  const updatePixelStatus = (status: boolean) => {
    if (user) {
      const updatedUser = { ...user, pixelInstalled: status };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, companyName: string) => {
    try {
      const response = await api.register(email, password, name, companyName);
      if (response.success) {
        toast.success('Registration successful!');
        await login(email, password);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register,
        logout, 
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        updatePixelStatus
      }}
    >
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