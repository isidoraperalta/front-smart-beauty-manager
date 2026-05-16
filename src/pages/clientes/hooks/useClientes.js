import { useState, useEffect, useCallback } from 'react'
import { clientesService } from '@/services'

// ─────────────────────────────────────────────────────────────────────────────
// useClientes — custom hook
//
// Un "custom hook" es una función que empieza con "use" y puede llamar a otros
// hooks de React (useState, useEffect, etc.). Su propósito es separar la
// LÓGICA de la UI: este archivo no sabe nada de cómo se ve la pantalla.
//
// Devuelve:
//   - Datos:   clientes, loading, error, showForm, clienteAEliminar
//   - Acciones: handleGuardar, handleEditarInline, handleAbrirConfirmacionEliminar,
//               handleConfirmarEliminar, handleCancelarEliminar, setShowForm, clearError
// ─────────────────────────────────────────────────────────────────────────────

export function useClientes() {
  const [clientes, setClientes]         = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [success, setSuccess]           = useState(null) // mensaje de operación exitosa
  const [showForm, setShowForm]         = useState(false)
  const [clienteAEliminar, setClienteAEliminar] = useState(null) // ID del cliente pendiente de eliminar

  const sanitizeClientePayload = (formData) => ({
    ...formData,
    direccion: formData.direccion?.trim() || null,
    fechaNacimiento: formData.fechaNacimiento || null,
    notas: formData.notas?.trim() || null,
  })

  // Auto-cierra el mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(null), 3000)
    return () => clearTimeout(timer) // limpia el timer si el componente se desmonta antes
  }, [success])

  // ── Cargar todos los clientes desde el backend ───────────────────────────
  // useCallback evita que esta función se recree en cada render.
  // Si no lo usáramos, el useEffect de abajo se ejecutaría en bucle
  // (useEffect ve una función "nueva" → vuelve a ejecutar → nueva función...).
  const cargarClientes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await clientesService.getAll()
      setClientes(data)
    } catch (err) {
      setError('Error al cargar clientes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Carga inicial: se ejecuta una sola vez cuando el componente se monta
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarClientes()
  }, [cargarClientes])

  // ── Crear cliente (desde el modal de formulario) ─────────────────────────
  const handleGuardar = async (formData) => {
    try {
      const nuevo = await clientesService.create(sanitizeClientePayload(formData))
      // Añadimos al array sin volver a cargar del backend: [...prev, nuevo]
      // "prev" es el estado anterior; nunca se muta directamente (inmutabilidad)
      setClientes(prev => [...prev, nuevo])
      setShowForm(false)
      setSuccess('Cliente creado correctamente')
    } catch (err) {
      setError('Error al crear cliente: ' + err.message)
    }
  }

  // ── Editar inline desde AG Grid ──────────────────────────────────────────
  // AG Grid llama a esto cuando el usuario termina de editar una celda.
  // Si el backend rechaza el cambio, mostramos el error sin recargar,
  // así el usuario puede ver qué falló y corregirlo.
  const handleEditarInline = async (id, cambios) => {
    try {
      const payload = sanitizeClientePayload(cambios)
      await clientesService.update(id, payload)
      setClientes(prev => prev.map(c => c.id === id ? { ...c, ...payload } : c))
      setSuccess('Cliente actualizado correctamente')
    } catch (err) {
      setError('Error al actualizar: ' + err.message)
    }
  }

  // ── Flujo de eliminación (en dos pasos: abrir modal → confirmar) ─────────

  // Paso 1: guarda el ID y abre el modal de confirmación
  const handleAbrirConfirmacionEliminar = (id) => {
    setClienteAEliminar(id)
  }

  // Paso 2: elimina en el backend y actualiza el estado local
  const handleConfirmarEliminar = async () => {
    if (!clienteAEliminar) return
    try {
      await clientesService.delete(clienteAEliminar)
      setClientes(prev => prev.filter(c => c.id !== clienteAEliminar))
      setSuccess('Cliente eliminado correctamente')
    } catch (err) {
      setError('Error al eliminar: ' + err.message)
    } finally {
      // El modal se cierra siempre, haya error o no
      setClienteAEliminar(null)
    }
  }

  // Cancela sin eliminar
  const handleCancelarEliminar = () => setClienteAEliminar(null)

  const clearError   = () => setError(null)
  const clearSuccess = () => setSuccess(null)

  return {
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
    handleEditarInline,
    handleAbrirConfirmacionEliminar,
    handleConfirmarEliminar,
    handleCancelarEliminar,
    clienteAEliminar,
  }
}
