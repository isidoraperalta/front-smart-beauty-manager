import { useLocation, useNavigate } from 'react-router-dom'
import { authStorage } from '@/utils/auth'
import sbmLogoBlob from '../../assets/smart-beauty-manager-logo-blob.jpeg'

// Navbar fija en la parte superior de cada página.
// Usa useNavigate en lugar de <Link> para poder aplicar estilos con cursor pointer.
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    authStorage.clearToken()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg sbm-navbar sticky-top">
      <div className="container py-1">

        {/* Logo / nombre de la app — lleva al inicio */}
        <span
          className="navbar-brand d-flex align-items-center gap-2"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <img src={sbmLogoBlob} alt="Smart Beauty Manager" className="sbm-brand-mark sbm-brand-mark-lg" />
          <span className="sbm-brand-title">Smart Beauty Manager</span>
        </span>

        {/* Links de navegación */}
        <div className="navbar-nav d-flex flex-row gap-2 align-items-center">
          <button type="button" className={`sbm-nav-link ${isActive('/home') ? 'sbm-nav-link-active' : ''}`} onClick={() => navigate('/home')}>
            Home
          </button>
          <button type="button" className={`sbm-nav-link ${isActive('/clientes') ? 'sbm-nav-link-active' : ''}`} onClick={() => navigate('/clientes')}>
            Clientes
          </button>
          <button type="button" className={`sbm-nav-link ${isActive('/citas') ? 'sbm-nav-link-active' : ''}`} onClick={() => navigate('/citas')}>
            Citas
          </button>
          <button type="button" className={`sbm-nav-link ${isActive('/servicios') ? 'sbm-nav-link-active' : ''}`} onClick={() => navigate('/servicios')}>
            Servicios
          </button>
          <button type="button" className={`sbm-nav-link ${isActive('/informaciones') ? 'sbm-nav-link-active' : ''}`} onClick={() => navigate('/informaciones')}>
            Informaciones
          </button>
          <button type="button" className="sbm-nav-link sbm-nav-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

      </div>
    </nav>
  )
}
