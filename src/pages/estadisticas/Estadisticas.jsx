import { useState, useCallback } from 'react'
import Layout from '@/components/Layout'
import { useDateFilter } from '@/context/DateFilterContext'
import TabGanancias from './TabGanancias'
import TabClientas from './TabClientas'
import TabServicios from './TabServicios'
import TabCitas from './TabCitas'

const TABS = [
  { key: 'ganancias', label: '💰 Ganancias' },
  { key: 'clientas',  label: '👥 Clientas'  },
  { key: 'servicios', label: '✨ Servicios'  },
  { key: 'citas',     label: '📅 Citas'      },
]

const hoy = () => new Date().toISOString().split('T')[0]
const restarDias = (n) => {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]
}
const restarMeses = (n) => {
  const d = new Date(); d.setMonth(d.getMonth() - n); return d.toISOString().split('T')[0]
}

const PRESETS = [
  { label: '7D',  getInicio: () => restarDias(6) },
  { label: '30D', getInicio: () => restarDias(29) },
  { label: '3M',  getInicio: () => restarMeses(3) },
  { label: '6M',  getInicio: () => restarMeses(6) },
  { label: '1A',  getInicio: () => restarMeses(12) },
]

const determinarPreset = (inicio, fin) => {
  if (fin !== hoy()) return null
  for (const p of PRESETS) {
    if (p.getInicio() === inicio) return p.label
  }
  return null
}

export default function Estadisticas() {
  const { fechaInicio, setFechaInicio, fechaFin, setFechaFin } = useDateFilter()
  const [tabActiva, setTabActiva]     = useState('ganancias')
  const [presetActivo, setPresetActivo] = useState(() => determinarPreset(fechaInicio, fechaFin))

  const aplicarPreset = useCallback((preset) => {
    setFechaInicio(preset.getInicio())
    setFechaFin(hoy())
    setPresetActivo(preset.label)
  }, [setFechaInicio, setFechaFin])

  const handleInicioChange = (e) => {
    setFechaInicio(e.target.value)
    setPresetActivo(null)
  }
  const handleFinChange = (e) => {
    setFechaFin(e.target.value)
    setPresetActivo(null)
  }

  return (
    <Layout>
      <div className="sbm-module-page">
        <div className="sbm-module-card card shadow-sm">
          <div className="card-header">
            <h1 className="fs-5 fw-bold mb-0">📊 Estadísticas</h1>
            <div className="sbm-header-tabs">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`sbm-tab-btn ${tabActiva === t.key ? 'sbm-tab-btn-active' : ''}`}
                  onClick={() => setTabActiva(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro global de fechas — en su propia sección */}
          <div style={{ borderBottom: '1px solid var(--sbm-border)', padding: '0.75rem 1.25rem', fontSize: '0.82rem' }}>
            <div className="d-flex align-items-flex-start gap-3 flex-wrap">
              {/* Presets */}
              <div>
                <small className="text-muted d-block mb-1">Presets</small>
                <div className="d-flex gap-1">
                  {PRESETS.map(p => (
                    <button
                      key={p.label}
                      onClick={() => aplicarPreset(p)}
                      className={`btn btn-sm ${presetActivo === p.label ? 'sbm-preset-active' : 'sbm-preset-btn'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Rango personalizado */}
              <div>
                <small className="text-muted d-block mb-1">Rango personalizado</small>
                <div className="d-flex align-items-center gap-1">
                  <input
                    id="inicio"
                    type="date"
                    className="form-control form-control-sm sbm-date-input"
                    value={fechaInicio}
                    onChange={handleInicioChange}
                    max={fechaFin}
                  />
                  <span className="text-muted px-1">—</span>
                  <input
                    id="fin"
                    type="date"
                    className="form-control form-control-sm sbm-date-input"
                    value={fechaFin}
                    onChange={handleFinChange}
                    min={fechaInicio}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-body" style={{ overflow: 'auto' }}>
            {tabActiva === 'ganancias' && <TabGanancias fechaInicio={fechaInicio} fechaFin={fechaFin} />}
            {tabActiva === 'clientas'  && <TabClientas fechaInicio={fechaInicio} fechaFin={fechaFin} />}
            {tabActiva === 'servicios' && <TabServicios fechaInicio={fechaInicio} fechaFin={fechaFin} />}
            {tabActiva === 'citas'     && <TabCitas fechaInicio={fechaInicio} fechaFin={fechaFin} />}
          </div>
        </div>
      </div>
    </Layout>
  )
}
