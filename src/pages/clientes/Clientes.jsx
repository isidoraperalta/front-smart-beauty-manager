import { AllCommunityModule } from 'ag-grid-community'
import { AgGridProvider } from 'ag-grid-react'
import Layout from '@/components/Layout'
import ClientesGrid from './grid/ClientesGrid'
import AgregarClienteModal from './modal/AgregarClienteModal'
import ConfirmarEliminacionModal from '@/components/ConfirmarEliminacionModal'
import { useClientes } from './hooks/useClientes'

// Clientes — página orquestadora del módulo clientes.
//
// Patrón: este componente no tiene lógica propia.
//   - useClientes → maneja todo el estado y las llamadas al backend
//   - ClientesGrid → muestra y edita la tabla
//   - AgregarClienteModal → formulario de creación
//   - ConfirmarEliminacionModal → diálogo antes de borrar
export default function Clientes() {
  // Desestructuramos solo lo que necesita este componente para renderizar
  const {
    clientes,
    loading,
    showForm,
    setShowForm,
    handleGuardar,
    handleAbrirConfirmacionEliminar,
    handleConfirmarEliminar,
    handleCancelarEliminar,
    clienteAEliminar,
    handleEditarInline,
  } = useClientes()

  return (
    <Layout>
      <section className="sbm-module-page">
        <div className="sbm-module-card card shadow-sm">
          <div className="card-header bg-white border-0">
            <h1 className="fs-5 fw-bold mb-0">👥 Gestión de Clientes</h1>
            <div className="sbm-header-tabs">
              <button
                type="button"
                className="sbm-tab-btn sbm-btn-add"
                onClick={() => setShowForm(true)}
              >
                + Agregar Cliente
              </button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="d-flex align-items-center gap-2 py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status" />
                <span>Cargando clientes...</span>
              </div>
            ) : (
              <AgGridProvider modules={[AllCommunityModule]}>
                <ClientesGrid
                  clientes={clientes}
                  onAbrirConfirmacion={handleAbrirConfirmacionEliminar}
                  onEditarInline={handleEditarInline}
                />
              </AgGridProvider>
            )}
          </div>
        </div>

        {/* Modal de creación — se monta solo cuando showForm es true */}
        {showForm && (
          <AgregarClienteModal
            cliente={null}
            onGuardar={handleGuardar}
            onCerrar={() => setShowForm(false)}
          />
        )}

        {/* Modal de confirmación — se monta solo cuando hay un clienteAEliminar */}
        {clienteAEliminar && (
          <ConfirmarEliminacionModal
            itemLabel={clientes.find(c => c.id === clienteAEliminar)?.nombre}
            onConfirmar={handleConfirmarEliminar}
            onCancelar={handleCancelarEliminar}
            cargando={loading}
          />
        )}
      </section>
    </Layout>
  )
}
