"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Coupon {
  id: string
  code: string
  description: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_order_value: number
  max_discount: number
  start_date: string
  end_date: string
  usage_limit: number
  status: "active" | "expired"
  created_at: string
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  })
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    min_order_value: "",
    max_discount: "",
    start_date: "",
    end_date: "",
    usage_limit: "",
    applicable_products: [] as number[],
    applicable_categories: [] as number[],
  })

  useEffect(() => {
    fetchCoupons()
  }, [pagination.page, searchTerm, statusFilter])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.size,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
      }

      const response = await apiClient.getCoupons(params)

      if (response.status === "success") {
        setCoupons(response.data.content)
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch coupons",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = async () => {
    try {
      const couponData = {
        ...formData,
        discount_value: Number.parseFloat(formData.discount_value),
        min_order_value: Number.parseFloat(formData.min_order_value),
        max_discount: Number.parseFloat(formData.max_discount),
        usage_limit: Number.parseInt(formData.usage_limit),
      }

      const response = await apiClient.createCoupon(couponData)

      if (response.status === "success") {
        toast({
          title: "Success",
          description: "Coupon created successfully",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchCoupons()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      })
    }
  }

  const handleEditCoupon = async () => {
    if (!editingCoupon) return

    try {
      const couponData = {
        ...formData,
        discount_value: Number.parseFloat(formData.discount_value),
        min_order_value: Number.parseFloat(formData.min_order_value),
        max_discount: Number.parseFloat(formData.max_discount),
        usage_limit: Number.parseInt(formData.usage_limit),
      }

      const response = await apiClient.updateCoupon(editingCoupon.id, couponData)

      if (response.status === "success") {
        toast({
          title: "Success",
          description: "Coupon updated successfully",
        })
        setIsEditDialogOpen(false)
        setEditingCoupon(null)
        resetForm()
        fetchCoupons()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coupon",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return

    try {
      await apiClient.deleteCoupon(id)
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      })
      fetchCoupons()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_order_value: coupon.min_order_value.toString(),
      max_discount: coupon.max_discount.toString(),
      start_date: coupon.start_date.split("T")[0],
      end_date: coupon.end_date.split("T")[0],
      usage_limit: coupon.usage_limit.toString(),
      applicable_products: [],
      applicable_categories: [],
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      min_order_value: "",
      max_discount: "",
      start_date: "",
      end_date: "",
      usage_limit: "",
      applicable_products: [],
      applicable_categories: [],
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>Add a new promotional coupon</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="SUMMER25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setFormData((prev) => ({ ...prev, discount_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Coupon description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    Discount Value {formData.discount_type === "percentage" ? "(%)" : "($)"}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, discount_value: e.target.value }))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_order_value">Min Order Value ($)</Label>
                  <Input
                    id="min_order_value"
                    type="number"
                    step="0.01"
                    value={formData.min_order_value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, min_order_value: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_discount">Max Discount ($)</Label>
                  <Input
                    id="max_discount"
                    type="number"
                    step="0.01"
                    value={formData.max_discount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, max_discount: e.target.value }))}
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, usage_limit: e.target.value }))}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateCoupon}>
                Create Coupon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupon Management</CardTitle>
          <CardDescription>Manage promotional coupons and discounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{coupon.description}</div>
                      </TableCell>
                      <TableCell>
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `$${coupon.discount_value}`}
                      </TableCell>
                      <TableCell>${coupon.min_order_value}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(coupon.start_date)}</div>
                          <div className="text-muted-foreground">to {formatDate(coupon.end_date)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={coupon.status === "active" ? "default" : "secondary"}>
                          {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(coupon)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteCoupon(coupon.id)}>
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

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.size + 1} to{" "}
              {Math.min(pagination.page * pagination.size, pagination.totalElements)} of {pagination.totalElements}{" "}
              coupons
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>Update coupon information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Coupon Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="SUMMER25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount_type">Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData((prev) => ({ ...prev, discount_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Coupon description"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-discount_value">
                  Discount Value {formData.discount_type === "percentage" ? "(%)" : "($)"}
                </Label>
                <Input
                  id="edit-discount_value"
                  type="number"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discount_value: e.target.value }))}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-min_order_value">Min Order Value ($)</Label>
                <Input
                  id="edit-min_order_value"
                  type="number"
                  step="0.01"
                  value={formData.min_order_value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, min_order_value: e.target.value }))}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-max_discount">Max Discount ($)</Label>
                <Input
                  id="edit-max_discount"
                  type="number"
                  step="0.01"
                  value={formData.max_discount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, max_discount: e.target.value }))}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start_date">Start Date</Label>
                <Input
                  id="edit-start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end_date">End Date</Label>
                <Input
                  id="edit-end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-usage_limit">Usage Limit</Label>
                <Input
                  id="edit-usage_limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, usage_limit: e.target.value }))}
                  placeholder="100"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditCoupon}>
              Update Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
