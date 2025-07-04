import axios, { type AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:8888/shop/api/v1";

const buildProductFormData = (productData: any): FormData => {
  const formData = new FormData();

  for (const key of [
    "name",
    "description",
    "technical_specs",
    "highlight_specs",
    "promotions",
    "branch_name",
    "parent_category_id",
  ]) {
    if (productData[key]) {
      formData.append(key, productData[key]);
    }
  }

  // Handle number types that need string conversion
  for (const key of ["price", "stock"]) {
    if (productData[key] !== undefined && productData[key] !== null) {
      formData.append(key, productData[key].toString());
    }
  }

  // Handle array of strings (category_name)
  if (productData.category_name && productData.category_name.length > 0) {
    productData.category_name.forEach((categoryName: string) => {
      formData.append("category_name", categoryName);
    });
  }

  // Handle array of strings (children_categories_id)
  if (
    productData.children_categories_id &&
    productData.children_categories_id.length > 0
  ) {
    productData.children_categories_id.forEach((categoryId: string) => {
      formData.append("children_categories_id", categoryId);
    });
  }

  // Handle image files
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((image: File) => {
      formData.append("image", image);
    });
  }

  return formData;
};

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    // Request interceptor để thêm auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Chỉ thêm token nếu request không phải là login
        if (!config.url?.endsWith("/auth/login")) {
          const token = localStorage.getItem("admin_token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        // Đặt Content-Type mặc định cho các request JSON
        if (
          !(config.data instanceof FormData) &&
          !config.headers["Content-Type"]
        ) {
          config.headers["Content-Type"] = "application/json";
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor để xử lý lỗi
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error("API Error:", error);

        // Logout nếu dính tới lỗi authentication/authorization
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

  // --- API của Products v2 ---
  async getProducts(params?: any) {
    return this.axiosInstance.get("/products/v2", { params });
  }

  async getProduct(id: string) {
    return this.axiosInstance.get(`/products/v2/${id}`);
  }

  async createProduct(productData: any) {
    const formData = buildProductFormData(productData);
    return this.axiosInstance.post("/products/v2/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateProduct(id: string, productData: any) {
    const formData = buildProductFormData(productData);
    return this.axiosInstance.put(`/products/v2/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteProduct(id: string) {
    return this.axiosInstance.delete(`/products/v2/${id}`);
  }

  // --- API phần danh mục v2 ---
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
    return this.axiosInstance.post("/categories/v2/parent", data);
  }

  async createChildCategory(parentId: string, data: any) {
    return this.axiosInstance.post(`/categories/v2/child/${parentId}`, data);
  }

  async updateParentCategory(id: string, data: any) {
    return this.axiosInstance.put(`/categories/v2/parent/${id}`, data);
  }

  async updateChildCategory(id: string, data: any) {
    return this.axiosInstance.put(`/categories/v2/child/${id}`, data);
  }

  async deleteParentCategory(id: string) {
    return this.axiosInstance.delete(`/categories/v2/parent/${id}`);
  }

  async deleteChildCategory(id: string) {
    return this.axiosInstance.delete(`/categories/v2/child/${id}`);
  }

  // --- Orders API ---
  async getOrders(params?: any) {
    return this.axiosInstance.get("/orders/all", { params });
  }

  async getOrder(id: string) {
    return this.axiosInstance.get(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.axiosInstance.put(`/orders/${id}`, { status });
  }

  async cancelOrder(id: string) {
    return this.axiosInstance.delete(`/orders/${id}`);
  }

  // --- Users API ---
  async getUsers(params?: any) {
    return this.axiosInstance.get("/users", { params });
  }

  async getUser(id: string) {
    return this.axiosInstance.get(`/users/${id}`);
  }

  // --- Reviews API ---
  async getProductReviews(productId: string, params?: any) {
    return this.axiosInstance.get(`/products/${productId}/reviews`, { params });
  }

  async deleteReview(id: string) {
    return this.axiosInstance.delete(`/reviews/${id}`);
  }

  // --- Coupons API ---
  async getCoupons(params?: any) {
    return this.axiosInstance.get("/coupons", { params });
  }

  async createCoupon(data: any) {
    return this.axiosInstance.post("/coupons", data);
  }

  async updateCoupon(id: string, data: any) {
    return this.axiosInstance.put(`/coupons/${id}`, data);
  }

  async deleteCoupon(id: string) {
    return this.axiosInstance.delete(`/coupons/${id}`);
  }

  // --- Dashboard API ---
  async getDashboardSummary() {
    return this.axiosInstance.get("/dashboard/summary");
  }

  async getMonthlyRevenue() {
    return this.axiosInstance.get("/dashboard/monthly-revenue");
  }

  // --- Auth API ---
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
