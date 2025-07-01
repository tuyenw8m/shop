import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { reviewAPI } from 'src/apis/Review.api'
import type { ReviewProduct } from 'src/types/product.type'
import { formatDateFromNow } from 'src/utils/utils'

const StarRating = ({
  rating,
  setRating,
  readOnly = false
}: {
  rating: number
  setRating: (value: number) => void
  readOnly?: boolean
}) => (
  <div className='flex space-x-1'>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type='button'
        onClick={!readOnly ? () => setRating(star) : undefined}
        disabled={readOnly}
        className={`text-sm transition-colors duration-200 ${
          star <= rating ? 'text-yellow-500' : 'text-gray-400'
        } ${!readOnly ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
)

const ImagePreviews = ({ images }: { images: string[] }) => (
  <div className='flex flex-wrap gap-3 mt-3'>
    {images.map((src, idx) => (
      <img
        key={idx}
        src={src}
        alt={`Preview ${idx + 1}`}
        className='w-24 h-24 object-cover rounded-md border border-gray-200 shadow-sm'
      />
    ))}
  </div>
)

const ReviewList = ({ reviews }: { reviews: ReviewProduct[] }) => {
  return (
    <div className='space-y-4'>
      {reviews.map((review) => (
        <div
          key={review.id}
          className={`p-3 rounded-lg ${review.user_name.toLowerCase() === 'admin' ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className='flex items-start gap-3'>
            <div className='w-9 h-9 bg-gray-300 rounded-full overflow-hidden flex-shrink-0'>
              <img
                src={review.user_name.toLowerCase() === 'admin' ? '/admin-avatar.png' : '/user-avatar.png'}
                alt='avatar'
                className='w-full h-full object-cover'
              />
            </div>

            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h4 className='font-normal text-gray-800 text-base'>
                  {review.user_name}{' '}
                  {review.user_name.toLowerCase() === 'admin' && (
                    <span className='text-xs text-red-500 font-normal'>(Admin)</span>
                  )}
                </h4>
                <span className='text-xs text-gray-500'>{formatDateFromNow(review.created_at)}</span>
              </div>

              {review.user_name.toLowerCase() !== 'admin' && (
                <div className='mt-1 mb-1'>
                  <StarRating rating={review.rating} setRating={() => {}} readOnly />
                </div>
              )}

              <p className='text-gray-700 text-sm py-2 px-3 bg-gray-100 rounded-md mt-2 w-fit'>{review.comment}</p>

              {review.image_url && review.image_url.length > 0 && (
                <div className='mt-2'>
                  <ImagePreviews images={review.image_url} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ReviewSection({ productId }: { productId: string }) {
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    data: reviewsData,
    isLoading,
    isError
  } = useQuery<ReviewProduct[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await reviewAPI.getReviews(productId)
      if (res.data.status === 0) return res.data.data.content
      throw new Error('Failed to fetch reviews')
    },
    staleTime: 1000 * 60 * 5
  })

  const submitReviewMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await reviewAPI.submitReview(productId, formData)
      if (res.data.status === 0) return res.data.data
      throw new Error('Failed to submit review')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
      setRating(0)
      setComment('')
      setImages([])
      setImagePreviews([])
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 3000)
    },
    onError: () => {
      setSubmitSuccess(false)
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const filesArray = Array.from(e.target.files)
    if (images.length + filesArray.length > 5) {
      alert('Bạn chỉ có thể tải lên tối đa 5 ảnh.')
      return
    }
    setImages((prev) => [...prev, ...filesArray])
    setImagePreviews((prev) => [...prev, ...filesArray.map((file) => URL.createObjectURL(file))])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('rating', rating.toString())
    formData.append('comment', comment)
    images.forEach((file) => formData.append('images', file))

    submitReviewMutation.mutate(formData)
  }

  const reviews = reviewsData || []

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-bold mb-4 text-gray-900'>ĐÁNH GIÁ SẢN PHẨM</h2>
      <div className='bg-gray-50 border border-gray-200 p-4 rounded-lg'>
        <form onSubmit={handleSubmit}>
          <div className='flex items-center space-x-3 mb-3'>
            <span className='font-medium text-gray-700 text-sm'>Đánh giá của bạn:</span>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div className='space-y-3'>
            <textarea
              className='w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-red-400 shadow-sm text-sm'
              rows={4}
              placeholder='Hãy chia sẻ cảm nhận của bạn về sản phẩm này...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <label
              htmlFor='file-upload'
              className='block w-fit text-xs text-gray-500 cursor-pointer bg-gray-50 py-1.5 px-3 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors duration-200'
            >
              <input
                id='file-upload'
                type='file'
                multiple
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
              <span className='flex items-center space-x-1.5'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-red-500'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 4 4 4-4V5h-2v2.586l-2.707-2.707A1 1 0 0010 4.414L7.414 7H6V6a1 1 0 011-1h2.586l-2.707-2.707A1 1 0 006.414 2H5a1 1 0 00-1 1v12zM10 9a1 1 0 100 2 1 1 0 000-2z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Thêm ảnh (Tùy chọn)</span>
              </span>
            </label>

            {imagePreviews.length > 0 && <ImagePreviews images={imagePreviews} />}

            <button
              type='submit'
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md font-medium transition-colors duration-300 shadow-sm text-sm
              disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={submitReviewMutation.isPending || rating === 0 || comment.trim() === ''}
            >
              {submitReviewMutation.isPending ? 'Đang gửi...' : 'GỬI ĐÁNH GIÁ CỦA BẠN'}
            </button>
            {submitReviewMutation.isError && (
              <p className='text-red-500 text-xs mt-1'>Gửi đánh giá thất bại. Vui lòng thử lại.</p>
            )}
            {submitSuccess && <p className='text-green-600 text-xs mt-1'>Đánh giá của bạn đã được gửi thành công!</p>}
          </div>
        </form>
      </div>

      <div className='mt-8'>
        <h3 className='text-xl font-bold mb-4 text-gray-900'>BÌNH LUẬN CỦA KHÁCH HÀNG</h3>
        {isLoading ? (
          <p className='text-gray-600 text-sm'>Đang tải đánh giá...</p>
        ) : isError ? (
          <p className='text-red-500 text-sm'>Không thể tải đánh giá. Vui lòng thử lại sau.</p>
        ) : reviews.length === 0 ? (
          <p className='text-gray-500 text-sm'>Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <ReviewList reviews={reviews} />
        )}
      </div>
    </div>
  )
}
