"use client";
import { useState, useEffect } from "react";
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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortType, setSortType] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    technical_specs: "",
    highlight_specs: "",
    stock: "",
    parent_category_name: "",
    children_category_name: [] as string[],
    image_url: [] as string[],
    image_files: [] as File[],
    original_price: "",
    promotions: "",
    features: "",
    branch_name: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [pagination.pageNumber, searchTerm, selectedCategory, sortBy, sortType]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.pageNumber,
        size: pagination.pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory &&
          selectedCategory !== "all" && {
          parent_category_name: selectedCategory,
        }),
        ...(sortBy && { sort_by: sortBy }),
        ...(sortType && { sort_type: sortType }),
      };
      const response = await apiClient.getProducts(params);
      if (response.status === 0) {
        setProducts(response.data.content);
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }));
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      if (response.status === 0) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  const handleCreateProduct = async () => {
    try {
      const productData: any = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        original_price: Number.parseFloat(formData.original_price),
      };
      // Chuẩn hóa image_url: nếu là file, truyền file, nếu là url, truyền url
      if (formData.image_url && formData.image_url.length > 0) {
        productData.image_url = formData.image_url;
      }
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
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo sản phẩm",
        variant: "destructive",
      });
    }
  };
  const handleEditProduct = async () => {
    if (!editingProduct) return;
    try {
      const productData: any = {
        name: formData.name,
        price: Number.parseFloat(formData.price),
        description: formData.description,
        technical_specs: formData.technical_specs,
        highlight_specs: formData.highlight_specs,
        stock: Number.parseInt(formData.stock),
        promotions: formData.promotions,
        category_name: formData.category_name || [],
        parent_category_id: formData.parent_category_id || "",
        children_categories_id: formData.children_category_name || [],
        branch_name: formData.branch_name,
      };
      // Chỉ gửi image nếu có file
      if (formData.image_files && formData.image_files.length > 0) {
        productData.image = formData.image_files;
      }
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
    } catch (error) {
      console.error("API Error during product update:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật sản phẩm",
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
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
        variant: "destructive",
      });
    }
  };
  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      technical_specs: product.technical_specs,
      highlight_specs: product.highlight_specs,
      stock: product.stock.toString(),
      parent_category_name: product.parent_category_name,
      children_category_name: product.children_category_name,
      image_url: product.image_url,
      image_files: [],
      original_price: product.original_price.toString(),
      promotions: product.promotions,
      features: product.features,
      branch_name: product.branch_name,
    });
    setIsEditDialogOpen(true);
  };
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      technical_specs: "",
      highlight_specs: "",
      stock: "",
      parent_category_name: "",
      children_category_name: [],
      image_url: [],
      image_files: [],
      original_price: "",
      promotions: "",
      features: "",
      branch_name: "",
    });
  };
  const addImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: [...prev.image_url, ""],
    }));
  };
  const updateImageUrl = (index: number, url: string) => {
    setFormData((prev) => ({
      ...prev,
      image_url: prev.image_url.map((img, i) => (i === index ? url : img)),
    }));
  };
  const removeImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image_url: prev.image_url.filter((_, i) => i !== index),
    }));
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo sản phẩm mới</DialogTitle>
              <DialogDescription>
                Thêm sản phẩm mới vào kho hàng
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên sản phẩm</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá bán</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="original_price">Giá gốc</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        original_price: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Số lượng tồn kho</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
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
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="features">Đặc điểm</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        features: e.target.value,
                      }))
                    }
                    placeholder="Đặc điểm sản phẩm"
                  />
                </div>
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
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Danh mục cha</Label>
                  <Select
                    value={formData.parent_category_name}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        parent_category_name: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch_name">Thương hiệu</Label>
                  <Input
                    id="branch_name"
                    value={formData.branch_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        branch_name: e.target.value,
                      }))
                    }
                    placeholder="Tên thương hiệu"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hình ảnh sản phẩm</Label>
                {formData.image_url.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="URL hình ảnh"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImageUrl(index)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImageUrl}
                >
                  Thêm hình ảnh
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateProduct}>
                Tạo sản phẩm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>Quản lý kho hàng sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
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
              <SelectTrigger className="w-[150px]">
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
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Tăng dần</SelectItem>
                <SelectItem value="desc">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Đã bán</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không tìm thấy sản phẩm
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.image_url && product.image_url[0] && (
                            <img
                              src={product.image_url[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">
                            {product.parent_category_name}
                          </Badge>
                          <div className="flex flex-wrap gap-1">
                            {product.children_category_name.map(
                              (category, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
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
                          <div className="font-medium">
                            {formatPrice(product.price)}
                          </div>
                          {product.original_price !== product.price && (
                            <div className="text-sm text-muted-foreground line-through">
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
                        >
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.sold || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-1"> ⭐ </span>
                          {product.rating || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.branch_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
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
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {pagination.pageNumber * pagination.pageSize + 1} đến{" "}
              {Math.min(
                (pagination.pageNumber + 1) * pagination.pageSize,
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
                disabled={pagination.pageNumber <= 0}
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
                disabled={pagination.pageNumber >= pagination.totalPages - 1}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sửa thông tin sản phẩm</DialogTitle>
            <DialogDescription>
              Chỉnh sửa chi tiết sản phẩm. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên sản phẩm</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Giá bán</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-original_price">Giá gốc</Label>
                <Input
                  id="edit-original_price"
                  name="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      original_price: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Số lượng tồn kho</Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả sản phẩm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-technical_specs">Thông số kỹ thuật</Label>
                <Textarea
                  id="edit-technical_specs"
                  name="technical_specs"
                  value={formData.technical_specs}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      technical_specs: e.target.value,
                    }))
                  }
                  placeholder="Thông số kỹ thuật"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-highlight_specs">Tính năng nổi bật</Label>
                <Textarea
                  id="edit-highlight_specs"
                  name="highlight_specs"
                  value={formData.highlight_specs}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      highlight_specs: e.target.value,
                    }))
                  }
                  placeholder="Tính năng nổi bật"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-features">Đặc điểm</Label>
                <Textarea
                  id="edit-features"
                  name="features"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      features: e.target.value,
                    }))
                  }
                  placeholder="Đặc điểm sản phẩm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-promotions">Khuyến mãi</Label>
                <Textarea
                  id="edit-promotions"
                  name="promotions"
                  value={formData.promotions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      promotions: e.target.value,
                    }))
                  }
                  placeholder="Thông tin khuyến mãi"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-parent_category_name">Danh mục cha</Label>
                <Select
                  value={formData.parent_category_name}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      parent_category_name: value,
                    }))
                  }
                >
                  <SelectTrigger id="edit-parent_category_name">
                    <SelectValue placeholder="Chọn danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-branch_name">Thương hiệu</Label>
                <Input
                  id="edit-branch_name"
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      branch_name: e.target.value,
                    }))
                  }
                  placeholder="Tên thương hiệu"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ảnh sản phẩm (có thể chọn nhiều)</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={e => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  setFormData(prev => ({ ...prev, image_files: files }));
                }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.image_url && formData.image_url.map((url, idx) => (
                  <img key={idx} src={url} alt="Ảnh sản phẩm" className="h-16 w-16 object-cover rounded" />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditProduct}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
