import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts'
import { useEstadisticas, filtrarPorRango } from './useEstadisticas'
import PropTypes from 'prop-types'

const COLORS   = ['#3fa59e','#f472b6','#a78bfa','#fb923c','#34d399','#60a5fa']
const MESES    = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export default function TabServicios({ fechaInicio, fechaFin }) {
  const { citas, loading, error } = useEstadisticas()

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (error)   return <div className="alert alert-danger small">{error}</div>

  const citasFiltradas = filtrarPorRango(citas, fechaInicio, fechaFin)

  const conteoPorServicio   = {}
  const gananciasPorServicio = {}
  citasFiltradas.forEach(c => {
    const nombre = c.servicio?.tipo?.nombre || c.servicio?.nombre || 'Desconocido'
    conteoPorServicio[nombre]    = (conteoPorServicio[nombre]    || 0) + 1
    gananciasPorServicio[nombre] = (gananciasPorServicio[nombre] || 0) + (c.valorTotal || 0)
  })

  const datosServicios = Object.entries(conteoPorServicio)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)

  const datosMasS   = datosServicios.slice(0, 5)
  const datosMenosS = [...datosServicios].sort((a, b) => a.cantidad - b.cantidad).slice(0, 5)

  const total = datosServicios.reduce((a, s) => a + s.cantidad, 0)
  const datosPie = datosServicios.slice(0, 6).map(s => ({
    name: s.nombre,
    value: Math.round((s.cantidad / (total || 1)) * 100),
  }))

  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  const ahora = new Date()
  const nombresServicios = Object.keys(conteoPorServicio).slice(0, 4)
  const datosPorMes = Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - (5 - i), 1)
    const entry = { mes: MESES[fecha.getMonth()] }
    nombresServicios.forEach(nombre => {
      entry[nombre] = citasFiltradas.filter(c => {
        const f = new Date(c.fechaHora)
        return f.getMonth() === fecha.getMonth() && f.getFullYear() === fecha.getFullYear() &&
          (c.servicio?.tipo?.nombre || c.servicio?.nombre) === nombre
      }).length
    })
    return entry
  })

  const topGanancias = Object.entries(gananciasPorServicio).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div>
      <div className="row g-4">
        <div className="col-md-6">
          <h6 className="fw-bold mb-2" style={{ color: 'var(--sbm-text-900)' }}>Servicios más solicitados</h6>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={datosMasS} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f0" />
              <XAxis dataKey="nombre" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" name="Citas" radius={[4,4,0,0]}>
                {datosMasS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h6 className="fw-bold mb-2" style={{ color: 'var(--sbm-text-900)' }}>Servicios menos solicitados</h6>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={datosMenosS} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f0" />
              <XAxis dataKey="nombre" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" name="Citas" radius={[4,4,0,0]}>
                {datosMenosS.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h6 className="fw-bold mb-2" style={{ color: 'var(--sbm-text-900)' }}>Distribución % de citas por servicio</h6>
          {datosPie.length === 0 ? (
            <p className="text-muted small">Sin datos para el período seleccionado.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={datosPie} dataKey="value" nameKey="name" cx="45%" cy="45%" outerRadius={70}
                  label={({ name, value }) => `${value}%`}>
                  {datosPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="col-md-6">
          <h6 className="fw-bold mb-2" style={{ color: 'var(--sbm-text-900)' }}>Servicios con más ganancias</h6>
          {topGanancias.length === 0 ? (
            <p className="text-muted small">Sin datos.</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {topGanancias.map(([nombre, valor], i) => (
                <div key={nombre} className="d-flex align-items-center gap-2 small">
                  <span className="fw-bold" style={{ color: COLORS[i % COLORS.length], width: 16 }}>{i + 1}.</span>
                  <span className="flex-grow-1">{nombre}</span>
                  <span className="fw-semibold">${valor.toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        
      </div>
    </div>
  )
}

TabServicios.propTypes = {
  fechaInicio: PropTypes.string.isRequired,
  fechaFin: PropTypes.string.isRequired,
}
