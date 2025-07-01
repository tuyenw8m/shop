// Connection Test Utility
const API_URL = 'http://localhost:8888/shop/api/v1';

export interface ConnectionTestResult {
  url: string;
  success: boolean;
  status?: number;
  error?: string;
  responseTime?: number;
}

export const testBackendConnection = async (): Promise<ConnectionTestResult[]> => {
  const results: ConnectionTestResult[] = [];

  // Test 1: Basic connectivity to backend
  try {
    console.log('Đang kiểm tra kết nối cơ bản...');
    const startTime = Date.now();
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const endTime = Date.now();
    
    results.push({
      url: `${API_URL}/products`,
      success: response.ok,
      status: response.status,
      responseTime: endTime - startTime
    });
    
    console.log('Kết quả kiểm tra kết nối cơ bản:', results[0]);
  } catch (error) {
    results.push({
      url: `${API_URL}/products`,
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi không xác định'
    });
    console.error('Kiểm tra kết nối cơ bản thất bại:', error);
  }

  // Test 2: Test with different ports
  const testPorts = [8888, 3000, 8080, 5000];
  for (const port of testPorts) {
    if (port === 8888) continue; // Already tested above
    
    try {
      const testUrl = `http://localhost:${port}/api/v1/products`;
      console.log(`Đang kiểm tra cổng ${port}...`);
      const startTime = Date.now();
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const endTime = Date.now();
      
      results.push({
        url: testUrl,
        success: response.ok,
        status: response.status,
        responseTime: endTime - startTime
      });
    } catch (error) {
      results.push({
        url: `http://localhost:${port}/api/v1/products`,
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }

  // Test 3: Test different base URLs
  const testUrls = [
    'http://localhost:8888/shop/api/v1/products',
    'http://localhost:8888/api/v1/products',
    'http://127.0.0.1:8888/api/v1/products'
  ];

  for (const testUrl of testUrls) {
    if (testUrl === `${API_URL}/products`) continue; // Already tested
    
    try {
      console.log(`Đang kiểm tra URL: ${testUrl}`);
      const startTime = Date.now();
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const endTime = Date.now();
      
      results.push({
        url: testUrl,
        success: response.ok,
        status: response.status,
        responseTime: endTime - startTime
      });
    } catch (error) {
      results.push({
        url: testUrl,
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }

  return results;
};

export const logConnectionResults = (results: ConnectionTestResult[]) => {
  console.log('=== Kết Quả Kiểm Tra Kết Nối ===');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.url}`);
    console.log(`   Thành công: ${result.success}`);
    if (result.status) {
      console.log(`   Trạng thái: ${result.status}`);
    }
    if (result.responseTime) {
      console.log(`   Thời gian phản hồi: ${result.responseTime}ms`);
    }
    if (result.error) {
      console.log(`   Lỗi: ${result.error}`);
    }
    console.log('---');
  });

  // Summary
  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);
  
  console.log('=== Tóm Tắt ===');
  console.log(`Tổng số kiểm tra: ${results.length}`);
  console.log(`Thành công: ${successfulTests.length}`);
  console.log(`Thất bại: ${failedTests.length}`);
  
  if (successfulTests.length > 0) {
    console.log('✅ Backend có thể truy cập được!');
    console.log('URL hoạt động:', successfulTests.map(r => r.url));
  } else {
    console.log('❌ Backend không thể truy cập được');
    console.log('Các vấn đề có thể gặp:');
    console.log('1. Máy chủ backend không đang chạy');
    console.log('2. Số cổng không đúng');
    console.log('3. Vấn đề cấu hình CORS');
    console.log('4. Vấn đề kết nối mạng');
  }
};

// Quick test function
export const quickConnectionTest = async () => {
  console.log('🔍 Bắt đầu kiểm tra kết nối nhanh...');
  const results = await testBackendConnection();
  logConnectionResults(results);
  return results;
}; 