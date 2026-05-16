import { AllCommunityModule } from 'ag-grid-community'
import { AgGridProvider } from 'ag-grid-react'
import Layout from '@/components/Layout'
import ServiciosGrid from './grid/ServiciosGrid'
import ServiciosModal from './modal/ServiciosModal'
import ConfirmarEliminacionServiciosModal from './modal/ConfirmarEliminacionServiciosModal'
import { useServiciosModule } from './hooks/useServiciosModule'
import { SERVICIOS_TABS } from './config/serviciosConfig'

export default function ServiciosGestion() {
  const {
    activeTab,
    setActiveTab,
    activeTabConfig,
    activeRows,
    servicesData,
    servicesLookups,
    formData,
    loading,
    error,
    success,
    showForm,
    showDeleteModal,
    itemToDelete,
    openCreateForm,
    closeForm,
    handleSave,
    handleInlineUpdate,
    requestDelete,
    closeDeleteModal,
    confirmDelete,
    clearError,
    clearSuccess,
  } = useServiciosModule()

  let itemLabel = ''
  if (itemToDelete) {
    if (activeTab === 'servicios') {
      itemLabel = [itemToDelete.tipoLabel, itemToDelete.accionLabel].filter(Boolean).join(' + ')
    } else {
      itemLabel = itemToDelete.nombre || String(itemToDelete.id)
    }
  }

  return (
    <Layout>
      <section className="sbm-module-page py-3 py-md-4">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={clearError} />
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={clearSuccess} />
          </div>
        )}

        <div className="card border-0 shadow-sm sbm-module-card">
          <div className="card-header bg-white border-0">
            <h1 className="h4 mb-0">Gestión de Servicios</h1>
            <div className="sbm-header-tabs">
              {SERVICIOS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`sbm-tab-btn${activeTab === tab.key ? ' sbm-tab-btn-active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="d-flex align-items-center gap-2 py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status" />
                <span>Cargando modulo de servicios...</span>
              </div>
            ) : (
              <AgGridProvider modules={[AllCommunityModule]}>
                <ServiciosGrid
                  key={activeTab}
                  entityKey={activeTab}
                  rowData={activeRows}
                  servicesLookups={servicesLookups}
                  onInlineUpdate={handleInlineUpdate}
                  onDelete={requestDelete}
                  onAdd={openCreateForm}
                  addLabel={activeTabConfig.createLabel}
                />
              </AgGridProvider>
            )}
          </div>
        </div>
      </section>

      {showForm && (
        <ServiciosModal
          key={`${activeTab}-new`}
          entityKey={activeTab}
          title={`Nuevo ${activeTabConfig.singular}`}
          initialData={formData}
          onClose={closeForm}
          onSave={handleSave}
          servicesData={{
            categorias: servicesData.categorias,
            tipos: servicesData.tipos,
            acciones: servicesData.acciones,
          }}
        />
      )}

      {showDeleteModal && itemToDelete && (
        <ConfirmarEliminacionServiciosModal
          title={`Eliminar ${activeTabConfig.singular}`}
          itemLabel={String(itemLabel)}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </Layout>
  )
}
