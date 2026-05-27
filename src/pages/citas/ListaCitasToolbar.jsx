import PropTypes from 'prop-types'

export default function ListaCitasToolbar({
  quickFilter,
  onQuickFilterChange,
  colsVisible,
  onToggleColumn,
  COLUMNAS_TOGGLE,
  showColumnPicker,
  onToggleColumnPicker,
  pickerRef,
}) {
  return (
    <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">
      {/* Buscador */}
      <input
        type="text"
        className="form-control"
        style={{ maxWidth: 260 }}
        placeholder="Buscar en la tabla..."
        value={quickFilter}
        onChange={e => onQuickFilterChange(e.target.value)}
      />

      {/* Selector de columnas */}
      <div className="position-relative" ref={pickerRef}>
        <button className="btn btn-outline-secondary" onClick={onToggleColumnPicker}>
          Columnas ▾
        </button>

        {showColumnPicker && (
          <div
            className="card shadow p-3 position-absolute"
            style={{ top: '110%', left: 0, zIndex: 1000, minWidth: 170 }}
          >
            <p className="fw-semibold mb-2 small text-muted">Mostrar columnas</p>
            {COLUMNAS_TOGGLE.map(({ field, label }) => (
              <div key={field} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`cita-col-${field}`}
                  checked={colsVisible[field]}
                  onChange={() => onToggleColumn(field)}
                />
                <label className="form-check-label" htmlFor={`cita-col-${field}`}>
                  {label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

ListaCitasToolbar.propTypes = {
  quickFilter:           PropTypes.string.isRequired,
  onQuickFilterChange:   PropTypes.func.isRequired,
  colsVisible:           PropTypes.object.isRequired,
  onToggleColumn:        PropTypes.func.isRequired,
  COLUMNAS_TOGGLE:       PropTypes.arrayOf(PropTypes.object).isRequired,
  showColumnPicker:      PropTypes.bool.isRequired,
  onToggleColumnPicker:  PropTypes.func.isRequired,
  pickerRef:             PropTypes.shape({ current: PropTypes.any }).isRequired,
}
