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
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  description: string
  children?: Category[]
  branch_name?: string[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [searchTerm])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const params = {
        ...(searchTerm && { search: searchTerm }),
      }

      const response = await apiClient.getCategories(params)

      if (response.status === 0) {
        setCategories(response.data)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    try {
      const response = await apiClient.createCategory(formData)

      if (response.status === 0) {
        toast({
          title: "Thành công",
          description: "Tạo danh mục thành công",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchCategories()
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo danh mục",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory) return

    try {
      const response = await apiClient.updateCategory(editingCategory.id, formData)

      if (response.status === 0) {
        toast({
          title: "Thành công",
          description: "Cập nhật danh mục thành công",
        })
        setIsEditDialogOpen(false)
        setEditingCategory(null)
        resetForm()
        fetchCategories()
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật danh mục",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return

    try {
      await apiClient.deleteCategory(id)
      toast({
        title: "Thành công",
        description: "Xóa danh mục thành công",
      })
      fetchCategories()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa danh mục",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const renderCategoryRow = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <>
        <TableRow key={category.id}>
          <TableCell>
            <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6 mr-2"
                  onClick={() => toggleCategory(category.id)}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <span className="font-medium">{category.name}</span>
              {level === 0 && (
                <Badge variant="outline" className="ml-2">
                  Cha
                </Badge>
              )}
              {level > 0 && (
                <Badge variant="secondary" className="ml-2">
                  Con
                </Badge>
              )}
            </div>
          </TableCell>
          <TableCell>{category.description}</TableCell>
          <TableCell>
            {category.branch_name && (
              <div className="flex flex-wrap gap-1">
                {category.branch_name.map((brand, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {brand}
                  </Badge>
                ))}
              </div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && category.children!.map((child) => renderCategoryRow(child, level + 1))}
      </>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo danh mục mới</DialogTitle>
              <DialogDescription>Thêm danh mục sản phẩm mới</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên danh mục</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả danh mục"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateCategory}>
                Tạo danh mục
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>Quản lý danh mục sản phẩm theo cấu trúc phân cấp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Không tìm thấy danh mục
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => renderCategoryRow(category))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên danh mục</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả danh mục"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditCategory}>
              Cập nhật danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
