import PropTypes from 'prop-types'

export default function ConfirmarEliminacionServiciosModal({
  title,
  itemLabel,
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel} disabled={loading} />
          </div>

          <div className="modal-body">
            <p className="mb-2">
              ¿Deseas eliminar <strong>{itemLabel}</strong>?
            </p>
            <p className="text-muted small mb-0">
              Esta acción no se puede deshacer. Si existen relaciones activas, la eliminación será rechazada automáticamente.
            </p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="button" className="btn sbm-btn-delete" onClick={onConfirm} disabled={loading}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

ConfirmarEliminacionServiciosModal.propTypes = {
  title: PropTypes.string.isRequired,
  itemLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}
