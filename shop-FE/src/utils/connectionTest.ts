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
    console.log('Testing basic connectivity...');
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
    
    console.log('Basic connectivity test result:', results[0]);
  } catch (error) {
    results.push({
      url: `${API_URL}/products`,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    console.error('Basic connectivity test failed:', error);
  }

  // Test 2: Test with different ports
  const testPorts = [8888, 3000, 8080, 5000];
  for (const port of testPorts) {
    if (port === 8888) continue; // Already tested above
    
    try {
      const testUrl = `http://localhost:${port}/api/v1/products`;
      console.log(`Testing port ${port}...`);
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
        error: error instanceof Error ? error.message : 'Unknown error'
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
      console.log(`Testing URL: ${testUrl}`);
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
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
};

export const logConnectionResults = (results: ConnectionTestResult[]) => {
  console.log('=== Connection Test Results ===');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.url}`);
    console.log(`   Success: ${result.success}`);
    if (result.status) {
      console.log(`   Status: ${result.status}`);
    }
    if (result.responseTime) {
      console.log(`   Response Time: ${result.responseTime}ms`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('---');
  });

  // Summary
  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);
  
  console.log('=== Summary ===');
  console.log(`Total tests: ${results.length}`);
  console.log(`Successful: ${successfulTests.length}`);
  console.log(`Failed: ${failedTests.length}`);
  
  if (successfulTests.length > 0) {
    console.log('✅ Backend is reachable!');
    console.log('Working URLs:', successfulTests.map(r => r.url));
  } else {
    console.log('❌ Backend is not reachable');
    console.log('Possible issues:');
    console.log('1. Backend server is not running');
    console.log('2. Wrong port number');
    console.log('3. CORS configuration issue');
    console.log('4. Network connectivity problem');
  }
};

// Quick test function
export const quickConnectionTest = async () => {
  console.log('🔍 Starting quick connection test...');
  const results = await testBackendConnection();
  logConnectionResults(results);
  return results;
}; 