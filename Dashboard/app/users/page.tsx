"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, Phone, MapPin } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  avatar_url: string
  roles: string[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [pagination.pageNumber, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.pageNumber,
        limit: pagination.pageSize,
        ...(searchTerm && { search: searchTerm }),
      }

      const response = await apiClient.getUsers(params)

      if (response.status === 0) {
        setUsers(response.data.content)
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }))
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý người dùng
        </h2>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-800">Danh sách người dùng</CardTitle>
          <CardDescription>Quản lý thông tin người dùng hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="rounded-lg border-2 border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableRow>
                  <TableHead className="font-semibold">Người dùng</TableHead>
                  <TableHead className="font-semibold">Liên hệ</TableHead>
                  <TableHead className="font-semibold">Địa chỉ</TableHead>
                  <TableHead className="font-semibold">Vai trò</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      Không tìm thấy người dùng
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id.slice(-8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="max-w-xs truncate">{user.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, index) => (
                            <Badge
                              key={index}
                              variant={role === "ADMIN" ? "default" : "secondary"}
                              className={role === "ADMIN" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                            >
                              {role}
                            </Badge>
                          ))}
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
              {pagination.totalElements} người dùng
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
