import { useNavigate } from 'react-router-dom'

// Navbar fija en la parte superior de cada página.
// Usa useNavigate en lugar de <Link> para poder aplicar estilos con cursor pointer.
export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">

        {/* Logo / nombre de la app — lleva al inicio */}
        <span
          className="navbar-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Smart Beauty Manager
        </span>

        {/* Links de navegación */}
        <div className="navbar-nav">
          <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
            Home
          </a>
          <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/clientes')}>
            Clientes
          </a>
        </div>

      </div>
    </nav>
  )
}
