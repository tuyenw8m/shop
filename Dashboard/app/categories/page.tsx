"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronDown, FolderPlus, X } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  description: string
  children?: Category[]
  branch_name?: string[]
}

interface CategoryFormData {
  name: string
  description: string
  branch_names: string[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateParentDialogOpen, setIsCreateParentDialogOpen] = useState(false)
  const [isCreateChildDialogOpen, setIsCreateChildDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingType, setEditingType] = useState<"parent" | "child">("parent")
  const [selectedParentId, setSelectedParentId] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [newBrandName, setNewBrandName] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    branch_names: [],
  })

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        ...(searchTerm && { search: searchTerm }),
      }

      const response = await apiClient.getCategories(params)

      if (response.status === 0) {
        setCategories(response.data || [])
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tải danh sách danh mục",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [searchTerm, toast])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tên danh mục", variant: "destructive" })
      return false
    }
    if (!formData.description.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập mô tả danh mục", variant: "destructive" })
      return false
    }
    return true
  }

  const handleCreateParentCategory = async () => {
    if (!validateForm()) return

    try {
      const response = await apiClient.createParentCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        branch_names: formData.branch_names,
      })

      if (response.status === 0) {
        toast({
          title: "Thành công",
          description: "Tạo danh mục cha thành công",
        })
        setIsCreateParentDialogOpen(false)
        resetForm()
        fetchCategories()
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tạo danh mục cha",
        variant: "destructive",
      })
    }
  }

  const handleCreateChildCategory = async () => {
    if (!selectedParentId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn danh mục cha",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) return

    try {
      const response = await apiClient.createChildCategory(selectedParentId, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        branch_names: formData.branch_names,
      })

      if (response.status === 0) {
        toast({
          title: "Thành công",
          description: "Tạo danh mục con thành công",
        })
        setIsCreateChildDialogOpen(false)
        resetForm()
        setSelectedParentId("")
        fetchCategories()
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tạo danh mục con",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !validateForm()) return

    try {
      let response
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        branch_names: formData.branch_names,
      }

      if (editingType === "parent") {
        response = await apiClient.updateParentCategory(editingCategory.id, categoryData)
      } else {
        response = await apiClient.updateChildCategory(editingCategory.id, categoryData)
      }

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
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật danh mục",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: string, type: "parent" | "child") => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return

    try {
      if (type === "parent") {
        await apiClient.deleteParentCategory(id)
      } else {
        await apiClient.deleteChildCategory(id)
      }

      toast({
        title: "Thành công",
        description: "Xóa danh mục thành công",
      })
      fetchCategories()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa danh mục",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (category: Category, type: "parent" | "child") => {
    setEditingCategory(category)
    setEditingType(type)
    setFormData({
      name: category.name,
      description: category.description,
      branch_names: category.branch_name || [],
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      branch_names: [],
    })
    setNewBrandName("")
  }

  const addBrandName = () => {
    if (newBrandName.trim() && !formData.branch_names.includes(newBrandName.trim())) {
      setFormData((prev) => ({
        ...prev,
        branch_names: [...prev.branch_names, newBrandName.trim()],
      }))
      setNewBrandName("")
    }
  }

  const removeBrandName = (brandName: string) => {
    setFormData((prev) => ({
      ...prev,
      branch_names: prev.branch_names.filter((name) => name !== brandName),
    }))
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
        <TableRow key={category.id} className="hover:bg-gray-50 transition-colors">
          <TableCell>
            <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6 mr-2 hover:bg-blue-100"
                  onClick={() => toggleCategory(category.id)}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <span className="font-medium">{category.name}</span>
              {level === 0 && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                  Cha
                </Badge>
              )}
              {level > 0 && (
                <Badge variant="secondary" className="ml-2 bg-purple-50 text-purple-700">
                  Con
                </Badge>
              )}
            </div>
          </TableCell>
          <TableCell className="max-w-md">
            <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
          </TableCell>
          <TableCell>
            {category.branch_name && category.branch_name.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {category.branch_name.slice(0, 3).map((brand, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700">
                    {brand}
                  </Badge>
                ))}
                {category.branch_name.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
                    +{category.branch_name.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              {level === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedParentId(category.id)
                    resetForm()
                    setIsCreateChildDialogOpen(true)
                  }}
                  className="hover:bg-green-50 hover:border-green-300"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(category, level === 0 ? "parent" : "child")}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteCategory(category.id, level === 0 ? "parent" : "child")}
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && category.children!.map((child) => renderCategoryRow(child, level + 1))}
      </>
    )
  }

  const renderBrandNameForm = () => (
    <div className="space-y-4">
      <Label>Thương hiệu</Label>
      <div className="flex space-x-2">
        <Input
          value={newBrandName}
          onChange={(e) => setNewBrandName(e.target.value)}
          placeholder="Nhập tên thương hiệu"
          className="border-2 focus:border-blue-500"
          onKeyPress={(e) => e.key === "Enter" && addBrandName()}
        />
        <Button type="button" onClick={addBrandName} variant="outline">
          Thêm
        </Button>
      </div>
      {formData.branch_names.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.branch_names.map((brandName, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {brandName}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeBrandName(brandName)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý danh mục
        </h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Dialog open={isCreateParentDialogOpen} onOpenChange={setIsCreateParentDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục cha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tạo danh mục cha mới
                </DialogTitle>
                <DialogDescription>Thêm danh mục sản phẩm cha mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-name">
                    Tên danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="parent-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên danh mục cha"
                    className="border-2 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent-description">
                    Mô tả <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="parent-description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả danh mục cha"
                    className="border-2 focus:border-blue-500 min-h-[100px]"
                  />
                </div>
                {renderBrandNameForm()}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleCreateParentCategory}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  Tạo danh mục cha
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateChildDialogOpen} onOpenChange={setIsCreateChildDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={resetForm}
                className="border-2 hover:bg-green-50 hover:border-green-300 bg-transparent"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Thêm danh mục con
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Tạo danh mục con mới
                </DialogTitle>
                <DialogDescription>Thêm danh mục sản phẩm con mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>
                    Danh mục cha <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                    <SelectTrigger className="border-2 focus:border-blue-500">
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-name">
                    Tên danh mục con <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="child-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên danh mục con"
                    className="border-2 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-description">
                    Mô tả <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="child-description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả danh mục con"
                    className="border-2 focus:border-blue-500 min-h-[100px]"
                  />
                </div>
                {renderBrandNameForm()}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleCreateChildCategory}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  Tạo danh mục con
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-800">Danh sách danh mục</CardTitle>
          <CardDescription>Quản lý danh mục sản phẩm theo cấu trúc phân cấp</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
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
                  <TableHead className="font-semibold">Tên danh mục</TableHead>
                  <TableHead className="font-semibold">Mô tả</TableHead>
                  <TableHead className="font-semibold">Thương hiệu</TableHead>
                  <TableHead className="font-semibold">Thao tác</TableHead>
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
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
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
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chỉnh sửa danh mục {editingType === "parent" ? "cha" : "con"}
            </DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Tên danh mục <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh mục"
                className="border-2 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả danh mục"
                className="border-2 focus:border-blue-500 min-h-[100px]"
              />
            </div>
            {renderBrandNameForm()}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditCategory}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              Cập nhật danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
