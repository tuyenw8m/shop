import ProductCard from 'src/components/ProductCard'
import type { ProductList } from 'src/types/product.type'

interface Props {
  title: string
  products: ProductList | undefined
  viewAllLink?: string
}

export function ProductGrid({ title, products, viewAllLink }: Props) {
  return (
    <div className='mt-8 mb-12'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl md:text-2xl font-bold text-gray-800 relative'>
          {title}
          <span className='absolute -bottom-1 left-0 w-12 h-1 bg-blue-600'></span>
        </h2>
        {viewAllLink && (
          <a href={viewAllLink} className='text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors'>
            Xem tất cả
          </a>
        )}
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {products?.content && products?.content.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  )
}
