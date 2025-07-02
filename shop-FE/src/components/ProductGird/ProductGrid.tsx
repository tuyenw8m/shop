import { GemIcon } from 'lucide-react'
import ProductCard from 'src/components/ProductCard'
import type { ProductList } from 'src/types/product.type'

interface Props {
  title: string
  child_title: string
  products: ProductList | undefined
  viewAllLink?: string
  onOrderSuccess?: () => void
}

export function ProductGrid({ title, child_title, products, viewAllLink, onOrderSuccess }: Props) {
  return (
    <div className='mt-8 mb-12'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-3 p-4'>
          <div className='bg-gradient-to-r from-teal-400 to-yellow-200 p-2 rounded-lg'>
            <GemIcon className='w-6 h-6 text-white' />
          </div>
          <h2 className='bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text'>
            <p className='text-lg font-semibold leading-none'>{title}</p>
            <p className='text-sm bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>
              {child_title}
            </p>
          </h2>
        </div>

        {viewAllLink && (
          <a href={viewAllLink} className='text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors'>
            Xem tất cả
          </a>
        )}
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {products?.content && products?.content.map((product) => <ProductCard key={product.id} product={product} onOrderSuccess={onOrderSuccess} />)}
      </div>
    </div>
  )
}
