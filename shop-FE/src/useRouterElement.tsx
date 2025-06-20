import { useRoutes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/productDetail/productDetail'
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout'
import AccountLayout from './layouts/AccountLayout/AccountLayout'
import Home from './pages/Home'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './pages/contexts/AuthContext'
import Category from './pages/Category'
import Profile from './pages/Profile/Profile'
import CartPage from './pages/CartPage'

export default function useRouterElement() {
  const authContext = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)

  if (!authContext) {
    throw new Error('useRouterElement must be used within an AuthProvider')
  }

  const { user } = authContext

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [user])

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
    {
      path: '/login',
      element: isLoading ? (
        <div>Đang kiểm tra...</div>
      ) : !user ? (
        <AccountLayout>
          <Login />
        </AccountLayout>
      ) : (
        <Navigate to='/' />
      )
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
    },
    {
      path: '/cart',
      element: user ? (
        <DefaultLayout>
          <CartPage />
        </DefaultLayout>
      ) : (
        <Navigate to='/login' />
      )
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
        <Navigate to='/login' />
      )
    }
  ])

  return routeElements
}
