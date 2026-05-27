import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

const DateFilterContext = createContext()

const restarDias = (n) => {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]
}
const restarMeses = (n) => {
  const d = new Date(); d.setMonth(d.getMonth() - n); return d.toISOString().split('T')[0]
}
const hoy = () => new Date().toISOString().split('T')[0]

export function DateFilterProvider({ children }) {
  const [fechaInicio, setFechaInicio] = useState(() => {
    const guardada = localStorage.getItem('sbm-fecha-inicio')
    return guardada || restarDias(6)
  })
  const [fechaFin, setFechaFin] = useState(() => {
    const guardada = localStorage.getItem('sbm-fecha-fin')
    return guardada || hoy()
  })

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('sbm-fecha-inicio', fechaInicio)
  }, [fechaInicio])

  useEffect(() => {
    localStorage.setItem('sbm-fecha-fin', fechaFin)
  }, [fechaFin])

  const value = useMemo(() => ({
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin
  }), [fechaInicio, fechaFin])

  return (
    <DateFilterContext.Provider value={value}>
      {children}
    </DateFilterContext.Provider>
  )
}

DateFilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useDateFilter() {
  const context = useContext(DateFilterContext)
  if (!context) {
    throw new Error('useDateFilter debe usarse dentro de DateFilterProvider')
  }
  return context
}
