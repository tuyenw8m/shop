import { useQuery } from '@tanstack/react-query'
import categoriesAPI from 'src/apis/Categories.api'

export default function CategorySidebar() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoriesAPI.getCategories()
    }
  })

  console.log(data)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  if (!data) return <div>Không có dữ liệu</div>

  return (
    <div className='w-60 bg-white p-4 shadow rounded-lg'>
      <h2 className='font-semibold text-lg mb-4'>Danh mục</h2>
      <ul className='space-y-4'>
        {data?.data.data.map((category, index) => (
          <li key={index} className='flex items-center gap-3 text-sm text-gray-700 hover:text-blue-500 cursor-pointer'>
            {/* Không có icon trong dữ liệu */}
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
