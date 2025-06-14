// src/useRouterElement.tsx
import { useRoutes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/productDetail/productDetail';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import AccountLayout from './layouts/AccountLayout/AccountLayout';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

export default function useRouterElement() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DefaultLayout>
            <Home />
          </DefaultLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/login',
      element: (
        <AccountLayout>
          <Login />
        </AccountLayout>
      ),
    },
    {
      path: '/register',
      element: (
        <AccountLayout>
          <Register />
        </AccountLayout>
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
  ]);
  return routeElements;
}