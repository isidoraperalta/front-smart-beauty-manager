// ConfirmarEliminacionModal
//
// Diálogo de confirmación antes de eliminar un cliente.
// Bloquea los botones mientras la petición DELETE está en curso (prop cargando).
//
// Props:
//   clienteId   → ID del cliente a eliminar (si es null, el modal no se muestra)
//   cliente     → objeto cliente, para mostrar su nombre en el mensaje
//   onConfirmar → llama al backend y cierra el modal
//   onCancelar  → cierra el modal sin hacer nada
//   cargando    → true mientras la petición está en vuelo (muestra spinner)
export default function ConfirmarEliminacionModal({
  clienteId,
  cliente,
  onConfirmar,
  onCancelar,
  cargando = false
}) {
  if (!clienteId) return null

  const nombreCliente = cliente?.nombre || 'este cliente'

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Confirmar Eliminación</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancelar}
              disabled={cargando}
            />
          </div>

          <div className="modal-body">
            <p className="mb-3">
              ¿Estás seguro de que deseas eliminar a <strong>{nombreCliente}</strong>?
            </p>
            <p className="text-muted small mb-0">
              Esta acción no se puede deshacer. Si existen registros relacionados, el sistema bloqueará la eliminación.
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelar}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn sbm-btn-delete"
              onClick={onConfirmar}
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                  />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
