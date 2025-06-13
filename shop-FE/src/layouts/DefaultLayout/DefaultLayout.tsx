import { Fragment, useState } from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface Props {
  children: React.ReactNode
}

function DefaultLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Fragment>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {children}
      <Footer />
    </Fragment>
  )
}

export default DefaultLayout
