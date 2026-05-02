import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Clientes from './pages/clientes/Clientes'

// App define el enrutamiento de la aplicación.
// Cada <Route> mapea una URL a un componente de página.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/home"     element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  )
}

export default App