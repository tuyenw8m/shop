# API Endpoints Summary - Frontend Implementation

## Base URL

```
http://localhost:8888/api/v1
```

## 1. User Management (Profile)

### 1.1 Get User Profile

- **Method:** GET
- **Endpoint:** `/user/me`
- **Headers:** `Authorization: Bearer {token}`
- **Response Format:** `{ status: 0, message: null, data: {...} }`

### 1.2 Update User Profile

- **Method:** PUT
- **Endpoint:** `/user/me`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "name": "Nguyen Van B",
  "phone": "0987654321",
  "email": "user@example.com",
  "address": "Ha Noi"
}
```

### 1.3 Change Password

- **Method:** POST
- **Endpoint:** `/user/change-password`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## 2. Products Management

### 2.1 Get Products List

- **Method:** GET
- **Endpoint:** `/products`
- **Query Parameters:**
  - `category_name` (optional): Filter by category
  - `search` (optional): Search content
  - `min_price`, `max_price` (optional): Price range filter
  - `page` (default: 1): Current page
  - `limit` (default: 10): Items per page
  - `sort_by`: Sort option

### 2.2 Get Product Detail

- **Method:** GET
- **Endpoint:** `/products/:id`

### 2.3 Add New Product (Admin)

- **Method:** POST
- **Endpoint:** `/products`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "name": "iPhone 14 Pro",
  "price": 999.99,
  "description": "xxxx",
  "technical_specs": "xxxx",
  "highlight_specs": "hahah",
  "stock": 50,
  "category_name": ["xx", "vv"],
  "image": ["https://example.com/iphone14.jpg", "https://example.com/iphone14.jpg"]
}
```

### 2.4 Update Product (Admin)

- **Method:** PUT
- **Endpoint:** `/products/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** Same as Add Product

### 2.5 Delete Product (Admin)

- **Method:** DELETE
- **Endpoint:** `/products/:id`
- **Headers:** `Authorization: Bearer {token}`

## 3. Categories Management

### 3.1 Get Categories List

- **Method:** GET
- **Endpoint:** `/categories`
- **Query Parameters:**
  - `search` (optional): Search by category name
  - `page` (default: 1): Current page
  - `limit` (default: 10): Items per page

### 3.2 Get Category Detail

- **Method:** GET
- **Endpoint:** `/categories/:id`

### 3.3 Add New Category (Admin)

- **Method:** POST
- **Endpoint:** `/categories`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "name": "Phụ kiện",
  "description": "Các phụ kiện điện tử"
}
```

### 3.4 Update Category (Admin)

- **Method:** PUT
- **Endpoint:** `/categories/:id`
- **Headers:** `Authorization: Bearer {token}`

### 3.5 Delete Category (Admin)

- **Method:** DELETE
- **Endpoint:** `/categories/:id`
- **Headers:** `Authorization: Bearer {token}`

## 4. Cart Management

### 4.1 Get Cart

- **Method:** GET
- **Endpoint:** `/cart`
- **Headers:** `Authorization: Bearer {token}`

### 4.2 Add to Cart

- **Method:** POST
- **Endpoint:** `/cart`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "product_id": "xxxx",
  "quantity": 2
}
```

### 4.3 Update Cart Item

- **Method:** PUT
- **Endpoint:** `/cart/:item_id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "quantity": 3
}
```

### 4.4 Remove from Cart

- **Method:** DELETE
- **Endpoint:** `/cart/:item_id`
- **Headers:** `Authorization: Bearer {token}`

## 5. Orders Management

### 5.1 Get Orders List

- **Method:** GET
- **Endpoint:** `/orders`
- **Headers:** `Authorization: Bearer {token}`
- **Query Parameters:**
  - `status` (optional): Filter by status
  - `search` (optional): Search by order ID or customer info
  - `page` (default: 1): Current page
  - `limit` (default: 10): Items per page

### 5.2 Get Order Detail

- **Method:** GET
- **Endpoint:** `/orders/:id`
- **Headers:** `Authorization: Bearer {token}`

### 5.3 Create New Order

- **Method:** POST
- **Endpoint:** `/orders`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "product_id": "xxxx",
  "quantity": 12
}
```

### 5.4 Update Order Status (Admin)

- **Method:** PUT
- **Endpoint:** `/orders/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "status": "confirmed"
}
```

### 5.5 Cancel Order

- **Method:** DELETE
- **Endpoint:** `/orders/:id`
- **Headers:** `Authorization: Bearer {token}`

## 6. Authentication

### 6.1 Register

- **Method:** POST
- **Endpoint:** `/auth/register`
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyen Van A",
  "phone": "0123456789"
}
```

### 6.2 Login

- **Method:** POST
- **Endpoint:** `/auth/login`
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 7. Product Reviews

### 7.1 Get Product Reviews

- **Method:** GET
- **Endpoint:** `/products/:id/reviews`
- **Query Parameters:**
  - `rating` (optional): Filter by rating (1-5)
  - `search` (optional): Search by review content
  - `page` (default: 1): Current page
  - `limit` (default: 10): Items per page

### 7.2 Add Review

- **Method:** POST
- **Endpoint:** `/products/:id/reviews`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "rating": 5,
  "comment": "Sản phẩm tuyệt vời, đáng giá!",
  "images": ["https://example.com/review1.jpg"]
}
```

### 7.3 Delete Review

- **Method:** DELETE
- **Endpoint:** `/reviews/:id`
- **Headers:** `Authorization: Bearer {token}`

## 8. Coupons Management

### 8.1 Get Coupons List

- **Method:** GET
- **Endpoint:** `/coupons`
- **Query Parameters:**
  - `status` (optional): Filter by status (active, expired)
  - `search` (optional): Search by code or description
  - `page` (default: 1): Current page
  - `limit` (default: 10): Items per page

### 8.2 Create Coupon (Admin)

- **Method:** POST
- **Endpoint:** `/coupons`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "code": "SUMMER25",
  "description": "Giảm 25% cho đơn hàng trên 1000",
  "discount_type": "percentage",
  "discount_value": 25,
  "min_order_value": 1000,
  "max_discount": 200,
  "start_date": "2025-05-01T00:00:00Z",
  "end_date": "2025-06-30T23:59:59Z",
  "usage_limit": 100,
  "applicable_products": [1, 2],
  "applicable_categories": [1]
}
```

### 8.3 Apply Coupon

- **Method:** POST
- **Endpoint:** `/coupons/apply`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**

```json
{
  "code": "SUMMER25",
  "cart_id": 456
}
```

## Response Format Standards

### Success Response

```json
{
  "status": 0,
  "message": null,
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "status": 1,
  "message": "Error message",
  "data": null
}
```

## Notes

- All endpoints require `Content-Type: application/json` header
- Authentication endpoints don't require Authorization header
- Admin-only endpoints require admin role in user token
- Pagination uses `page` and `limit` parameters
- Search functionality available on most list endpoints
