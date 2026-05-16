import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  accionesService,
  categoriasService,
  serviciosService,
  tiposService,
} from '@/services'
import {
  SERVICIOS_INITIAL_DATA,
  SERVICIOS_INITIAL_FORM,
  SERVICIOS_LABELS,
  SERVICIOS_TABS,
  buildServiciosPayload,
} from '../config/serviciosConfig'

const SERVICE_LOOKUP = {
  servicios: serviciosService,
  tipos: tiposService,
  categorias: categoriasService,
  acciones: accionesService,
}

export function useServiciosModule() {
  const [activeTab, setActiveTab] = useState('servicios')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [formData, setFormData] = useState({ ...SERVICIOS_INITIAL_FORM.servicios })
  const [servicesData, setServicesData] = useState(SERVICIOS_INITIAL_DATA)

  const servicesLookups = useMemo(() => ({
    categorias: servicesData.categorias.map((categoria) => ({
      id: String(categoria.id),
      label: categoria.nombre,
    })),
    tipos: servicesData.tipos.map((tipo) => ({
      id: String(tipo.id),
      label: `${tipo.nombre} (${tipo.categoria?.nombre || 'Sin categoría'})`,
      categoriaId: tipo.categoria?.id ? String(tipo.categoria.id) : '',
      categoriaLabel: tipo.categoria?.nombre || 'Sin categoría',
    })),
    acciones: servicesData.acciones.map((accion) => ({
      id: String(accion.id),
      label: accion.nombre,
    })),
    categoriaNameById: Object.fromEntries(
      servicesData.categorias.map((categoria) => [String(categoria.id), categoria.nombre]),
    ),
    tipoNameById: Object.fromEntries(
      servicesData.tipos.map((tipo) => [String(tipo.id), tipo.nombre]),
    ),
    accionNameById: Object.fromEntries(
      servicesData.acciones.map((accion) => [String(accion.id), accion.nombre]),
    ),
  }), [servicesData])

  const activeTabConfig = useMemo(
    () => SERVICIOS_TABS.find((tab) => tab.key === activeTab) || SERVICIOS_TABS[0],
    [activeTab],
  )

  const loadAllServicesData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [servicios, tipos, categorias, acciones] = await Promise.all([
        serviciosService.getAll(),
        tiposService.getAll(),
        categoriasService.getAll(),
        accionesService.getAll(),
      ])

      setServicesData({ servicios, tipos, categorias, acciones })
    } catch (err) {
      setError(`No se pudo cargar el módulo de servicios: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllServicesData()
  }, [loadAllServicesData])

  useEffect(() => {
    if (!success) return undefined
    const timer = setTimeout(() => setSuccess(null), 3000)
    return () => clearTimeout(timer)
  }, [success])

  const activeRows = useMemo(() => {
    if (activeTab === 'servicios') {
      return [...servicesData.servicios]
        .sort((a, b) => Number(a.id) - Number(b.id))
        .map((servicio) => ({
        ...servicio,
        tipoId: servicio.tipo?.id ? String(servicio.tipo.id) : '',
        tipoLabel: servicio.tipo?.nombre || '',
        categoriaId: servicio.tipo?.categoria?.id ? String(servicio.tipo.categoria.id) : '',
        categoriaLabel: servicio.tipo?.categoria?.nombre || '',
        accionId: servicio.accion?.id ? String(servicio.accion.id) : '',
        accionLabel: servicio.accion?.nombre || '',
        precio: servicio.precio ?? null,
        duracionMinutos: servicio.duracionMinutos ?? null,
        diasParaRetocar: servicio.diasParaRetocar ?? null,
      }))
    }

    if (activeTab === 'tipos') {
      return [...servicesData.tipos]
        .sort((a, b) => Number(a.id) - Number(b.id))
        .map((tipo) => ({
        ...tipo,
        categoriaId: tipo.categoria?.id ? String(tipo.categoria.id) : '',
        categoriaLabel: tipo.categoria?.nombre || '',
      }))
    }

    return [...servicesData[activeTab]].sort((a, b) => Number(a.id) - Number(b.id))
  }, [activeTab, servicesData])
  const activeService = SERVICE_LOOKUP[activeTab]
  const activeLabel = SERVICIOS_LABELS[activeTab]

  const openCreateForm = () => {
    setFormData({ ...SERVICIOS_INITIAL_FORM[activeTab] })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
  }

  const handleSave = async (payloadFromForm) => {
    try {
      const payload = buildServiciosPayload(activeTab, payloadFromForm)
      await activeService.create(payload)

      await loadAllServicesData()
      closeForm()
      setSuccess(`${activeLabel} guardado correctamente`)
    } catch (err) {
      setError(`No se pudo guardar el ${activeLabel.toLowerCase()}: ${err.message}`)
    }
  }

  const handleInlineUpdate = async (rowData) => {
    try {
      const payload = buildServiciosPayload(activeTab, rowData)
      await activeService.update(rowData.id, payload)
      await loadAllServicesData()
      setSuccess(`${activeLabel} actualizado correctamente`)
    } catch (err) {
      setError(`No se pudo actualizar el ${activeLabel.toLowerCase()}: ${err.message}`)
    }
  }

  const requestDelete = (item) => {
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      await activeService.delete(itemToDelete.id)
      await loadAllServicesData()
      setSuccess(`${activeLabel} eliminado correctamente`)
    } catch (err) {
      setError(`No se pudo eliminar el ${activeLabel.toLowerCase()}: ${err.message}`)
    } finally {
      closeDeleteModal()
    }
  }

  const clearError = () => setError(null)
  const clearSuccess = () => setSuccess(null)

  return {
    activeTab,
    setActiveTab,
    activeTabConfig,
    activeRows,
    servicesData,
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
    setSuccess,
    servicesLookups,
  }
}
