import { createContext, useState } from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface Props {
  children: React.ReactNode
}

interface SidebarContextType {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType>({ sidebarOpen: false, setSidebarOpen: () => {} })

function DefaultLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {children}
      <Footer />
    </SidebarContext.Provider>
  )
}

export default DefaultLayout
