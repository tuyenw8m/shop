import useRouterElement from './useRouterElement'
import { OrderProvider } from './pages/contexts/OrderContext'

function App() {
  const routeElements = useRouterElement()
  return (
    <OrderProvider>
      <div>{routeElements}</div>
    </OrderProvider>
  )
}

export default App
