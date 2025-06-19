import { useState, useEffect, useCallback } from 'react'
import { fetchProducts } from '../fetchProduct'

interface ProductFilters {
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

interface Product {
  id: string
  name: string
  price: number
  original_price: number
  image_url: string[]
  rating: number
  sold: number
  promotions: string
  highlight_specs: string
  stock: number
  parent_category_name: string
  children_category_name: string[]
  category_name: string[]
  branch_name: string
  description: string
  technical_specs: string
  features: string
}

interface ProductsResponse {
  status: number
  message: string | null
  data: {
    content: Product[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
  }
}

export function useProducts(initialFilters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)

  const loadProducts = useCallback(
    async (newFilters?: ProductFilters) => {
      setLoading(true)
      setError(null)

      try {
        const currentFilters = newFilters || filters
        const response: ProductsResponse = await fetchProducts(currentFilters)

        if (response.status === 0) {
          setProducts(response.data.content)
          setPagination({
            pageNumber: response.data.pageNumber,
            pageSize: response.data.pageSize,
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages
          })
        } else {
          setError(response.message || 'Có lỗi xảy ra khi tải sản phẩm')
        }
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm')
        console.error('Error loading products:', err)
      } finally {
        setLoading(false)
      }
    },
    [filters]
  )

  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const updatedFilters = { ...filters, ...newFilters, page: 0 } // Reset to first page when filters change
      setFilters(updatedFilters)
      loadProducts(updatedFilters)
    },
    [filters, loadProducts]
  )

  const changePage = useCallback(
    (page: number) => {
      const updatedFilters = { ...filters, page }
      setFilters(updatedFilters)
      loadProducts(updatedFilters)
    },
    [filters, loadProducts]
  )

  const clearFilters = useCallback(() => {
    const clearedFilters = { page: 0, limit: 10 }
    setFilters(clearedFilters)
    loadProducts(clearedFilters)
  }, [loadProducts])

  useEffect(() => {
    loadProducts()
  }, []) // Only run on mount

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    clearFilters,
    refetch: () => loadProducts()
  }
}
