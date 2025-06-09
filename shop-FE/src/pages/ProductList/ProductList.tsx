import Slideshow from 'src/components/SlideShow'

export default function ProductList() {
  const products = [
    {
      id: 1,
      name: 'Sản phẩm 1',
      price: '1.000.000₫',
      image: 'https://placehold.co/300x200?text=Product+1'
    },
    {
      id: 2,
      name: 'Sản phẩm 2',
      price: '2.000.000₫',
      image: 'https://placehold.co/300x200?text=Product+2'
    },
    {
      id: 3,
      name: 'Sản phẩm 3',
      price: '3.000.000₫',
      image: 'https://placehold.co/300x200?text=Product+3'
    },
    {
      id: 4,
      name: 'Sản phẩm 4',
      price: '4.000.000₫',
      image: 'https://placehold.co/300x200?text=Product+4'
    },
    {
      id: 5,
      name: 'Sản phẩm 5',
      price: '5.000.000₫',
      image: 'https://placehold.co/300x200?text=Product+5'
    }
  ]

  return (
    <>
      <main className='pl-12 pr-12 pt-8 pb-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <aside className='w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md'>
            <h3 className='text-lg font-semibold mb-4'>DANH MỤC</h3>
            <div className='space-y-4 text-sm'>
              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>Điện Thoại</h4>
                <ul className='space-y-1 ml-4 text-gray-600'>
                  <li className='hover:text-teal-600 cursor-pointer'>iPhone</li>
                  <li className='hover:text-teal-600 cursor-pointer'>Samsung</li>
                  <li className='hover:text-teal-600 cursor-pointer'>Xiaomi</li>
                </ul>
              </div>

              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>Laptop</h4>
                <ul className='space-y-1 ml-4 text-gray-600'>
                  <li className='hover:text-teal-600 cursor-pointer'>MacBook</li>
                  <li className='hover:text-teal-600 cursor-pointer'>Dell</li>
                  <li className='hover:text-teal-600 cursor-pointer'>ASUS</li>
                </ul>
              </div>

              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>Phụ Kiện</h4>
                <ul className='space-y-1 ml-4 text-gray-600'>
                  <li className='hover:text-teal-600 cursor-pointer'>Sạc dự phòng</li>
                  <li className='hover:text-teal-600 cursor-pointer'>Tai nghe</li>
                  <li className='hover:text-teal-600 cursor-pointer'>Chuột + bàn phím</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <section className='flex-1 mb-12'>
            <Slideshow />
            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 mt-6'>
              {products.map((product) => (
                <div key={product.id} className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                  <img src={product.image} alt={product.name} className='w-full h-40 object-cover mb-4 rounded' />
                  <h3 className='text-lg font-semibold text-gray-800'>{product.name}</h3>
                  <p className='text-green-600 font-bold mt-2'>{product.price}</p>
                  <button className='mt-4 w-full bg-teal-600 text-white py-2 rounded-full hover:bg-teal-700 transition-colors'>
                    Thêm vào giỏ hàng
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
