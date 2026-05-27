import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { useEstadisticas, filtrarPorRango } from './useEstadisticas'
import PropTypes from 'prop-types'

const MESES    = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const ESTADO_COLORS = {
  AGENDADA:   '#3b82f6',
  CONFIRMADA: '#22c55e',
  REALIZADA:  '#16a34a',
  CANCELADA:  '#ef4444',
}

export default function TabCitas({ fechaInicio, fechaFin }) {
  const { citas, loading, error } = useEstadisticas()

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (error)   return <div className="alert alert-danger small">{error}</div>

  const citasFiltradas = filtrarPorRango(citas, fechaInicio, fechaFin)
  const total = citasFiltradas.length

  const datosPorEstado = ['AGENDADA','CONFIRMADA','REALIZADA','CANCELADA'].map(e => ({
    estado: e.charAt(0) + e.slice(1).toLowerCase(),
    cantidad: citasFiltradas.filter(c => c.estado === e).length,
    color: ESTADO_COLORS[e],
  }))

  const canceladas = citasFiltradas.filter(c => c.estado === 'CANCELADA').length
  const tasaCancelacion = total > 0 ? Math.round((canceladas / total) * 100) : 0

  // Buscar TODAS las citas realizadas del sistema que tienen diasParaRetocar
  const todasCitasRealizadas = citas.filter(c => {
    const diasRetoque = c.diasParaRetocar || c.servicio?.diasParaRetocar
    return c.estado === 'REALIZADA' && diasRetoque && diasRetoque > 0
  })
  
  // Filtrar solo las que tienen retoque EN el rango seleccionado
  const citasConRetoque = todasCitasRealizadas.filter(c => {
    const diasRetoque = c.diasParaRetocar || c.servicio?.diasParaRetocar
    const fechaRetoque = new Date(c.fechaHora)
    fechaRetoque.setUTCDate(fechaRetoque.getUTCDate() + diasRetoque + 1)
    const fechaRetoqueSolo = fechaRetoque.toISOString().split('T')[0]
    return fechaRetoqueSolo >= fechaInicio && fechaRetoqueSolo <= fechaFin
  })
  
  // Agregar fecha de retoque a cada cita
  const citasConRetoqueDetalle = citasConRetoque.map(c => {
    const diasRetoque = c.diasParaRetocar || c.servicio?.diasParaRetocar
    const fechaRetoque = new Date(c.fechaHora)
    fechaRetoque.setUTCDate(fechaRetoque.getUTCDate() + diasRetoque + 1)
    return { ...c, fechaRetoque: fechaRetoque.toISOString().split('T')[0], diasRetoque }
  })

  return (
    <div>
      <div className="row g-4">
        <div className="col-md-7">
          <h6 className="fw-bold mb-2" style={{ color: 'var(--sbm-text-900)' }}>Citas por estado</h6>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={datosPorEstado} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f0" />
              <XAxis dataKey="estado" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" name="Citas" radius={[4,4,0,0]}>
                {datosPorEstado.map((d) => <Cell key={d.estado} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-5">
          <h6 className="fw-bold mb-3" style={{ color: 'var(--sbm-text-900)' }}>Tasa de cancelación</h6>
          <div className="text-center py-3">
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>{tasaCancelacion}%</div>
            <div className="small text-muted mt-1">{canceladas} de {total} citas</div>
          </div>
          {total > 0 && (
            <div className="mt-2">
              <div className="d-flex rounded overflow-hidden" style={{ height: 12 }}>
                {datosPorEstado.filter(d => d.cantidad > 0).map((d) => (
                  <div key={d.estado} style={{ width: `${(d.cantidad / total) * 100}%`, background: d.color }} title={`${d.estado}: ${d.cantidad}`} />
                ))}
              </div>
              <div className="d-flex flex-wrap gap-2 mt-1">
                {datosPorEstado.map(d => (
                  <div key={d.estado} className="d-flex align-items-center gap-1" style={{ fontSize: '0.65rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                    {d.estado} ({d.cantidad})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-12">
          <h6 className="fw-bold mb-3" style={{ color: 'var(--sbm-text-900)' }}>🔧 Recordatorio: Retoques en el período</h6>
          
          {citasConRetoqueDetalle.length === 0 ? (
            <div className="p-4 rounded-3 text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <p className="text-muted small mb-0">✓ No hay citas con retoque en este período</p>
            </div>
          ) : (
            <div style={{ 
              maxHeight: '280px',
              overflowY: 'auto',
              border: '1px solid var(--sbm-border)',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <table className="table table-sm table-hover mb-0" style={{ fontSize: '0.8rem', marginBottom: 0 }}>
                <thead style={{ 
                  background: 'linear-gradient(135deg,#daf1f7,#e8f9fc)',
                  borderBottom: '1px solid #b8e6f0',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}>
                  <tr>
                    <th className="fw-bold" style={{ color: '#0c7a8a', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.75rem' }}>Cliente</th>
                    <th className="fw-bold" style={{ color: '#0c7a8a', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.75rem' }}>Servicio</th>
                    <th className="fw-bold text-center" style={{ color: '#0c7a8a', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.75rem' }}>Fecha cita</th>
                    <th className="fw-bold text-center" style={{ color: '#0c7a8a', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.75rem' }}>Días</th>
                    <th className="fw-bold text-center" style={{ color: '#0c7a8a', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.75rem' }}>Fecha retoque</th>
                  </tr>
                </thead>
                <tbody>
                  {[...citasConRetoqueDetalle]
                    .sort((a, b) => new Date(a.fechaRetoque) - new Date(b.fechaRetoque))
                    .map((cita, idx) => (
                      <tr key={cita.id} style={{ 
                        background: idx % 2 === 0 ? '#ffffff' : 'rgba(218,241,239,0.25)',
                        transition: 'background 0.15s',
                        borderBottom: '1px solid rgba(220,220,220,0.5)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(218,241,239,0.5)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : 'rgba(218,241,239,0.25)'}
                      >
                        <td style={{ paddingTop: '0.35rem', paddingBottom: '0.35rem', verticalAlign: 'middle' }}>
                          <div className="fw-600" style={{ color: 'var(--sbm-text-900)' }}>{cita.cliente?.nombre || '—'}</div>
                        </td>
                        <td style={{ paddingTop: '0.35rem', paddingBottom: '0.35rem', verticalAlign: 'middle' }}>
                          <div className="fw-500" style={{ color: 'var(--sbm-text-800)', lineHeight: '1.2' }}>{cita.servicio?.tipo?.nombre || '—'}</div>
                          <div style={{ color: '#0c7a8a', fontSize: '0.7rem', lineHeight: '1.1' }}>{cita.servicio?.accion?.nombre || '—'}</div>
                        </td>
                        <td className="text-center" style={{ paddingTop: '0.35rem', paddingBottom: '0.35rem', verticalAlign: 'middle' }}>
                          <span style={{ color: 'var(--sbm-text-800)', fontSize: '0.75rem' }}>
                            {new Date(cita.fechaHora).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="text-center" style={{ paddingTop: '0.35rem', paddingBottom: '0.35rem', verticalAlign: 'middle' }}>
                          <span style={{ color: '#0c7a8a', fontSize: '0.75rem', fontWeight: 600 }}>
                            {cita.diasRetoque}
                          </span>
                        </td>
                        <td className="text-center" style={{ paddingTop: '0.35rem', paddingBottom: '0.35rem', verticalAlign: 'middle' }}>
                          <span className="badge" style={{ 
                            background: '#06b6d4',
                            fontSize: '0.7rem',
                            padding: '0.25rem 0.5rem',
                            fontWeight: 600
                          }}>
                            {new Date(cita.fechaRetoque).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

TabCitas.propTypes = {
  fechaInicio: PropTypes.string.isRequired,
  fechaFin: PropTypes.string.isRequired,
}
