import { useRoutes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/productDetail/productDetail'
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout'
import AccountLayout from './layouts/AccountLayout/AccountLayout'
import Home from './pages/Home'

export default function useRouterElement() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <DefaultLayout>
          <Home />
        </DefaultLayout>
      )
    },
    {
      path: '/login',
      element: (
        <AccountLayout>
          <Login />
        </AccountLayout>
      )
    },
    {
      path: '/register',
      element: (
        <AccountLayout>
          <Register />
        </AccountLayout>
      )
    },
    {
      path: '/product/:id',
      element: (
        <DefaultLayout>
          <ProductDetail />
        </DefaultLayout>
      )
    }
  ])
  return routeElements
}
