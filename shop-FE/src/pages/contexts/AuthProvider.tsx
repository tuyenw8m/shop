import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../contexts/auth.types';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Restoring session with token:', token);
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
            console.log('User Response:', data);
            setUser(data.data);
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
    setUser(user);
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
