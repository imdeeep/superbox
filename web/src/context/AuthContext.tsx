'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/constant/data';
import jsCookie from 'js-cookie';

interface User {
  _id: string;
  userId: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}auth/check/`, {
          withCredentials: true,
        });
        setUser(response.data.user);
        jsCookie.set('tk', response.data.token, {
          expires: 1,
          secure: true,
          sameSite: 'Strict',
          path: '/',
        });
      } catch (error) {
        console.error('User is not authenticated:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    await axios.post(`${BASE_URL}auth/logout`, {}, { withCredentials: true });
    setUser(null);
    jsCookie.remove('tk');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
