import CategorySidebar from './components/CategorySidebar'
import ContentHome from './components/ContentHome'

export default function Home() {
  return (
    <main className='pl-12 pr-12 pt-8 pb-8'>
      <div className='flex flex-col lg:flex-row gap-6'>
        <CategorySidebar />
        <ContentHome />
      </div>
    </main>
  )
}
