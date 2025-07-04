"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        router.push("/login")
      } else if (user && !isAdmin && pathname !== "/login") {
        // User is logged in but not admin, redirect to login
        router.push("/login")
      } else if (user && isAdmin && pathname === "/login") {
        router.push("/")
      }
    }
  }, [user, isLoading, isAdmin, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (pathname === "/login") {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  )
}
