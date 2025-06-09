import Header from 'src/components/Header'
import Footer from 'src/components/Footer'

interface Props {
  children: React.ReactNode
}

function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default MainLayout
