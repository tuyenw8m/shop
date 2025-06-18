import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import FilterSidebar from './components/FilterSidebar'
import ProductCard from 'src/components/ProductCard'
import type { Product, ProductSearchParams } from 'src/types/product.type'
import FeaturesCategory from 'src/components/FeaturesCategory'
import ProductSortDropdown from './components/ProductSortDropdown'
import productApi from 'src/apis/ProductService.api'
import useQueryParams from 'src/hooks/useQueryParams'
import { isUndefined, omitBy } from 'lodash'

export function Category() {
  const MAX_PRICE = 200000000
  const queryParamsUrl: ProductSearchParams = useQueryParams()

  const cleannedQueryParams = omitBy(
    {
      name: queryParamsUrl.name,
      min_price: queryParamsUrl.min_price,
      max_price: queryParamsUrl.max_price,
      page: queryParamsUrl.page,
      limit: queryParamsUrl.limit,
      sort_by: queryParamsUrl.sort_by,
      sort_type: queryParamsUrl.sort_type,
      children_category_name: queryParamsUrl.children_category_name,
      parent_category_name: queryParamsUrl.parent_category_name,
      branch_name: queryParamsUrl.branch_name
    },
    isUndefined
  )

  // Lấy PARAMS xóa bỏ các fields không cần tránh query lỗi
  console.log(cleannedQueryParams)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', cleannedQueryParams],
    queryFn: () => {
      return productApi.getAllProducts(cleannedQueryParams)
    }
  })

  const products: Product[] = data?.data?.data.content || []

  const categories = useMemo(
    () => [...new Set(products.flatMap((p) => p.children_category_name || []).filter(Boolean))],
    [products]
  )
  const brands = useMemo(() => [...new Set(products.map((p) => p.branch_name).filter(Boolean))], [products])
  const parentCategories = useMemo(
    () => [...new Set(products.map((p) => p.parent_category_name).filter(Boolean))],
    [products]
  )
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price || 0), 0), [products])

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>('')
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 0])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<string>('')

  useEffect(() => {
    if (maxPrice > 0 && selectedPriceRange[1] === 0) {
      setSelectedPriceRange([0, maxPrice])
    }
  }, [maxPrice, selectedPriceRange])

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedParentCategory('')
    setSelectedPriceRange([0, MAX_PRICE])
    setSearchQuery('')
    setSortOrder('')
  }

  const handleSortChange = (sortValue: string) => {
    setSortOrder(sortValue)
  }

  const filteredProducts = useMemo(() => {
    const currentProducts = products.filter((product: Product) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        (product.children_category_name && product.children_category_name.some((c) => selectedCategories.includes(c)))
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.branch_name)
      const matchParent = selectedParentCategory === '' || product.parent_category_name === selectedParentCategory
      const matchPrice = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1]
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchBrand && matchParent && matchPrice && matchSearch
    })

    if (sortOrder === 'price-asc') {
      currentProducts.sort((a, b) => a.price - b.price)
    } else if (sortOrder === 'price-desc') {
      currentProducts.sort((a, b) => b.price - a.price)
    } else if (sortOrder === 'name-asc') {
      currentProducts.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder === 'name-desc') {
      currentProducts.sort((a, b) => b.name.localeCompare(a.name))
    }

    return currentProducts
  }, [products, selectedCategories, selectedBrands, selectedParentCategory, selectedPriceRange, searchQuery, sortOrder])

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <p className='text-gray-700 text-lg'>Đang tải sản phẩm...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-red-50'>
        <p className='text-red-700 text-lg'>
          Có lỗi xảy ra khi tải sản phẩm: {error?.message || 'Không xác định'}. Vui lòng thử lại sau.
        </p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 font-sans antialiased'>
      {/* Breadcrumb */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto p-4'>
          <nav className='flex items-center space-x-2 text-sm text-gray-500'>
            <a href='/' className='hover:text-teal-600 font-medium transition-colors duration-200'>
              Trang chủ
            </a>
            <span className='text-gray-400'>/</span>
            <span className='text-gray-700 font-semibold'>Sản phẩm</span>
          </nav>
        </div>
      </div>

      {/* Features Category Banner */}
      <div className='bg-gray-100 text-teal-600 py-10 shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-extrabold mb-2 drop-shadow-md'>Khám phá sản phẩm của chúng tôi</h1>
          <p className='text-teal-600 text-lg mb-6'>Tìm kiếm những gì bạn cần với bộ lọc mạnh mẽ.</p>
          <FeaturesCategory />
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Filter Sidebar */}
            <div className='lg:w-1/4'>
              <FilterSidebar
                categories={categories}
                brands={brands}
                parentCategories={parentCategories}
                maxPrice={maxPrice}
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                selectedParentCategory={selectedParentCategory}
                selectedPriceRange={selectedPriceRange}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategories}
                onBrandChange={setSelectedBrands}
                onParentCategoryChange={setSelectedParentCategory}
                onPriceRangeChange={setSelectedPriceRange}
                onSearchChange={setSearchQuery}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Product Grid */}
            <div className='lg:w-3/4'>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div className='text-sm text-gray-600'>
                    Hiển thị <span className='font-medium'>{filteredProducts.length}</span> sản phẩm
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-gray-600 whitespace-nowrap'>Sắp xếp theo:</span>
                    <ProductSortDropdown onSortChange={handleSortChange} />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product: Product) => (
                    <div
                      key={product.id}
                      className='transform hover:scale-103 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden'
                    >
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className='col-span-full text-center py-16 bg-gray-50 rounded-lg'>
                    <p className='text-gray-700 text-xl font-semibold mb-4'>
                      Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn.
                    </p>
                    <button
                      onClick={clearFilters}
                      className='mt-4 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors duration-300 shadow-md hover:shadow-lg'
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
