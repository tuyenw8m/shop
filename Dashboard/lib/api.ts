const API_BASE_URL = "http://localhost:8888/shop/api/v1"

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("admin_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Products API v2
  async getProducts(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/products/v2${queryString ? `?${queryString}` : ""}`)
  }

  async getProduct(id: string) {
    return this.request(`/products/v2/${id}`)
  }

  async createProduct(data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          formData.append(`${key}`, v);
        });
      } else {
        formData.append(key, value);
      }
    });
    return fetch(`${API_BASE_URL}/products/v2`, {
      method: "POST",
      headers: {
        ...(localStorage.getItem("admin_token") && { Authorization: `Bearer ${localStorage.getItem("admin_token")}` })
      },
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "API request failed");
      return data;
    });
  }

  async updateProduct(id: string, data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          formData.append(`${key}`, v);
        });
      } else {
        formData.append(key, value);
      }
    });
    return fetch(`${API_BASE_URL}/products/v2/${id}`, {
      method: "PUT",
      headers: {
        ...(localStorage.getItem("admin_token") && { Authorization: `Bearer ${localStorage.getItem("admin_token")}` })
      },
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "API request failed");
      return data;
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/v2/${id}`, {
      method: "DELETE",
    })
  }

  // Categories API v2
  async getCategories(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/categories/v2${queryString ? `?${queryString}` : ""}`)
  }

  async getParentCategories(id: string) {
    return this.request(`/categories/v2/parent/${id}`)
  }

  async getChildCategories(id: string) {
    return this.request(`/categories/v2/child/${id}`)
  }

  async getCategory(id: string) {
    return this.request(`/categories/v2/${id}`)
  }

  async createCategory(data: any) {
    return this.request("/categories/v2", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: string, data: any) {
    return this.request(`/categories/v2/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/v2/${id}`, {
      method: "DELETE",
    })
  }

  // Orders API
  async getOrders(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/orders${queryString ? `?${queryString}` : ""}`)
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`)
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  async cancelOrder(id: string) {
    return this.request(`/orders/${id}`, {
      method: "DELETE",
    })
  }

  // Users API
  async getUsers(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/users${queryString ? `?${queryString}` : ""}`)
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`)
  }

  // Reviews API
  async getProductReviews(productId: string, params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`)
  }

  async deleteReview(id: string) {
    return this.request(`/reviews/${id}`, {
      method: "DELETE",
    })
  }

  // Coupons API
  async getCoupons(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/coupons${queryString ? `?${queryString}` : ""}`)
  }

  async createCoupon(data: any) {
    return this.request("/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCoupon(id: string, data: any) {
    return this.request(`/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCoupon(id: string) {
    return this.request(`/coupons/${id}`, {
      method: "DELETE",
    })
  }

  // Dashboard Summary API
  async getDashboardSummary() {
    return this.request('/dashboard/summary');
  }

  async getMonthlyRevenue() {
    return this.request('/dashboard/monthly-revenue');
  }
}

export const apiClient = new ApiClient()
