import { useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import Login from './pages/Login'
import Register from './pages/Register'
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout'
import AccountLayout from './layouts/AccountLayout/AccountLayout'

export default function useRouterElement() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <DefaultLayout>
          <ProductList />
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
    }
  ])
  return routeElements
}
