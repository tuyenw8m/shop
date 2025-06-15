export function FeaturedBrands() {
  const brands = [
    { name: 'Apple' },
    { name: 'Samsung' },
    { name: 'Dell' },
    { name: 'Sony' },
    { name: 'Asus' },
    { name: 'Lenovo' },
    { name: 'HP' },
    { name: 'LG' }
  ]

  return (
    <div className='my-12'>
      <h2 className='text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center'>Thương Hiệu Nổi Bật</h2>
      <div className='grid grid-cols-4 md:grid-cols-8 gap-4'>
        {brands.map((brand, index) => (
          <div
            key={index}
            className='bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-center hover:shadow-md transition-shadow'
          >
            <img src={`https://placehold.co/60?text=${brand.name}`} alt={brand.name} className='max-h-10' />
          </div>
        ))}
      </div>
    </div>
  )
}
