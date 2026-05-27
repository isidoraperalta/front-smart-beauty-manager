import PropTypes from 'prop-types'

export default function ServiciosGridToolbar({
  quickFilter,
  onQuickFilterChange,
  colsVisible,
  onToggleColumn,
  onAdd,
  addLabel,
  columnToggles,
  showColumnPicker,
  onToggleColumnPicker,
  pickerRef,
  canToggleColumns,
}) {
  return (
    <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">
      <input
        type="text"
        className="form-control"
        style={{ maxWidth: 260 }}
        placeholder="Buscar en la tabla..."
        value={quickFilter}
        onChange={(e) => onQuickFilterChange(e.target.value)}
      />

      {canToggleColumns && (
        <div className="position-relative" ref={pickerRef}>
          <button type="button" className="btn btn-outline-secondary" onClick={onToggleColumnPicker}>
            Columnas ▾
          </button>

          {showColumnPicker && (
            <div
              className="card shadow p-3 position-absolute"
              style={{ top: '110%', left: 0, zIndex: 1000, minWidth: 200 }}
            >
              <p className="fw-semibold mb-2 small text-muted">Mostrar columnas</p>
              {columnToggles.map(({ field, label }) => (
                <div key={field} className="form-check">
                  <input
                    id={`servicios-col-${field}`}
                    type="checkbox"
                    className="form-check-input"
                    checked={Boolean(colsVisible[field])}
                    onChange={() => onToggleColumn(field)}
                  />
                  <label className="form-check-label" htmlFor={`servicios-col-${field}`}>
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

ServiciosGridToolbar.propTypes = {
  quickFilter: PropTypes.string.isRequired,
  onQuickFilterChange: PropTypes.func.isRequired,
  colsVisible: PropTypes.object.isRequired,
  onToggleColumn: PropTypes.func.isRequired,
  columnToggles: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  showColumnPicker: PropTypes.bool.isRequired,
  onToggleColumnPicker: PropTypes.func.isRequired,
  pickerRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  canToggleColumns: PropTypes.bool.isRequired,
}
