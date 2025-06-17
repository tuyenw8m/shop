import { useState, useMemo } from 'react'
import FilterSidebar from './components/FilterSidebar'
import ProductCard from 'src/components/ProductCard'
import type { Product } from 'src/types/product.type'
import FeaturesCategory from 'src/components/FeaturesCategory'

const productsData = {
  categories: ['Điện thoại', 'Laptop', 'Máy tính bảng'],
  brands: ['Apple', 'Samsung', 'Dell', 'Asus'],
  parentCategories: ['Công nghệ', 'Thiết bị số', 'Máy tính'],
  maxPrice: 50000000,
  products: [
    {
      id: '3167343d-1614-417e-9a57-ab70245bab66',
      name: 'Dell Core Work112',
      price: 20379400,
      description:
        'Công nghệ tiên tiến, đáp ứng tốt các tác vụ chuyên sâu. Dành cho PC đồ họa / workstation trong danh mục Máy tính.',
      technical_specs: 'CPU Ryzen 9, 32GB RAM, SSD 1TB',
      highlight_specs: 'CPU 12 nhân, RAM 32GB',
      stock: 49,
      image_url: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ix=carousel&auto=format&fit=crop&w=1050&q=80',
        'https://i.pinimg.com/736x/c2/56/29/c2562961b1e81fc60e748f9f0f2f0769.jpg',
        'https://i.pinimg.com/736x/81/42/a5/8142a59c8128ab47a838d81a03aedf71.jpg'
      ],
      parent_category_name: 'Máy tính',
      children_category_name: ['PC đồ họa / workstation'],
      category_name: 'Laptop',
      sold: 38,
      original_price: 20379400,
      promotions: 'Miễn phí vận chuyển toàn quốc',
      features: 'CPU 12 nhân, 32GB RAM, SSD 1TB',
      branch_name: 'Dell',
      rating: 5.0
    },
    {
      id: '1306a8cc-3b75-4de6-a520-1b71192af5da',
      name: 'Dell X Mini42',
      price: 21764400,
      description: 'Sản phẩm chất lượng cao, bền bỉ và đáng tin cậy. Dành cho Mini PC trong danh mục Máy tính.',
      technical_specs: 'CPU i5, 8GB RAM, SSD 256GB',
      highlight_specs: 'Nhỏ gọn, tiết kiệm điện',
      stock: 12,
      image_url: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ix=carousel&auto=format&fit=crop&w=1050&q=80',
        'https://i.pinimg.com/736x/af/b0/4d/afb04de7b01f843c45abbc9ee08dc58e.jpg',
        'https://images.unsplash.com/photo-1527814050087-3793815e3476?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ix=carousel&auto=format&fit=crop&w=1050&q=80'
      ],
      parent_category_name: 'Máy tính',
      children_category_name: ['PC để bàn', 'Mini PC'],
      category_name: 'Máy tính bảng',
      sold: 23,
      original_price: 21764400,
      promotions: 'Bảo hành mở rộng 24 tháng',
      features: 'Thiết kế nhỏ gọn, tiết kiệm năng lượng, 8GB RAM',
      branch_name: 'Dell',
      rating: 4.0
    },
    {
      id: '151a5cd3-7532-4d13-bc49-9621a49b6419',
      name: 'HP Turbo Work192',
      price: 30070000,
      description:
        'Thiết kế hiện đại, hiệu suất vượt trội, phù hợp cho mọi nhu cầu. Dành cho PC đồ họa / workstation trong danh mục Máy tính.',
      technical_specs: 'CPU Ryzen 9, 32GB RAM, SSD 1TB',
      highlight_specs: 'CPU 12 nhân, RAM 32GB',
      stock: 53,
      image_url: [
        'https://images.unsplash.com/photo-1588872657578-c1f5117f827e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ix=carousel&auto=format&fit=crop&w=1050&q=80',
        'https://i.pinimg.com/736x/b6/14/28/b614286ef52de836895c9855796e3e84.jpg',
        'https://i.pinimg.com/736x/0a/4c/fc/0a4cfca4a2b7650effb12444f5b7b8f4.jpg'
      ],
      parent_category_name: 'Máy tính',
      children_category_name: ['PC đồ họa / workstation'],
      category_name: 'Laptop',
      sold: 215,
      original_price: 30070000,
      promotions: 'Bảo hành mở rộng 24 tháng',
      features: 'CPU 12 nhân, 32GB RAM, SSD 1TB',
      branch_name: 'HP',
      rating: 4.0
    }
  ]
}

export function Category() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>('')
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, productsData.maxPrice])
  const [searchQuery, setSearchQuery] = useState<string>('')

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedParentCategory('')
    setSelectedPriceRange([0, productsData.maxPrice])
    setSearchQuery('')
  }

  const filteredProducts = useMemo(() => {
    return productsData.products.filter((product: Product) => {
      const matchCategory =
        selectedCategories.length === 0 || (product.category_name && selectedCategories.includes(product.category_name))
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.branch_name)
      const matchParent = selectedParentCategory === '' || product.parent_category_name === selectedParentCategory
      const matchPrice = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1]
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())

      return matchCategory && matchBrand && matchParent && matchPrice && matchSearch
    })
  }, [selectedCategories, selectedBrands, selectedParentCategory, selectedPriceRange, searchQuery])

  return (
    <div className='min-h-screen bg-gray-50 font-sans antialiased'>
      {/* Breadcrumb */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto p-4'>
          <nav className='flex items-center space-x-2 text-sm text-gray-500'>
            <a href='/' className='hover:text-teal-600 transition-colors duration-200 font-medium'>
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
                categories={productsData.categories}
                brands={productsData.brands}
                parentCategories={productsData.parentCategories}
                maxPrice={productsData.maxPrice}
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
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product: Product) => (
                    <div
                      key={product.id}
                      className='transform transition-all duration-300 hover:scale-103 hover:shadow-xl rounded-lg overflow-hidden'
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
