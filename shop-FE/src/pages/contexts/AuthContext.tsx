// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext<{
  user: { token: string; name?: string; email?: string } | null;
  login: (token: string) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ token: string; name?: string; email?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Gọi API để lấy thông tin người dùng
      fetch('http://localhost:8888/shop/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.name && data.email) {
            setUser({ token, name: data.name, email: data.email });
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetch('http://localhost:8888/shop/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name && data.email) {
          setUser({ token, name: data.name, email: data.email });
        } else {
          throw new Error('Không thể lấy thông tin người dùng');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;