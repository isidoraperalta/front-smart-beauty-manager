import { useState } from 'react'
import PropTypes from 'prop-types'
import { SERVICIOS_FORM_FIELDS } from '../config/serviciosConfig'

export default function ServiciosModal({
  entityKey,
  title,
  initialData,
  onClose,
  onSave,
  servicesData,
}) {
  const [formData, setFormData] = useState(initialData)
  const [errores, setErrores] = useState({})

  const validate = () => {
    const nextErrors = {}
    const fields = SERVICIOS_FORM_FIELDS[entityKey] || []

    fields.forEach((field) => {
      const value = formData[field.name]
      if (field.required && (value === '' || value === null || value === undefined)) {
        nextErrors[field.name] = 'Este campo es obligatorio'
      }
    })

    setErrores(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (validate()) {
      onSave(formData)
    }
  }

  const fields = SERVICIOS_FORM_FIELDS[entityKey] || []

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {fields.map((field) => {
                if (field.type === 'text') {
                  return (
                    <div className="mb-3" key={field.name}>
                      <label className="form-label">{field.label}</label>
                      <input
                        type="text"
                        className={`form-control ${errores[field.name] ? 'is-invalid' : ''}`}
                        value={formData[field.name] ?? ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                      {errores[field.name] && <div className="invalid-feedback d-block">{errores[field.name]}</div>}
                    </div>
                  )
                }

                if (field.type === 'number') {
                  return (
                    <div className="mb-3" key={field.name}>
                      <label className="form-label">{field.label}</label>
                      <input
                        type="number"
                        min={field.min}
                        className={`form-control ${errores[field.name] ? 'is-invalid' : ''}`}
                        value={formData[field.name] ?? ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                      {errores[field.name] && <div className="invalid-feedback d-block">{errores[field.name]}</div>}
                    </div>
                  )
                }

                if (field.type === 'textarea') {
                  return (
                    <div className="mb-3" key={field.name}>
                      <label className="form-label">{field.label}</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={formData[field.name] ?? ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                    </div>
                  )
                }

                if (field.type === 'switch') {
                  return (
                    <div className="form-check form-switch mb-3" key={field.name}>
                      <input
                        id={`switch-${field.name}`}
                        type="checkbox"
                        className="form-check-input"
                        checked={Boolean(formData[field.name])}
                        onChange={(e) => handleChange(field.name, e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`switch-${field.name}`}>
                        {field.label}
                      </label>
                    </div>
                  )
                }

                if (field.type === 'select') {
                  const options =
                    field.name === 'categoriaId'
                      ? servicesData.categorias
                      : field.name === 'tipoId'
                        ? servicesData.tipos
                        : servicesData.acciones

                  return (
                    <div className="mb-3" key={field.name}>
                      <label className="form-label">{field.label}</label>
                      <select
                        className={`form-select ${errores[field.name] ? 'is-invalid' : ''}`}
                        value={formData[field.name] ?? ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      >
                        <option value="">Selecciona una opción</option>
                        {options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {field.name === 'tipoId'
                              ? `${option.nombre} (${option.categoria?.nombre || 'Sin categoría'})`
                              : option.nombre}
                          </option>
                        ))}
                      </select>
                      {errores[field.name] && <div className="invalid-feedback d-block">{errores[field.name]}</div>}
                    </div>
                  )
                }

                return null
              })}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn sbm-btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

ServiciosModal.propTypes = {
  entityKey: PropTypes.oneOf(['servicios', 'tipos', 'categorias', 'acciones']).isRequired,
  title: PropTypes.string.isRequired,
  initialData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  servicesData: PropTypes.shape({
    categorias: PropTypes.array.isRequired,
    tipos: PropTypes.array.isRequired,
    acciones: PropTypes.array.isRequired,
  }).isRequired,
}
