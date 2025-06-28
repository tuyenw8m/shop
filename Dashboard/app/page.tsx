"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingCart, Star, TrendingUp, DollarSign, Eye, AlertTriangle } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for dashboard
const salesData = [
  { name: "T1", sales: 4000000, orders: 240 },
  { name: "T2", sales: 3000000, orders: 139 },
  { name: "T3", sales: 2000000, orders: 980 },
  { name: "T4", sales: 2780000, orders: 390 },
  { name: "T5", sales: 1890000, orders: 480 },
  { name: "T6", sales: 2390000, orders: 380 },
]

const categoryData = [
  { name: "Máy tính", value: 400, color: "#3B82F6" },
  { name: "Linh kiện", value: 300, color: "#8B5CF6" },
  { name: "Camera", value: 200, color: "#10B981" },
  { name: "Phụ kiện", value: 100, color: "#F59E0B" },
]

const recentOrders = [
  { id: "ORD-001", customer: "Nguyễn Văn A", amount: 2500000, status: "completed", time: "2 phút trước" },
  { id: "ORD-002", customer: "Trần Thị B", amount: 1800000, status: "pending", time: "5 phút trước" },
  { id: "ORD-003", customer: "Lê Văn C", amount: 3200000, status: "processing", time: "10 phút trước" },
  { id: "ORD-004", customer: "Phạm Thị D", amount: 950000, status: "completed", time: "15 phút trước" },
]

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  })

  useEffect(() => {
    // Simulate API calls to get dashboard stats
    setStats({
      totalProducts: 1250,
      totalUsers: 3420,
      totalOrders: 892,
      totalRevenue: 125430000,
      pendingOrders: 23,
      lowStockProducts: 8,
    })
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Hoàn thành", variant: "default" as const, color: "bg-green-100 text-green-800" },
      pending: { label: "Chờ xử lý", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      processing: { label: "Đang xử lý", variant: "outline" as const, color: "bg-blue-100 text-blue-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bảng điều khiển
        </h1>
        <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Tổng sản phẩm</CardTitle>
            <Package className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Người dùng</CardTitle>
            <Users className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Đơn hàng</CardTitle>
            <ShoppingCart className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Doanh thu</CardTitle>
            <DollarSign className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% so với tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart className="h-5 w-5 text-blue-600" />
                Doanh thu theo tháng
              </CardTitle>
              <CardDescription>Biểu đồ doanh thu và đơn hàng 6 tháng gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "sales" ? formatCurrency(value as number) : value,
                      name === "sales" ? "Doanh thu" : "Đơn hàng",
                    ]}
                    labelStyle={{ color: "#333" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="sales" fill="url(#salesGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Eye className="h-5 w-5 text-green-600" />
                Thống kê nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Đơn hàng chờ xử lý</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {stats.pendingOrders}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sản phẩm sắp hết</span>
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  {stats.lowStockProducts}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mục tiêu tháng</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Cảnh báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Sản phẩm sắp hết</p>
                  <p className="text-xs text-yellow-600">8 sản phẩm cần nhập thêm</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Star className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Đánh giá mới</p>
                  <p className="text-xs text-blue-600">12 đánh giá chờ phản hồi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            Đơn hàng gần đây
          </CardTitle>
          <CardDescription>Các đơn hàng mới nhất trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">
                      {order.id} • {order.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">{formatCurrency(order.amount)}</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
