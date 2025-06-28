import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { useMemo } from 'react'
import productApi from 'src/apis/ProductService.api'
import Pagination from 'src/components/Pagination'
import ProductCard from 'src/components/ProductCard'
import useQueryParams from 'src/hooks/useQueryParams'
import type { ProductSearchParams, ProductSearchParamsConfig } from 'src/types/product.type'

export default function ViewAllLink() {
  const queryParamsUrl: ProductSearchParamsConfig = useQueryParams()

  const cleannedParams: ProductSearchParamsConfig = useMemo(() => {
    return omitBy(
      {
        page: queryParamsUrl.page,
        limit: queryParamsUrl.limit
      },
      isUndefined
    )
  }, [queryParamsUrl.limit, queryParamsUrl.page])

  const { data } = useQuery({
    queryKey: ['products', cleannedParams],
    queryFn: async () => {
      const res = await productApi.getTopSold(cleannedParams as ProductSearchParams)
      if (res.data.status === 0) return res.data.data
      throw new Error('Failed call api')
    },
    placeholderData: keepPreviousData
  })

  return (
    <main className='flex-1'>
      <div className='max-w-7xl mx-auto px-12 py-12 '>
        <div className='mt-8 mb-12'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {data?.content && data.content.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <Pagination cleanedQueryParams={cleannedParams} totalPage={data?.pageSize as number} />
        </div>
      </div>
    </main>
  )
}
