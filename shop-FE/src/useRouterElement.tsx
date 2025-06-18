import { useRoutes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail/ProductDetail'; // Or './pages/productDetail/productDetail' depending on actual file name
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import AccountLayout from './layouts/AccountLayout/AccountLayout';
import Home from './pages/Home';
import { useContext } from 'react';
import { AuthContext } from './pages/contexts/AuthContext';
import Category from './pages/Category'; // Added from fe-apiv2
import Profile from './pages/Profile/Profile'; // Added from main

export default function useRouterElement() {
  const { user } = useContext(AuthContext);

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
      path: '/categories/:id', // Route from fe-apiv2
      element: (
        <DefaultLayout>
          <Category />
        </DefaultLayout>
      ),
    },
    {
      path: '/profile', // Route from main
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