"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Edit, Trash2, Upload, X, ImageIcon } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  technical_specs: string;
  highlight_specs: string;
  stock: number;
  image_url: string[];
  parent_category_name: string;
  children_category_name: string[];
  category_name: string[];
  sold: number;
  original_price: number;
  promotions: string;
  features: string;
  branch_name: string;
  rating?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  children?: Category[];
  branch_name?: string[];
}

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  technical_specs: string;
  highlight_specs: string;
  stock: string;
  parent_category_id: string;
  children_categories_id: string[];
  category_name: string[];
  promotions: string;
  branch_name: string;
  images: File[];
  existingImages: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortType, setSortType] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    technical_specs: "",
    highlight_specs: "",
    stock: "",
    parent_category_id: "",
    children_categories_id: [],
    category_name: [],
    promotions: "",
    branch_name: "",
    images: [],
    existingImages: [],
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Fetch data functions
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.pageNumber,
        limit: pagination.pageSize,
        ...(searchTerm && { name: searchTerm }),
        ...(selectedCategory &&
          selectedCategory !== "all" && {
            parent_category_name: selectedCategory,
          }),
        ...(sortBy && { sort_by: sortBy }),
        ...(sortType && { sort_type: sortType }),
      };

      const response = await apiClient.getProducts(params);

      if (response.status === 0) {
        setProducts(response.data.content || []);
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
        }));
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message || "Không thể tải danh sách sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.pageNumber,
    pagination.pageSize,
    searchTerm,
    selectedCategory,
    sortBy,
    sortType,
    toast,
  ]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.getCategories();
      if (response.status === 0) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  // Fetch child categories and brands when parent category changes
  const fetchChildCategoriesAndBrands = useCallback(
    async (parentId: string) => {
      try {
        const parent = categories.find((cat) => cat.id === parentId);
        if (parent?.children) {
          setChildCategories(parent.children);

          // Collect all brands from child categories
          const allBrands = new Set<string>();
          for (const child of parent.children) {
            try {
              const childResponse = await apiClient.getChildCategory(child.id);
              if (
                childResponse.status === 0 &&
                childResponse.data.branch_name
              ) {
                childResponse.data.branch_name.forEach((brand: string) =>
                  allBrands.add(brand)
                );
              }
            } catch (error) {
              console.error(
                `Failed to fetch child category ${child.id}:`,
                error
              );
            }
          }
          setAvailableBrands(Array.from(allBrands));
        }
      } catch (error) {
        console.error("Failed to fetch child categories:", error);
      }
    },
    [categories]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (formData.parent_category_id) {
      fetchChildCategoriesAndBrands(formData.parent_category_id);
    }
  }, [formData.parent_category_id, fetchChildCategoriesAndBrands]);

  // Image handling functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Lỗi",
          description: `File ${file.name} không phải là hình ảnh`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "Lỗi",
          description: `File ${file.name} quá lớn (tối đa 10MB)`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  // Form handling functions
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      technical_specs: "",
      highlight_specs: "",
      stock: "",
      parent_category_id: "",
      children_categories_id: [],
      category_name: [],
      promotions: "",
      branch_name: "",
      images: [],
      existingImages: [],
    });
    setImagePreviewUrls([]);
    setChildCategories([]);
    setAvailableBrands([]);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên sản phẩm",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập giá hợp lệ",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mô tả sản phẩm",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.stock || Number.parseInt(formData.stock) < 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số lượng tồn kho hợp lệ",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.parent_category_id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn danh mục cha",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.branch_name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn thương hiệu",
        variant: "destructive",
      });
      return false;
    }
    if (
      formData.images.length === 0 &&
      formData.existingImages.length === 0 &&
      !editingProduct
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 1 hình ảnh",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) return;

    try {
      const productData = {
        name: formData.name.trim(),
        price: Number.parseFloat(formData.price),
        description: formData.description.trim(),
        technical_specs: formData.technical_specs.trim(),
        highlight_specs: formData.highlight_specs.trim(),
        stock: Number.parseInt(formData.stock),
        promotions: formData.promotions.trim(),
        parent_category_id: formData.parent_category_id,
        branch_name: formData.branch_name.trim(),
        children_categories_id: formData.children_categories_id,
        category_name: formData.category_name,
        images: formData.images,
      };

      const response = await apiClient.createProduct(productData);

      if (response.status === 0) {
        toast({
          title: "Thành công",
          description: "Tạo sản phẩm thành công",
        });
        setIsCreateDialogOpen(false);
        resetForm();
        fetchProducts();
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tạo sản phẩm",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct || !validateForm()) return;

    try {
      const productData = {
        name: formData.name.trim(),
        price: Number.parseFloat(formData.price),
        description: formData.description.trim(),
        technical_specs: formData.technical_specs.trim(),
        highlight_specs: formData.highlight_specs.trim(),
        stock: Number.parseInt(formData.stock),
        promotions: formData.promotions.trim(),
        parent_category_id: formData.parent_category_id,
        branch_name: formData.branch_name.trim(),
        children_categories_id: formData.children_categories_id,
        category_name: formData.category_name,
        images: formData.images, // Only new images
      };

      const response = await apiClient.updateProduct(
        editingProduct.id,
        productData
      );

      if (response.status === 0) {
        toast({
          title: "Thành công",
          description: "Cập nhật sản phẩm thành công",
        });
        setIsEditDialogOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message || "Không thể cập nhật sản phẩm",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await apiClient.deleteProduct(id);
      toast({
        title: "Thành công",
        description: "Xóa sản phẩm thành công",
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa sản phẩm",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = async (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      technical_specs: product.technical_specs || "",
      highlight_specs: product.highlight_specs || "",
      stock: product.stock.toString(),
      parent_category_id: "",
      children_categories_id: [],
      category_name: product.category_name || [],
      promotions: product.promotions || "",
      branch_name: product.branch_name,
      images: [],
      existingImages: product.image_url || [],
    });
    setImagePreviewUrls([]);
    setIsEditDialogOpen(true);
  };

  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleParentCategoryChange = (parentId: string) => {
    setFormData((prev) => ({
      ...prev,
      parent_category_id: parentId,
      children_categories_id: [], // Reset children when parent changes
      category_name: [], // Reset category names
      branch_name: "", // Reset brand
    }));
  };

  const handleChildCategoryChange = (childId: string, checked: boolean) => {
    const child = childCategories.find((c) => c.id === childId);
    if (!child) return;

    setFormData((prev) => ({
      ...prev,
      children_categories_id: checked
        ? [...prev.children_categories_id, childId]
        : prev.children_categories_id.filter((id) => id !== childId),
      category_name: checked
        ? [...prev.category_name, child.name]
        : prev.category_name.filter((name) => name !== child.name),
    }));
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý sản phẩm
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tạo sản phẩm mới
              </DialogTitle>
              <DialogDescription>
                Thêm sản phẩm mới vào kho hàng
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nhập tên sản phẩm"
                    className="border-2 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Giá bán <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="0"
                    className="border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  Số lượng tồn kho <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, stock: e.target.value }))
                  }
                  placeholder="0"
                  className="border-2 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Mô tả sản phẩm"
                  className="border-2 focus:border-blue-500 min-h-[100px]"
                />
              </div>

              {/* Technical Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technical_specs">Thông số kỹ thuật</Label>
                  <Textarea
                    id="technical_specs"
                    value={formData.technical_specs}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        technical_specs: e.target.value,
                      }))
                    }
                    placeholder="Thông số kỹ thuật"
                    className="border-2 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highlight_specs">Tính năng nổi bật</Label>
                  <Textarea
                    id="highlight_specs"
                    value={formData.highlight_specs}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        highlight_specs: e.target.value,
                      }))
                    }
                    placeholder="Tính năng nổi bật"
                    className="border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Promotions */}
              <div className="space-y-2">
                <Label htmlFor="promotions">Khuyến mãi</Label>
                <Textarea
                  id="promotions"
                  value={formData.promotions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      promotions: e.target.value,
                    }))
                  }
                  placeholder="Thông tin khuyến mãi"
                  className="border-2 focus:border-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Danh mục cha <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.parent_category_id}
                    onValueChange={handleParentCategoryChange}
                  >
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

                {childCategories.length > 0 && (
                  <div className="space-y-2">
                    <Label>Danh mục con (có thể chọn nhiều)</Label>
                    <div className="border-2 border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {childCategories.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`child-${child.id}`}
                              checked={formData.children_categories_id.includes(
                                child.id
                              )}
                              onCheckedChange={(checked) =>
                                handleChildCategoryChange(
                                  child.id,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`child-${child.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {child.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {availableBrands.length > 0 && (
                  <div className="space-y-2">
                    <Label>
                      Thương hiệu <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.branch_name}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, branch_name: value }))
                      }
                    >
                      <SelectTrigger className="border-2 focus:border-blue-500">
                        <SelectValue placeholder="Chọn thương hiệu" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="space-y-4">
                <Label>
                  Hình ảnh sản phẩm <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600">
                      Nhấp để chọn hình ảnh hoặc kéo thả vào đây
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF tối đa 10MB mỗi file
                    </p>
                  </label>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateProduct}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                Tạo sản phẩm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-800">
            Danh sách sản phẩm
          </CardTitle>
          <CardDescription>Quản lý kho hàng sản phẩm</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-blue-500"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[200px] border-2 focus:border-blue-500">
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[150px] border-2 focus:border-blue-500">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Giá</SelectItem>
                <SelectItem value="stock">Tồn kho</SelectItem>
                <SelectItem value="sold">Đã bán</SelectItem>
                <SelectItem value="rating">Đánh giá</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortType} onValueChange={setSortType}>
              <SelectTrigger className="w-full md:w-[120px] border-2 focus:border-blue-500">
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Tăng dần</SelectItem>
                <SelectItem value="desc">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border-2 border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableRow>
                  <TableHead className="font-semibold">Sản phẩm</TableHead>
                  <TableHead className="font-semibold">Danh mục</TableHead>
                  <TableHead className="font-semibold">Giá bán</TableHead>
                  <TableHead className="font-semibold">Tồn kho</TableHead>
                  <TableHead className="font-semibold">Đã bán</TableHead>
                  <TableHead className="font-semibold">Đánh giá</TableHead>
                  <TableHead className="font-semibold">Thương hiệu</TableHead>
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
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      Không tìm thấy sản phẩm
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.image_url && product.image_url[0] ? (
                            <img
                              src={product.image_url[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description?.substring(0, 50)}
                              {product.description?.length > 50 ? "..." : ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {product.parent_category_name}
                          </Badge>
                          <div className="flex flex-wrap gap-1">
                            {product.children_category_name?.map(
                              (category, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-purple-50 text-purple-700"
                                >
                                  {category}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-green-600">
                            {formatPrice(product.price)}
                          </div>
                          {product.original_price &&
                            product.original_price !== product.price && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(product.original_price)}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock > 10 ? "default" : "destructive"
                          }
                          className={
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-blue-600">
                          {product.sold || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-1">⭐</span>
                          <span className="font-medium">
                            {product.rating || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700"
                        >
                          {product.branch_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
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
              Hiển thị {(pagination.pageNumber - 1) * pagination.pageSize + 1}{" "}
              đến{" "}
              {Math.min(
                pagination.pageNumber * pagination.pageSize,
                pagination.totalElements
              )}{" "}
              trong tổng số {pagination.totalElements} sản phẩm
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageNumber: prev.pageNumber - 1,
                  }))
                }
                disabled={pagination.pageNumber <= 1}
                className="hover:bg-blue-50"
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageNumber: prev.pageNumber + 1,
                  }))
                }
                disabled={pagination.pageNumber >= pagination.totalPages}
                className="hover:bg-blue-50"
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chỉnh sửa sản phẩm
            </DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên sản phẩm"
                  className="border-2 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">
                  Giá bán <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0"
                  className="border-2 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
                }
                placeholder="0"
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả sản phẩm"
                className="border-2 focus:border-blue-500 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-technical_specs">Thông số kỹ thuật</Label>
                <Textarea
                  id="edit-technical_specs"
                  value={formData.technical_specs}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      technical_specs: e.target.value,
                    }))
                  }
                  placeholder="Thông số kỹ thuật"
                  className="border-2 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-highlight_specs">Tính năng nổi bật</Label>
                <Textarea
                  id="edit-highlight_specs"
                  value={formData.highlight_specs}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      highlight_specs: e.target.value,
                    }))
                  }
                  placeholder="Tính năng nổi bật"
                  className="border-2 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-promotions">Khuyến mãi</Label>
              <Textarea
                id="edit-promotions"
                value={formData.promotions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    promotions: e.target.value,
                  }))
                }
                placeholder="Thông tin khuyến mãi"
                className="border-2 focus:border-blue-500"
              />
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Danh mục cha <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.parent_category_id}
                  onValueChange={handleParentCategoryChange}
                >
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

              {childCategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Danh mục con (có thể chọn nhiều)</Label>
                  <div className="border-2 border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <div className="space-y-2">
                      {childCategories.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`edit-child-${child.id}`}
                            checked={formData.children_categories_id.includes(
                              child.id
                            )}
                            onCheckedChange={(checked) =>
                              handleChildCategoryChange(
                                child.id,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`edit-child-${child.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {child.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {availableBrands.length > 0 && (
                <div className="space-y-2">
                  <Label>
                    Thương hiệu <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.branch_name}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, branch_name: value }))
                    }
                  >
                    <SelectTrigger className="border-2 focus:border-blue-500">
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Images - Existing and New */}
            <div className="space-y-4">
              <Label>Hình ảnh sản phẩm</Label>

              {/* Existing Images */}
              {formData.existingImages.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600">
                    Hình ảnh hiện có
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {formData.existingImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="edit-image-upload"
                />
                <label htmlFor="edit-image-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    Nhấp để thêm hình ảnh mới
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF tối đa 10MB mỗi file
                  </p>
                </label>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600">Hình ảnh mới</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`New Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditProduct}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              Cập nhật sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
