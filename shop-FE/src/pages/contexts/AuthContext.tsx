import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext<{
  user: { token: string; name: string } | null;
  login: (token: string, name: string) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ token: string; name: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Giả định API verify-token trả về name
      fetch(`http://localhost:8888/shop/api/v1/auth/authentication?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Token không hợp lệ');
          }
        })
        .then((data) => {
  console.log("Verify response:", data); // ✅ Kiểm tra dữ liệu
  setUser({ token, name: data.user?.name || 'Người dùng' });
})
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  const login = (token: string, name: string) => {
    localStorage.setItem('token', token);
    setUser({ token, name });
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