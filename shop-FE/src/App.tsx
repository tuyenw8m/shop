// src/App.tsx
import useRouterElement from './useRouterElement';
import AuthProvider from './pages/contexts/AuthContext';

function App() {
  const routeElements = useRouterElement();
  return (
    <AuthProvider>
      <div>{routeElements}</div>
    </AuthProvider>
  );
}

export default App;
