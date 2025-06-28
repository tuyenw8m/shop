import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { reviewAPI } from 'src/apis/Review.api'
import type { ReviewProduct } from 'src/types/product.type'

const StarRating = ({ rating, setRating }: { rating: number; setRating: (value: number) => void }) => (
  <div className='flex space-x-1'>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type='button'
        onClick={() => setRating(star)}
        className={`text-3xl transition-colors duration-200 ${
          star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
        }`}
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

const ReviewList = ({ reviews }: { reviews: ReviewProduct[] }) => (
  <div className='space-y-8'>
    {reviews.map((review) => (
      <div key={review.id} className='bg-white border border-gray-200 p-6 rounded-lg shadow-sm'>
        <div className='flex items-center justify-between mb-3'>
          <h4 className='font-semibold text-xl text-gray-800'>{review.user_name}</h4>
          <span className='text-sm text-gray-500'>{new Date(review.created_at).toLocaleDateString('vi-VN')}</span>
        </div>
        <StarRating rating={review.rating} setRating={() => {}} />
        <p className='text-gray-700 leading-relaxed mb-4'>{review.comment}</p>
        {review.image_url.length > 0 && <ImagePreviews images={review.image_url} />}
      </div>
    ))}
  </div>
)

export default function ReviewSection({ productId }: { productId: string }) {
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

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
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const filesArray = Array.from(e.target.files)
    setImages(filesArray)
    setImagePreviews(filesArray.map((file) => URL.createObjectURL(file)))
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
    <div className='mt-12'>
      <h2 className='text-3xl font-extrabold mb-6 text-gray-900 border-b-2 pb-2'>ĐÁNH GIÁ SẢN PHẨM</h2>

      <div className='bg-white shadow-lg border border-gray-100 p-8 rounded-xl'>
        <h3 className='text-xl font-semibold mb-5 text-gray-800'>Gửi đánh giá của bạn</h3>
        <form onSubmit={handleSubmit}>
          <div className='flex items-center space-x-4 mb-6'>
            <span className='font-medium text-gray-700'>Đánh giá của bạn:</span>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div className='space-y-5'>
            <textarea
              className='w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-sm'
              rows={5}
              placeholder='Hãy chia sẻ cảm nhận của bạn về sản phẩm này...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <input
              type='file'
              multiple
              accept='image/*'
              onChange={handleImageChange}
              className='block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-600
                hover:file:bg-red-100 cursor-pointer'
            />

            {imagePreviews.length > 0 && <ImagePreviews images={imagePreviews} />}

            <button
              type='submit'
              className='bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors duration-300 shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={submitReviewMutation.isPending || rating === 0 || comment.trim() === ''}
            >
              {submitReviewMutation.isPending ? 'Đang gửi...' : 'GỬI ĐÁNH GIÁ CỦA BẠN'}
            </button>
            {submitReviewMutation.isError && (
              <p className='text-red-500 text-sm mt-2'>Gửi đánh giá thất bại. Vui lòng thử lại.</p>
            )}
          </div>
        </form>
      </div>

      <div className='mt-12'>
        <h3 className='text-2xl font-bold mb-6 text-gray-900'>Các đánh giá khác</h3>
        {isLoading ? (
          <p className='text-gray-600 text-lg'>Đang tải đánh giá...</p>
        ) : isError ? (
          <p className='text-red-500 text-lg'>Không thể tải đánh giá. Vui lòng thử lại sau.</p>
        ) : reviews.length === 0 ? (
          <p className='text-gray-500 text-lg'>Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <ReviewList reviews={reviews} />
        )}
      </div>
    </div>
  )
}
