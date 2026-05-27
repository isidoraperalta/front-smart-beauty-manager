import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Layout from "@/components/Layout"
import sbmLogoClean from "../../assets/smart-beauty-manager-logo-clean.jpeg"
import { citasService } from '@/services'

function esHoy(fechaHora) {
  const hoy = new Date()
  const f = new Date(fechaHora)
  return f.getFullYear() === hoy.getFullYear() &&
    f.getMonth() === hoy.getMonth() &&
    f.getDate() === hoy.getDate()
}

function pluralCita(n) {
  return n === 1 ? '1 cita' : `${n} citas`
}

function pluralServicio(n) {
  return n === 1 ? '1 servicio realizado' : `${n} servicios realizados`
}

function formatHora(fechaHora) {
  if (!fechaHora) return null
  return new Date(fechaHora).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

function useTodayCitas() {
  const [stats, setStats] = useState({ citasHoy: [], cargando: true })

  useEffect(() => {
    citasService.getAll()
      .then(all => {
        const citasHoy = all.filter(c => esHoy(c.fechaHora))
        setStats({ citasHoy, cargando: false })
      })
      .catch(() => setStats({ citasHoy: [], cargando: false }))
  }, [])

  return stats
}

function KpiCard({ icono, titulo, cargando, children }) {
  return (
    <div className="col-md-4">
      <div className="sbm-home-kpi p-4 h-100 d-flex flex-column gap-1">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span style={{ fontSize: '1.5rem' }}>{icono}</span>
          <p className="text-muted mb-0 small fw-semibold">{titulo}</p>
        </div>
        {cargando
          ? <div className="spinner-border spinner-border-sm text-primary" />
          : children}
      </div>
    </div>
  )
}

KpiCard.propTypes = {
  icono:    PropTypes.string.isRequired,
  titulo:   PropTypes.string.isRequired,
  cargando: PropTypes.bool.isRequired,
  children: PropTypes.node,
}
KpiCard.defaultProps = { children: null }

function AgendaHoyKpi({ citasHoy, cargando }) {
  const ordenadas = [...citasHoy].sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
  const primera = ordenadas.at(0)
  const ultima  = ordenadas.at(-1)

  const detalle = citasHoy.length === 0
    ? 'Sin citas para hoy.'
    : `Primera: ${formatHora(primera?.fechaHora)} · Última: ${formatHora(ultima?.fechaHora)}`

  return (
    <KpiCard icono="📅" titulo="Agenda de hoy" cargando={cargando}>
      <h2 className="h5 mb-0">{pluralCita(citasHoy.length)} programada{citasHoy.length === 1 ? '' : 's'}</h2>
      <p className="small text-muted mt-1 mb-0">{detalle}</p>
    </KpiCard>
  )
}
AgendaHoyKpi.propTypes = { citasHoy: PropTypes.array.isRequired, cargando: PropTypes.bool.isRequired }

function PendientesKpi({ pendientes, cargando }) {
  const confirmadas = pendientes.filter(c => c.estado === 'CONFIRMADA').length
  const agendadas   = pendientes.filter(c => c.estado === 'AGENDADA').length

  const sufConfirmadas = confirmadas === 1 ? '' : 's'
  const sufAgendadas   = agendadas   === 1 ? '' : 's'
  const detalle = pendientes.length === 0
    ? 'Todas las citas de hoy están resueltas.'
    : `${confirmadas} confirmada${sufConfirmadas}, ${agendadas} agendada${sufAgendadas}`

  return (
    <KpiCard icono="⏳" titulo="Pendientes hoy" cargando={cargando}>
      <h2 className="h5 mb-0">{pluralCita(pendientes.length)} por atender</h2>
      <p className="small text-muted mt-1 mb-0">{detalle}</p>
    </KpiCard>
  )
}
PendientesKpi.propTypes = { pendientes: PropTypes.array.isRequired, cargando: PropTypes.bool.isRequired }

function IngresosDiaKpi({ realizadas, ingresosDia, cargando }) {
  const detalle = realizadas.length === 0
    ? 'Sin servicios realizados aún.'
    : pluralServicio(realizadas.length)

  return (
    <KpiCard icono="💰" titulo="Ingresos del día" cargando={cargando}>
      <h2 className="h5 mb-0">${ingresosDia.toLocaleString('es-CL')}</h2>
      <p className="small text-muted mt-1 mb-0">{detalle}</p>
    </KpiCard>
  )
}
IngresosDiaKpi.propTypes = { realizadas: PropTypes.array.isRequired, ingresosDia: PropTypes.number.isRequired, cargando: PropTypes.bool.isRequired }

export default function Home() {
  const { citasHoy, cargando } = useTodayCitas()

  const pendientes  = citasHoy.filter(c => c.estado === 'AGENDADA' || c.estado === 'CONFIRMADA')
  const realizadas  = citasHoy.filter(c => c.estado === 'REALIZADA')
  const ingresosDia = realizadas.reduce((sum, c) => sum + (c.valorTotal || 0), 0)

  return (
    <Layout>
      <section className="sbm-module-page pb-3 pb-md-4 d-flex flex-column gap-4">
        <div className="sbm-home-hero p-4 p-md-5">
          <div className="row g-4 align-items-start">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold mb-3">🏠 Bienvenida</h1>
              <p className="fs-4 mb-2" style={{ color: 'var(--sbm-text-900)', fontWeight: 700 }}>
                Smart Beauty Manager
              </p>
              <p className="mb-1 fs-6 text-muted">Tu espacio, tu agenda, tu mejor versión.</p>
              <p className="mb-0 fs-6 text-muted">Organiza tus citas, gestiona tus clientes y haz crecer tu negocio.</p>
            </div>
            <div className="col-lg-6 d-flex flex-column gap-2 align-items-lg-end">
              <img
                src={sbmLogoClean}
                alt="Logo Smart Beauty Manager"
                className="img-fluid rounded-4 sbm-home-image"
              />
            </div>
          </div>
        </div>

        <div className="row g-3">
          <AgendaHoyKpi    citasHoy={citasHoy}   cargando={cargando} />
          <PendientesKpi   pendientes={pendientes} cargando={cargando} />
          <IngresosDiaKpi  realizadas={realizadas} ingresosDia={ingresosDia} cargando={cargando} />
        </div>
      </section>
    </Layout>
  );
}
