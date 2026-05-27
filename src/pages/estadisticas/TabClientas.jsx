import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEstadisticas, filtrarPorRango } from './useEstadisticas'
import PropTypes from 'prop-types'

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export default function TabClientas({ fechaInicio, fechaFin }) {
  const { citas, clientes, loading, error } = useEstadisticas()

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (error)   return <div className="alert alert-danger small">{error}</div>

  const citasFiltradas = filtrarPorRango(citas, fechaInicio, fechaFin)

  // Top 5 clientas (por el rango global)
  const conteo = {}
  citasFiltradas.forEach(c => {
    const id = c.cliente?.id
    if (!id) return
    conteo[id] = conteo[id] || { nombre: c.cliente?.nombre || 'Sin nombre', cantidad: 0 }
    conteo[id].cantidad++
  })
  const topClientas = Object.values(conteo).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)
  const maxCitas = Math.max(...topClientas.map(c => c.cantidad), 1)

  // Clientas nuevas por mes (filtrado por el rango personalizado)
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  fin.setHours(23, 59, 59, 999)
  
  // Calcular los meses únicos dentro del rango
  const mesesEnRango = new Set()
  let fecha = new Date(inicio)
  while (fecha <= fin) {
    const clave = `${fecha.getMonth()}-${fecha.getFullYear()}`
    mesesEnRango.add(clave)
    fecha.setMonth(fecha.getMonth() + 1)
  }
  
  const clientasNuevasPorMes = Array.from(mesesEnRango)
    .sort((a, b) => {
      const [mesA, anioA] = a.split('-').map(Number)
      const [mesB, anioB] = b.split('-').map(Number)
      return anioA - anioB || mesA - mesB
    })
    .map(clave => {
      const [mes, anio] = clave.split('-').map(Number)
      const cantidad = clientes.filter(cl => {
        if (!cl.fechaRegistro) return false
        const f = new Date(cl.fechaRegistro)
      return f.getMonth() === mes && f.getFullYear() === anio && f >= inicio && f <= fin
    }).length
    return { mes: MESES[mes], cantidad }
  })

  // Cumpleaños dentro del rango personalizado
  const cumpleMesSorted = clientes
    .filter(cl => {
      if (!cl.fechaNacimiento) return false
      const fechaNac = new Date(cl.fechaNacimiento + 'T12:00:00')
      // Buscar cumpleaños en cualquier año dentro del rango
      for (let anio = inicio.getFullYear(); anio <= fin.getFullYear(); anio++) {
        const cumplAnio = new Date(anio, fechaNac.getMonth(), fechaNac.getDate())
        if (cumplAnio >= inicio && cumplAnio <= fin) {
          return true
        }
      }
      return false
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fechaNacimiento + 'T12:00:00')
      const fechaB = new Date(b.fechaNacimiento + 'T12:00:00')
      return fechaA.getMonth() - fechaB.getMonth() || fechaA.getDate() - fechaB.getDate()
    })

  // Clientas inactivas (sin cita en el rango global)
  const clientesActivos = new Set(citasFiltradas.map(c => c.cliente?.id))
  const inactivas = clientes.filter(cl => !clientesActivos.has(cl.id))

  return (
    <div>
      <div className="row g-4">
        {/* Top 5 */}
        <div className="col-md-6">
          <h6 className="fw-bold mb-3" style={{ color: 'var(--sbm-text-900)' }}>Top 5 clientas con más citas</h6>
          {topClientas.length === 0 ? <p className="text-muted small">Sin datos.</p> : (
            <div className="d-flex flex-column gap-2">
              {topClientas.map((c, i) => (
                <div key={c.nombre} className="d-flex align-items-center gap-2">
                  <span className="fw-bold small" style={{ width: 20, color: 'var(--sbm-text-700)' }}>{i + 1}.</span>
                  <span className="small flex-grow-1">{c.nombre}</span>
                  <div style={{ width: '45%', background: '#e0f2f0', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${(c.cantidad / maxCitas) * 100}%`, height: '100%', background: 'var(--sbm-green-500)', borderRadius: 6 }} />
                  </div>
                  <span className="small fw-semibold" style={{ width: 24, textAlign: 'right' }}>{c.cantidad}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clientas nuevas por mes */}
        <div className="col-md-6">
          <h6 className="fw-bold mb-3" style={{ color: 'var(--sbm-text-900)' }}>Clientas nuevas</h6>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={clientasNuevasPorMes} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" name="Nuevas" fill="#f472b6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cumpleaños */}
        <div className="col-md-6">
          <h6 className="fw-bold mb-2" style={{ color: 'var(--sbm-text-900)' }}>🎂 Cumpleaños</h6>
          <div className="d-flex flex-column gap-1" style={{ maxHeight: 140, overflowY: 'auto' }}>
            {cumpleMesSorted.length === 0 ? (
              <p className="text-muted small mb-0">Sin cumpleaños en este rango.</p>
            ) : cumpleMesSorted.map(cl => (
              <div key={cl.id} className="d-flex align-items-center gap-2 small p-1 rounded"
                style={{ background: 'rgba(253,231,186,0.5)' }}>
                <span>{cl.nombre}</span>
                <span className="ms-auto text-muted" style={{ fontSize: '0.7rem' }}>
                  {new Date(cl.fechaNacimiento + 'T12:00:00').toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clientas inactivas */}
        <div className="col-md-6">
          <h6 className="fw-bold mb-2" style={{ color: 'var(--sbm-text-900)' }}>
            😴 Clientas inactivas
          </h6>
          <div style={{ maxHeight: 160, overflowY: 'auto' }}>
            {inactivas.length === 0 ? (
              <p className="text-muted small mb-0">¡Todas las clientas están activas!</p>
            ) : inactivas.map(cl => {
              const ultimaCita = citas
                .filter(c => c.cliente?.id === cl.id)
                .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))[0]
              return (
                <div key={cl.id} className="d-flex align-items-center gap-2 small py-1" style={{ borderBottom: '1px solid var(--sbm-border)' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sbm-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                    {cl.nombre?.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex-grow-1">{cl.nombre}</span>
                  <span className="text-muted" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                    {ultimaCita
                      ? 'Última: ' + new Date(ultimaCita.fechaHora).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
                      : 'Sin citas'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

TabClientas.propTypes = {
  fechaInicio: PropTypes.string.isRequired,
  fechaFin: PropTypes.string.isRequired,
}
