import { AllCommunityModule } from 'ag-grid-community'
import { AgGridProvider } from 'ag-grid-react'
import Layout from '@/components/Layout'
import ServiciosGrid from './grid/ServiciosGrid'
import ServiciosModal from './modal/ServiciosModal'
import ConfirmarEliminacionModal from '@/components/ConfirmarEliminacionModal'
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
      <section className="sbm-module-page">
        <div className="sbm-module-card card shadow-sm">
          <div className="card-header bg-white border-0">
            <h1 className="fs-5 fw-bold mb-0">✨ Gestión de Servicios</h1>
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
              <button
                type="button"
                className="sbm-tab-btn sbm-btn-add"
                onClick={openCreateForm}
              >
                + {activeTabConfig.createLabel}
              </button>
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
        <ConfirmarEliminacionModal
          title={`Eliminar ${activeTabConfig.singular}`}
          itemLabel={String(itemLabel)}
          onConfirmar={confirmDelete}
          onCancelar={closeDeleteModal}
        />
      )}
    </Layout>
  )
}
