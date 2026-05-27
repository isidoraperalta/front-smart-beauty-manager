import PropTypes from 'prop-types'

// ConfirmarEliminacionModal — modal genérico de confirmación de borrado.
//
// Props:
//   title      → título del modal (default: "Confirmar Eliminación")
//   itemLabel  → nombre del elemento a eliminar (se muestra en el cuerpo)
//   onConfirmar → callback al confirmar
//   onCancelar  → callback al cancelar
//   cargando   → true mientras la petición está en vuelo (muestra spinner)
export default function ConfirmarEliminacionModal({
  title = 'Confirmar Eliminación',
  itemLabel,
  onConfirmar,
  onCancelar,
  cargando = false,
}) {
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancelar}
              disabled={cargando}
            />
          </div>

          <div className="modal-body">
            {itemLabel ? (
              <>
                <p className="mb-2">
                  ¿Estás segura de que deseas eliminar <strong>{itemLabel}</strong>?
                </p>
                <p className="text-muted small mb-0">
                  Esta acción no se puede deshacer. Si existen registros relacionados, el sistema bloqueará la eliminación.
                </p>
              </>
            ) : (
              <p className="mb-0">
                ¿Estás segura de que deseas eliminar este elemento? Esta acción no se puede deshacer.
              </p>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
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
                <><span className="spinner-border spinner-border-sm me-2" />Eliminando...</>
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

ConfirmarEliminacionModal.propTypes = {
  title:      PropTypes.string,
  itemLabel:  PropTypes.string,
  onConfirmar: PropTypes.func.isRequired,
  onCancelar:  PropTypes.func.isRequired,
  cargando:   PropTypes.bool,
}
