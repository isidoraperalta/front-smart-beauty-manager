import { useState, useEffect } from 'react'
import { citasService, clientesService, serviciosService } from '@/services'

export function useEstadisticas() {
  const [citas, setCitas]       = useState([])
  const [clientes, setClientes] = useState([])
  const [servicios, setServicios] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      setError(null)
      try {
        const [c, cl, sv] = await Promise.all([
          citasService.getAll(),
          clientesService.getAll(),
          serviciosService.getAll(),
        ])
        setCitas(c)
        setClientes(cl)
        setServicios(sv)
      } catch (err) {
        setError('Error al cargar datos: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return { citas, clientes, servicios, loading, error }
}

export function filtrarPorPeriodo(citas, periodo) {
  const hoy = new Date()
  return citas.filter(c => {
    const f = new Date(c.fechaHora)
    if (periodo === 'semana') {
      const lunes = new Date(hoy)
      lunes.setDate(hoy.getDate() - hoy.getDay() + 1)
      lunes.setHours(0, 0, 0, 0)
      return f >= lunes
    }
    if (periodo === 'mes')  return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear()
    if (periodo === 'anio') return f.getFullYear() === hoy.getFullYear()
    return true
  })
}

export function agruparPorMes(citas) {
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const ahora = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - (5 - i), 1)
    const mes = fecha.getMonth()
    const anio = fecha.getFullYear()
    const citasMes = citas.filter(c => {
      const f = new Date(c.fechaHora)
      return f.getMonth() === mes && f.getFullYear() === anio && c.estado === 'REALIZADA'
    })
    return {
      mes: MESES[mes],
      total: citasMes.reduce((acc, c) => acc + (c.valorTotal || 0), 0),
      cantidad: citasMes.length,
    }
  })
}

/**
 * Filtra citas por rango de fechas
 * @param {Array} citas - Array de citas
 * @param {string} fechaInicio - Formato 'YYYY-MM-DD'
 * @param {string} fechaFin - Formato 'YYYY-MM-DD'
 * @returns {Array} Citas dentro del rango
 */
export function filtrarPorRango(citas, fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) return citas
  
  const inicio = new Date(fechaInicio)
  inicio.setHours(0, 0, 0, 0)
  
  const fin = new Date(fechaFin)
  fin.setHours(23, 59, 59, 999)
  
  return citas.filter(c => {
    const fecha = new Date(c.fechaHora)
    return fecha >= inicio && fecha <= fin
  })
}

/**
 * Agrupa por mes considerando el rango global
 */
export function agruparPorMesEnRango(citas, fechaInicio, fechaFin) {
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const citasFiltradas = filtrarPorRango(citas, fechaInicio, fechaFin)
  
  if (citasFiltradas.length === 0) {
    return Array.from({ length: 6 }, (_, i) => ({
      mes: MESES[new Date().getMonth() - (5 - i) < 0 
        ? 12 + new Date().getMonth() - (5 - i) 
        : new Date().getMonth() - (5 - i)],
      total: 0,
      cantidad: 0,
    }))
  }

  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  const meses = []
  const fechaActual = new Date(inicio)
  while (fechaActual <= fin) {
    meses.push(new Date(fechaActual))
    fechaActual.setMonth(fechaActual.getMonth() + 1)
  }

  return meses.map(fecha => {
    const mes = fecha.getMonth()
    const anio = fecha.getFullYear()
    const citasMes = citasFiltradas.filter(c => {
      const f = new Date(c.fechaHora)
      return f.getMonth() === mes && f.getFullYear() === anio && c.estado === 'REALIZADA'
    })
    return {
      mes: MESES[mes],
      total: citasMes.reduce((acc, c) => acc + (c.valorTotal || 0), 0),
      cantidad: citasMes.length,
    }
  })
}
