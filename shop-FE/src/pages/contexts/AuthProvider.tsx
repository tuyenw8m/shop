// src/pages/contexts/AuthProvider.tsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from './auth.types';
interface AuthState {
  token: string;
  user: User;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthState | null>(null); // Sử dụng AuthState

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      fetch('http://localhost:8888/shop/api/v1/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            console.error('User fetch failed:', res.status, res.statusText);
            if (res.status === 401 || res.status === 404) {
              localStorage.removeItem('token');
              setUser(null);
              return null;
            }
            throw new Error('Không thể tải thông tin người dùng');
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.status === 0 && data.data) {
            console.log('Fetched user data from API:', data.data);
            setUser({ token, user: data.data });
          } else {
            console.warn('No valid user data:', data);
            setUser(null);
          }
        })
        .catch((error) => {
          console.error('Auth Error:', error.message);
          setUser(null);
        });
    } else {
      console.log('No token found');
      setUser(null);
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser({ token, user: userData });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;