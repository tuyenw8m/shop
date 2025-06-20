import { createSearchParams, Link, useLocation } from 'react-router-dom'
import type { ProductSearchParamsConfig } from 'src/types/product.type'

interface Props {
  cleanedQueryParams: ProductSearchParamsConfig
  totalPage: number
}

const RANGE = 2

export default function Pagination({ cleanedQueryParams, totalPage }: Props) {
  const location = useLocation()
  // Laaays tuwf params ra
  const page = Number(cleanedQueryParams.page)

  const renderButton = (pageNumber: number) => (
    <Link
      to={{
        pathname: location.pathname,
        search: createSearchParams({
          ...cleanedQueryParams,
          page: pageNumber.toString()
        }).toString()
      }}
      key={pageNumber}
      className={`mx-1 px-3 py-1 rounded border ${
        page === pageNumber ? 'border-blue-500 text-blue-500 font-semibold' : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      {pageNumber}
    </Link>
  )

  // Thuật toán render phân trang, nút button và 3 chấm ...
  const displayPagination = () => {
    const items = []
    let showLeftDots = false
    let showRightDots = false

    for (let i = 1; i <= totalPage; i++) {
      if (totalPage <= RANGE * 2 + 5) {
        items.push(renderButton(i))
        continue
      }

      if (i === 1 || i === totalPage || Math.abs(i - page) <= RANGE) {
        items.push(renderButton(i))
      } else if (i < page && !showLeftDots) {
        items.push(
          <span key='left-dots' className='mx-1'>
            ...
          </span>
        )
        showLeftDots = true
      } else if (i > page && !showRightDots) {
        items.push(
          <span key='left-dots' className='mx-1'>
            ...
          </span>
        )
        showRightDots = true
      }
    }
    return items
  }

  return (
    <div className='flex justify-center items-center my-4 flex-wrap'>
      <Link
        to={{
          pathname: location.pathname,
          search: createSearchParams({
            ...cleanedQueryParams,
            page: (page - 1).toString()
          }).toString()
        }}
      >
        <button disabled={page === 1} className='mx-1 px-3 py-1 rounded border border-gray-300 disabled:opacity-50'>
          Prev
        </button>
      </Link>

      {displayPagination()}

      <Link
        to={{
          pathname: location.pathname,
          search: createSearchParams({
            ...cleanedQueryParams,
            page: (page + 1).toString()
          }).toString()
        }}
      >
        <button disabled={page === 1} className='mx-1 px-3 py-1 rounded border border-gray-300 disabled:opacity-50'>
          Next
        </button>
      </Link>
    </div>
  )
}
