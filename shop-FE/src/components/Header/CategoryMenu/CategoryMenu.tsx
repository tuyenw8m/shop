import { useQuery } from '@tanstack/react-query'
import { Computer, Cpu, Camera, CircleX, ChevronDown, ChevronUp } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import categoriesAPI from 'src/apis/Categories.api'
import type { Category, ChildCategory } from 'src/types/categories.type'
import React from 'react'

interface CategoryMenuProps {
  isOpen: boolean
  onClose: () => void
  isDesktop?: boolean
}

interface HoverPopoverProps {
  subcategory: ChildCategory
  position: { x: number; y: number }
  isVisible: boolean
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

type HoverPopoverType = {
  subcategory: ChildCategory | null
  position: { x: number; y: number }
  isVisible: boolean
}

function SubcategoryPopover({
  subcategory,
  position,
  isVisible,
  onClose,
  onMouseEnter,
  onMouseLeave
}: HoverPopoverProps) {
  if (!isVisible) return null

  return (
    <div
      className='fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[100] w-56'
      style={{
        left: position.x,
        top: position.y
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='py-2 max-h-64 overflow-y-auto'>
        {/* Render branch_name */}
        {subcategory.branch_name &&
          subcategory.branch_name.map((brand, i) => (
            <Link
              key={i}
              to={`/product-category/${brand}`}
              className='block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-teal-600'
              onClick={onClose}
            >
              {brand}
            </Link>
          ))}
      </div>
    </div>
  )
}

export default function CategoryMenu({ isOpen, onClose, isDesktop = false }: CategoryMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({})
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [hoverPopover, setHoverPopover] = useState<HoverPopoverType>({
    subcategory: null,
    position: { x: 0, y: 0 },
    isVisible: false
  })

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getCategories()
      return response.data
    }
  })

  const categories: Category[] = Array.isArray(data?.data) ? data.data : []

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }))
  }

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) => ({ ...prev, [subcategoryId]: !prev[subcategoryId] }))
  }

  const handleSubcategoryHover = (
    subcategory: ChildCategory,
    category: Category,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!isDesktop || !subcategory.branch_name) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    const rect = event.currentTarget.getBoundingClientRect()
    setHoverPopover({
      subcategory,
      position: {
        x: rect.right + 16, // Increased gap to 16px
        y: rect.top - 8 // Slight offset up to avoid overlap
      },
      isVisible: true
    })
  }

  const handleSubcategoryLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverPopover((prev) => ({ ...prev, isVisible: false }))
    }, 150)
  }

  const handlePopoverEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handlePopoverLeave = () => {
    setHoverPopover((prev) => ({ ...prev, isVisible: false }))
  }

  const getCategoryIcon = (index: number): React.ReactElement => {
    const icons = [
      <Camera size={20} key='camera' />,
      <Cpu size={20} key='cpu' />,
      <Computer size={20} key='computer' />
    ]
    return icons[index % icons.length]
  }

  const ChevronIcon = ({ isOpen }: { isOpen: boolean }): React.ReactElement => {
    return isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />
  }

  if (isDesktop) {
    return (
      <div className='relative'>
        {isOpen && <div className='fixed inset-0 z-40' onClick={onClose} />}
        <div className='flex relative z-50'>
          <div
            className={`absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto scroll transition-all ${isOpen ? 'block' : 'hidden'}`}
          >
            <div className='py-2'>
              {categories.map((category, index) => (
                <div key={category.id} className='relative border-b border-gray-100 last:border-b-0'>
                  <div
                    className='flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer'
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className='flex items-center space-x-3'>
                      <span className='text-gray-500'>{getCategoryIcon(index)}</span>
                      <Link
                        to={`/categories/${category.id}`}
                        className='font-medium text-gray-800 hover:text-teal-600'
                        onClick={onClose}
                      >
                        {category.name}
                      </Link>
                    </div>
                    {category.children && category.children?.length > 0 && (
                      <ChevronIcon isOpen={expandedCategories[category.id]} />
                    )}
                  </div>

                  {/* Subcategories - Click to expand */}
                  {category.children && expandedCategories[category.id] && (
                    <div className='pl-4 bg-gray-50'>
                      {category.children.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className='flex items-center justify-between p-2 pl-3 hover:bg-gray-100 cursor-pointer relative'
                          onMouseEnter={(e) => handleSubcategoryHover(subcategory, category, e)}
                          onMouseLeave={handleSubcategoryLeave}
                        >
                          <Link
                            to={`/category/${category.slug}/${subcategory.slug}`}
                            className='text-sm text-gray-700 hover:text-teal-600 flex-1'
                            onClick={onClose}
                          >
                            {subcategory.name}
                          </Link>
                          {subcategory.branch_name && (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='w-4 h-4 text-gray-400'
                            >
                              <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                            </svg>
                          )}

                          {/* Invisible bridge to prevent gap issues */}
                          {subcategory.branch_name &&
                            hoverPopover.isVisible &&
                            hoverPopover.subcategory?.id === subcategory.id && (
                              <div
                                className='absolute right-0 top-0 w-4 h-full z-[99]'
                                onMouseEnter={handlePopoverEnter}
                              />
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Separate Hover Popover */}
          {hoverPopover.subcategory && (
            <SubcategoryPopover
              subcategory={hoverPopover.subcategory}
              position={hoverPopover.position}
              isVisible={hoverPopover.isVisible}
              onClose={onClose}
              onMouseEnter={handlePopoverEnter}
              onMouseLeave={handlePopoverLeave}
            />
          )}
        </div>
      </div>
    )
  }

  // Mobile view
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={onClose}
          className='absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100'
          aria-label='Đóng menu'
        >
          <CircleX />
        </button>

        <div className='p-4 border-b border-gray-200 bg-gray-50'>
          <h2 className='text-lg font-semibold text-gray-800'>Danh Mục Sản Phẩm</h2>
        </div>

        <div className='overflow-y-auto h-[calc(100%-56px)] pb-4'>
          <ul className='space-y-1'>
            {categories.map((category, index) => (
              <li key={category.id} className='border-b border-gray-100 last:border-0'>
                <div
                  className='flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer'
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className='flex items-center space-x-2'>
                    <span className='text-gray-500'>{getCategoryIcon(index)}</span>
                    <Link
                      to={`/category/${category.slug}`}
                      className='font-medium text-gray-800 hover:text-teal-600'
                      onClick={onClose}
                    >
                      {category.name}
                    </Link>
                  </div>
                  {<ChevronIcon isOpen={expandedCategories[category.id]} />}
                </div>

                {category.children && expandedCategories[category.id] && (
                  <ul className='pl-4 bg-gray-50'>
                    {category.children.map((subcategory) => (
                      <li key={subcategory.id}>
                        <div
                          className='flex items-center justify-between p-2 pl-3 hover:bg-gray-100 cursor-pointer'
                          onClick={() => toggleSubcategory(subcategory.id)}
                        >
                          <Link
                            to={`/category/${category.slug}/${subcategory.slug}`}
                            className='text-sm text-gray-700 hover:text-teal-600'
                            onClick={onClose}
                          >
                            {subcategory.name}
                          </Link>
                          {subcategory.branch_name && subcategory.branch_name?.length > 0 && (
                            <ChevronIcon isOpen={expandedSubcategories[subcategory.id]} />
                          )}
                        </div>

                        {subcategory.branch_name &&
                          subcategory.branch_name?.length > 0 &&
                          expandedSubcategories[subcategory.id] && (
                            <ul className='pl-4 bg-gray-100'>
                              {subcategory.branch_name.map((brand, i) => (
                                <li key={i}>
                                  <Link
                                    to={`/product-category/${brand}`}
                                    className='block p-2 text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    onClick={onClose}
                                  >
                                    {brand}
                                  </Link>
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
