import type { User } from 'src/pages/contexts/auth.types'

export function formatPrices(price: number) {
  return new Intl.NumberFormat('vi-VN').format(price)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLocaleLowerCase()
}

export const getAccessToken = () => localStorage.getItem('token') || ''
export const getProfileLocalStorage = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const saveAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const saveProfileToLocalStorage = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export function getCategoryStyle(index: number) {
  switch (index) {
    case 0:
      return 'bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 text-white'
    case 1:
      return 'text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}

export function salePercent(priceOriginal: number, price: number) {
  return Math.round(((priceOriginal - price) / priceOriginal) * 100)
}

export const formatDateFromNow = (dateString: string | Date): string => {
  const date = new Date(dateString)
  const now = new Date()

  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffDays / 30)

  const formattedDate = date.toLocaleDateString('vi-VN')

  if (diffMonths > 0) {
    return `${diffMonths} tháng trước - (${formattedDate})`
  } else if (diffDays > 0) {
    return `${diffDays} ngày trước - (${formattedDate})`
  } else {
    return `Hôm nay (${formattedDate})`
  }
}
