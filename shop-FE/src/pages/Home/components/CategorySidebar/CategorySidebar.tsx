/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import categoriesAPI from 'src/apis/Categories.api'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CategorySidebar({ isOpen, onClose }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories()
  })

  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({})
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<number, boolean>>({})

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const toggleSubcategory = (id: number) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getCategoryIcon = () => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='size-5'>
        <path d='M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z' />
      </svg>
    )
  }

  if (isLoading) return <div className='p-4'>Đang tải danh mục...</div>
  if (error) return <div className='p-4 text-red-500'>Lỗi: {(error as Error).message}</div>
  if (!data || !data.data?.data) return <div className='p-4'>Không có dữ liệu</div>

  const categories = data.data.data

  return (
    <>
      {/* Mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full  bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          lg:relative lg:transform-none lg:z-0 lg:shadow-none lg:block
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <button onClick={onClose} className='absolute top-3 right-3 lg:hidden p-1 rounded-full hover:bg-gray-100'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
          </svg>
        </button>

        <div className='p-4 border-b border-gray-200 bg-gray-50'>
          <h2 className='text-lg font-bold text-gray-800'>Danh Mục Sản Phẩm</h2>
        </div>
        <div className='pb-20'>
          <ul>
            {categories.map((category: any) => (
              <li key={category.id} className='border-b border-gray-100'>
                <div
                  className='flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer'
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-gray-600'>{getCategoryIcon()}</span>
                    <span className='font-medium'>{category.name}</span>
                  </div>
                  {category.children && (
                    <span>
                      {expandedCategories[category.id] ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-6'
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                        </svg>
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-6'
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                        </svg>
                      )}
                    </span>
                  )}
                </div>

                {/* Subcategory con của thằng con */}
                {category.children && expandedCategories[category.id] && (
                  <ul className='pl-4 bg-gray-50'>
                    {category.children.map((subcategory: any) => (
                      <li key={subcategory.id}>
                        <div
                          className='flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer'
                          onClick={() => toggleSubcategory(subcategory.id)}
                        >
                          <span className='text-sm'>{subcategory.name}</span>
                          {subcategory.subcategories && (
                            <span>
                              {expandedSubcategories[subcategory.id] ? (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={1.5}
                                  stroke='currentColor'
                                  className='size-6'
                                >
                                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                                </svg>
                              ) : (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={1.5}
                                  stroke='currentColor'
                                  className='size-6'
                                >
                                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>

                        {/* Third-level: Brands or sub-subcategories */}
                        {subcategory.subcategories && expandedSubcategories[subcategory.id] && (
                          <ul className='pl-4 bg-gray-100'>
                            {subcategory.subcategories.map((brand: any) => (
                              <li key={brand.id}>
                                <a
                                  href={`/product-category/${category.slug}/${subcategory.slug}/${brand.slug}`}
                                  className='block p-2 text-sm hover:bg-gray-200'
                                >
                                  {brand.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
