import { useRoutes } from 'react-router-dom';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Register from './pages/Register';
import WebLayout from './layouts/WebLayout';

export default function useRouterElement() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <WebLayout isProductPage={true}>
          <ProductList />
        </WebLayout>
      ),
    },
    {
      path: '/login',
      element: (
        <WebLayout>
          <Login />
        </WebLayout>
      ),
    },
    {
      path: '/register',
      element: (
        <WebLayout>
          <Register />
        </WebLayout>
      ),
    },
  ]);
  return routeElements;
}