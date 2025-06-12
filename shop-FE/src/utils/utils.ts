export function formatPrices(price: number) {
  return new Intl.NumberFormat('de-DE').format(price)
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

export function originalPrice(price: number) {
  const randomSale = [0.1, 0.12, 0.15, 0.2, 0.3]
  const randomPrice = randomSale[Math.floor(Math.random() * randomSale.length)]
  return Math.round(price / (1 - randomPrice))
}
