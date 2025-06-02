import useRouterElement from './useRouterElement'

function App() {
  const routeElements = useRouterElement()
  return <div>{routeElements}</div>
}

export default App
