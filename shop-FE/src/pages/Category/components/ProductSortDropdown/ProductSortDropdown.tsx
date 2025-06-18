import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { sortBy } from 'src/constant/sort.constant'

interface ProductSortDropdownProps {
  onSortChange: (value: string) => void
}

export function ProductSortDropdown({ onSortChange }: ProductSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Phổ biến')

  const sortOptions = [
    { value: sortBy.price, label: 'Giá cả' },
    { value: sortBy.sold, label: 'Bán chạy' },
    { value: sortBy.rating, label: 'Đánh giá' },
    { value: sortBy.stock, label: 'Số lượng trong kho' }
  ]

  const toggleDropdown = () => setIsOpen(!isOpen)

  const selectOption = (value: string, label: string) => {
    setSelectedOption(label)
    setIsOpen(false)
    onSortChange(value)
  }

  return (
    <div className='relative inline-block text-left w-48'>
      <button
        type='button'
        onClick={toggleDropdown}
        className='inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500'
      >
        <span>{selectedOption}</span>
        {isOpen ? <ChevronUp className='w-4 h-4 ml-2' /> : <ChevronDown className='w-4 h-4 ml-2' />}
      </button>

      {isOpen && (
        <div className='absolute right-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5'>
          <div className='py-1'>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => selectOption(option.value, option.label)}
                className={`block w-full px-4 py-2 text-sm text-left ${
                  selectedOption === option.label ? 'bg-teal-100 text-teal-800' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
