import axios, { type AxiosInstance } from "axios";

const API_BASE_URL = "http://localhost:8888/shop/api/v1";

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    // Request interceptor thêm auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor xử lý lỗi
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error("API Error:", error);

        // Logout nếu dính tới auth
        if (
          error.response?.status === 401 &&
          error.response?.data?.message?.includes("token")
        ) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    );
  }

  // API của Products v2
  async getProducts(params?: any) {
    return this.axiosInstance.get("/products/v2", { params });
  }

  async getProduct(id: string) {
    return this.axiosInstance.get(`/products/v2/${id}`);
  }

  async createProduct(productData: any) {
    const formData = new FormData();

    if (productData.name) formData.append("name", productData.name);
    if (productData.price)
      formData.append("price", productData.price.toString());
    if (productData.description)
      formData.append("description", productData.description);
    if (productData.technical_specs)
      formData.append("technical_specs", productData.technical_specs);
    if (productData.highlight_specs)
      formData.append("highlight_specs", productData.highlight_specs);
    if (productData.stock)
      formData.append("stock", productData.stock.toString());
    if (productData.promotions)
      formData.append("promotions", productData.promotions);
    if (productData.branch_name)
      formData.append("branch_name", productData.branch_name);
    if (productData.parent_category_id)
      formData.append("parent_category_id", productData.parent_category_id);

    // Xử lý phần category_name thành mảng array
    if (productData.category_name && productData.category_name.length > 0) {
      productData.category_name.forEach((categoryName: string) => {
        formData.append("category_name", categoryName);
      });
    }

    // Xử lý children_categories_id array (dùng id)
    if (
      productData.children_categories_id &&
      productData.children_categories_id.length > 0
    ) {
      productData.children_categories_id.forEach((categoryId: string) => {
        formData.append("children_categories_id", categoryId);
      });
    }

    // Handle images - field name là "image" theo Java class
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image: File) => {
        formData.append("image", image);
      });
    }

    return this.axiosInstance.post("/products/v2/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateProduct(id: string, productData: any) {
    const formData = new FormData();

    if (productData.name) formData.append("name", productData.name);
    if (productData.price)
      formData.append("price", productData.price.toString());
    if (productData.description)
      formData.append("description", productData.description);
    if (productData.technical_specs)
      formData.append("technical_specs", productData.technical_specs);
    if (productData.highlight_specs)
      formData.append("highlight_specs", productData.highlight_specs);
    if (productData.stock)
      formData.append("stock", productData.stock.toString());
    if (productData.promotions)
      formData.append("promotions", productData.promotions);
    if (productData.branch_name)
      formData.append("branch_name", productData.branch_name);
    if (productData.parent_category_id)
      formData.append("parent_category_id", productData.parent_category_id);

    if (productData.category_name && productData.category_name.length > 0) {
      productData.category_name.forEach((categoryName: string) => {
        formData.append("category_name", categoryName);
      });
    }

    if (
      productData.children_categories_id &&
      productData.children_categories_id.length > 0
    ) {
      productData.children_categories_id.forEach((categoryId: string) => {
        formData.append("children_categories_id", categoryId);
      });
    }

    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image: File) => {
        formData.append("image", image);
      });
    }

    return this.axiosInstance.put(`/products/v2/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteProduct(id: string) {
    return this.axiosInstance.delete(`/products/v2/${id}`);
  }

  // API phần danh mục v2
  async getCategories(params?: any) {
    return this.axiosInstance.get("/categories/v2", { params });
  }

  async getParentCategory(id: string) {
    return this.axiosInstance.get(`/categories/v2/parent/${id}`);
  }

  async getChildCategory(id: string) {
    return this.axiosInstance.get(`/categories/v2/child/${id}`);
  }

  async createParentCategory(data: any) {
    return this.axiosInstance.post("/categories/v2/parent", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createChildCategory(parentId: string, data: any) {
    return this.axiosInstance.post(`/categories/v2/child/${parentId}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async updateParentCategory(id: string, data: any) {
    return this.axiosInstance.put(`/categories/v2/parent/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async updateChildCategory(id: string, data: any) {
    return this.axiosInstance.put(`/categories/v2/child/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async deleteParentCategory(id: string) {
    return this.axiosInstance.delete(`/categories/v2/parent/${id}`);
  }

  async deleteChildCategory(id: string) {
    return this.axiosInstance.delete(`/categories/v2/child/${id}`);
  }

  // Orders API lấy tất cả
  async getOrders(params?: any) {
    const token = localStorage.getItem("admin_token");
    return this.axiosInstance.get("/orders/all", {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getOrder(id: string) {
    return this.axiosInstance.get(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.axiosInstance.put(
      `/orders/${id}`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async cancelOrder(id: string) {
    return this.axiosInstance.delete(`/orders/${id}`);
  }

  // Users API
  async getUsers(params?: any) {
    return this.axiosInstance.get("/users", { params });
  }

  async getUser(id: string) {
    return this.axiosInstance.get(`/users/${id}`);
  }

  // Reviews API (chưa làm xong)
  async getProductReviews(productId: string, params?: any) {
    return this.axiosInstance.get(`/products/${productId}/reviews`, { params });
  }

  async deleteReview(id: string) {
    return this.axiosInstance.delete(`/reviews/${id}`);
  }

  async getCoupons(params?: any) {
    return this.axiosInstance.get("/coupons", { params });
  }

  async createCoupon(data: any) {
    return this.axiosInstance.post("/coupons", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async updateCoupon(id: string, data: any) {
    return this.axiosInstance.put(`/coupons/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async deleteCoupon(id: string) {
    return this.axiosInstance.delete(`/coupons/${id}`);
  }

  // Dashboard API - Vừa mock vừa call API
  async getDashboardSummary() {
    const token = localStorage.getItem("admin_token");
    console.log(token);
    return this.axiosInstance.get("/dashboard/summary", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getMonthlyRevenue() {
    const token = localStorage.getItem("admin_token");
    return this.axiosInstance.get("/dashboard/monthly-revenue", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Auth API
  async login(email: string, password: string) {
    return axios.post(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export const apiClient = new ApiClient();
