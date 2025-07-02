"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("admin_token")
    const storedUser = localStorage.getItem("admin_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not on login page
    if (!isLoading && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8888/shop/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.status === 0 && data.data.token) {
        const { token: authToken, user: userData } = data.data
        if (!userData.roles || !Array.isArray(userData.roles) || !userData.roles.includes("ADMIN")) {
          throw new Error("Chỉ admin mới được phép đăng nhập vào hệ thống này.")
        }
        setToken(authToken)
        setUser({ ...userData, role: "ADMIN" })
        localStorage.setItem("admin_token", authToken)
        localStorage.setItem("admin_user", JSON.stringify({ ...userData, role: "ADMIN" }))
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
