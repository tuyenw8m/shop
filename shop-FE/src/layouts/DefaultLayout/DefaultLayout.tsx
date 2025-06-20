import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import ReviewCart from 'src/components/ReviewCart'

interface Props {
  children: React.ReactNode
}

function DefaultLayout({ children }: Props) {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Header />
      <ReviewCart />
      {children}
      <Footer />
    </div>
  )
}

export default DefaultLayout
