import { keepPreviousData, useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/ProductService.api'
import HeroSlide from 'src/components/HeroSlide/SlideShow'
import useQueryParams from 'src/hooks/useQueryParams'
import FeatureBanner from './components/FeatureBanner'
import FeaturedBrands from './components/FeaturedBrands'
import ProductGrid from 'src/components/ProductGird'
import type { ProductList } from 'src/types/product.type'

export default function ContentHome() {
  const queryParamsUrl = useQueryParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', queryParamsUrl],
    queryFn: () => productApi.getAllProducts(queryParamsUrl),
    placeholderData: keepPreviousData
  })

  if (isLoading) return <div>Đang tải...</div>
  if (error || !data) return <div>Có lỗi xảy ra</div>

  const products: ProductList = data.data.data

  const listSuggest: ProductList = {
    ...products,
    content: products.content?.filter((product) => product.stock < 20) || []
  }

  return (
    <section className='flex-1 mb-12'>
      <HeroSlide />
      <FeatureBanner />
      <ProductGrid title='Flash Sale 🔥' products={products} viewAllLink='/flash-sale' />
      <ProductGrid title='Gợi Ý Cho Bạn ' products={listSuggest} viewAllLink='/suggest' />
      <FeaturedBrands />
    </section>
  )
}
