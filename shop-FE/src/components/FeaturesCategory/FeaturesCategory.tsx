import { Laptop, MemoryStick, MonitorSmartphone, Cpu, GanttChart, Webcam, Camera } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const categories = [
  {
    name: 'Laptop',
    icon: Laptop,
    link_url: '/categories/Máy tính?parent_category_name=Máy tính&children_category_name=Laptop'
  },
  {
    name: 'RAM',
    icon: MemoryStick,
    link_url: '/categories/Linh kiện?parent_category_name=Linh kiện&children_category_name=RAM'
  },
  {
    name: 'PC Gaming',
    icon: MonitorSmartphone,
    link_url: '/categories/Máy tính?parent_category_name=Máy tính&children_category_name=PC Gaming'
  },
  {
    name: 'CPU',
    icon: Cpu,
    link_url: '/categories/Linh kiện?parent_category_name=Linh kiện&children_category_name=CPU'
  },
  {
    name: 'GPU',
    icon: GanttChart,
    link_url: '/categories/Linh kiện?parent_category_name=Linh kiện&children_category_name=GPU'
  },
  {
    name: 'Web Cam',
    icon: Webcam,
    link_url: '/categories/Camera?parent_category_name=Camera&children_category_name=Webcam'
  },
  {
    name: 'Camera',
    icon: Camera,
    link_url: '/categories/Camera?parent_category_name=Camera'
  }
]

export default function FeaturesCategory() {
  const location = useLocation()

  const isActive = (categoryLinkUrl: string) => {
    const categoryUrl = new URL(categoryLinkUrl, window.location.origin)

    if (location.pathname !== categoryUrl.pathname) {
      return false
    }

    const currentParams = new URLSearchParams(location.search)
    const categoryParams = new URLSearchParams(categoryUrl.search)

    if (currentParams.size !== categoryParams.size) {
      return false
    }
    for (const [key, value] of categoryParams.entries()) {
      if (currentParams.get(key) !== value) {
        return false
      }
    }
    return true
  }

  return (
    <div className='bg-white rounded-lg p-6 mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold text-gray-800'>Danh mục nổi bật</h2>
      </div>
      <div className='grid grid-cols-4 md:grid-cols-7 gap-4'>
        {categories.map((category, index) => {
          const Icon = category.icon
          const active = isActive(category.link_url)
          const activeClass = active ? 'bg-teal-100 text-teal-700 shadow-inner' : ''
          const activeIconClass = active ? 'text-teal-600' : 'text-gray-600'
          const activeLinkTextClass = active ? 'font-semibold' : ''

          return (
            <div
              key={index}
              className={`group flex flex-col items-center p-4 hover:bg-teal-50 hover:shadow-md rounded-xl cursor-pointer transition-transform duration-300 transform hover:-translate-y-1 ${activeClass}`}
            >
              <Link
                to={category.link_url}
                className={`text-sm text-gray-700 text-center group-hover:text-teal-600 transition-colors duration-300 ${activeLinkTextClass}`}
              >
                <Icon
                  className={`w-8 h-8 mb-2 group-hover:text-teal-500 transition-colors duration-300 ${activeIconClass}`}
                />
                {category.name}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
