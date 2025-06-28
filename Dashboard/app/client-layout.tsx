"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user && !isLoginPage) {
    return children // This will redirect to login in the auth context
  }

  if (isLoginPage) {
    return children
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 shadow-sm">
          <SidebarTrigger className="-ml-1 text-gray-600 hover:text-gray-900" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">
                  Bảng điều khiển
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-700">Tổng quan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50/50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppContent
