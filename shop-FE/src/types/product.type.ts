export interface Product {
  id: string
  name: string
  price: number
  description: string
  technical_specs: string
  highlight_specs: string
  stock: number
  image_url: never[]
  category_name: string[]
}

// Kiểu trả về của GetAllProduct
export interface ProductList {
  content: Product[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
}

// type params cho url tùy biến
export interface ProductQueryParams {
  category_name?: string
  search?: string
  min_price?: number
  max_price?: number
  page?: number
  limit?: number
  sort_by?: string
}
