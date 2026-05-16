import PropTypes from 'prop-types'

// ClientesGridToolbar
//
// Barra de herramientas del grid de clientes. Contiene:
//   1. Buscador rápido (filtra filas en tiempo real)
//   2. Selector de columnas (checkbox por columna)
//
// Toda la lógica de estado vive en ClientesGrid; este componente solo
// recibe valores y callbacks por props, lo que lo hace muy fácil de testear.
export default function ClientesGridToolbar({
  quickFilter,
  onQuickFilterChange,
  colsVisible,
  onToggleColumn,
  onAdd,
  addLabel,
  COLUMNAS_TOGGLE,
  showColumnPicker,
  onToggleColumnPicker,
  pickerRef,
}) {
  return (
    <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">

      {/* 1. Buscador — filtra las filas del grid mientras el usuario escribe */}
      <input
        type="text"
        className="form-control"
        style={{ maxWidth: 260 }}
        placeholder="Buscar en la tabla..."
        value={quickFilter}
        onChange={e => onQuickFilterChange(e.target.value)}
      />

      {/* 2. Selector de columnas — abre un dropdown con checkboxes */}
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
                  id={`col-${field}`}
                  checked={colsVisible[field]}
                  onChange={() => onToggleColumn(field)}
                />
                <label className="form-check-label" htmlFor={`col-${field}`}>
                  {label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="button" className="btn sbm-btn-primary ms-auto" onClick={onAdd}>
        {addLabel}
      </button>

    </div>
  )
}

ClientesGridToolbar.propTypes = {
  quickFilter:         PropTypes.string.isRequired,
  onQuickFilterChange: PropTypes.func.isRequired,
  colsVisible:         PropTypes.object.isRequired,
  onToggleColumn:      PropTypes.func.isRequired,
  onAdd:               PropTypes.func.isRequired,
  addLabel:            PropTypes.string.isRequired,
  COLUMNAS_TOGGLE:     PropTypes.arrayOf(PropTypes.object).isRequired,
  showColumnPicker:    PropTypes.bool.isRequired,
  onToggleColumnPicker:PropTypes.func.isRequired,
  pickerRef:           PropTypes.shape({ current: PropTypes.any }).isRequired,
}
