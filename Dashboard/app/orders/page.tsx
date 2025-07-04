"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  user_id: string
  product_id: string
  total_price: number
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "DELIVERED" | "SHIPPED"
  items_count: number
  created_at: string
  price: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [pagination.pageNumber, searchTerm, selectedStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.pageNumber,
        limit: pagination.pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStatus && selectedStatus !== "all" && { status: selectedStatus }),
      }

      const response = await apiClient.getOrders(params)

      if (response.status === 0) {
        setOrders(response.data.content)
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }))
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await apiClient.updateOrderStatus(id, status)

      if (response.status === 0) {
        toast({
          title: "Thành công",
          description: "Cập nhật trạng thái đơn hàng thành công",
        })
        fetchOrders()
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng",
        variant: "destructive",
      })
    }
  }

  const handleCancelOrder = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return

    try {
      await apiClient.cancelOrder(id)
      toast({
        title: "Thành công",
        description: "Hủy đơn hàng thành công",
      })
      fetchOrders()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể hủy đơn hàng",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { variant: "default" as const, label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
      SHIPPED: { variant: "default" as const, label: "Đang giao", color: "bg-purple-100 text-purple-800" },
      DELIVERED: { variant: "default" as const, label: "Đã giao", color: "bg-green-100 text-green-800" },
      CANCELLED: { variant: "destructive" as const, label: "Đã hủy", color: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING

    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý đơn hàng
        </h2>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-800">Danh sách đơn hàng</CardTitle>
          <CardDescription>Quản lý và theo dõi đơn hàng</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-blue-500"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px] border-2 focus:border-blue-500">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="SHIPPED">Đang giao</SelectItem>
                <SelectItem value="DELIVERED">Đã giao</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border-2 border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableRow>
                  <TableHead className="font-semibold">Mã đơn hàng</TableHead>
                  <TableHead className="font-semibold">Khách hàng</TableHead>
                  <TableHead className="font-semibold">Sản phẩm</TableHead>
                  <TableHead className="font-semibold">Số lượng</TableHead>
                  <TableHead className="font-semibold">Tổng tiền</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold">Ngày tạo</TableHead>
                  <TableHead className="font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Không tìm thấy đơn hàng
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-blue-600">#{order.id.slice(-8)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.user_id.slice(-8)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.product_id.slice(-8)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {order.items_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">{formatPrice(order.total_price)}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{formatDate(order.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                              <SelectItem value="CONFIRMED">Xác nhận</SelectItem>
                              <SelectItem value="SHIPPED">Đang giao</SelectItem>
                              <SelectItem value="DELIVERED">Đã giao</SelectItem>
                              <SelectItem value="CANCELLED">Hủy</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {(pagination.pageNumber - 1) * pagination.pageSize + 1} đến{" "}
              {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalElements)} trong tổng số{" "}
              {pagination.totalElements} đơn hàng
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, pageNumber: prev.pageNumber - 1 }))}
                disabled={pagination.pageNumber <= 1}
                className="hover:bg-blue-50"
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }))}
                disabled={pagination.pageNumber >= pagination.totalPages}
                className="hover:bg-blue-50"
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
