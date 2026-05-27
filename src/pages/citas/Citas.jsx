import { useState } from 'react'
import Layout from '@/components/Layout'
import CalendarioCitas from './CalendarioCitas'
import ListaCitas from './ListaCitas'
import { useCitas } from './hooks/useCitas'
import AgregarCitaModal from './modal/AgregarCitaModal'
import ConfirmarEliminacionModal from '@/components/ConfirmarEliminacionModal'

export default function Citas() {
  const [vista, setVista] = useState('calendario')
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date().getDate())
  const {
    citas, clientes, servicios, acciones, loading, showForm, setShowForm,
    citaAEliminar, handleGuardar, handleActualizar, handleCambiarEstado,
    handleConfirmarEliminar, handleAbrirConfirmacionEliminar,
    handleCancelarEliminar,
  } = useCitas()

  return (
    <Layout>
      <div className="sbm-module-page">
        <div className="sbm-module-card card shadow-sm">
          <div className="card-header">
            <h1 className="fs-5 fw-bold mb-0">📅 Gestión de Citas</h1>
            <div className="sbm-header-tabs">
              <button
                className={`sbm-tab-btn ${vista === 'calendario' ? 'sbm-tab-btn-active' : ''}`}
                onClick={() => setVista('calendario')}
              >
                Calendario
              </button>
              <button
                className={`sbm-tab-btn ${vista === 'lista' ? 'sbm-tab-btn-active' : ''}`}
                onClick={() => setVista('lista')}
              >
                Lista
              </button>
              <button
                className="sbm-tab-btn ms-2"
                style={{ background: 'var(--sbm-green-500)', borderColor: 'var(--sbm-green-500)', color: '#fff' }}
                onClick={() => setShowForm(true)}
              >
                + Agregar Cita
              </button>
            </div>
          </div>

          <div className="card-body" style={{ overflow: 'auto' }}>
            {loading && (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            )}
            {!loading && vista === 'calendario' && (
              <CalendarioCitas
                citas={citas}
                diaSeleccionado={diaSeleccionado}
                setDiaSeleccionado={setDiaSeleccionado}
                onEliminar={handleAbrirConfirmacionEliminar}
                onCambiarEstado={handleCambiarEstado}
              />
            )}
            {!loading && vista === 'lista' && (
              <ListaCitas
                citas={citas}
                clientes={clientes}
                servicios={servicios}
                acciones={acciones}
                onEliminar={handleAbrirConfirmacionEliminar}
                onActualizar={handleActualizar}
              />
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <AgregarCitaModal onGuardar={handleGuardar} onCerrar={() => setShowForm(false)} />
      )}
      {citaAEliminar && (
        <ConfirmarEliminacionModal
          title="Eliminar cita"
          onConfirmar={handleConfirmarEliminar}
          onCancelar={handleCancelarEliminar}
        />
      )}
    </Layout>
  )
}
