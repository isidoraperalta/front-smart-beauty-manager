import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useEstadisticas, filtrarPorRango, agruparPorMesEnRango } from './useEstadisticas'
import PropTypes from 'prop-types'

const PERIODOS = ['diario', 'semanal', 'mensual', 'anual']
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function formatClp(val) {
  return '$' + (val || 0).toLocaleString('es-CL')
}

export default function TabGanancias({ fechaInicio, fechaFin }) {
  const { citas, loading, error } = useEstadisticas()
  const [periodo, setPeriodo] = useState('mensual')

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (error)   return <div className="alert alert-danger small">{error}</div>

  // Calcular rango de días disponibles
  const inicio = new Date(fechaInicio)
  inicio.setHours(0, 0, 0, 0)
  const fin = new Date(fechaFin)
  fin.setHours(23, 59, 59, 999)
  const diasEnRango = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1

  // Determinar qué períodos son válidos según el rango
  const disponibles = ['diario']
  if (diasEnRango >= 7) disponibles.push('semanal')
  if (diasEnRango >= 30) disponibles.push('mensual')
  if (diasEnRango >= 365) disponibles.push('anual')
  const periodosDisponibles = disponibles

  // Si el período actual no está disponible, cambiar al más granular disponible
  const periodoActual = periodosDisponibles.includes(periodo) ? periodo : periodosDisponibles[0]

  // Filtrar citas por rango global
  const citasFiltradas = filtrarPorRango(citas, fechaInicio, fechaFin)
  const citasRealizadas = citasFiltradas.filter(c => c.estado === 'REALIZADA')
  const totalGanancias  = citasRealizadas.reduce((a, c) => a + (c.valorTotal || 0), 0)
  const promedioPorCita = citasRealizadas.length > 0 ? Math.round(totalGanancias / citasRealizadas.length) : 0

  const gananciasPorDia = {}
  citasRealizadas.forEach(c => {
    const fecha = new Date(c.fechaHora)
    const dia = fecha.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', weekday: 'short' })
    gananciasPorDia[dia] = (gananciasPorDia[dia] || 0) + (c.valorTotal || 0)
  })
  const diaMasGanancias = Object.entries(gananciasPorDia).sort((a, b) => b[1] - a[1])[0]

  const datosMensual = agruparPorMesEnRango(citas, fechaInicio, fechaFin)

  let datosGrafico = datosMensual
  if (periodoActual === 'diario') {
    // Generar un punto por cada día en el rango
    datosGrafico = Array.from({ length: diasEnRango }, (_, i) => {
      const d = new Date(inicio)
      d.setDate(inicio.getDate() + i)
      const citasDia = citasRealizadas.filter(c => new Date(c.fechaHora).toDateString() === d.toDateString())
      return {
        mes: d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }),
        total: citasDia.reduce((a, c) => a + (c.valorTotal || 0), 0),
      }
    })
  } else if (periodoActual === 'semanal') {
    const semanas = []
    let semanaInicio = new Date(inicio)
    // Retroceder al inicio de la semana (lunes)
    while (semanaInicio.getDay() !== 1) {
      semanaInicio.setDate(semanaInicio.getDate() - 1)
    }
    while (semanaInicio <= fin) {
      const semanaFin = new Date(semanaInicio)
      semanaFin.setDate(semanaInicio.getDate() + 6)
      const citasSemana = citasRealizadas.filter(c => {
        const f = new Date(c.fechaHora)
        return f >= semanaInicio && f <= semanaFin
      })
      const etiqueta = `${semanaInicio.getDate()}-${semanaFin.getDate()} ${MESES[semanaFin.getMonth()]}`
      semanas.push({
        mes: etiqueta,
        total: citasSemana.reduce((a, c) => a + (c.valorTotal || 0), 0)
      })
      semanaInicio.setDate(semanaInicio.getDate() + 7)
    }
    datosGrafico = semanas
  } else if (periodoActual === 'anual') {
    const inicioAnio = Number.parseInt(fechaInicio.split('-')[0], 10)
    const finAnio = Number.parseInt(fechaFin.split('-')[0], 10)
    const rango = finAnio - inicioAnio + 1
    datosGrafico = Array.from({ length: rango }, (_, i) => {
      const anio = inicioAnio + i
      const citasAnio = citasRealizadas.filter(c => new Date(c.fechaHora).getFullYear() === anio)
      return {
        mes: String(anio),
        total: citasAnio.reduce((a, c) => a + (c.valorTotal || 0), 0)
      }
    })
  }

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4">
          <div className="p-3 rounded-3" style={{ background: 'linear-gradient(135deg,#daf1ef,#faffff)', border: '1px solid var(--sbm-border)' }}>
            <div className="small text-muted mb-1">Total de ganancias</div>
            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--sbm-text-900)' }}>{formatClp(totalGanancias)}</div>
            <div className="small" style={{ color: '#22c55e' }}>Citas realizadas: {citasRealizadas.length}</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="p-3 rounded-3" style={{ background: 'linear-gradient(135deg,#ede9fe,#faf5ff)', border: '1px solid #c4b5fd' }}>
            <div className="small text-muted mb-1">Promedio por cita</div>
            <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#6d28d9' }}>{formatClp(promedioPorCita)}</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="p-3 rounded-3" style={{ background: 'linear-gradient(135deg,#fef9c3,#fffbeb)', border: '1px solid #fde68a' }}>
            <div className="small text-muted mb-1">Día con más ganancias</div>
            <div className="fw-bold" style={{ fontSize: '1.2rem', color: '#92400e', textTransform: 'capitalize' }}>
              {diaMasGanancias ? diaMasGanancias[0] : '—'}
            </div>
            {diaMasGanancias && <div className="small text-muted">{formatClp(diaMasGanancias[1])}</div>}
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold mb-0" style={{ color: 'var(--sbm-text-900)' }}>Ganancias en el tiempo</h6>
        <div className="d-flex gap-1">
          {periodosDisponibles.map(p => (
            <button key={p} className={`sbm-tab-btn ${periodoActual === p ? 'sbm-tab-btn-active' : ''}`}
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
              onClick={() => setPeriodo(p)}
              title={diasEnRango < 7 && p !== 'diario' ? `Se requieren al menos ${p === 'semanal' ? '7 días' : p === 'mensual' ? '30 días' : '365 días'}` : ''}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={datosGrafico} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f0" />
          <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={v => '$' + (v/1000).toFixed(0) + 'k'} tick={{ fontSize: 11 }} />
          <Tooltip formatter={v => formatClp(v)} />
          <Legend />
          <Line type="monotone" dataKey="total" name="Ganancias" stroke="#3fa59e" strokeWidth={2.5} dot={{ fill: '#3fa59e', r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

TabGanancias.propTypes = {
  fechaInicio: PropTypes.string.isRequired,
  fechaFin: PropTypes.string.isRequired,
}
