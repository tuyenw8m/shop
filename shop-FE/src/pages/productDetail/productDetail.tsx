import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Giả định gọi API để lấy dữ liệu sản phẩm
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://api.example.com/products/${id}`) // goiapi
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <div className="pl-12 pr-12 pt-8 pb-8">Đang tải...</div>
  if (!product) return <div className="pl-12 pr-12 pt-8 pb-8">Sản phẩm không tồn tại</div>

  return (
    <main className='pl-12 pr-12 pt-8 pb-8'>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-3/4 bg-white p-6 rounded-lg shadow-md'>
          <img src={product.image} alt={product.name} className='w-full h-64 object-cover mb-4 rounded' />
          <h3 className='text-2xl font-semibold text-gray-800'>{product.name}</h3>
          <p className='text-green-600 font-bold mt-2 text-xl'>{product.price}</p>
          <p className='mt-4 text-gray-600'>{product.description || 'Không có mô tả'}</p>
          <button className='mt-6 w-full lg:w-auto bg-teal-600 text-white py-2 px-4 rounded-full hover:bg-teal-700 transition-colors'>
            Thêm vào giỏ hàng
          </button>
        </div>
        <Link to="/" className='mt-4 lg:mt-0 lg:ml-6 text-teal-600 hover:underline'>Quay lại danh sách sản phẩm</Link>
      </div>
    </main>
  )
}