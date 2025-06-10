import Footer from 'src/components/Footer'
import HeaderAuth from 'src/components/HeaderAuth'

interface Props {
  children: React.ReactNode
}

function AccountLayout({ children }: Props) {
  return (
    <>
      <HeaderAuth />
      {children}
      <Footer />
    </>
  )
}

export default AccountLayout
