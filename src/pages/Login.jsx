import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authService } from '@/services'
import { authStorage } from '@/utils/auth'
import sbmLogoBlob from '../../assets/smart-beauty-manager-logo-blob.jpeg'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/home'

  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login(form)
      if (!response?.token) {
        throw new Error('No se recibió token de autenticación')
      }

      authStorage.setToken(response.token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container sbm-login-shell px-3 py-4 py-md-5">
      <div className="sbm-card bg-white overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-5 sbm-login-accent p-4 p-md-5 d-flex flex-column justify-content-between">
            <div className="sbm-login-intro">
              <div className="sbm-login-logo-wrap mb-3">
                <img src={sbmLogoBlob} alt="Smart Beauty Manager" className="img-fluid rounded-4" />
              </div>
              <p className="sbm-login-welcome">
                Bienvenida
              </p>
              <p className="sbm-login-tagline">
                Tu espacio, tu agenda, tu mejor version
              </p>
              <p className="sbm-login-description">
                Organiza tus citas, gestiona tus clientes y haz crecer tu negocio.
              </p>
            </div>
          </div>

          <div className="col-lg-7 p-4 p-md-5 sbm-login-form-pane">
            <h2 className="h4 fw-bold mb-2">Iniciar sesión</h2>
            <p className="text-muted mb-4">Ingresa tus credenciales para continuar</p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="username">Usuario</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn sbm-btn-primary w-100" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
