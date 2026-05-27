import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { citasService, clientesService, serviciosService, accionesService } from '@/services'

export function useCitas() {
  const [citas, setCitas]                 = useState([])
  const [clientes, setClientes]           = useState([])
  const [servicios, setServicios]         = useState([])
  const [acciones, setAcciones]           = useState([])
  const [loading, setLoading]             = useState(false)
  const [showForm, setShowForm]           = useState(false)
  const [citaAEliminar, setCitaAEliminar] = useState(null)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    try {
      const [citasData, clientesData, serviciosData, accionesData] = await Promise.all([
        citasService.getAll(),
        clientesService.getAll(),
        serviciosService.getAll(),
        accionesService.getAll(),
      ])
      setCitas(citasData)
      setClientes(clientesData)
      setServicios(serviciosData)
      setAcciones(accionesData)
    } catch (err) {
      toast.error('Error al cargar datos: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  const handleGuardar = async (formData) => {
    try {
      await citasService.create(formData)
      toast.success('Cita agendada correctamente.')
      setShowForm(false)
      await cargarDatos()
    } catch (err) {
      toast.error('Error al guardar cita: ' + err.message)
    }
  }

  const handleAbrirConfirmacionEliminar = (id) => setCitaAEliminar(id)
  const handleCancelarEliminar          = ()  => setCitaAEliminar(null)

  const handleConfirmarEliminar = async () => {
    if (!citaAEliminar) return
    try {
      await citasService.delete(citaAEliminar)
      toast.success('Cita eliminada correctamente.')
      setCitaAEliminar(null)
      await cargarDatos()
    } catch (err) {
      toast.error('Error al eliminar cita: ' + err.message)
    }
  }

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      const citaActual = citas.find(c => c.id === id)
      if (!citaActual) {
        toast.error('Cita no encontrada.')
        return
      }
      await citasService.update(id, {
        estado: nuevoEstado,
        servicioId: citaActual.servicio?.id || citaActual.servicioId,
        clienteId: citaActual.cliente?.id || citaActual.clienteId,
        fechaHora: citaActual.fechaHora,
        lugar: citaActual.lugar,
        descuento: citaActual.descuento,
        cargoExtra: citaActual.cargoExtra,
        notas: citaActual.notas,
      })
      toast.success('Estado actualizado.')
      await cargarDatos()
    } catch (err) {
      toast.error('Error al actualizar estado: ' + err.message)
    }
  }

  const handleActualizar = async (id, formData) => {
    try {
      await citasService.update(id, formData)
      toast.success('Cita actualizada correctamente.')
      await cargarDatos()
    } catch (err) {
      toast.error('Error al actualizar cita: ' + err.message)
    }
  }

  return {
    citas, clientes, servicios, acciones, loading,
    showForm, setShowForm,
    citaAEliminar,
    handleGuardar,
    handleActualizar,
    handleCambiarEstado,
    handleConfirmarEliminar,
    handleAbrirConfirmacionEliminar,
    handleCancelarEliminar,
  }
}
