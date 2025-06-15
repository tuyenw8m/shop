import { Laptop, MemoryStick, MonitorSmartphone, Cpu, GanttChart, Webcam, Camera } from 'lucide-react'

const categories = [
  { name: 'Laptop', icon: Laptop },
  { name: 'RAM', icon: MemoryStick },
  { name: 'PC Gaming', icon: MonitorSmartphone },
  { name: 'CPU', icon: Cpu },
  { name: 'GPU', icon: GanttChart },
  { name: 'Web Cam', icon: Webcam },
  { name: 'Camera', icon: Camera }
]

export default function FeaturesCategory() {
  return (
    <div className='bg-white rounded-lg p-6 mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold text-gray-800'>Danh mục nổi bật</h2>
      </div>
      <div className='grid grid-cols-4 md:grid-cols-7 gap-4'>
        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <div
              key={index}
              className='group flex flex-col items-center p-4 hover:bg-teal-50 hover:shadow-md rounded-xl cursor-pointer transition-transform duration-300 transform hover:-translate-y-1'
            >
              <Icon className='w-8 h-8 mb-2 text-gray-600 group-hover:text-teal-500 transition-colors duration-300' />
              <span className='text-sm text-gray-700 text-center group-hover:text-teal-600 transition-colors duration-300'>
                {category.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
