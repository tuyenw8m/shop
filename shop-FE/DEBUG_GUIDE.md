# 🔧 Debug Guide - "Failed to fetch" Error

## ✅ **GIẢI PHÁP ĐÃ TÌM THẤY**

**Backend URL chính xác:** `http://localhost:8888/shop/api/v1`

**Cập nhật trong code:**

```javascript
const API_URL = 'http://localhost:8888/shop/api/v1'
```

## 🚨 Vấn đề: "Failed to fetch"

Lỗi này xảy ra khi frontend không thể kết nối được với backend. Dưới đây là các bước debug:

## 📋 Checklist Debug

### 1. **Kiểm tra Backend Server**

```bash
# Kiểm tra xem backend có đang chạy không
curl http://localhost:8888/shop/api/v1/products

# Hoặc mở browser và truy cập
http://localhost:8888/shop/api/v1/products
```

### 2. **Kiểm tra Port và URL**

- **Backend URL chính xác:** `http://localhost:8888/shop/api/v1`
- **Kiểm tra port 8888 có đang được sử dụng:**

```bash
# Windows
netstat -ano | findstr :8888

# Mac/Linux
lsof -i :8888
```

### 3. **Test các URL khác nhau**

Mở browser console và chạy:

```javascript
// Test 1: URL chính xác (HOẠT ĐỘNG)
fetch('http://localhost:8888/shop/api/v1/products')
  .then((response) => console.log('✅ Success:', response.status))
  .catch((error) => console.log('❌ Error:', error.message))

// Test 2: URL sai (KHÔNG HOẠT ĐỘNG)
fetch('http://localhost:8888/api/v1/products')
  .then((response) => console.log('✅ Success:', response.status))
  .catch((error) => console.log('❌ Error:', error.message))
```

### 4. **Kiểm tra CORS**

Nếu backend đang chạy nhưng vẫn lỗi, có thể là vấn đề CORS:

```javascript
// Test với mode 'no-cors'
fetch('http://localhost:8888/api/v1/products', {
  mode: 'no-cors'
})
  .then((response) => console.log('Response:', response))
  .catch((error) => console.log('Error:', error))
```

## 🔍 Các nguyên nhân phổ biến

### ❌ **Backend không chạy**

**Triệu chứng:** Tất cả requests đều fail
**Giải pháp:**

1. Khởi động backend server
2. Kiểm tra logs backend

### ❌ **Sai port**

**Triệu chứng:** Connection refused
**Giải pháp:**

1. Kiểm tra backend đang chạy trên port nào
2. Cập nhật API_URL trong code

### ❌ **Sai endpoint path**

**Triệu chứng:** 404 Not Found
**Giải pháp:**

1. Kiểm tra tài liệu API
2. Cập nhật endpoint paths

### ❌ **CORS Error**

**Triệu chứng:** CORS policy error trong console
**Giải pháp:**

1. Cấu hình CORS trong backend
2. Hoặc sử dụng proxy trong development

## 🛠️ Cách sử dụng Debug Tools

### 1. **Connection Test Utility**

```javascript
// Import và sử dụng trong browser console
import { quickConnectionTest } from './src/utils/connectionTest'
const results = await quickConnectionTest()
console.log(results)
```

### 2. **API Test Utility**

```javascript
// Test tất cả API endpoints
import { testApiEndpoints, logApiResults } from './src/utils/apiTest'
const results = await testApiEndpoints(userToken)
logApiResults(results)
```

### 3. **Browser Network Tab**

1. Mở DevTools (F12)
2. Chuyển sang tab Network
3. Refresh trang
4. Kiểm tra các requests bị fail

## 📝 Logs để kiểm tra

### **Frontend Logs (Browser Console)**

```javascript
// Các logs này sẽ xuất hiện khi load Profile page
console.log('Attempting to fetch profile from:', 'http://localhost:8888/api/v1/user/me')
console.log('User token:', 'Present' | 'Missing')
console.log('Response received:', status, statusText)
console.log('Profile data received:', data)
```

### **Backend Logs**

Kiểm tra console/terminal nơi backend đang chạy để xem:

- Server có start thành công không?
- Có requests nào đến không?
- Có lỗi gì không?

## 🚀 Quick Fixes

### **Fix 1: Thay đổi API URL**

```javascript
// Trong Profile.tsx, thay đổi:
const API_URL = 'http://localhost:8888/api/v1'

// Thành:
const API_URL = 'http://localhost:3000/api/v1' // hoặc port khác
```

### **Fix 2: Sử dụng Proxy (Development)**

Thêm vào `package.json`:

```json
{
  "proxy": "http://localhost:8888"
}
```

Sau đó thay đổi API_URL thành:

```javascript
const API_URL = '/api/v1'
```

### **Fix 3: Bypass CORS (Temporary)**

```javascript
// Chỉ dùng cho development
const response = await fetch(`${API_URL}/user/me`, {
  headers: {
    Authorization: `Bearer ${user.token}`,
    'Content-Type': 'application/json'
  },
  mode: 'cors' // hoặc 'no-cors' nếu cần
})
```

## 📞 Cần hỗ trợ thêm?

Nếu vẫn gặp vấn đề, hãy cung cấp:

1. **Backend logs** - Console output khi start server
2. **Browser console logs** - Error messages chi tiết
3. **Network tab** - Screenshot các failed requests
4. **Backend URL** - URL chính xác backend đang chạy

## ✅ Kết quả mong đợi

Sau khi fix thành công:

- ✅ Console hiển thị: "Profile data received: {...}"
- ✅ Network tab hiển thị successful requests
- ✅ Profile page load được thông tin user
- ✅ Form submission hoạt động bình thường
