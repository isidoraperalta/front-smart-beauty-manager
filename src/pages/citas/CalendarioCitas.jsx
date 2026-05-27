import { useState } from 'react'
import PropTypes from 'prop-types'

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]
const ESTADO_COLORS = {
  AGENDADA:   { bg: '#bfdbfe', text: '#0c4a6e', dot: '#2563eb' },
  CONFIRMADA: { bg: '#fef08a', text: '#92400e', dot: '#eab308' },
  REALIZADA:  { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  CANCELADA:  { bg: '#fecaca', text: '#7f1d1d', dot: '#dc2626' },
}

function getDiasDelMes(year, month) {
  const primer = new Date(year, month, 1)
  const ultimo = new Date(year, month + 1, 0)
  const dias = []
  // Offset para iniciar en lunes: getDay() 0=Dom,1=Lun,...,6=Sáb → (getDay()+6)%7 → 0=Lun,...,6=Dom
  const offset = (primer.getDay() + 6) % 7
  for (let i = 0; i < offset; i++) dias.push(null)
  for (let d = 1; d <= ultimo.getDate(); d++) dias.push(d)
  return dias
}

function formatHora(fechaHora) {
  return new Date(fechaHora).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

export default function CalendarioCitas({ citas, diaSeleccionado, setDiaSeleccionado, onEliminar, onCambiarEstado }) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())

  const diasDelMes = getDiasDelMes(anio, mes)

  const citasPorDia = (dia) => {
    if (!dia) return []
    return citas.filter(c => {
      const f = new Date(c.fechaHora)
      return f.getFullYear() === anio && f.getMonth() === mes && f.getDate() === dia
    })
  }

  const prevMes = () => {
    if (mes === 0) { setMes(11); setAnio(a => a - 1) }
    else setMes(m => m - 1)
    setDiaSeleccionado(null)
  }
  const nextMes = () => {
    if (mes === 11) { setMes(0); setAnio(a => a + 1) }
    else setMes(m => m + 1)
    setDiaSeleccionado(null)
  }

  const esHoy = (dia) => dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
  const citasDiaSeleccionado = diaSeleccionado ? citasPorDia(diaSeleccionado) : []

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-8">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <button className="btn btn-sm sbm-cal-nav" onClick={prevMes}>‹</button>
          <h5 className="mb-0 fw-bold" style={{ color: 'var(--sbm-text-900)' }}>{MESES[mes]} {anio}</h5>
          <button className="btn btn-sm sbm-cal-nav" onClick={nextMes}>›</button>
        </div>

        <div className="sbm-cal-grid mb-1">
          {DIAS_SEMANA.map(d => (
            <div key={d} className="sbm-cal-head">{d}</div>
          ))}
        </div>

        <div className="sbm-cal-grid">
          {diasDelMes.map((dia, i) => {
            const citasDia = citasPorDia(dia)
            const sel = dia === diaSeleccionado
            return (
              <div
                key={i}
                className={`sbm-cal-cell ${!dia ? 'sbm-cal-empty' : ''} ${sel ? 'sbm-cal-selected' : ''}`}
                onClick={() => dia && setDiaSeleccionado(sel ? null : dia)}
              >
                {dia && (
                  <>
                    <span className={`sbm-cal-num ${esHoy(dia) ? 'sbm-cal-today' : ''}`}>{dia}</span>
                    <div className="sbm-cal-dots">
                      {citasDia.slice(0, 3).map((c, idx) => {
                        const col = ESTADO_COLORS[c.estado] || ESTADO_COLORS.AGENDADA
                        return <span key={idx} className="sbm-cal-dot" style={{ background: col.dot }} />
                      })}
                      {citasDia.length > 3 && <span className="sbm-cal-more">+{citasDia.length - 3}</span>}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className="d-flex gap-3 mt-3 flex-wrap">
          {Object.entries(ESTADO_COLORS).map(([estado, col]) => (
            <div key={estado} className="d-flex align-items-center gap-1 small">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot, display: 'inline-block' }} />
              <span style={{ color: '#555' }}>{estado.charAt(0) + estado.slice(1).toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="h-100 p-3 rounded-3" style={{ background: 'rgba(218,241,239,0.35)', border: '1px solid var(--sbm-border)', minHeight: 300 }}>
          {diaSeleccionado ? (
            <>
              <h6 className="fw-bold mb-3" style={{ color: 'var(--sbm-text-900)' }}>
                {diaSeleccionado} de {MESES[mes]}
                <span className="ms-2 badge" style={{ background: 'var(--sbm-green-200)', color: 'var(--sbm-text-900)', fontSize: '0.7rem' }}>
                  {citasDiaSeleccionado.length} cita{citasDiaSeleccionado.length !== 1 ? 's' : ''}
                </span>
              </h6>
              {citasDiaSeleccionado.length === 0 ? (
                <p className="text-muted small">Sin citas este día.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {[...citasDiaSeleccionado]
                    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
                    .map(cita => {
                      const col = ESTADO_COLORS[cita.estado] || ESTADO_COLORS.AGENDADA
                      return (
                        <div key={cita.id} className="p-2 rounded-2"
                          style={{ background: col.bg, border: `1px solid ${col.dot}22` }}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="fw-bold small" style={{ color: col.text }}>
                                {formatHora(cita.fechaHora)} — {cita.cliente?.nombre || 'Sin cliente'}
                              </div>
                              <div className="small text-muted">{cita.servicio?.tipo?.nombre || cita.servicio?.nombre || 'Servicio'} - {cita.servicio?.accion?.nombre || 'Acción'}</div>
                              {/* Selector de estado */}
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  className="sbm-estado-select mt-1"
                                  style={{ color: col.text, background: col.bg }}
                                  value={cita.estado}
                                  onChange={(e) => onCambiarEstado(cita.id, e.target.value)}
                                >
                                  {Object.keys(ESTADO_COLORS).map(e => (
                                    <option key={e} value={e}>{e.charAt(0) + e.slice(1).toLowerCase()}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <button className="btn btn-sm sbm-btn-delete ms-2"
                              style={{ padding: '0.1rem 0.45rem', fontSize: '0.7rem' }}
                              onClick={() => onEliminar(cita.id)}>✕</button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center" style={{ opacity: 0.6 }}>
              <span style={{ fontSize: '2.5rem' }}>📅</span>
              <p className="small mt-2 mb-0 text-muted">Selecciona un día para ver las citas</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sbm-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
        .sbm-cal-head { text-align: center; font-size: 0.72rem; font-weight: 700; color: var(--sbm-text-700); padding: 4px 2px; }
        .sbm-cal-cell { min-height: 58px; border-radius: 8px; padding: 4px 5px; cursor: pointer; border: 1.5px solid transparent; transition: all 0.15s; background: rgba(255,255,255,0.7); }
        .sbm-cal-cell:hover:not(.sbm-cal-empty) { border-color: var(--sbm-green-300); background: var(--sbm-green-050); }
        .sbm-cal-empty { background: transparent; cursor: default; }
        .sbm-cal-selected { border-color: var(--sbm-green-500) !important; background: var(--sbm-green-100) !important; }
        .sbm-cal-num { font-size: 0.8rem; font-weight: 600; color: var(--sbm-text-900); }
        .sbm-cal-today { background: var(--sbm-green-700); color: #fff; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; }
        .sbm-cal-dots { display: flex; gap: 2px; flex-wrap: wrap; margin-top: 2px; }
        .sbm-cal-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .sbm-cal-more { font-size: 0.55rem; color: var(--sbm-text-700); }
        .sbm-cal-nav { border: 1.5px solid var(--sbm-green-300); color: var(--sbm-text-700); background: transparent; font-size: 1.2rem; padding: 0.1rem 0.55rem; border-radius: 6px; }
        .sbm-cal-nav:hover { background: var(--sbm-green-100); border-color: var(--sbm-green-500); }
      `}</style>
    </div>
  )
}

CalendarioCitas.propTypes = {
  citas:              PropTypes.array.isRequired,
  diaSeleccionado:    PropTypes.number,
  setDiaSeleccionado: PropTypes.func.isRequired,
  onEliminar:         PropTypes.func.isRequired,
  onCambiarEstado:    PropTypes.func.isRequired,
}
CalendarioCitas.defaultProps = { diaSeleccionado: null }
