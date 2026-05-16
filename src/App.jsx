import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Clientes from './pages/clientes/Clientes'
import ServiciosGestion from './pages/servicios/ServiciosGestion'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import { authStorage } from '@/utils/auth'

// App define el enrutamiento de la aplicación.
// Cada <Route> mapea una URL a un componente de página.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={authStorage.isAuthenticated() ? '/home' : '/login'} replace />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicios" element={<ServiciosGestion />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App