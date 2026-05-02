import { AllCommunityModule } from 'ag-grid-community'
import { AgGridProvider } from 'ag-grid-react'
import Layout from '@/components/Layout'
import ClientesGrid from './grid/ClientesGrid'
import AgregarClienteModal from './modal/AgregarClienteModal'
import ConfirmarEliminacionModal from './modal/ConfirmarEliminacionModal'
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
    error,
    success,
    showForm,
    setShowForm,
    setSuccess,
    clearError,
    clearSuccess,
    handleGuardar,
    handleAbrirConfirmacionEliminar,
    handleConfirmarEliminar,
    handleCancelarEliminar,
    clienteAEliminar,
    handleEditarInline,
  } = useClientes()

  return (
    <Layout>
      <div className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Clientes</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Agregar Cliente
          </button>
        </div>

        {/* Mensaje de error (desaparece al cerrar con la X) */}
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={clearError} />
          </div>
        )}

        {/* Mensaje de éxito (se cierra solo en 3s o manualmente) */}
        {success && (
          <div className="alert alert-success alert-dismissible" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={clearSuccess} />
          </div>
        )}

        {/* Spinner de carga inicial */}
        {loading ? (
          <div className="d-flex align-items-center gap-2 py-3">
            <div className="spinner-border spinner-border-sm text-primary" role="status" />
            <span>Cargando clientes...</span>
          </div>
        ) : (
          // AgGridProvider es obligatorio para que AG Grid funcione en React
          <AgGridProvider modules={[AllCommunityModule]}>
            <ClientesGrid
              clientes={clientes}
              onAbrirConfirmacion={handleAbrirConfirmacionEliminar}
              onEditarInline={handleEditarInline}
              onExportSuccess={() => setSuccess('Tabla exportada correctamente')}
            />
          </AgGridProvider>
        )}

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
            clienteId={clienteAEliminar}
            cliente={clientes.find(c => c.id === clienteAEliminar)}
            onConfirmar={handleConfirmarEliminar}
            onCancelar={handleCancelarEliminar}
            cargando={loading}
          />
        )}
      </div>
    </Layout>
  )
}
