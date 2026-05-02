import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="text-center">
        <h1 className="display-4 mb-4">Smart Beauty Manager</h1>
        <p className="lead mb-4">Gestiona tu salón de belleza</p>
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/home')}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}