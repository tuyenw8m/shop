// src/pages/contexts/AuthProvider.tsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from './auth.types';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ token: string; user: User } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Restoring session with token:', token); // Debug log
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
              console.warn('Invalid token or endpoint not found, logging out');
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
            console.log('User Response:', data); // Debug log
            setUser({ token, user: data.data });
          } else {
            console.warn('No valid user data:', data);
            throw new Error('Dữ liệu người dùng không hợp lệ');
          }
        })
        .catch((error) => {
          console.error('Auth Error:', error.message);
          setUser(null);
        });
    } else {
      console.log('No token found in localStorage');
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setUser({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  console.log('Current user state:', user); // Debug current state

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;