import { useRoutes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/productDetail/productDetail';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import AccountLayout from './layouts/AccountLayout/AccountLayout';
import Home from './pages/Home';
import Profile from './pages/Profile/Profile';
import { useContext } from 'react';
import { AuthContext } from './pages/contexts/AuthContext';

export default function useRouterElement() {
  const { user } = useContext(AuthContext);

  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <DefaultLayout>
          <Home />
        </DefaultLayout>
      ),
    },
    {
      path: '/login',
      element: !user ? (
        <AccountLayout>
          <Login />
        </AccountLayout>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: '/register',
      element: !user ? (
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
      path: '/profile',
      element: user ? (
        <DefaultLayout>
          <Profile />
        </DefaultLayout>
      ) : (
        <Navigate to="/" />
      ),
    },
  ]);
  return routeElements;
}