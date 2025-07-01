"use client"

import type * as React from "react"
import { BarChart3, Package, Users, ShoppingCart, Tag, Star, Percent, LogOut, Home, Settings, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api"

const menuItems = [
  {
    title: "Tổng quan",
    url: "/",
    icon: Home,
    color: "text-blue-600",
  },
  {
    title: "Sản phẩm",
    url: "/products",
    icon: Package,
    color: "text-green-600",
    badge: "1.2k",
  },
  {
    title: "Danh mục",
    url: "/categories",
    icon: Tag,
    color: "text-purple-600",
  },
  {
    title: "Đơn hàng",
    url: "/orders",
    icon: ShoppingCart,
    color: "text-orange-600",
    badge: "23",
  },
  {
    title: "Người dùng",
    url: "/users",
    icon: Users,
    color: "text-indigo-600",
  },
  {
    title: "Đánh giá",
    url: "/reviews",
    icon: Star,
    color: "text-yellow-600",
  },
  {
    title: "Mã giảm giá",
    url: "/coupons",
    icon: Percent,
    color: "text-pink-600",
  },
  {
    title: "Thống kê",
    url: "/analytics",
    icon: BarChart3,
    color: "text-cyan-600",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [counts, setCounts] = useState<{ products: number; users: number }>({ products: 0, users: 0 })

  useEffect(() => {
    apiClient.getDashboardSummary().then((data) => {
      setCounts({ products: data.totalProducts, users: data.totalUsers })
    })
  }, [])

  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-lg" {...props}>
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg truncate">E-Shop Admin</h2>
            <p className="text-xs text-blue-100 truncate">Hệ thống quản trị</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium px-4 py-2">Điều hướng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="group relative rounded-lg transition-all duration-200 hover:bg-gray-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-50 data-[active=true]:to-purple-50 data-[active=true]:border-r-2 data-[active=true]:border-blue-500"
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                      <item.icon
                        className={`h-5 w-5 ${pathname === item.url ? "text-blue-600" : item.color} group-hover:scale-110 transition-transform`}
                      />
                      <span
                        className={`font-medium ${pathname === item.url ? "text-blue-900" : "text-gray-700"} group-hover:text-gray-900`}
                      >
                        {item.title}
                      </span>
                      {item.title === "Sản phẩm" && counts.products > 0 && (
                        <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-600 text-xs">
                          {counts.products.toLocaleString()}
                        </Badge>
                      )}
                      {item.title === "Người dùng" && counts.users > 0 && (
                        <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-600 text-xs">
                          {counts.users.toLocaleString()}
                        </Badge>
                      )}
                      {item.badge && item.title !== "Sản phẩm" && item.title !== "Người dùng" && (
                        <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-600 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="rounded-lg hover:bg-gray-50">
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-700">Cài đặt</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-gray-50/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 ring-2 ring-blue-100">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-sm">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "admin@example.com"}</p>
          </div>
          <div className="relative">
            <Bell className="h-4 w-4 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
