import { useRoutes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout'
import AccountLayout from './layouts/AccountLayout/AccountLayout'
import Home from './pages/Home'
import { useContext } from 'react'
import { AuthContext } from './pages/contexts/AuthContext'
import Category from './pages/Category'

export default function useRouterElement() {
  const { user } = useContext(AuthContext)

  const routeElements = useRoutes([
    {
      path: '/',
      index: true,
      element: (
        <DefaultLayout>
          <Home />
        </DefaultLayout>
      )
    },
    //  {
    //   path: '/',
    //   element: user ? (
    //     <DefaultLayout>
    //       <Home />
    //     </DefaultLayout>
    //   ) : (
    //     <Navigate to='/login' />
    //   )
    // },
    {
      path: '/login',
      element: !user ? (
        <AccountLayout>
          <Login />
        </AccountLayout>
      ) : (
        <Navigate to='/' />
      )
    },
    {
      path: '/register',
      element: !user ? (
        <AccountLayout>
          <Register />
        </AccountLayout>
      ) : (
        <Navigate to='/' />
      )
    },
    {
      path: '/product/:id',
      element: (
        <DefaultLayout>
          <ProductDetail />
        </DefaultLayout>
      )
    },
    {
      path: '/categories/:id',
      element: (
        <DefaultLayout>
          <Category />
        </DefaultLayout>
      )
    }
  ])
  return routeElements
}
