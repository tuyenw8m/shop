import { useContext } from 'react'
import CategorySidebar from './components/CategorySidebar'
import ContentHome from './components/ContentHome'
import { SidebarContext } from 'src/layouts/DefaultLayout/DefaultLayout'


export default function Home() {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)

  return (
    <main className='pl-12 pr-12 pt-8 pb-8'>
      <div className='flex flex-col lg:flex-row gap-6'>
        <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <ContentHome />
      </div>
    </main>
  )
}
