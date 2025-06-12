import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/ProductService.api'
import CardProduct from 'src/components/CardProduct'
import Slideshow from 'src/components/SlideShow'
import useQueryParams from 'src/hooks/useQueryParams'

export default function ContentHome() {
  const queryParamsUrl = useQueryParams()
  // const [page, setPage] = useState(1)
  const { data } = useQuery({
    queryKey: ['products', queryParamsUrl],
    queryFn: () => {
      return productApi.getAllProducts(queryParamsUrl)
    }
  })
  console.log(queryParamsUrl, data)

  return (
    <section className='flex-1 mb-12'>
      <Slideshow />
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid xl:grid-cols-5 gap-6 mt-6'>
        {data?.data.data.content.map((product) => <CardProduct product={product} />)}
      </div>
    </section>
  )
}
