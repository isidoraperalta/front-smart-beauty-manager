import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Clientes from './pages/clientes/Clientes'
import Citas from './pages/citas/Citas'
import ServiciosGestion from './pages/servicios/ServiciosGestion'
import Estadisticas from './pages/estadisticas/Estadisticas'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import { authStorage } from '@/utils/auth'
import { DateFilterProvider } from '@/context/DateFilterContext'

function App() {
  return (
    <DateFilterProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={authStorage.isAuthenticated() ? '/home' : '/login'} replace />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/servicios" element={<ServiciosGestion />} />
            <Route path="/informaciones" element={<Estadisticas />} />
          </Route>
        </Routes>
      </Router>
    </DateFilterProvider>
  )
}

export default App
