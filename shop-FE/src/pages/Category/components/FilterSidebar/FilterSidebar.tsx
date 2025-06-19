import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import type { ProductSearchParamsConfig } from 'src/types/product.type'
import { omit } from 'lodash'

interface FilterSidebarProps {
  productSearchParams: ProductSearchParamsConfig
  categories: string[]
  brands: string[]
  parentCategories: string[]
  maxPrice: number
  selectedCategories: string[]
  selectedBrands: string[]
  selectedParentCategory: string
  selectedPriceRange: [number, number]
  searchQuery: string
  onCategoryChange: (categories: string[]) => void
  onBrandChange: (brands: string[]) => void
  onParentCategoryChange: (category: string) => void
  onPriceRangeChange: (range: [number, number]) => void
  onSearchChange: (query: string) => void
  onClearFilters: () => void
}

export function FilterSidebar({
  productSearchParams,
  categories,
  brands,
  parentCategories,
  maxPrice,
  selectedCategories,
  selectedBrands,
  selectedParentCategory,
  selectedPriceRange,
  searchQuery,
  onCategoryChange,
  onBrandChange,
  onParentCategoryChange,
  onPriceRangeChange,
  onSearchChange,
  onClearFilters
}: FilterSidebarProps) {
  const navigate = useNavigate()
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllBrands, setShowAllBrands] = useState(false)
  // state lưu giá trị
  const [minPriceInput, setMinPriceInput] = useState<number | string>(selectedPriceRange[0])
  const [maxPriceInput, setMaxPriceInput] = useState<number | string>(selectedPriceRange[1])
  // error
  const [minPriceError, setMinPriceError] = useState<string | null>(null)
  const [maxPriceError, setMaxPriceError] = useState<string | null>(null)

  useEffect(() => {
    setMinPriceInput(selectedPriceRange[0])
    setMaxPriceInput(selectedPriceRange[1])
  }, [selectedPriceRange])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫'
  }

  const handleApplyPriceFilter = () => {
    const minVal = Number(minPriceInput)
    const maxVal = Number(maxPriceInput)

    setMinPriceError(null)
    setMaxPriceError(null)

    let hasError = false
    if (minVal < 0) {
      setMinPriceError('Giá tối thiểu không âm.')
      hasError = true
    }
    if (minVal > maxPrice) {
      setMinPriceError(`Giá tối thiểu không quá ${formatPrice(maxPrice)}.`)
      hasError = true
    }
    if (maxVal < 0) {
      setMaxPriceError('Giá tối đa không âm.')
      hasError = true
    }
    if (maxVal > maxPrice) {
      setMaxPriceError(`Giá tối đa không quá ${formatPrice(maxPrice)}.`)
      hasError = true
    }
    if (!hasError && minVal > maxVal && maxVal !== 0) {
      setMinPriceError('Giá tối thiểu không lớn hơn tối đa.')
      hasError = true
    }

    if (!hasError) {
      onPriceRangeChange([minVal, maxVal])
      navigate({
        pathname: location.pathname,
        search: createSearchParams({
          ...productSearchParams,
          min_price: minVal.toString(),
          max_price: maxVal.toString()
        }).toString()
      })
    }
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    onCategoryChange(newCategories)
  }

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    onBrandChange(newBrands)
  }

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6)
  const displayedBrands = showAllBrands ? brands : brands.slice(0, 6)

  const handleSelectBtnAllCategory = () => {
    const cloneParams = omit(productSearchParams, ['children_category_name', 'parent_category_name'])
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...cloneParams
      }).toString()
    })
  }

  return (
    <div className='w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-2'>
          <Filter className='w-5 h-5 text-teal-600' />
          <h2 className='text-lg font-semibold text-gray-800'>Bộ lọc</h2>
        </div>
        <button
          onClick={onClearFilters}
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 text-teal-600 hover:text-teal-700 hover:bg-teal-50'
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className='mb-6'>
        <h3 className='text-md font-medium text-gray-800 mb-3'>Tìm kiếm</h3>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Tìm kiếm sản phẩm...'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10'
          />
        </div>
      </div>

      <div className='mb-6'>
        <h3 className='text-md font-medium text-gray-800 mb-3'>Danh mục chính</h3>
        <div className='space-y-2'>
          <label className='flex items-center space-x-3 cursor-pointer group'>
            <div className='relative'>
              <input
                type='radio'
                onClick={handleSelectBtnAllCategory}
                name='parent_category'
                checked={selectedParentCategory === ''}
                onChange={() => onParentCategoryChange('')}
                className='sr-only'
              />
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  selectedParentCategory === ''
                    ? 'bg-teal-600 border-teal-600'
                    : 'border-gray-300 group-hover:border-teal-400'
                }`}
              >
                {selectedParentCategory === '' && (
                  <div className='w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5' />
                )}
              </div>
            </div>
            <span className='text-sm text-gray-700 group-hover:text-teal-600 transition-colors'>Tất cả</span>
          </label>
          {parentCategories.map((category) => (
            <label key={category} className='flex items-center space-x-3 cursor-pointer group'>
              <div className='relative'>
                <input
                  type='radio'
                  name='parent_category'
                  checked={selectedParentCategory === category}
                  onChange={() => onParentCategoryChange(category)}
                  className='sr-only'
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    selectedParentCategory === category
                      ? 'bg-teal-600 border-teal-600'
                      : 'border-gray-300 group-hover:border-teal-400'
                  }`}
                >
                  {selectedParentCategory === category && (
                    <div className='w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5' />
                  )}
                </div>
              </div>
              <span className='text-sm text-gray-700 group-hover:text-teal-600 transition-colors'>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='mb-8'>
        <h3 className='text-md font-medium text-gray-800 mb-4'>Khoảng giá</h3>
        <div className='space-y-4'>
          <div className='relative pt-2'>
            <div className='flex items-center justify-between space-x-4'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700'>Giá tối thiểu</label>
                <input
                  type='number'
                  value={minPriceInput} // Giá trị hiển thị từ state cục bộ
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className={`block w-full p-2 border rounded-md ${minPriceError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {minPriceError && <p className='text-red-500 text-xs mt-1'>{minPriceError}</p>}
              </div>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700'>Giá tối đa</label>
                <input
                  type='number'
                  value={maxPriceInput} // Giá trị hiển thị từ state cục bộ
                  placeholder='0'
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className={`block w-full p-2 border rounded-md ${maxPriceError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {maxPriceError && <p className='text-red-500 text-xs mt-1'>{maxPriceError}</p>}
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            {/* Hiển thị giá trị đang được áp dụng, không phải giá trị input */}
            <span>{formatPrice(selectedPriceRange[0])}</span>
            <span>{formatPrice(selectedPriceRange[1])}</span>
          </div>
          <button
            onClick={handleApplyPriceFilter}
            className='mt-4 w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors'
          >
            Áp dụng
          </button>
        </div>
      </div>

      <div className='mb-8'>
        <h3 className='text-md font-medium text-gray-800 mb-4'>Danh mục con</h3>
        <div className='space-y-2'>
          {displayedCategories.map((category) => (
            <label key={category} className='flex items-center space-x-3 cursor-pointer group'>
              <div className='relative'>
                <input
                  type='checkbox'
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className='sr-only'
                />
                <div
                  className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                    selectedCategories.includes(category)
                      ? 'bg-teal-600 border-teal-600'
                      : 'border-gray-300 group-hover:border-teal-400'
                  }`}
                >
                  {selectedCategories.includes(category) && (
                    <svg
                      className='w-3 h-3 text-white absolute top-0.5 left-0.5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className='text-sm text-gray-700 group-hover:text-teal-600 transition-colors'>{category}</span>
            </label>
          ))}
          {categories.length > 6 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className='flex items-center space-x-1 text-sm text-teal-600 hover:text-teal-700 mt-2'
            >
              <span>{showAllCategories ? 'Thu gọn' : 'Xem thêm'}</span>
              {showAllCategories ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
            </button>
          )}
        </div>
      </div>

      <div className='mb-6'>
        <h3 className='text-md font-medium text-gray-800 mb-4'>Hãng</h3>
        <div className='space-y-2'>
          {displayedBrands.map((brand) => (
            <label key={brand} className='flex items-center space-x-3 cursor-pointer group'>
              <div className='relative'>
                <input
                  type='checkbox'
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className='sr-only'
                />
                <div
                  className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                    selectedBrands.includes(brand)
                      ? 'bg-teal-600 border-teal-600'
                      : 'border-gray-300 group-hover:border-teal-400'
                  }`}
                >
                  {selectedBrands.includes(brand) && (
                    <svg
                      className='w-3 h-3 text-white absolute top-0.5 left-0.5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className='text-sm text-gray-700 group-hover:text-teal-600 transition-colors'>{brand}</span>
            </label>
          ))}
          {brands.length > 6 && (
            <button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className='flex items-center space-x-1 text-sm text-teal-600 hover:text-teal-700 mt-2'
            >
              <span>{showAllBrands ? 'Thu gọn' : 'Xem thêm'}</span>
              {showAllBrands ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
