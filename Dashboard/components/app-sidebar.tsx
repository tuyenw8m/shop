"use client";

import type * as React from "react";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Tag,
  Home,
  FolderTree,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Tổng quan",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Sản phẩm",
      url: "/products",
      icon: Package,
    },
    {
      title: "Danh mục",
      url: "/categories",
      icon: FolderTree,
    },
    {
      title: "Đơn hàng",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Khách hàng",
      url: "/users",
      icon: Users,
    },
    {
      title: "Đánh giá",
      url: "/reviews",
      icon: MessageSquare,
    },
    {
      title: "Mã giảm giá",
      url: "/coupons",
      icon: Tag,
    },
    {
      title: "Thống kê",
      url: "/analytics",
      icon: BarChart3,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Package className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Ecommerce Admin</span>
            <span className="truncate text-xs text-muted-foreground">
              Quản trị hệ thống
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onLogout={logout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
