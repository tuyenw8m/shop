// API Test Utility for Backend Integration
const API_URL = 'http://localhost:8888/shop/api/v1';

export interface ApiTestResult {
  endpoint: string;
  method: string;
  success: boolean;
  status: number;
  response?: unknown;
  error?: string;
}

export interface ProfileTestData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface PasswordTestData {
  currentPassword: string;
  newPassword: string;
}

export const testApiEndpoints = async (token?: string): Promise<ApiTestResult[]> => {
  const results: ApiTestResult[] = [];

  // Test 1: Get Products (Public)
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    results.push({
      endpoint: '/products',
      method: 'GET',
      success: response.ok,
      status: response.status,
      response: data
    });
  } catch (error) {
    results.push({
      endpoint: '/products',
      method: 'GET',
      success: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Lỗi không xác định'
    });
  }

  // Test 2: Get Categories (Public)
  try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    results.push({
      endpoint: '/categories',
      method: 'GET',
      success: response.ok,
      status: response.status,
      response: data
    });
  } catch (error) {
    results.push({
      endpoint: '/categories',
      method: 'GET',
      success: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Lỗi không xác định'
    });
  }

  // Test 3: Get User Profile (Authenticated)
  if (token) {
    try {
      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      results.push({
        endpoint: '/user/me',
        method: 'GET',
        success: response.ok,
        status: response.status,
        response: data
      });
    } catch (error) {
      results.push({
        endpoint: '/user/me',
        method: 'GET',
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }

  // Test 4: Get Cart (Authenticated)
  if (token) {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      results.push({
        endpoint: '/cart',
        method: 'GET',
        success: response.ok,
        status: response.status,
        response: data
      });
    } catch (error) {
      results.push({
        endpoint: '/cart',
        method: 'GET',
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }

  // Test 5: Get Orders (Authenticated)
  if (token) {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      results.push({
        endpoint: '/orders',
        method: 'GET',
        success: response.ok,
        status: response.status,
        response: data
      });
    } catch (error) {
      results.push({
        endpoint: '/orders',
        method: 'GET',
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }

  return results;
};

export const testProfileUpdate = async (token: string, testData: ProfileTestData): Promise<ApiTestResult> => {
  try {
    const response = await fetch(`${API_URL}/user/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    const data = await response.json();
    return {
      endpoint: '/user/me',
      method: 'PUT',
      success: response.ok,
      status: response.status,
      response: data
    };
  } catch (error) {
    return {
      endpoint: '/user/me',
      method: 'PUT',
      success: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Lỗi không xác định'
    };
  }
};

export const testPasswordChange = async (token: string, passwordData: PasswordTestData): Promise<ApiTestResult> => {
  try {
    const response = await fetch(`${API_URL}/user/change-password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
    const data = await response.json();
    return {
      endpoint: '/user/change-password',
      method: 'POST',
      success: response.ok,
      status: response.status,
      response: data
    };
  } catch (error) {
    return {
      endpoint: '/user/change-password',
      method: 'POST',
      success: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Lỗi không xác định'
    };
  }
};

// Console logging utility for debugging
export const logApiResults = (results: ApiTestResult[]) => {
  console.log('=== Kết Quả Kiểm Tra API ===');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.method} ${result.endpoint}`);
    console.log(`   Trạng thái: ${result.status}`);
    console.log(`   Thành công: ${result.success}`);
    if (result.error) {
      console.log(`   Lỗi: ${result.error}`);
    } else if (result.response) {
      const response = result.response as { status?: number; data?: unknown };
      console.log(`   Trạng thái phản hồi: ${response.status}`);
      console.log(`   Dữ liệu phản hồi:`, response.data);
    }
    console.log('---');
  });
}; 