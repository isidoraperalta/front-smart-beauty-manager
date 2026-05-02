import { useState, useEffect } from 'react'

// AgregarClienteModal (también sirve para editar si se pasa un cliente existente)
//
// Props:
//   cliente   → null para crear nuevo; objeto cliente para editar
//   onGuardar → recibe el formData al hacer submit
//   onCerrar  → cierra el modal sin guardar
export default function AgregarClienteModal({ cliente, onGuardar, onCerrar }) {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' })
  const [errores, setErrores]   = useState({})

  // Si recibimos un cliente existente (modo edición), precargamos el formulario
  useEffect(() => {
    if (cliente) setFormData(cliente)
  }, [cliente])

  // Valida cada campo y acumula los mensajes de error en un objeto
  const validar = () => {
    const nuevosErrores = {}

    if (!formData.nombre.trim())
      nuevosErrores.nombre = 'El nombre es requerido'

    if (!formData.email.trim())
      nuevosErrores.email = 'El email es requerido'
    else if (!formData.email.includes('@'))
      nuevosErrores.email = 'Email inválido'

    if (!formData.telefono.trim())
      nuevosErrores.telefono = 'El teléfono es requerido'

    setErrores(nuevosErrores)
    // Retorna true si no hay errores (el objeto está vacío)
    return Object.keys(nuevosErrores).length === 0
  }

  // Actualiza el campo que cambió y limpia su error si lo había
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault() // evita que el navegador recargue la página
    if (validar()) onGuardar(formData)
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h5>
            <button type="button" className="btn-close" onClick={onCerrar} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: María García"
                />
                {errores.nombre && <div className="invalid-feedback d-block">{errores.nombre}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: maria@example.com"
                />
                {errores.email && <div className="invalid-feedback d-block">{errores.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 123456789"
                />
                {errores.telefono && <div className="invalid-feedback d-block">{errores.telefono}</div>}
              </div>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {cliente ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
