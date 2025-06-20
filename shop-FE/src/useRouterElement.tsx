// src/useRouterElement.tsx
import { useRoutes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/productDetail/productDetail'; // Or './pages/productDetail/productDetail' depending on actual file name

import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import AccountLayout from './layouts/AccountLayout/AccountLayout';
import Home from './pages/Home';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './pages/contexts/AuthContext';
import Category from './pages/Category';
import Profile from './pages/Profile/Profile';

export default function useRouterElement() {
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra xem context có tồn tại không
  if (!authContext) {
    throw new Error('useRouterElement phải được dùng trong AuthProvider');
  }

  const { user } = authContext;

  // Chờ một chút để đảm bảo AuthProvider đã cập nhật user
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100); // Delay nhỏ để đồng bộ
    return () => clearTimeout(timer);
  }, [user]);

  const routeElements = useRoutes([
    {
      path: '/',
      index: true,
      element: (
        <DefaultLayout>
          <Home />
        </DefaultLayout>
      ),
    },
    {
      path: '/login',
      element: isLoading ? (
        <div>Đang kiểm tra...</div>
      ) : !user ? (
        <AccountLayout>
          <Login />
        </AccountLayout>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: '/register',
      element: isLoading ? (
        <div>Đang kiểm tra...</div>
      ) : !user ? (
        <AccountLayout>
          <Register />
        </AccountLayout>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: '/product/:id',
      element: (
        <DefaultLayout>
          <ProductDetail />
        </DefaultLayout>
      ),
    },
    {
      path: '/categories/:id',
      element: (
        <DefaultLayout>
          <Category />
        </DefaultLayout>
      ),
    },
    {
      path: '/profile',
      element: isLoading ? (
        <div>Đang kiểm tra...</div>
      ) : user ? (
        <DefaultLayout>
          <Profile />
        </DefaultLayout>
      ) : (
        <Navigate to="/login" />
      ),
    },
  ]);

  return routeElements;
}