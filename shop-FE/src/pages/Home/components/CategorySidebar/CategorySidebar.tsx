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

  const getCategoryIcon = (index: number) => {
    const icons = [
      <svg
        key={0}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-5 h-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25'
        />
      </svg>,
      <svg
        key={1}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-5 h-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z'
        />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z'
        />
      </svg>,
      <svg
        key={2}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-5 h-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3'
        />
      </svg>
    ]
    return icons[index % icons.length]
  }

  const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
    </svg>
  )

  if (isLoading) return <div className='p-4 text-gray-500'>Đang tải danh mục...</div>
  if (error) return <div className='p-4 text-red-500'>Lỗi: {(error as Error).message}</div>
  if (!data || !data.data?.data) return <div className='p-4 text-gray-500'>Không có dữ liệu</div>

  const categories = data.data.data

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300
          lg:relative lg:translate-x-0 lg:shadow-none lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 lg:hidden p-1 rounded-full hover:bg-gray-100'
          aria-label='Đóng menu'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
          </svg>
        </button>

        {/* Header */}
        <div className='p-4 border-b border-gray-200 bg-gray-50'>
          <h2 className='text-lg font-semibold text-gray-800'>Danh Mục Sản Phẩm</h2>
        </div>

        {/* Content */}
        <div className='overflow-y-auto h-[calc(100%-56px)] pb-4'>
          <ul className='space-y-1'>
            {categories.map((category: any, index: number) => (
              <li key={category.id} className='border-b border-gray-100 last:border-0'>
                {/* Main category */}
                <div
                  className='flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer'
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className='flex items-center space-x-2'>
                    <span className='text-gray-500'>{getCategoryIcon(index)}</span>
                    <span className='font-medium text-gray-800'>{category.name}</span>
                  </div>
                  {category?.children && <ChevronIcon isOpen={!!expandedCategories[category.id]} />}
                </div>

                {/* Subcategories */}
                {category.children && expandedCategories[category.id] && (
                  <ul className='pl-4 bg-gray-50'>
                    {category.children.map((subcategory: any) => (
                      <li key={subcategory.id}>
                        <div
                          className='flex items-center justify-between p-2 pl-3 hover:bg-gray-100 cursor-pointer'
                          onClick={() => toggleSubcategory(subcategory.id)}
                        >
                          <span className='text-sm text-gray-700'>{subcategory.name}</span>
                          {(subcategory.subcategories || subcategory.branch_name) && (
                            <ChevronIcon isOpen={!!expandedSubcategories[subcategory.id]} />
                          )}
                        </div>

                        {/* Brands */}
                        {subcategory?.branch_name && expandedSubcategories[subcategory.id] && (
                          <ul className='pl-4 bg-gray-100'>
                            {subcategory.branch_name.map((brand: string, i: number) => (
                              <li key={i}>
                                <a
                                  href={`/product-category/${brand}`}
                                  className='block p-2 text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                >
                                  {brand}
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
