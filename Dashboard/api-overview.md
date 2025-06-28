# Electronic Products E-commerce API Documentation

## Overview

This API provides endpoints for managing an electronic products e-commerce system. The API supports various functionalities including product management, category management, shopping cart, order processing, user authentication, product reviews, and promotional coupons.

### Base URL

\`\`\`
http://localhost:8888/shop
\`\`\`

All endpoints are prefixed with `/api/v1`.

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

\`\`\`
Authorization: Bearer {your_token}
\`\`\`

### Response Format

All API responses follow this standard format:

\`\`\`json
{
  "status": "success" | 0,
  "message": "Success message" | null,
  "data": { ... }
}
\`\`\`

## System Requirements

The e-commerce system supports:

1. **Product Management**: View, add, edit, delete products (phones, laptops, headphones, etc.)
2. **Category Management**: Filter products by category (e.g., Phones, Laptops)
3. **Shopping Cart**: Add, remove, update products in the cart
4. **Orders**: Create, view, update order status (processing, delivered, cancelled, etc.)
5. **User Management**: Registration, login, profile updates, role management (admin, customer)
6. **Product Reviews**: Submit and view product reviews
7. **Search and Filter**: Search products by keyword, price, category
8. **Promotions**: Apply discount codes to orders

## API Endpoints Summary

### Products
- `GET /api/v1/products` - Get products list
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Add new product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

### Categories
- `GET /api/v1/categories` - Get categories list
- `GET /api/v1/categories/:id` - Get category details
- `POST /api/v1/categories` - Add new category (Admin)
- `PUT /api/v1/categories/:id` - Update category (Admin)
- `DELETE /api/v1/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/v1/cart` - View cart (User)
- `POST /api/v1/cart` - Add item to cart (User)
- `PUT /api/v1/cart/:item_id` - Update cart item (User)
- `DELETE /api/v1/cart/:item_id` - Remove item from cart (User)

### Orders
- `GET /api/v1/orders` - Get orders list (User/Admin)
- `GET /api/v1/orders/:id` - Get order details (User/Admin)
- `POST /api/v1/orders` - Create order (User)
- `PUT /api/v1/orders/:id` - Update order status (Admin)
- `DELETE /api/v1/orders/:id` - Cancel order (User/Admin)

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login

### Users
- `GET /api/v1/users/me` - Get user profile (User)
- `PUT /api/v1/users/me` - Update user profile (User)
- `GET /api/v1/users` - Get users list (Admin)

### Reviews
- `GET /api/v1/products/:id/reviews` - Get product reviews
- `POST /api/v1/products/:id/reviews` - Add product review (User)
- `DELETE /api/v1/reviews/:id` - Delete review (User/Admin)

### Coupons
- `GET /api/v1/coupons` - Get coupons list
- `POST /api/v1/coupons` - Create coupon (Admin)
- `POST /api/v1/coupons/apply` - Apply coupon (User)
