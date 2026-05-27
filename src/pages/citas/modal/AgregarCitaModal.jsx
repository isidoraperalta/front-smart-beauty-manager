import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { clientesService, serviciosService } from '@/services'

const ESTADOS = ['AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA']
const LUGARES = ['LOCAL', 'DOMICILIO']

export default function AgregarCitaModal({ onGuardar, onCerrar }) {
  const [clientes, setClientes]     = useState([])
  const [servicios, setServicios]   = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    clienteId: '', servicioId: '', fechaHora: '',
    estado: 'AGENDADA', lugar: 'LOCAL',
    descuento: '', cargoExtra: '', notas: '',
  })
  const [errores, setErrores] = useState({})

  useEffect(() => {
    Promise.all([clientesService.getAll(), serviciosService.getAll()])
      .then(([c, s]) => { setClientes(c); setServicios(s) })
      .finally(() => setLoadingData(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const errs = {}
    if (!formData.clienteId)  errs.clienteId  = 'Selecciona un cliente'
    if (!formData.servicioId) errs.servicioId = 'Selecciona un servicio'
    if (!formData.fechaHora)  errs.fechaHora  = 'La fecha y hora son requeridas'
    setErrores(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return
    onGuardar({
      clienteId:  Number(formData.clienteId),
      servicioId: Number(formData.servicioId),
      fechaHora:  formData.fechaHora,
      estado:     formData.estado,
      lugar:      formData.lugar || null,
      descuento:  formData.descuento  ? Number(formData.descuento)  : null,
      cargoExtra: formData.cargoExtra ? Number(formData.cargoExtra) : null,
      notas:      formData.notas || null,
    })
  }

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.4)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content sbm-card">
          <div className="modal-header" style={{ borderBottom: '1px solid var(--sbm-border)' }}>
            <h5 className="modal-title fw-bold">📅 Nueva Cita</h5>
            <button type="button" className="btn-close" onClick={onCerrar} />
          </div>
          <div className="modal-body">
            {loadingData ? (
              <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Cliente *</label>
                    <select name="clienteId" className={`form-select form-select-sm ${errores.clienteId ? 'is-invalid' : ''}`} value={formData.clienteId} onChange={handleChange}>
                      <option value="">Seleccionar cliente...</option>
                      {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    {errores.clienteId && <div className="invalid-feedback">{errores.clienteId}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Servicio *</label>
                    <select name="servicioId" className={`form-select form-select-sm ${errores.servicioId ? 'is-invalid' : ''}`} value={formData.servicioId} onChange={handleChange}>
                      <option value="">Seleccionar servicio...</option>
                      {servicios.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.tipo?.nombre || s.nombre} — {s.accion?.nombre} — ${(s.precio || 0).toLocaleString('es-CL')}
                        </option>
                      ))}
                    </select>
                    {errores.servicioId && <div className="invalid-feedback">{errores.servicioId}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Fecha y hora *</label>
                    <input type="datetime-local" name="fechaHora" className={`form-control form-control-sm ${errores.fechaHora ? 'is-invalid' : ''}`} value={formData.fechaHora} onChange={handleChange} />
                    {errores.fechaHora && <div className="invalid-feedback">{errores.fechaHora}</div>}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold small">Estado</label>
                    <select name="estado" className="form-select form-select-sm" value={formData.estado} onChange={handleChange}>
                      {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold small">Lugar</label>
                    <select name="lugar" className="form-select form-select-sm" value={formData.lugar} onChange={handleChange}>
                      {LUGARES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Descuento ($)</label>
                    <input type="number" name="descuento" className="form-control form-control-sm" placeholder="0" min="0" value={formData.descuento} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Cargo extra ($)</label>
                    <input type="number" name="cargoExtra" className="form-control form-control-sm" placeholder="0" min="0" value={formData.cargoExtra} onChange={handleChange} />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">Notas</label>
                    <textarea name="notas" className="form-control form-control-sm" rows={2} placeholder="Observaciones opcionales..." value={formData.notas} onChange={handleChange} />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCerrar}>Cancelar</button>
                  <button type="submit" className="btn btn-sm sbm-btn-primary">Guardar cita</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

AgregarCitaModal.propTypes = {
  onGuardar: PropTypes.func.isRequired,
  onCerrar:  PropTypes.func.isRequired,
}
