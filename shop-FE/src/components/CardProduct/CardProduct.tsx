import type { Product } from 'src/types/product.type'
import { formatPrices, getCategoryStyle } from 'src/utils/utils'

interface Props {
  product: Product
}

export default function CardProduct({ product }: Props) {
  return (
    <div className='rounded-sm shadow hover:translate-y-[-0.125rem] hover:shadow-lg transition-shadow cursor-pointerd duration-100 transition-transform flex flex-col h-full'>
      <div className='w-full pt-[100%] relative'>
        <img
          src='https://img.lazcdn.com/g/p/e5509421321e1d4e08fd70fe2bc660d2.jpg_720x720q80.jpg_.webp'
          alt={product.name}
          className='absolute top-0 left-0 bg-white w-full h-full rounded-t-sm object-cover'
        />
        <span className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
          {product.stock}
        </span>
      </div>

      <div className='p-4 flex flex-col justify-between flex-1'>
        <div className='flex flex-wrap items-center gap-2 mb-2 min-h-[32px]'>
          {product.category_name.map((category, index) => (
            <span key={index} className={`${getCategoryStyle(index)} text-xs font-semibold px-2 py-1 rounded`}>
              {category}
            </span>
          ))}
        </div>

        <div className='min-h-[40px] text-sm font-bold line-clamp-2 mb-2'>{product.name}</div>

        <div className='flex items-center space-x-1 mb-1'>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span key={i} className='text-yellow-400 text-sm'>
                ★
              </span>
            ))}
        </div>

        <div className='text-red-600 font-semibold text-lg'>{formatPrices(product.price)}₫</div>
      </div>
    </div>
  )
}
