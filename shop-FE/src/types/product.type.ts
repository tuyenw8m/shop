export interface Product {
  id: string
  name: string
  price: number
  description: string
  technical_specs: string
  highlight_specs: string
  stock: number
  image_url: string[]
  parent_category_name: string
  children_category_name: string[]
  category_name: string | null
  sold: number
  original_price: number
  promotions: string
  features: string
  branch_name: string
  rating: number
}

// Kiểu trả về của GetAllProducts
export interface ProductList {
  content: Product[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
}

// type params cho url tùy biến
export interface ProductSearchParams {
  name?: string
  min_price?: number
  max_price?: number
  page?: number
  limit?: number
  sort_by?: string
  sort_type?: 'asc' | 'desc'
  children_category_name?: string[]
  parent_category_name?: string
  branch_name?: string
}
